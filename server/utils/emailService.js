// Nodemailer Config
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });
const Resend = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Email error:", err.message);
    }
}


module.exports = sendEmail;