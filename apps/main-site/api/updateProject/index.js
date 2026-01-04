const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { validateAdmin, unauthorizedResponse } = require('../shared/auth');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * PATCH /api/projects/{id}
 * Updates an existing project (admin only)
 */
app.http('updateProject', {
  methods: ['PATCH', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request, context) => {
    const projectId = request.params.id;
    context.log(`PATCH /api/projects/${projectId} - Updating project`);

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
  },
});
