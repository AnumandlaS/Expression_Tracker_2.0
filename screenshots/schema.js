const mongoose = require('mongoose');

// Define a schema for session data
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  imagePaths: [String],  // Array of strings for image paths
  screenshotPaths: [String],  // Array of strings for screenshot paths  // Field for the screenshot path
  timestamp: { type: Date, default: Date.now },
  modelResponse:{type: Array,requried:false}
});

// Create a model for the schema
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
