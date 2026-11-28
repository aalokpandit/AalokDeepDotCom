const fs = require('fs');
const path = require('path');

// Source directory for shared assets
const sourceDir = path.resolve(__dirname, '../packages/assets/public');

// Destination directory for the current application's public folder
// When invoked via an app's predev/prebuild script (e.g. apps/workbench), process.cwd() is that app directory.
const repoRoot = path.resolve(__dirname, '..');
const cwd = process.cwd();
const isAppDir = path.dirname(cwd) === path.join(repoRoot, 'apps');
const destDir = isAppDir
  ? path.join(cwd, 'public')
  : path.resolve(__dirname, '../apps/main-site/public');

// --- Main execution ---
console.log('--- Running pre-dev script: Copying shared assets ---');

// Ensure the destination public directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created destination directory: ${destDir}`);
}

// Check if the source directory exists before attempting to copy
if (fs.existsSync(sourceDir)) {
  // Copy all files and folders from source to destination
  fs.cpSync(sourceDir, destDir, { recursive: true, force: true });
  console.log(`✅ Assets successfully copied from ${sourceDir} to ${destDir}`);
} else {
  console.warn(`⚠️ Source directory not found, skipping asset copy: ${sourceDir}`);
}

console.log('--- Finished pre-dev script ---');
