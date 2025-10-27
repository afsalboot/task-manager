const cron = require("node-cron");
const Task = require("../models/Task");
const { sendEmail } = require("../utils/emailService");
const { taskReminderTemplate, overdueTaskTemplate } = require("../template/emailTemplates");

const checkTasks = async () => {
  try {
    const now = new Date();
    const allTasks = await Task.find().populate("user", "name email");

    for (const task of allTasks) {
      const dueDate = new Date(task.dueDate);
      const diffDays = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));

      if (!task.user?.email) continue;

      if (diffDays === 1 && task.status !== "completed") {
        await sendEmail(
          task.user.email,
          `Reminder: ${task.title} is due tomorrow`,
          taskReminderTemplate(task.user.name, task.title, dueDate)
        );
      }

      if (diffDays < 0 && task.status !== "completed") {
        await sendEmail(
          task.user.email,
          `Overdue: ${task.title}`,
          overdueTaskTemplate(task.user.name, task.title, dueDate)
        );
      }
    }

    console.log("Task reminder & overdue check complete");
  } catch (err) {
    console.error("Error checking tasks:", err);
  }
};

// Run every day at 9 AM India time
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Running daily task notification job...");
  checkTasks();
}, { timezone: "Asia/Kolkata" });

module.exports = { checkTasks };
