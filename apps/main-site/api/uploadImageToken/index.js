/**
 * Image Upload Token API
 *
 * Endpoint: POST /api/projects/{id}/upload-image-token
 * Purpose: Generates a short-lived SAS token for direct client-side image upload to
 * Azure Blob Storage. Admin-only via `validateAdmin`.
 *
 * Dependencies:
 *  - Auth: validateAdmin, unauthorizedResponse
 *  - HTTP helpers: successResponse, errorResponse, optionsResponse
 *  - Blob: generateImageUploadSAS(containerName, blobName, expiryHours)
 */

const { app } = require('@azure/functions');
const { validateAdmin, unauthorizedResponse } = require('../shared/auth');
const { successResponse, errorResponse, optionsResponse } = require('../shared/httpHelpers');
const { generateImageUploadSAS } = require('../shared/blobClient');

/**
 * POST /api/projects/{id}/upload-image-token
 * Generate SAS token for direct image upload to Blob Storage (admin only)
 */
app.http('uploadImageToken', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'projects/{id}/upload-image-token',
  handler: async (request, context) => {
    const projectId = request.params.id;
    context.log(`POST /api/projects/${projectId}/upload-image-token - Generating upload token`);

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
      const body = await request.json();
      const { filename } = body;

      if (!filename) {
        return errorResponse(
          'INVALID_REQUEST',
          'Filename is required',
          400,
          request
        );
      }

      // Validate file extension (images only)
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
      if (!allowedExtensions.includes(ext)) {
        return errorResponse(
          'INVALID_FILE',
          `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
          400,
          request
        );
      }

      // Generate SAS token for workbench container
      // Store images with structure: projects/{projectId}/{filename}
      const blobName = `projects/${projectId}/${filename}`;
      const { sasUrl, blobUrl } = generateImageUploadSAS('workbench', blobName, 1); // 1 hour token

      context.log(`Generated SAS token for: ${blobName}`);

      return successResponse(
        {
          sasUrl,
          blobUrl,
        },
        request,
        false // no cache for POST
      );
    } catch (error) {
      context.error('Error generating upload token:', error);
      return errorResponse(
        'TOKEN_ERROR',
        'Failed to generate upload token',
        500,
        request
      );
    }
  },
});
