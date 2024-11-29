const { Session, UserAuth,Game, AdminDetails } = require('./schema');
// edit the above line 
// copy the whole below function
app.post("/api/register", async (req, res) => {
    console.log("Entered into registration route");
    try {
      const { admin_name, phone_number, admin_email, admin_role } = req.body;
      console.log("Admin_name: "+admin_name +"phone_number: "+phone_number+"admin_email: "+admin_email+"admin_role: "+admin_role);
      if (!admin_name || !phone_number || !admin_email || !admin_role) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingAdmin = await AdminDetails.findOne({ admin_email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin email already registered" });
      }
  
      const newAdmin = new AdminDetails({
        admin_name,
        phone_number,
        admin_email,
        admin_role,
        is_verified: false,
        children_accounts: [],
      });
  
      await newAdmin.save();
      res.status(201).json({ message: "Your form is submitted successfull. Response will be sent to your mail soon ", admin: newAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  