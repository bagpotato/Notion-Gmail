# Advanced Gmail to Notion Sync Pro

<p align="center">
  <img src="https://skillicons.dev/icons?i=gmail,notion,js" alt="Skill Icons" />
</p>

An automated pipeline to transform emails into Notion tasks with full support for file attachments, sender security, and deep linking.

## Pro Features
- **Sender Security**: Only processes emails from an authorized address to prevent spam.
- **Attachment Support**: Automatically uploads email attachments to Google Drive and links them in the Notion task.
- **Deep Linking**: Includes a direct link back to the original Gmail thread in each Notion task for quick access.
- **Auto-Reply**: Sends a confirmation email to the sender once the task is successfully created.
- **Automatic Labeling**: Categorizes emails in Gmail as 'Processed' or 'Error' for easy tracking.

## Setup Instructions

### 1. Notion Configuration
1. Create an integration at [Notion Developers](https://www.notion.com/my-integrations).
2. Note your `Internal Integration Token`.
3. Create a Notion database with these exact properties:
   - Name (type: Title)
   - Description (type: Rich Text)
   - Date (type: Date)
   - Priority (type: Select)
   - Status (type: Status)
   - Source (type: Rich Text)
4. Grant the integration access to the database via the 'Connect to' menu.

### 2. Google Apps Script Configuration
1. Create a new project at [Apps Script](https://script.google.com/).
2. Copy the contents of `Main.gs`.
3. Create a `Config.gs` file and enter your API keys and database IDs.
4. Enable the **Google Drive API** service in the Apps Script editor (Services > Add a service > Drive API).
5. Run the `setupTrigger` function once to activate the automation.

## Usage
Send an email to yourself with the subject defined in your config (e.g., "Notion Task"):

```text
TASK: Review financial report
DESC: Check the Q3 numbers and verify with the team.
DATE: 2026-12-01
PRIORITY: High
STATUS: In progress  