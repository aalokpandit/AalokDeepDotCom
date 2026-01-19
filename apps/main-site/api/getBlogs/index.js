const { app } = require('@azure/functions');
const { getBlogsContainer } = require('../shared/cosmosClient');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');

/**
 * GET /api/blogs
 * Returns list of blog posts with lightweight fields for the journal landing page
 */
app.http('getBlogs', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'blogs',
  handler: async (request, context) => {
    context.log('GET /api/blogs - Fetching blog list');

    if (request.method === 'OPTIONS') {
      return optionsResponse(request);
    }

    try {
      const container = getBlogsContainer();

      const querySpec = {
        query: 'SELECT c.id, c.title, c.summary, c.tags, c.createdAt, c.heroImage FROM c ORDER BY c.createdAt DESC',
      };

      const { resources: blogs } = await container.items.query(querySpec).fetchAll();
      context.log(`Successfully fetched ${blogs.length} blogs`);

      return successResponse(blogs, request, true);
    } catch (error) {
      context.error('Error fetching blogs:', error);
      return errorResponse('FETCH_ERROR', 'Failed to fetch blogs', 500, request);
    }
  },
});
