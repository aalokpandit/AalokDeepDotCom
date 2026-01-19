const { app } = require('@azure/functions');
const { getBlogsContainer } = require('../shared/cosmosClient');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * GET /api/blogs/{id}
 * Returns full blog post for detail page
 */
app.http('getBlogById', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'blogs/{id}',
  handler: async (request, context) => {
    const blogId = request.params.id;
    context.log(`GET /api/blogs/${blogId} - Fetching blog detail`);

    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

    if (!blogId) {
      return errorResponse('INVALID_REQUEST', 'Blog ID is required', 400, request);
    }

    try {
      const container = getBlogsContainer();
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @blogId',
        parameters: [{ name: '@blogId', value: blogId }],
      };

      const { resources: blogs } = await container.items.query(querySpec).fetchAll();

      if (blogs.length === 0) {
        context.log(`Blog not found: ${blogId}`);
        return errorResponse('NOT_FOUND', `Blog with id '${blogId}' not found`, 404, request);
      }

      context.log(`Successfully fetched blog: ${blogId}`);
      return successResponse(blogs[0], request, true);
    } catch (error) {
      context.error('Error fetching blog:', error);
      return errorResponse('FETCH_ERROR', 'Failed to fetch blog', 500, request);
    }
  },
});
