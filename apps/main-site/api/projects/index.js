/**
 * Project API handlers
 *
 * Endpoints:
 *  - GET /api/projects            → List projects (lightweight card fields, cached 1h)
 *  - POST /api/projects           → Create project (admin only via validateAdmin)
 *  - GET /api/projects/{id}       → Full project details (cached 1h)
 *  - PATCH /api/projects/{id}     → Update project (admin only)
 *
 * Dependencies:
 *  - Cosmos: `getProjectsContainer()` for database access
 *  - Auth: `validateAdmin()` + `unauthorizedResponse()` for admin endpoints
 *  - HTTP helpers: `successResponse()`, `errorResponse()`, `optionsResponse()` for consistent JSON + CORS
 */
const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { validateAdmin, unauthorizedResponse } = require('../shared/auth');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');


/**
 * Handler: /api/projects
 * - GET: Returns array of projects with card fields (id, title, description, heroImage)
 * - POST: Creates a new project document (admin-only)
 */
app.http('projects', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: async (request, context) => {
    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

    if (request.method === 'GET') {
      return handleGetProjects(request, context);
    }

    if (request.method === 'POST') {
      return handleCreateProject(request, context);
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405, request);
  },
});

/**
 * Handler: /api/projects/{id}
 * - GET: Returns full project document by ID (public, cached); 404 when not found
 * - PATCH: Updates an existing project (admin-only); document id cannot be changed
 */
app.http('projectById', {
  methods: ['GET', 'PATCH', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request, context) => {
    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

    if (request.method === 'GET') {
      return handleGetProjectById(request, context);
    }

    if (request.method === 'PATCH') {
      return handleUpdateProject(request, context);
    }

    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed', 405, request);
  },
});

/**
 * Handles GET requests to fetch all projects with lightweight card fields
 * Returns only id, title, description, and heroImage for efficient listing page loads
 * Response is cached for 1 hour to reduce Cosmos RU consumption
 * 
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @param {import('@azure/functions').InvocationContext} context - Function execution context
 * @returns {Promise<Object>} Success response with project array or error response
 */
async function handleGetProjects(request, context) {
  context.log('GET /api/projects - Fetching project list');

  try {
    const container = getProjectsContainer();

    // Query with field projection for card display (lightweight)
    const querySpec = {
      query: 'SELECT c.id, c.title, c.description, c.heroImage FROM c',
    };

    const { resources: projects } = await container.items
      .query(querySpec)
      .fetchAll();

    context.log(`Successfully fetched ${projects.length} projects`);

    return successResponse(projects, request, true); // cached=true (1 hour)
  } catch (error) {
    context.error('Error fetching projects:', error);
    context.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      body: error.body,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    return errorResponse(
      'FETCH_ERROR',
      `Failed to fetch projects: ${error.message}`,
      500,
      request
    );
  }
}

/**
 * Handles POST requests to create a new project (admin-only)
 * Validates required fields, checks for duplicate IDs, and creates Cosmos document
 * Requires x-ms-client-principal header with GitHub handle 'aalokpandit'
 * 
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request with project data in body
 * @param {import('@azure/functions').InvocationContext} context - Function execution context
 * @returns {Promise<Object>} Success response with created project or error response
 */
async function handleCreateProject(request, context) {
  context.log('POST /api/projects - Creating new project');

  // Validate admin authorization
  const authResult = validateAdmin(request);
  if (!authResult.authorized) {
    context.log('Unauthorized access attempt');
    return unauthorizedResponse(authResult.error);
  }

  try {
    const projectData = await request.json();
    const { id, title, description, heroImage } = projectData;

    // Validate required fields
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!heroImage) missingFields.push('heroImage');

    if (missingFields.length > 0) {
      return errorResponse(
        'INVALID_REQUEST',
        `Missing required fields: ${missingFields.join(', ')}`,
        400,
        request
      );
    }

    // Ensure id doesn't already exist
    const container = getProjectsContainer();
    const { resources: existing } = await container.items
      .query({
        query: 'SELECT c.id FROM c WHERE c.id = @projectId',
        parameters: [{ name: '@projectId', value: id }],
      })
      .fetchAll();

    if (existing.length > 0) {
      return errorResponse(
        'DUPLICATE_ID',
        `Project with id '${id}' already exists`,
        409,
        request
      );
    }

    // Create project document
    const newProject = {
      id,
      title,
      description,
      heroImage,
      detailedDescription: projectData.detailedDescription || '',
      progressLog: projectData.progressLog || [],
      links: projectData.links || [],
      detailImages: projectData.detailImages || [],
    };

    const { resource: createdProject } = await container.items.create(newProject);

    context.log(`Project created successfully: ${createdProject.id}`);

    return successResponse(createdProject, request, false); // no cache for POST
  } catch (error) {
    context.error('Error creating project:', error);
    return errorResponse(
      'CREATE_ERROR',
      'Failed to create project',
      500,
      request
    );
  }
}

