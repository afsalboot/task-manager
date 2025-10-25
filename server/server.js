// Importing necessary modules
const express = require("express");
const cors = require("cors");

const connectDB = require("./db"); // Database connection function
const authRoutes = require("./routes/authRoutes"); // Authentication-related routes
const taskRoute = require("./routes/taskRoutes"); // Task-related routes
const userRoute = require("./routes/userRouter"); // User-related routes
const checkTasks = require("./corn/taskNotifier");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Start the cron job
checkTasks();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Define route handlers
app.get('/', (req,res)=>res.send('Server is Live!'))
app.use("/api/auth", authRoutes); // Routes for login/register
app.use("/api/task", taskRoute); // Routes for task operations
app.use("/api/user", userRoute); // Routes for user operations



// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
