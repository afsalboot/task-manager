// Import Mongoose for MongoDB interaction
const mongoose = require("mongoose");

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected!");
  } catch (err) {
    // Handle connection errors
    console.log('DB connection error:', err.message);
  }
};

// Export the connectDB function to use in other parts of the application
module.exports = connectDB;
