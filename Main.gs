/**
 * MAIN LOGIC - PRO VERSION
 */
function checkGmailAndCreateNotionTasks() {
  const processedLabel = getOrCreateLabel_(CONFIG.GMAIL_PROCESSED_LABEL);
  const errorLabel     = getOrCreateLabel_(CONFIG.GMAIL_ERROR_LABEL);

  // Filter by subject and ensure it's from the authorized sender
  const query = `subject:"${CONFIG.GMAIL_SUBJECT_FILTER}" is:unread from:${CONFIG.AUTHORIZED_EMAIL}`;
  const threads = GmailApp.search(query);

  if (threads.length === 0) {
    Logger.log("No authorized emails found.");
    return;
  }

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      if (!message.isUnread()) return;

      try {
        const taskData = parseEmailToTask_(message);
        
        // 1. Handle Attachments
        const attachmentLinks = handleAttachments_(message);
        taskData.desc = taskData.desc ? `${taskData.desc}\n\nAttachments:\n${attachmentLinks}` : `Attachments:\n${attachmentLinks}`;

        // 2. Create Task in Notion
        const notionPageId = createNotionTask_(taskData, message.getThread().getPermalink());

        Logger.log(`Task created: "${taskData.title}"`);
        
        // 3. Mark as processed
        message.markRead();
        thread.addLabel(processedLabel);

        // 4. Send confirmation reply
        if (CONFIG.SEND_CONFIRMATION) {
          message.reply(`Success! Task created in Notion.\nView thread: ${message.getThread().getPermalink()}`);
        }

      } catch (error) {
        Logger.log(`Error: ${error.message}`);
        thread.addLabel(errorLabel);
        notifyError_(message, error);
      }
    });
  });
}

function handleAttachments_(message) {
  const attachments = message.getAttachments();
  if (attachments.length === 0) return "No attachments.";

  let folder = getOrCreateFolder_(CONFIG.DRIVE_FOLDER_NAME);
  let links = [];

  attachments.forEach(att => {
    const file = folder.createFile(att);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    links.push(`- ${att.getName()}: ${file.getUrl()}`);
  });

  return links.join("\n");
}

function parseEmailToTask_(message) {
  const body = message.getPlainBody().trim();
  const get = (key) => {
    const match = body.match(new RegExp(`^${key}:\\s*(.+)$`, "im"));
    return match ? match[1].trim() : null;
  };

  const title = get("TASK") || message.getSubject();
  const dueDate = get("DATE") || null;
  
  if (dueDate && !isValidDate_(dueDate)) throw new Error("Invalid date format YYYY-MM-DD");

  return {
    title: title,
    desc: get("DESC") || "",
    dueDate: dueDate,
    priority: normalizePriority_(get("PRIORITY")),
    status: get("STATUS") || "Not started",
    from: message.getFrom(),
    receivedAt: message.getDate()
  };
}

function createNotionTask_(taskData, threadUrl) {
  const F = CONFIG.NOTION_FIELDS;
  const properties = {};

  properties[F.title] = { title: [{ type: "text", text: { content: taskData.title } }] };
  properties[F.description] = { rich_text: [{ type: "text", text: { content: taskData.desc } }] };
  properties[F.source] = { rich_text: [{ type: "text", text: { content: `Email: ${threadUrl}` } }] };

  if (taskData.dueDate) properties[F.dueDate] = { date: { start: taskData.dueDate } };
  if (taskData.priority) properties[F.priority] = { select: { name: taskData.priority } };
  if (taskData.status) properties[F.status] = { status: { name: taskData.status } };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": `Bearer ${CONFIG.NOTION_API_KEY}`, "Notion-Version": "2022-06-28" },
    payload: JSON.stringify({ parent: { database_id: CONFIG.NOTION_DATABASE_ID }, properties: properties }),
    muteHttpExceptions: true
  };

  const res = UrlFetchApp.fetch("https://api.notion.com/v1/pages", options);
  if (res.getResponseCode() !== 200) throw new Error(res.getContentText());
  return JSON.parse(res.getContentText()).id;
}

// Helpers
function getOrCreateLabel_(name) { return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name); }
function getOrCreateFolder_(name) { 
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}
function isValidDate_(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); }
function normalizePriority_(p) {
  if (!p) return null;
  const m = { "high": "High", "alta": "High", "medium": "Medium", "media": "Medium", "low": "Low", "baja": "Low" };
  return m[p.toLowerCase()] || p;
}
function notifyError_(m, e) {
  GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Sync Error", `Error: ${e.message}`);
}

// Automatically requested and referenced by README
function setupTrigger() {
  removeTrigger(); // Prevent duplicates
  ScriptApp.newTrigger('checkGmailAndCreateNotionTasks')
    .timeBased()
    .everyMinutes(CONFIG.TRIGGER_INTERVAL_MINUTES)
    .create();
  Logger.log(`Trigger created to run every ${CONFIG.TRIGGER_INTERVAL_MINUTES} minutes.`);
}

function removeTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'checkGmailAndCreateNotionTasks') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  Logger.log('All previous triggers removed.');
}
