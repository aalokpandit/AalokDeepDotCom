/**
 * Cosmos DB client singleton
 * Reuses connection across function invocations
 */

// Ensure crypto is available (required for Cosmos SDK)
if (typeof crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto || require('crypto');
}

const { CosmosClient } = require('@azure/cosmos');

let cosmosClient = null;
let database = null;
let projectsContainer = null;

const CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;
const DATABASE_ID = 'workbench-content';
const PROJECTS_CONTAINER_ID = 'projects';

function getCosmosClient() {
  if (!CONNECTION_STRING) {
    throw new Error('COSMOS_CONNECTION_STRING environment variable not set');
  }

  if (!cosmosClient) {
    cosmosClient = new CosmosClient({ connectionString: CONNECTION_STRING });
  }

  return cosmosClient;
}

function getDatabase() {
  if (!database) {
    const client = getCosmosClient();
    database = client.database(DATABASE_ID);
  }

  return database;
}

function getProjectsContainer() {
  if (!projectsContainer) {
    const db = getDatabase();
    projectsContainer = db.container(PROJECTS_CONTAINER_ID);
  }

  return projectsContainer;
}

module.exports = {
  getCosmosClient,
  getDatabase,
  getProjectsContainer,
};
