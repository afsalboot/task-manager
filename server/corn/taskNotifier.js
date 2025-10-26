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

    console.log("✅ Task reminder and overdue check completed");
  } catch (err) {
    console.error("❌ Error checking tasks:", err);
  }
};

// Schedule to run every day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Running task notification cron job...");
  checkTasks();
});

module.exports = {checkTasks};








// // taskNotifier.js
// const nodemailer = require("nodemailer");
// const Task = require("../models/Task.js");
// const { taskReminderTemplate, overdueTasksTemplate } = require("../utils/emailTemplates.js");
// require("dotenv").config();

// const DASHBOARD_LINK = "https://fortask.netlify.app";

// // ------------------- EMAIL SENDER -------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async (to, subject, html, retries = 2) => {
//   console.log("Sending email to:", to);
//   try {
//     const info = await transporter.sendMail({ from: `"Task Manager" <${process.env.EMAIL_USER}>`, to, subject, html });
//     console.log(`Email sent to ${to}: ${info.response}`);
//   } catch (err) {
//     if (retries > 0) {
//       console.warn(`⚠️ Retry sending email... (${2 - retries + 1})`);
//       await new Promise((r) => setTimeout(r, 2000));
//       return sendEmail(to, subject, html, retries - 1);
//     }
//     console.error("Email send error:", err.message);
//   }
// };

// // ------------------- TASK CHECKER -------------------
// const checkTasks = async () => {
//   try {
//     const now = new Date();
//     const tomorrow = new Date(now);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const allTasks = await Task.find().populate("user", "email name");
//     const userOverdueTasks = {};

//     for (const task of allTasks) {
//       if (!task.user || !task.dueDate || task.status === "Completed") continue;

//       const dueDate = new Date(task.dueDate);
//       const email = task.user.email;

//       // Reminder for tasks due tomorrow (send only once)
//       if (dueDate.toDateString() === tomorrow.toDateString() && !task.lastReminderSent) {
//         await sendEmail(
//           email,
//           `Upcoming Task Reminder: ${task.title}`,
//           taskReminderTemplate(task.user.name || "User", task.title, task.dueDate, DASHBOARD_LINK)
//         );
//         task.lastReminderSent = new Date();
//         await task.save();
//       }

//       // Collect overdue tasks per user
//       if (dueDate < now) {
//         if (!userOverdueTasks[email]) userOverdueTasks[email] = [];
//         userOverdueTasks[email].push(task);
//       }
//     }

//     // Send single email per user for overdue tasks
//     for (const email in userOverdueTasks) {
//       const tasks = userOverdueTasks[email];
//       await sendEmail(
//         email,
//         `Overdue Tasks Alert (${tasks.length})`,
//         overdueTasksTemplate(tasks[0].user.name, tasks, DASHBOARD_LINK)
//       );
//     }

//     console.log("Task check completed.");
//   } catch (error) {
//     console.error("Error in task check:", error.message);
//   }
// };

// // ------------------- TEST SCHEDULE: EVERY 30 SECONDS -------------------
// console.log("Test mode: Task checker will run every 30 seconds.");
// setInterval(() => {
//   console.log("Running task check (Test mode)...");
//   checkTasks();
// }, 30 * 1000); // 30 seconds

// module.exports = checkTasks;
