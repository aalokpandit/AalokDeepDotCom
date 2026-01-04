const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * GET /api/projects/{id}
 * Returns full project details for the detail page
 */
app.http('getProjectById', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request, context) => {
    const projectId = request.params.id;
    context.log(`GET /api/projects/${projectId} - Fetching project details`);

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
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
  },
});
