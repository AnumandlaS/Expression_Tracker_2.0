const authorizeRoles=(...allowedRoles)=> {
      return (req,res,next)=>{
        const userRole = req.user?.role; // Extract role from the decoded token
        console.log("User Role:", userRole); // Log role to verify
        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({message:"Access denied"});
        }
        next();
      }
};

module.exports={authorizeRoles};

