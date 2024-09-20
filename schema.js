const mongoose = require('mongoose');

// Define a schema for session data
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  imagePath: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model for the schema
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
