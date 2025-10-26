// cronRoutes.js
const express = require("express");
const router = express.Router();
const checkTasks = require("../cron/taskNotifier.js");

router.get("/run-tasks", async (req, res) => {
  try {
    await checkTasks();
    res.status(200).send("Task check completed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error running task check");
  }
});

module.exports = router;
