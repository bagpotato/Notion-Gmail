// Config.gs - Configuration Template
const CONFIG = {
  // 1. NOTION CONFIGURATION
  NOTION_API_KEY: "YOUR_NOTION_TOKEN",
  NOTION_DATABASE_ID: "YOUR_DATABASE_ID",

  // 2. GMAIL CONFIGURATION
  AUTHORIZED_EMAIL: "your_email@gmail.com", // The email address that is allowed to send tasks
  GMAIL_SUBJECT_FILTER: "Notion Task",
  GMAIL_PROCESSED_LABEL: "Notion/Processed",
  GMAIL_ERROR_LABEL:     "Notion/Error",

  // 3. DRIVE CONFIGURATION
  DRIVE_FOLDER_NAME: "Notion Attachments", // Folder to save email attachments

  // 4. TRIGGER & GENERAL CONFIGURATION
  TRIGGER_INTERVAL_MINUTES: 5,
  SEND_CONFIRMATION: true, // Send an email confirmation upon success

  // 5. FIELD MAPPING (Notion Column Names)
  NOTION_FIELDS: {
    title:       "Name",
    description: "Description",
    dueDate:     "Date",
    priority:    "Priority",
    status:      "Status",
    source:      "Source"
  }
};
