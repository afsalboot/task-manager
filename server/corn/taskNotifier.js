const cron =  require("node-cron");
const Task = require("../models/Task.js");
const {sendEmail} = require("../utils/emailService.js");
const { taskReminderTemplate, overdueTaskTemplate } = require("../utils/emailTemplates.js");

const checkTasks = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all tasks (you can optimize by user if needed)
    const allTasks = await Task.find().populate("user", "name email");

    for (const task of allTasks) {
      const dueDate = new Date(task.dueDate);
      const user = task.user;

      if (!user?.email) continue;

      // Upcoming tasks (due tomorrow)
      if (
        dueDate.getDate() === tomorrow.getDate() &&
        dueDate.getMonth() === tomorrow.getMonth() &&
        dueDate.getFullYear() === tomorrow.getFullYear() &&
        task.status !== "completed"
      ) {
        await sendEmail(
          user.email,
          `Reminder: ${task.title} is due tomorrow`,
          taskReminderTemplate(user.name, task.title, dueDate)
        );
      }

      // Overdue tasks
      if (dueDate < now && task.status !== "completed") {
        await sendEmail(
          user.email,
          `Overdue: ${task.title}`,
          overdueTaskTemplate(user.name, task.title, dueDate)
        );
      }
    }

    console.log("Task reminder and overdue check completed");
  } catch (err) {
    console.error("Error checking tasks:", err);
  }
};

// Schedule to run every day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Running task notification cron job...");
  checkTasks();
});

module.exports = {checkTasks};