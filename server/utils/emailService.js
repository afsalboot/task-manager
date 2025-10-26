import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "ForTask", email: process.env.EMAIL_SENDER };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent:", response.messageId);
    return response;
  } catch (error) {
    console.error("Error sending email:", error.response?.text || error.message);
  }
};

export default sendEmail;








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
