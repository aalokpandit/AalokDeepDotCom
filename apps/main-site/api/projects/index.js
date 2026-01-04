const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { validateAdmin, unauthorizedResponse } = require('../shared/auth');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * GET /api/projects - List all projects (public, cached)
 * POST /api/projects - Create new project (admin only)
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
 * GET /api/projects/{id} - Get full project details (public, cached)
 * PATCH /api/projects/{id} - Update project (admin only)
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
    return errorResponse(
      'FETCH_ERROR',
      'Failed to fetch projects',
      500,
      request
    );
  }
}

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

    // Validate required fields
    if (!projectData.id || !projectData.title || !projectData.description || !projectData.heroImage) {
      return errorResponse(
        'INVALID_REQUEST',
        'Missing required fields: id, title, description, heroImage',
        400,
        request
      );
    }

    // Ensure id doesn't already exist
    const container = getProjectsContainer();
    const checkQuery = {
      query: 'SELECT c.id FROM c WHERE c.id = @projectId',
      parameters: [{ name: '@projectId', value: projectData.id }],
    };

    const { resources: existing } = await container.items
      .query(checkQuery)
      .fetchAll();

    if (existing.length > 0) {
      return errorResponse(
        'DUPLICATE_ID',
        `Project with id '${projectData.id}' already exists`,
        409,
        request
      );
    }

    // Create project document
    const newProject = {
      id: projectData.id,
      title: projectData.title,
      description: projectData.description,
      heroImage: projectData.heroImage,
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
