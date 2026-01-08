/**
 * HTTP response helpers and CORS configuration.
 *
 * Provides a small set of utilities for Azure Functions HTTP handlers:
 *  - getCorsHeaders: builds permissive CORS headers for allowed origins (including localhost)
 *  - getCacheHeaders: shared cache headers for GET responses (1 hour)
 *  - successResponse / errorResponse: consistent JSON envelopes
 *  - optionsResponse: preflight handler for CORS
 */

/**
 * Allowed CORS origins for browser calls.
 *
 * Note: Any localhost port is allowed dynamically by `getCorsHeaders` to simplify local dev.
 */
const ALLOWED_ORIGINS = [
  'https://aalokdeep.com',
  'https://www.aalokdeep.com',
  'https://workbench.aalokdeep.com',
  'http://localhost:3000', // Local development
  'http://localhost:4280', // SWA CLI
];

/**
 * Builds CORS headers for the request origin.
 *
 * For localhost, echoes the exact origin (any port). For production domains, restricts to
 * the values in `ALLOWED_ORIGINS`. Always returns a consistent set of allowed methods/headers
 * and a 1-day preflight cache.
 *
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @returns {Record<string, string>} CORS header map
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
 * Returns cache headers for cacheable GET responses (1 hour).
 *
 * @returns {Record<string, string>} Cache header map
 */
function getCacheHeaders() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    'Vary': 'Accept-Encoding',
  };
}

/**
 * Creates a standardized 200 JSON success response.
 *
 * @template T
 * @param {T} data - Response payload to include in `{ success: true, data }`
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @param {boolean} [cached=false] - Whether to attach shared cache headers
 * @returns {{ status: number, headers: Record<string,string>, jsonBody: { success: true, data: T } }}
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
 * Creates a standardized JSON error response.
 *
 * @param {string} code - Machine-readable error code
 * @param {string} message - Human-readable error message
 * @param {number} status - HTTP status code (e.g., 400, 404, 500)
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @returns {{ status: number, headers: Record<string,string>, jsonBody: { success: false, error: { code: string, message: string }}}}
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
 * Handles OPTIONS preflight requests for CORS.
 *
 * @param {import('@azure/functions').HttpRequest} request - Incoming HTTP request
 * @returns {{ status: number, headers: Record<string,string> }} 204 response with CORS headers
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
