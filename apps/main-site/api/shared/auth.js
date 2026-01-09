/**
 * Authorization helpers for admin-only endpoints.
 *
 * These functions validate the `x-ms-client-principal` header that Azure Static Web Apps
 * injects for authenticated users. Admin access is granted when the decoded principal's
 * `userDetails` matches the configured GitHub handle (default: `aalokpandit`).
 *
 * Usage:
 *  - Call `validateAdmin(request)` in handlers for POST/PATCH/DELETE endpoints.
 *  - If unauthorized, return `unauthorizedResponse()` from the handler.
 */

const ALLOWED_ADMIN = process.env.ALLOWED_ADMIN_GITHUB_HANDLE || 'aalokpandit';

/**
 * Validates that the request comes from an authenticated admin user.
 *
 * Reads and decodes the `x-ms-client-principal` header (Base64 JSON). When the decoded
 * `userDetails` matches `ALLOWED_ADMIN_GITHUB_HANDLE`, returns `{ authorized: true }`.
 *
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @returns {{ authorized: boolean, user?: string, error?: string }} Validation result
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
 * Creates a standardized 401 Unauthorized response.
 *
 * @param {string} message - Human-readable error message
 * @returns {{ status: number, jsonBody: { success: false, error: { code: string, message: string }}}}
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
 * Creates a standardized 403 Forbidden response.
 *
 * @param {string} message - Human-readable error message
 * @returns {{ status: number, jsonBody: { success: false, error: { code: string, message: string }}}}
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
