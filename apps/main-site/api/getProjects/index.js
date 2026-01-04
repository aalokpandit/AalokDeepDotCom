const { app } = require('@azure/functions');
const { getProjectsContainer } = require('../shared/cosmosClient');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * GET /api/projects
 * Returns list of all projects with card fields only (lightweight for landing page)
 */
app.http('getProjects', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: async (request, context) => {
    context.log('GET /api/projects - Fetching project list');

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

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
  },
});
