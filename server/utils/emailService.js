// utils/emailService.js
const Brevo = require("@getbrevo/brevo");
require("dotenv").config();

const { welcomeEmailTemplate } = require("../utils/emailTemplates.js");

// Initialize Brevo Transactional Email API
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API key from environment variable
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Optional: plain text fallback
    const textContent = htmlContent.replace(/<[^>]+>/g, "");

    const sendSmtpEmail = {
      sender: { name: "ForTask", email: process.env.EMAIL_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent,
      textContent,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent to ${to}: ${subject}`);
    return response;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body || error.message
    );
  }
};

const sendWelcomeEmail = async (to, name) => {
  try {
    await sendEmail(to, "Welcome to ForTask!", welcomeEmailTemplate(name));
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
