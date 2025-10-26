// cronRoutes.js
const express = require("express");
const router = express.Router();
const checkTasks = require("../corn/taskNotifier");

router.get("/run-tasks", async (req, res) => {
  try {
    const key = req.query.key;
    if (key !== process.env.CRON_KEY) {
      return res.status(403).send("Unauthorized");
    }

    await checkTasks();
    res.status(200).send("Task check completed successfully");
  } catch (error) {
    console.error("Error running task check:", error);
    res.status(500).send("Error running task check");
  }
});

