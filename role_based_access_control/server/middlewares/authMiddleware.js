const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   try {
//     // Extract the Authorization header
//     const authHeader = req.headers.Authorization|| req.headers.authorization;

//     // Check if the header is missing or doesn't start with "Bearer "
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized: Token missing or invalid" });
//     }

//     // Extract the token from the header
//     const token = authHeader.split(" ")[1];

//     // Verify the token using the secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach the decoded payload (user data) to the request object
//     req.user = decoded;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (err) {
//     // Handle token verification errors
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Unauthorized: Token has expired" });
//     }

//     if (err.name === "JsonWebTokenError") {
//       return res.status(403).json({ message: "Forbidden: Invalid token" });
//     }

//     // Handle other unexpected errors
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from headers

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;  // Ensure user info (including role) is attached to req.user
    next();
  });
};

module.exports = { authenticateToken };
