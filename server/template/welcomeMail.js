// utils/welcomeEmailTemplate.js
const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ForTask!</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background-color: #3b82f6;
      color: white;
      text-align: center;
      padding: 25px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 25px 30px;
      color: #333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 20px;
      background-color: #3b82f6;
      color: #ffffff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      background-color: #f1f1f1;
      color: #777;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ForTask!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We’re thrilled to have you join <strong>ForTask</strong> — your personal productivity companion to stay on top of your goals, deadlines, and progress.</p>
      <p>Here’s what you can do next:</p>
      <ul>
        <li>✅ Create and organize your daily tasks</li>
        <li>⏰ Get smart reminders for upcoming and overdue tasks</li>
        <li>📊 Track your progress visually on your dashboard</li>
      </ul>
      <a href="${process.env.CLIENT_URL || "https://fortask.app"}" class="button">Go to Dashboard</a>
      <p>If you ever need help, just reply to this email — we’re here for you!</p>
      <p>Let’s make productivity simple.<br>– The ForTask Team 🚀</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ForTask. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

module.exports = { welcomeEmailTemplate };
