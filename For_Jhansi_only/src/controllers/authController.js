// const UserAuth = require("../models/authModel");
const AdminDetails = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    // const { username, password, role, isVerified } = req.body;
    const {
      admin_name,
      phone_number,
      admin_email,
      admin_profession,
      password,
      child_accounts,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // await newAdmin.save();

    console.log(
      "Admin_name: " +
        admin_name +
        "phone_number: " +
        phone_number +
        "admin_email: " +
        admin_email +
        "admin_profession: " +
        admin_profession +
        "no. of child accounts: " +
        child_accounts
    );

    // console.log(
    //   "name: " + username + "role: " + role,
    //   "isVerified: " + isVerified
    // );

    if (!admin_name || !phone_number || !admin_email || !admin_profession) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // const existingAdmin = await AdminDetails.findOne({ admin_email });
    // if (existingAdmin) {
    //   return res
    //     .status(400)
    //     .json({ message: "Admin email already registered" });
    // }

    // const newAdmin = new AdminDetails({
    //   admin_name,
    //   phone_number,
    //   admin_email,
    //   admin_role,
    //   status: "Pending", // Pending status until approval
    //   children_accounts: [],
    // });

    // Save login details
    // const userAuth = new UserAuth({
    //   username: admin_email,
    //   password: null,
    //   role: admin_role,
    //   isVerified: false, // Not verified until approved
    // });

    // const userAuth = new UserAuth({
    //   username: username,
    //   password: hashedPassword,
    //   role: role,
    //   isVerified: false, // Not verified until approved
    // });

    const adminAuth = new AdminDetails({
      admin_name: admin_name,
      phone_number: phone_number,
      admin_email: admin_email,
      admin_profession: admin_profession,
      password: hashedPassword,
      child_accounts: child_accounts,
    });
    await adminAuth.save();

    res.status(201).json({
      message:
        "Your form is submitted successfully Response will be sent to your mail soon ",
      // admin: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  console.log(req.body);

  const { admin_name, password } = req.body;
  try {
    // Check if user exists
    const user = await AdminDetails.findOne({ admin_name });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // console.log(password);
    // console.log(user.password);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry (1 hour)
    );
    // Send role-based response
    return res.status(200).json({
      // token,
      message: `Welcome, ${user.role}!`,
      redirectTo: user.role === "admin" ? "/analysis" : "/select-game",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
