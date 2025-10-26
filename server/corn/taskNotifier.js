// taskNotifier.js
const Task = require("../models/Task.js");
const sendEmail = require("../utils/emailService.js");
const { taskReminderTemplate, overdueTaskTemplate } = require("../utils/emailTemplates.js");

// Flag to ensure the task runs only once per day
let lastRunDate = null;

const checkTasks = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allTasks = await Task.find().populate("user", "email name");

    for (const task of allTasks) {
      if (!task.user || !task.dueDate || task.status === "Completed") continue;

      const dueDate = new Date(task.dueDate);
      const email = task.user.email;
      const dashboardLink = "https://fortask.netlify.app";

      // Reminder for tasks due tomorrow (send only once)
      if (
        dueDate.toDateString() === tomorrow.toDateString() &&
        !task.lastReminderSent
      ) {
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

        // Mark reminder as sent
        task.lastReminderSent = new Date();
        await task.save();
      }

      // Alert for overdue tasks
      if (dueDate < now) {
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

    console.log("Task check completed.");
  } catch (error) {
    console.error("Error in task check:", error.message);
  }
};

// Run every minute, check IST time, execute once per day
setInterval(() => {
  const now = new Date();
  const istHour = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24;
  const istMinutes = (now.getUTCMinutes() + 30) % 60;
  const today = now.toLocaleDateString("en-IN");

  // Run at 9:00–9:09 IST, only once per day
  if (istHour === 9 && istMinutes < 10 && lastRunDate !== today) {
    console.log("Running daily task check (IST)...");
    checkTasks();
    lastRunDate = today;
  }
}, 60 * 1000);

module.exports = checkTasks;
