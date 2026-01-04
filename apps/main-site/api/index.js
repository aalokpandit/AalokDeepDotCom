/**
 * Azure Functions entry point
 * Loads all HTTP function handlers
 */

const { app } = require('@azure/functions');

// Import consolidated function handlers
require('./projects');
require('./uploadImageToken');

module.exports = app;
