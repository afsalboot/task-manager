// Importing necessary modules
const express = require("express");
const cors = require("cors");

const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoutes.js");
const taskRoute = require("./routes/taskRoutes.js");
const { checkTasks } = require("./corn/taskNotifier.js");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Define route handlers
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/auth", authRoutes); // Routes for login/register
app.use("/api/task", taskRoute); // Routes for task operations

// Start cron automatically
checkTasks();

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
