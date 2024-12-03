const express = require("express");
const {register,login,updateAdminStatus,updatePassword}=require('../controllers/authController');
const {authenticateToken}=require('../middlewares/authMiddleware');
const {authorizeRoles}=require('../middlewares/roleMiddleware');
const router=express.Router();


router.post("/register",register);
router.post("/adminlogin",login);
// Route to handle updating status
router.patch("/updateAdminStatus/:id", authenticateToken,authorizeRoles('super_admin'),updateAdminStatus);
// Update admin password
router.put("/updatePassword/:id",authenticateToken,authorizeRoles('admin','super_admin'),updatePassword);

module.exports=router;