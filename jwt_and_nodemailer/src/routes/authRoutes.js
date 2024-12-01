const express = require("express");
const {register,login,updateAdminStatus,updatePassword}=require('../controllers/authController');
const router=express.Router();
router.post("/register",register);
router.post("/adminlogin",login);
// Route to handle updating status
router.patch("/updateAdminStatus/:id", updateAdminStatus);
// Update admin password
router.put("/updatePassword/:id", updatePassword);
module.exports=router;