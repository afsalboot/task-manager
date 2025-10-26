// emailTemplates.js

exports.taskReminderTemplate = (userName, taskTitle, dueDate, link) => `
  <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background: #3b82f6; color: white; padding: 16px 24px;">
        <h2 style="margin: 0;">📅 Task Reminder</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hi <b>${userName}</b>,</p>
        <p>This is a friendly reminder that your task <b>"${taskTitle}"</b> is due on <b>${new Date(dueDate).toLocaleDateString()}</b>.</p>
        <a href="${link}" style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
          View Task
        </a>
        <p style="margin-top: 24px; color: #6b7280;">Stay productive,<br/>The Task Manager Team</p>
      </div>
    </div>
  </div>
`;

exports.overdueTasksTemplate = (userName, tasks, dashboardLink) => {
  const taskListHtml = tasks
    .map(task => `<li>${task.title} (Due: ${new Date(task.dueDate).toLocaleDateString()})</li>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background: #fff7f7; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: #ef4444; color: white; padding: 16px 24px;">
          <h2 style="margin: 0;">⚠️ Overdue Tasks Alert</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <b>${userName || "User"}</b>,</p>
          <p>You have <strong>${tasks.length}</strong> overdue task(s):</p>
          <ul>
            ${taskListHtml}
          </ul>
          <a href="${dashboardLink}" style="display:inline-block; margin-top: 16px; padding: 10px 20px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px;">
            Open Dashboard
          </a>
          <p style="margin-top: 24px; color: #6b7280;">Please complete them as soon as possible.<br/>— Task Manager Team</p>
        </div>
      </div>
    </div>
  `;
};
