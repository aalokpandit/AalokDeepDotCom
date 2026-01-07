/**
 * Health API
 *
 * Endpoint: GET /api/health
 * Purpose: Provides a lightweight health and environment diagnostics payload to verify
 * runtime configuration (env vars present), Node version, and dependency availability.
 * Useful for debugging deployment issues and as a readiness probe.
 */const { app } = require('@azure/functions');

/**
 * GET /api/health - Health check and environment diagnostics
 */
app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async (request, context) => {
    const diagnostics = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasCosmosConnectionString: !!process.env.COSMOS_CONNECTION_STRING,
        cosmosConnectionStringLength: process.env.COSMOS_CONNECTION_STRING?.length || 0,
        hasStorageConnectionString: !!process.env.AZURE_STORAGE_CONNECTION_STRING,
        hasStorageAccountName: !!process.env.AZURE_STORAGE_ACCOUNT_NAME,
        nodeVersion: process.version,
      },
      dependencies: {
        hasCosmos: (() => {
          try {
            require('@azure/cosmos');
            return true;
          } catch {
            return false;
          }
        })(),
        hasFunctions: (() => {
          try {
            require('@azure/functions');
            return true;
          } catch {
            return false;
          }
        })(),
      }
    };

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(diagnostics, null, 2),
    };
  },
});
