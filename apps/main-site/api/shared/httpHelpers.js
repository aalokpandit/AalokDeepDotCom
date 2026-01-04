/**
 * HTTP response helpers and CORS configuration
 */

const ALLOWED_ORIGINS = [
  'https://aalokdeep.com',
  'https://www.aalokdeep.com',
  'https://workbench.aalokdeep.com',
  'http://localhost:3000', // Local development
  'http://localhost:4280', // SWA CLI
];

/**
 * Gets CORS headers for the request origin
 * @param {import('@azure/functions').HttpRequest} request
 */
function getCorsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  
  // Allow localhost for development
  if (origin.startsWith('http://localhost:')) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ms-client-principal',
      'Access-Control-Max-Age': '86400',
    };
  }
  
  // Check if origin is in allowed list
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ms-client-principal',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Gets cache headers for GET requests (1 hour)
 */
function getCacheHeaders() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    'Vary': 'Accept-Encoding',
  };
}

/**
 * Creates a standardized success response
 * @param {any} data
 * @param {import('@azure/functions').HttpRequest} request
 * @param {boolean} cached - Whether to add cache headers
 */
function successResponse(data, request, cached = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...getCorsHeaders(request),
  };

  if (cached) {
    Object.assign(headers, getCacheHeaders());
  }

  return {
    status: 200,
    headers,
    jsonBody: {
      success: true,
      data,
    },
  };
}

/**
 * Creates a standardized error response
 * @param {string} code
 * @param {string} message
 * @param {number} status
 * @param {import('@azure/functions').HttpRequest} request
 */
function errorResponse(code, message, status, request) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(request),
    },
    jsonBody: {
      success: false,
      error: {
        code,
        message,
      },
    },
  };
}

/**
 * Handles OPTIONS preflight requests
 * @param {import('@azure/functions').HttpRequest} request
 */
function optionsResponse(request) {
  return {
    status: 204,
    headers: getCorsHeaders(request),
  };
}

module.exports = {
  getCorsHeaders,
  getCacheHeaders,
  successResponse,
  errorResponse,
  optionsResponse,
};
