/**
 * Migration script: Upload existing images from local /public folders to Azure Blob Storage
 * and update Cosmos DB documents with new blob URLs.
 * 
 * Images to migrate:
 * 1. apps/main-site/public/images/AalokPanditHeadshot.png → main-site container
 * 2. apps/workbench/public/images/memory-game-preview.png → workbench container (project hero)
 * 
 * Usage: npm run migrate:images (from repo root)
 * Environment variables needed:
 *   - AZURE_STORAGE_CONNECTION_STRING (or use .env file)
 *   - AZURE_STORAGE_ACCOUNT_NAME (or use .env file)
 *   - COSMOS_CONNECTION_STRING (read from local.settings.json if not set)
 */

const fs = require('fs');
const path = require('path');
const { BlobServiceClient, BlockBlobTier } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

// Read connection strings from local.settings.json
const localSettingsPath = path.join(__dirname, '../apps/main-site/api/local.settings.json');
let BLOB_CONNECTION_STRING;
let STORAGE_ACCOUNT_NAME;
let COSMOS_CONNECTION_STRING;

try {
  const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));
  BLOB_CONNECTION_STRING = localSettings.Values?.AZURE_STORAGE_CONNECTION_STRING;
  STORAGE_ACCOUNT_NAME = localSettings.Values?.AZURE_STORAGE_ACCOUNT_NAME;
  COSMOS_CONNECTION_STRING = localSettings.Values?.COSMOS_CONNECTION_STRING;
} catch (error) {
  console.error('❌ Error: Could not read local.settings.json');
  console.error('   File path:', localSettingsPath);
  console.error('   Error:', error.message);
  process.exit(1);
}

// Check for missing required variables
const missingVars = [];
if (!BLOB_CONNECTION_STRING) missingVars.push('AZURE_STORAGE_CONNECTION_STRING');
if (!STORAGE_ACCOUNT_NAME) missingVars.push('AZURE_STORAGE_ACCOUNT_NAME');
if (!COSMOS_CONNECTION_STRING) missingVars.push('COSMOS_CONNECTION_STRING');

if (missingVars.length > 0) {
  console.error('❌ Missing values in local.settings.json:');
  missingVars.forEach(v => {
    console.error(`   - ${v}`);
  });
  console.error('\n💡 Add them to apps/main-site/api/local.settings.json Values object');
  process.exit(1);
}


const images = [
  {
    sourcePath: 'apps/main-site/public/images/AalokPanditHeadshot.png',
    container: 'main-site',
    blobName: 'headshot.png',
    description: 'Main site headshot'
  },
  {
    sourcePath: 'apps/workbench/public/images/memory-game-preview.png',
    container: 'workbench',
    blobName: 'projects/memory-game/hero.png',
    projectId: 'classic-memory-game',
    description: 'Memory game hero image'
  }
];

async function uploadImageToBlob(blobServiceClient, image) {
  const fullSourcePath = path.join(__dirname, '..', image.sourcePath);
  
  if (!fs.existsSync(fullSourcePath)) {
    console.warn(`⚠️  Source file not found: ${image.sourcePath}`);
    return null;
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(image.container);
    const blockBlobClient = containerClient.getBlockBlobClient(image.blobName);

    const fileBuffer = fs.readFileSync(fullSourcePath);
    const contentType = 'image/png';

    console.log(`📤 Uploading ${image.description} to ${image.container}/${image.blobName}...`);
    
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${image.container}/${image.blobName}`;
    console.log(`✅ Uploaded: ${blobUrl}`);
    
    return blobUrl;
  } catch (error) {
    console.error(`❌ Failed to upload ${image.description}:`, error.message);
    throw error;
  }
}

async function updateCosmosDocument(cosmosClient, projectId, heroImageUrl) {
  try {
    const database = cosmosClient.database('workbench-content');
    const container = database.container('projects');
    
    // Fetch current document
    let project;
    try {
      const response = await container.item(projectId).read();
      project = response.resource;
    } catch (readError) {
      if (readError.code === 404) {
        console.warn(`⚠️  Project not found in Cosmos: ${projectId}`);
      } else {
        throw readError;
      }
      return false;
    }

    if (!project) {
      console.warn(`⚠️  Project not found in Cosmos: ${projectId}`);
      return false;
    }

    // Update hero image URL
    project.heroImage = {
      url: heroImageUrl,
      alt: project.heroImage?.alt || `Hero image for ${project.title}`
    };

    console.log(`📝 Updating Cosmos document for project ${projectId}...`);
    await container.item(projectId).replace(project);
    console.log(`✅ Updated Cosmos document for ${projectId}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to update Cosmos document for ${projectId}:`, error.message);
    throw error;
  }
}

async function migrateImages() {
  console.log('\n🚀 Starting image migration to Azure Blob Storage...\n');

  try {
    // Initialize Azure clients
    const blobServiceClient = BlobServiceClient.fromConnectionString(BLOB_CONNECTION_STRING);
    const cosmosClient = new CosmosClient({ connectionString: COSMOS_CONNECTION_STRING });

    // Verify containers exist
    console.log('🔍 Verifying Blob Storage containers...');
    for (const image of images) {
      const containerClient = blobServiceClient.getContainerClient(image.container);
      try {
        await containerClient.getProperties();
        console.log(`✅ Container exists: ${image.container}`);
      } catch (error) {
        if (error.code === 'ContainerNotFound') {
          console.log(`📦 Creating container: ${image.container}`);
          await blobServiceClient.createContainer({
            name: image.container,
            access: 'blob' // Public blob access
          });
          console.log(`✅ Created container: ${image.container}`);
        } else {
          throw error;
        }
      }
    }

    // Upload each image
    console.log('\n📸 Uploading images to Blob Storage...');
    const uploadedUrls = {};

    for (const image of images) {
      const blobUrl = await uploadImageToBlob(blobServiceClient, image);
      if (blobUrl) {
        uploadedUrls[image.sourcePath] = blobUrl;
      }
    }

    // Update Cosmos documents
    console.log('\n💾 Updating Cosmos DB documents...');
    
    // Update project hero images for projects that have them
    for (const image of images) {
      if (image.projectId) {
        const imageUrl = uploadedUrls[image.sourcePath];
        if (imageUrl) {
          await updateCosmosDocument(cosmosClient, image.projectId, imageUrl);
        }
      }
    }

    console.log('\n✨ Migration completed successfully!\n');
    console.log('Summary of uploaded images:');
    Object.entries(uploadedUrls).forEach(([source, url]) => {
      console.log(`  - ${source}`);
      console.log(`    → ${url}`);
    });

    console.log('\n📝 Next steps:\n');
    const headshotUrl = uploadedUrls['apps/main-site/public/images/AalokPanditHeadshot.png'];
    if (headshotUrl) {
      console.log('1. Update main-site headshot for production:');
      console.log(`   Set NEXT_PUBLIC_HEADSHOT_URL=${headshotUrl}`);
      console.log('   In: apps/main-site/.env.production.local (local build)');
      console.log('   Or: Azure Static Web Apps Application settings (remote build)\n');
      console.log('2. Update memory-game project in Cosmos manually:');
      console.log('   - Open Azure Portal → Cosmos DB → workbench-content → projects');
      console.log('   - Find document with id "classic-memory-game"');
      console.log('   - Update heroImage.url to:');
      console.log(`     ${uploadedUrls['apps/workbench/public/images/memory-game-preview.png']}\n`);
      console.log('3. Verify images display on localhost (uses /public/images/* as fallback)');
      console.log('4. After verifying, optionally remove /public/images/* files from repo');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateImages().then(() => {
  console.log('\n✅ Done!\n');
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
