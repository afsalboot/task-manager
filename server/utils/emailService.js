// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
//   },
// });

// const sendEmail = async (to, subject, html, retries = 2) => {
//   console.log("Sending email...");
//   try {
//     const info = await transporter.sendMail({
//       from: `"Task Manager" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
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

// module.exports = sendEmail;
