// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // Define a schema for session data
// const sessionSchema = new mongoose.Schema({
//   sessionId: { type: String, required: true },
//   sessionName: { type: String, required: true },  // Add sessionName to store player name
//   gameName: { type: String, required: false },
//   imagePaths: [String],  // Array of strings for image paths
//   screenshotPaths: [String],  // Array of strings for screenshot paths
//   timestamp: { type: [String], default: () => [new Date().toLocaleDateString(), new Date().toLocaleTimeString()] }, // Store date and time as an array
//   modelResponse: { type: Array, required: false }
// });

// // Define a schema for user authentication
// const authSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true, enum: ['admin', 'child'] }
// });

// // Hash the password before saving
// authSchema.pre('save', async function (next) {
//    if (this.isModified('password')) {
//      this.password = await bcrypt.hash(this.password, 10);
//    }
//    next();
// });

// // Main Game Schema
// const gameSchema = new mongoose.Schema({
//   gameId: { type: String, required: true },
//   name: { type: String, required: true },
//   questions: [
//     {
//       type: mongoose.Schema.Types.Mixed, // Can hold either questionType1Schema or questionType2Schema
//       required: true,
//     },
//   ],
// });

// // Create a model for the schema
// const Session = mongoose.model('Session', sessionSchema);
// const UserAuth = mongoose.model('UserAuth', authSchema);
// const Game = mongoose.model('Game', gameSchema); // Main game model

// // Export both models
// module.exports = {Session,UserAuth,Game};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a schema for session data
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  sessionName: { type: String, required: true },  // Add sessionName to store player name
  gameName: { type: String, required: false },
  imagePaths: [String],  // Array of strings for image paths
  screenshotPaths: [String],  // Array of strings for screenshot paths
  timestamp: { type: [String], default: () => [new Date().toLocaleDateString(), new Date().toLocaleTimeString()] }, // Store date and time as an array
  modelResponse: { type: Array, required: false }
});

// Define a schema for user authentication
const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'child'] }
});

// Hash the password before saving
authSchema.pre('save', async function (next) {
   if (this.isModified('password')) {
     this.password = await bcrypt.hash(this.password, 10);
   }
   next();
});

// Main Game Schema
const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  name: { type: String, required: true },
  questions: [
    {
      type: mongoose.Schema.Types.Mixed, // Can hold either questionType1Schema or questionType2Schema
      required: true,
    },
  ],
});

// for the rigestration page 
// Define the schema for the admin
const ChildAccountSchema = new mongoose.Schema({
  child_name: { type: String, required: true },
  child_age: { type: Number, required: true },
  child_password: { type: String, required: true } // Make sure to hash this later
});

const AdminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  admin_role: { type: String, enum: ["therapist", "game_developer"], required: true },
  //password: { type: String, required: true }, // Make sure to hash this later
  is_verified: { type: Boolean, default: false },
  children_accounts: [ChildAccountSchema]
});

// Create a model for the schema
const Session = mongoose.model('Session', sessionSchema);
const UserAuth = mongoose.model('UserAuth', authSchema);
const Game = mongoose.model('Game', gameSchema); // Main game model
const AdminDetails = mongoose.model('AdminSchema',AdminSchema);
const ChildDetails = mongoose.model('ChildAccountsSchema',ChildAccountSchema);
// Export both models
module.exports = {Session,UserAuth,Game,AdminDetails,ChildDetails};
