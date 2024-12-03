const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "super_admin"], default: "admin" }, // Include super_admin role
  admin_profession: {
    type: String,
    enum: ["therapist", "game_developer"],
    required:  function () {
      return this.role === "admin"; // profession required only for admin role
    },
  },
  password: { type: String, default : null}, // Make sure to hash this later
  status: { type: String,enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, 
  children_accounts: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    _id: false // Disable the automatic _id for subdocuments
  }], 
});

const AdminDetails = mongoose.model("AdminSchema", AdminSchema);

module.exports = AdminDetails;
