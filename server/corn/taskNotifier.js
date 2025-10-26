// taskNotifier.js
const nodemailer = require("nodemailer");
const Task = require("../models/Task.js");
const { taskReminderTemplate, overdueTaskTemplate } = require("../utils/emailTemplates.js");
require("dotenv").config();

// EMAIL SENDER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
  },
});

const sendEmail = async (to, subject, html, retries = 2) => {
  console.log("Sending email to:", to);
  try {
    const info = await transporter.sendMail({ from: `"Task Manager" <${process.env.EMAIL_USER}>`, to, subject, html });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (err) {
    if (retries > 0) {
      console.warn(`⚠️ Retry sending email... (${2 - retries + 1})`);
      await new Promise((r) => setTimeout(r, 2000));
      return sendEmail(to, subject, html, retries - 1);
    }
    console.error("Email send error:", err.message);
  }
};

// ------------------- TASK CHECKER -------------------
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
      if (dueDate.toDateString() === tomorrow.toDateString() && !task.lastReminderSent) {
        await sendEmail(
          email,
          `Upcoming Task Reminder: ${task.title}`,
          taskReminderTemplate(task.user.name || "User", task.title, task.dueDate, dashboardLink)
        );
        task.lastReminderSent = new Date();
        await task.save();
      }

      // Alert for overdue tasks
      if (dueDate < now) {
        await sendEmail(
          email,
          `Overdue Task Alert: ${task.title}`,
          overdueTaskTemplate(task.user.name || "User", task.title, task.dueDate, dashboardLink)
        );
      }
    }

    console.log("Task check completed.");
  } catch (error) {
    console.error("Error in task check:", error.message);
  }
};

// ------------------- SCHEDULE DAILY RUN AT 9 AM IST -------------------
const scheduleDailyTaskCheck = () => {
  const now = new Date();

  // IST is UTC+5:30
  const istOffset = 5.5 * 60; // minutes
  const utcMinutes = now.getUTCMinutes();
  const utcHours = now.getUTCHours();

  const istNow = new Date(now.getTime() + istOffset * 60 * 1000);

  const nextRun = new Date(istNow);
  nextRun.setHours(9, 0, 0, 0); // 9:00 AM IST

  if (istNow >= nextRun) {
    nextRun.setDate(nextRun.getDate() + 1); // schedule for tomorrow if past 9 AM
  }

  const delay = nextRun.getTime() - istNow.getTime();
  console.log(`Next task check scheduled in ${Math.round(delay / 1000 / 60)} minutes`);

  setTimeout(async () => {
    await checkTasks();
    scheduleDailyTaskCheck(); // schedule next run
  }, delay);
};

// Start the scheduler
scheduleDailyTaskCheck();

module.exports = checkTasks;
