/**
 * Azure Blob Storage client singleton
 * Reuses connection across function invocations
 */

const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');

let blobServiceClient = null;

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

function getBlobServiceClient() {
  if (!CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable not set');
  }

  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  }

  return blobServiceClient;
}

/**
 * Generate a SAS token for uploading an image to a specific blob
 * @param {string} containerName - e.g., 'workbench'
 * @param {string} blobName - e.g., 'projects/hero-image.jpg'
 * @param {number} expiryHours - Token validity in hours (default: 1)
 * @returns {{ sasUrl: string, blobUrl: string }}
 */
function generateImageUploadSAS(containerName, blobName, expiryHours = 1) {
  if (!STORAGE_ACCOUNT_NAME) {
    throw new Error('AZURE_STORAGE_ACCOUNT_NAME environment variable not set');
  }

  // Generate SAS token with Write permission for 1 hour
  const sasQueryParameters = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('racwd'), // read, add, create, write, delete
      expiresOn: new Date(new Date().valueOf() + expiryHours * 60 * 60 * 1000),
    },
    CONNECTION_STRING
  );

  // Construct URLs
  const sasUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}?${sasQueryParameters}`;
  const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}`;

  return { sasUrl, blobUrl };
}

module.exports = {
  getBlobServiceClient,
  generateImageUploadSAS,
};
