// Email Template

const baseEmailWrapper = (title, color, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <div style="background: ${color}; color: #ffffff; text-align: center; padding: 24px;">
      <h2 style="margin: 0; font-size: 22px;">${title}</h2>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      ${body}
    </div>
    <div style="background: #f1f1f1; color: #777777; text-align: center; padding: 16px; font-size: 14px;">
      &copy; ${new Date().getFullYear()} ForTask. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// 📨 Welcome Email
exports.welcomeEmailTemplate = (name) =>
  baseEmailWrapper(
    "Welcome to ForTask",
    "#3b82f6",
    `
      <p>Hi <strong>${name}</strong>,</p>
      <p>We’re thrilled to have you join <strong>ForTask</strong> — your personal productivity companion to stay on top of your goals, deadlines, and progress.</p>
      <p>Here’s what you can do next:</p>
      <ul style="padding-left: 20px;">
        <li>Create and organize your daily tasks</li>
        <li>Get smart reminders for upcoming and overdue tasks</li>
        <li>Track your progress visually on your dashboard</li>
      </ul>
      <a href="${process.env.CLIENT_URL || "https://fortask.netlify.app"}"
         style="display:inline-block; margin-top: 20px; padding: 12px 20px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
         Go to Dashboard
      </a>
      <p style="margin-top: 24px;">If you ever need help, just reply to this email — we’re here for you!</p>
      <p>Let’s make productivity simple.<br>– The ForTask Team 🚀</p>
    `
  );

// Daily Task Summary
exports.dailyTaskSummaryTemplate = (userName, reminders, overdue, link) => {
  const hasReminders = reminders.length > 0;
  const hasOverdue = overdue.length > 0;

  const reminderItems = reminders
    .map(
      (task) =>
        `<li><b>${task.title}</b> — due on ${new Date(
          task.dueDate
        ).toLocaleDateString()}</li>`
    )
    .join("");

  const overdueItems = overdue
    .map(
      (task) =>
        `<li><b>${task.title}</b> — was due on ${new Date(
          task.dueDate
        ).toLocaleDateString()}</li>`
    )
    .join("");

  //All clear message
  const allClearMessage = `
    <p>Hi <b>${userName}</b>,</p>
    <p>You’re all caught up — no pending or overdue tasks right now!</p>
    <p>Keep that streak going and make today count</p>
    <a href="${link}"
       style="display:inline-block; margin-top:20px; padding:10px 20px; background:#3b82f6; color:white; border-radius:6px; text-decoration:none; font-weight:600;">
       Go to Dashboard
    </a>
    <p style="margin-top: 24px; color:#6b7280;">Stay focused and keep winning,<br/>— The ForTask Team</p>
  `;

  //Main template body
  const body =
    !hasReminders && !hasOverdue
      ? allClearMessage
      : `
    <p>Hi <b>${userName}</b>,</p>
    ${
      hasReminders
        ? `<h3 style="color:#3b82f6;">Tasks Due Tomorrow (${reminders.length}):</h3><ul style="padding-left:20px;">${reminderItems}</ul>`
        : ""
    }
    ${
      hasOverdue
        ? `<h3 style="color:#ef4444;">Overdue Tasks (${overdue.length}):</h3><ul style="padding-left:20px;">${overdueItems}</ul>`
        : ""
    }
    <a href="${link}"
       style="display:inline-block; margin-top:20px; padding:10px 20px; background:#3b82f6; color:white; border-radius:6px; text-decoration:none; font-weight:600;">
       Go to Dashboard
    </a>
    <p style="margin-top: 24px; color:#6b7280;">Stay focused and keep going<br/>— The ForTask Team</p>
  `;

  return baseEmailWrapper("Your Daily Task Summary", "#3b82f6", body);
};
