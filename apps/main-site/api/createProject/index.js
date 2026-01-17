const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { validateAdmin, unauthorizedResponse } = require('../shared/auth');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * POST /api/projects
 * Creates a new project (admin only)
 */
app.http('createProject', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: async (request, context) => {
    context.log('POST /api/projects - Creating new project');

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

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
        futureConsiderations: projectData.futureConsiderations || [],
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
  },
});
