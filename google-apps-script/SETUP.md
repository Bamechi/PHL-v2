# Project High-Lvl partner form setup

1. Open the existing **PHL Partner Intake Form** Apps Script project.
2. Open `Code.gs`, remove the placeholder `myFunction`, and paste the complete contents of this folder's `Code.gs` file.
3. Click **Save**.
4. Select `setup` from the function menu and click **Run** once. Approve the requested Spreadsheet and email permissions. The function verifies the `Sheet1` tab and its five headers.
5. Click **Deploy → New deployment**.
6. Choose **Web app** and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, authorize if prompted, and copy the Web app URL ending in `/exec`.
8. Paste that URL between the quotes in `PARTNER_FORM_URL` near the top of `app/page.tsx`, then rebuild and republish the website.

The form will append `Your Name`, `Email`, `City`, `I want to`, and `Timestamp` to the existing spreadsheet. It also emails a notification to `phlnonprofit@gmail.com`. Until the `/exec` URL is added to the website, the form falls back to a pre-addressed email.
