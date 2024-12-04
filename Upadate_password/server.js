
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
  
  const getObjectID = async (req,res)=>
  {
    const {admin_email} =req.params;
      console.log("Username is : ", admin_email);
    try{
      
      const objId = await AdminDetails.findOne({admin_email});
      console.log("inside the route :",objId);
      res.status(200).json({
        message: "object id found",
        admin: { id: objId._id},
      });
      return objId._id;
    }catch(error)
    {
      res.status(500).json({ message:"go ree ",error:error.message});
    }
  };
  
  