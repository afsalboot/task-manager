// Importing necessary modules
const express = require("express");
const cors = require("cors");

const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoutes.js");
const taskRoute = require("./routes/taskRoutes.js");
const cronRoutes = require("./routes/cronRoutes.js");

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
app.use("/api/cron", cronRoutes); // Routes for corn job

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));