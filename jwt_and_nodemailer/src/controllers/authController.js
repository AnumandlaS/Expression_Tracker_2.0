const nodemailer = require("nodemailer");
const crypto = require("crypto");
const AdminDetails = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Register a new Admin
const register = async (req, res) => {
  try {
    // const { username, password, role, isVerified } = req.body;
    const {
      admin_name,
      phone_number,
      admin_email,
      admin_profession,
    } = req.body;

    console.log(
      "Admin_name: " +
        admin_name +
        "phone_number: " +
        phone_number +
        "admin_email: " +
        admin_email +
        "admin_profession: " +
        admin_profession 
    );

    if (!admin_name || !phone_number || !admin_email || !admin_profession) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAdmin = new AdminDetails({
      admin_name: admin_name,
      phone_number: phone_number,
      admin_email: admin_email,
      admin_profession: admin_profession,
    });
    await newAdmin.save();

    res.status(201).json({
      message:
        "Your form is submitted successfully Response will be sent to your mail soon ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin.", error: error.message });
  }
};

const login = async (req, res) => {
  console.log("Login attempt:", req.body);

  const { admin_email, password } = req.body;
  try {
    // Check if user exists
    const user = await AdminDetails.findOne({ admin_email });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    console.log("Found user:", user);
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry (1 hour)
    );
    // Send role-based response
    return res.status(200).json({
      token,
      message: `Welcome, ${user.role}!`,
      redirectTo: user.role === "admin" ? "/analysis" : "/select-game",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateAdminStatus = async(req,res)=>{
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    // Validate status value
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const admin = await AdminDetails.findByIdAndUpdate(id, { status }, { new: true });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    
       // If admin is approved, generate random password and send email
       if (status === "Approved") {
        const randomPassword = crypto.randomBytes(8).toString('hex'); // Generate random password
        const hashedPassword = await bcrypt.hash(randomPassword, 10); // Hash the password
  
        // Update the admin's password with the new hashed password
        admin.password = hashedPassword;
        await admin.save();
  
        // Prepare the email content
        const subject = "Your Account Has Been Approved!";
        const html = `<h3>Welcome, ${admin.admin_name}!</h3>
                      <p>Your account has been approved. Here are your credentials:</p>
                      <p>Email: ${admin.admin_email}</p>
                      <p>Password: ${randomPassword}</p>`;
  
        // Send email with credentials
        await sendEmail(admin.admin_email, subject, null, html);
      }

    res.status(200).json({ message: `Admin status updated to ${status}.`, admin });
  } catch (error) {
    res.status(500).json({ message: "Error updating status.", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params; // Get admin ID from URL
    const { password } = req.body; // Get new password from request body

    // Validate input
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin's password in the database
    const updatedAdmin = await AdminDetails.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({
      message: "Password updated successfully.",
      admin: { id: updatedAdmin._id, admin_name: updatedAdmin.admin_name },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Setup Nodemailer transporter (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  host: 'smtp.gmail.com',
  port: 587, // or 587 for TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password (use .env for security)
  },
  logger: true, // Enable logging for debugging
  debug: true,  // Enable SMTP debugging
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Transport Error:", error); // Debugging SMTP issues
  } else {
    console.log("SMTP Transport Verified: Ready to send emails");
  }
});
// Send email function
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: {
      name : "Joy with Learning",
      address:process.env.EMAIL_USER
    },
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  console.log("Preparing to send email..."); // Log before sending
  try {
    const info=await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response); // Log success response
    console.log("Message ID:", info.messageId); // Log Message ID for reference
  } catch (error) {
    console.error("Error sending email:", error); // Log error details
    console.error("Error Code:", error.code); // Log specific error code
    console.error("Response from Server:", error.response); // Log server response
    console.error("Failed Command:", error.command); // Log failed command if applicable
  }
};

module.exports = {
  register,
  login,
  updateAdminStatus,
  updatePassword,
};