/**
 * Handles GET requests to fetch a single project's full details by ID
 * Returns complete project document including progress log, links, and images
 * Response is cached for 1 hour; returns 404 if project not found
 * 
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @param {import('@azure/functions').InvocationContext} context - Function execution context
 * @returns {Promise<Object>} Success response with full project data or error response
 */
async function handleGetProjectById(request, context) {
  const projectId = request.params.id;
  context.log(`GET /api/projects/${projectId} - Fetching project details`);

  if (!projectId) {
    return errorResponse(
      'INVALID_REQUEST',
      'Project ID is required',
      400,
      request
    );
  }

  try {
    const container = getProjectsContainer();

    // Query full project document
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @projectId',
      parameters: [
        {
          name: '@projectId',
          value: projectId,
        },
      ],
    };

    const { resources: projects } = await container.items
      .query(querySpec)
      .fetchAll();

    if (projects.length === 0) {
      context.log(`Project not found: ${projectId}`);
      return errorResponse(
        'NOT_FOUND',
        `Project with id '${projectId}' not found`,
        404,
        request
      );
    }

    context.log(`Successfully fetched project: ${projectId}`);

    return successResponse(projects[0], request, true); // cached=true (1 hour)
  } catch (error) {
    context.error('Error fetching project:', error);
    return errorResponse(
      'FETCH_ERROR',
      'Failed to fetch project details',
      500,
      request
    );
  }
}

/**
 * Handles PATCH requests to update an existing project (admin-only)
 * Merges updates with existing project data; prevents changing document ID
 * Requires x-ms-client-principal header with GitHub handle 'aalokpandit'
 * 
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request with update data in body
 * @param {import('@azure/functions').InvocationContext} context - Function execution context
 * @returns {Promise<Object>} Success response with updated project or error response
 */
async function handleUpdateProject(request, context) {
  const projectId = request.params.id;
  context.log(`PATCH /api/projects/${projectId} - Updating project`);

  // Validate admin authorization
  const authResult = validateAdmin(request);
  if (!authResult.authorized) {
    context.log('Unauthorized access attempt');
    return unauthorizedResponse(authResult.error);
  }

  if (!projectId) {
    return errorResponse(
      'INVALID_REQUEST',
      'Project ID is required',
      400,
      request
    );
  }

  try {
    const updates = await request.json();
    const container = getProjectsContainer();

    // Fetch existing project
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @projectId',
      parameters: [{ name: '@projectId', value: projectId }],
    };

    const { resources: projects } = await container.items
      .query(querySpec)
      .fetchAll();

    if (projects.length === 0) {
      return errorResponse(
        'NOT_FOUND',
        `Project with id '${projectId}' not found`,
        404,
        request
      );
    }

    const existingProject = projects[0];

    // Merge updates (don't allow changing id)
    const updatedProject = {
      ...existingProject,
      ...updates,
      id: projectId, // Ensure id cannot be changed
    };

    // Replace document in Cosmos
    const { resource: result } = await container
      .item(projectId, projectId)
      .replace(updatedProject);

    context.log(`Project updated successfully: ${projectId}`);

    return successResponse(result, request, false); // no cache for PATCH
  } catch (error) {
    context.error('Error updating project:', error);
    return errorResponse(
      'UPDATE_ERROR',
      'Failed to update project',
      500,
      request
    );
  }
}
