# How to Use: Gmail to Notion Automation

This guide provides step-by-step instructions on setting up the email-to-Notion integration. It uses Google Apps Script to read emails matching specific labels/subjects and sends the extracted data directly to your Notion database.

## Step 1: Prepare Notion

1. Go to [Notion Developers](https://www.notion.com/my-integrations) and sign in.
2. Click **New integration** or **Create new integration**.
3. Name your integration (e.g., "Gmail to Notion"), submit, and then **copy the Internal Integration Token** (`secret_...`).
4. Go to your Notion Workspace and create a new **Database** (Full page or Inline).
5. Ensure the database has the following properties with the EXACT casing:
   - `Name` (Type: Title)
   - `Description` (Type: Rich Text)
   - `Date` (Type: Date)
   - `Priority` (Type: Select - Add options: "High", "Medium", "Low")
   - `Status` (Type: Status - Defaults like "Not started" are fine)
   - `Source` (Type: Rich Text)
6. To find your **Database ID**, copy the link to your database view. The link looks like `https://www.notion.so/{workspace_name}/{database_id}?v={view_id}`. Copy the `{database_id}` portion (a 32-character string located between the slash right after your workspace name and the `?v=`).
7. On your database page, go to the top right `...` menu, click **Connect to**, and choose the integration you created in step 2.

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/) and click **New project**.
2. Rename the project to "Gmail to Notion".
3. Rename the default `Code.gs` file to `Main.gs` and replace its contents with the code from the `Main.gs` file in this repository.
4. Click the `+` button next to Files to create a new script file, name it `Config.gs`, and paste the contents from `Config.gs`.
5. Open `Config.gs` and fill in your values:
   - `NOTION_API_KEY`: Your integration token from Step 1.
   - `NOTION_DATABASE_ID`: The Database ID from Step 1.
   - `AUTHORIZED_EMAIL`: The email address you will be sending tasks from.

## Step 3: Run the Code

1. In the Apps Script editor, open `Main.gs`.
2. From the top toolbar dropdown (next to the "Debug" and "Run" buttons), select `setupTrigger`.
3. Click **Run**.
4. A popup will ask for permissions. Click **Review permissions**, select your Google account, click **Advanced** at the bottom, and click **Go to Gmail to Notion (unsafe)**. Finally, click **Allow**.
5. Once executed, the trigger is active! The script will now run automatically in the background every 5 minutes (or whatever interval you specified in `Config.gs`).

## Step 4: Testing It Out

Send an email to your Gmail account (from your `AUTHORIZED_EMAIL` address).

- **Subject**: "Notion Task" (or whatever you set in `GMAIL_SUBJECT_FILTER`)
- **Body**:

```text
TASK: Buy groceries
DESC: Need to buy milk, bread, and eggs for the week.
DATE: 2026-05-15
PRIORITY: High
STATUS: Not started
```

In a few minutes, the script will run in the background. The automation will parse the email body, upload any attachments to Google Drive linking them to the note, mark the email as read and add the "Notion/Processed" label. Finally, the task should appear in your Notion database!