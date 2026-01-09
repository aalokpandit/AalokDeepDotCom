/**
 * Cosmos DB client singleton
 * Reuses connection across function invocations for performance
 * Handles crypto polyfill required by Cosmos SDK in Node.js environment
 */

// Ensure crypto is available (required for Cosmos SDK)
if (typeof crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto || require('crypto');
}

const { CosmosClient } = require('@azure/cosmos');

let cosmosClient = null;
let database = null;
let projectsContainer = null;
let journalDatabase = null;
let blogsContainer = null;

const CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;
const DATABASE_ID = 'workbench-content';
const PROJECTS_CONTAINER_ID = 'projects';
const JOURNAL_DATABASE_ID = 'journal-content';
const BLOGS_CONTAINER_ID = 'blogs';

function getCosmosClient() {
  if (!CONNECTION_STRING) {
    throw new Error('COSMOS_CONNECTION_STRING environment variable not set');
  }
  return cosmosClient ??= new CosmosClient({ connectionString: CONNECTION_STRING });
}

function getDatabase() {
  return database ??= getCosmosClient().database(DATABASE_ID);
}

/**
 * Gets or creates the projects container singleton
 * Container stores all project documents with /id as partition key
 * @returns {import('@azure/cosmos').Container} Cosmos DB container for projects
 */
function getProjectsContainer() {
  return projectsContainer ??= getDatabase().container(PROJECTS_CONTAINER_ID);
}

function getJournalDatabase() {
  if (!journalDatabase) {
    const client = getCosmosClient();
    journalDatabase = client.database(JOURNAL_DATABASE_ID);
  }

  return journalDatabase;
}

function getBlogsContainer() {
  if (!blogsContainer) {
    const db = getJournalDatabase();
    blogsContainer = db.container(BLOGS_CONTAINER_ID);
  }

  return blogsContainer;
}

module.exports = {
  getCosmosClient,
  getDatabase,
  getProjectsContainer,
  getJournalDatabase,
  getBlogsContainer,
};
