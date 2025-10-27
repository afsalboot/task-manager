const cron = require("node-cron");
const Task = require("../models/Task.js");
const { sendEmail } = require("../utils/emailService.js");
const { dailyDigestTemplate } = require("../utils/emailTemplates.js");

const checkTasks = async () => {
  try {
    const now = new Date();
    const allTasks = await Task.find().populate("user", "name email");

    // Group tasks by user
    const userTaskMap = new Map();

    for (const task of allTasks) {
      if (!task?.user?.email || !task?.dueDate) continue;
      if (task.status === "completed") continue;

      const dueDate = new Date(task.dueDate);
      const diffDays = Math.round((dueDate - now) / (1000 * 60 * 60 * 24));

      const userId = task.user._id.toString();
      if (!userTaskMap.has(userId)) {
        userTaskMap.set(userId, {
          user: task.user,
          reminders: [],
          overdue: [],
        });
      }

      if (diffDays === 1) userTaskMap.get(userId).reminders.push(task);
      if (diffDays < 0) userTaskMap.get(userId).overdue.push(task);
    }

    // Send one digest per user
    for (const [, { user, reminders, overdue }] of userTaskMap) {
      if (reminders.length === 0 && overdue.length === 0) continue;

      const dashboardLink = process.env.CLIENT_URL || "https://fortask.netlify.app/";

      try {
        await sendEmail(
          user.email,
          `Your Daily Task Summary — ${reminders.length} due tomorrow, ${overdue.length} overdue`,
          dailyDigestTemplate(user.name, reminders, overdue, dashboardLink)
        );
        console.log(`Daily digest sent to ${user.email}`);
      } catch (err) {
        console.warn(`Failed to send daily digest to ${user.email}:`, err.message);
      }
    }

    console.log("Daily digest check complete");
  } catch (err) {
    console.error("Error checking tasks:", err);
  }
};

// 🕘 Run every day at 9 AM India time
cron.schedule(
  "0 9 * * *",
  () => {
    console.log("Running daily digest job...");
    checkTasks();
  },
  { timezone: "Asia/Kolkata" }
);

module.exports = { checkTasks };
