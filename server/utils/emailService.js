// utils/emailService.js
const Brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
require("dotenv").config();

const apiInstance = new Brevo.TransactionalEmailsApi();



// Set your API key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const sendSmtpEmail = {
      sender: { name: "ForTask", email: process.env.EMAIL_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
  }
};

module.exports = {sendEmail};