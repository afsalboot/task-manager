const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.js");

// Middleware to protect routes by verifying JWT token
const protect = async (req, res, next) => {
  let token;

  try {
    // Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from the "Bearer <token>" format
      token = req.headers.authorization.split(" ")[1];

      // Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database using decoded token's user ID
      // Exclude the password from the user object
      req.user = await User.findById(decoded.id).select("-password");

      // If no user is found, send an unauthorized response
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Proceed to the next middleware or route handler
      next();
    } else {
      // No token provided in the header
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    // Token verification failed or other error occurred
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Export the middleware
module.exports = protect;
