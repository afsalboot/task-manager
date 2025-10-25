const cron = require("node-cron");
const Task = require("../models/Task.js");
const sendEmail = require("../utils/emailService.js");
const {
  taskReminderTemplate,
  overdueTaskTemplate,
} = require("../utils/emailTemplates.js");

const checkTasks = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allTasks = await Task.find().populate("user", "email name");

    for (const task of allTasks) {
      if (!task.user || !task.dueDate) continue;

      const dueDate = new Date(task.dueDate);
      const email = task.user.email;
      const dashboardLink = "https://fortask.netlify.app";

      // Reminder for tasks due tomorrow
      if (dueDate.toDateString() === tomorrow.toDateString()) {
        await sendEmail(
          email,
          `Upcoming Task Reminder: ${task.title}`,
          taskReminderTemplate(
            task.user.name || "User",
            task.title,
            task.dueDate,
            dashboardLink
          )
        );
      }

      // Alert for overdue tasks
      if (dueDate < now && task.status !== "Completed") {
        await sendEmail(
          email,
          `Overdue Task Alert: ${task.title}`,
          overdueTaskTemplate(
            task.user.name || "User",
            task.title,
            task.dueDate,
            dashboardLink
          )
        );
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
};

// Run daily at 9 AM
cron.schedule("0 9 * * *", checkTasks);

module.exports = checkTasks;
