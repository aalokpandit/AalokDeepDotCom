/**
 * Authorization middleware for admin-only endpoints
 * Checks x-ms-client-principal header for GitHub handle
 */

const ALLOWED_ADMIN = process.env.ALLOWED_ADMIN_GITHUB_HANDLE || 'aalokpandit';

/**
 * Validates that the request comes from an authenticated admin user
 * @param {import('@azure/functions').HttpRequest} request
 * @returns {{ authorized: boolean, user?: string, error?: string }}
 */
function validateAdmin(request) {
  const clientPrincipalHeader = request.headers.get('x-ms-client-principal');

  if (!clientPrincipalHeader) {
    return {
      authorized: false,
      error: 'Authentication required. Please log in.',
    };
  }

  try {
    // Decode base64 client principal
    const clientPrincipal = JSON.parse(
      Buffer.from(clientPrincipalHeader, 'base64').toString('utf-8')
    );

    const userDetails = clientPrincipal.userDetails;

    if (userDetails !== ALLOWED_ADMIN) {
      return {
        authorized: false,
        error: `Unauthorized. Only ${ALLOWED_ADMIN} can perform this action.`,
      };
    }

    return {
      authorized: true,
      user: userDetails,
    };
  } catch (error) {
    return {
      authorized: false,
      error: 'Invalid authentication token.',
    };
  }
}

/**
 * Creates a standardized 401 Unauthorized response
 * @param {string} message
 */
function unauthorizedResponse(message) {
  return {
    status: 401,
    jsonBody: {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: message || 'Unauthorized',
      },
    },
  };
}

/**
 * Creates a standardized 403 Forbidden response
 * @param {string} message
 */
function forbiddenResponse(message) {
  return {
    status: 403,
    jsonBody: {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: message || 'Forbidden',
      },
    },
  };
}

module.exports = {
  validateAdmin,
  unauthorizedResponse,
  forbiddenResponse,
};
