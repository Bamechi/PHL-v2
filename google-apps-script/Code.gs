const SPREADSHEET_ID = "1SUHqRUlgOdX5-TvpmfcqQAOPOry5K1PE97eSJqB3Ypg";
const SHEET_NAME = "Sheet1";
const NOTIFY_EMAIL = "phlnonprofit@gmail.com";
const HEADERS = ["Your Name", "Email", "City", "I want to", "Timestamp"];

/**
 * Run this once from the Apps Script editor before deploying the web app.
 * It verifies access to the spreadsheet and preserves the expected header row.
 */
function setup() {
  const sheet = getSheet_();
  ensureHeaders_(sheet);
  SpreadsheetApp.flush();
  return `Ready: ${sheet.getParent().getName()} / ${sheet.getName()}`;
}

/** Returns a small health response when the deployed URL is opened in a browser. */
function doGet() {
  return json_({ ok: true, service: "Project High-Lvl partner intake" });
}

/** Receives the website form submission and adds it to the partner spreadsheet. */
function doPost(e) {
  try {
    const payload = parsePayload_(e);

    // Honeypot: silently accept likely bot submissions without saving them.
    if (clean_(payload.website)) {
      return json_({ ok: true });
    }

    const name = clean_(payload.name);
    const email = clean_(payload.email).toLowerCase();
    const city = clean_(payload.city);
    const interest = clean_(payload.segment || payload.interest || payload["I want to"]);

    if (!name || !email || !city || !interest) {
      throw new Error("Name, email, city, and interest are required.");
    }
    if (!isValidEmail_(email)) {
      throw new Error("Please provide a valid email address.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      ensureHeaders_(sheet);
      sheet.appendRow([
        safeCell_(name),
        safeCell_(email),
        safeCell_(city),
        safeCell_(interest),
        new Date(),
      ]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `New Project High-Lvl inquiry — ${interest}`,
        body: [
          "A new website inquiry was added to the Partner Submission Form.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `City: ${city}`,
          `I want to: ${interest}`,
        ].join("\n"),
        replyTo: email,
        name: "Project High-Lvl Website",
      });
    } catch (notificationError) {
      console.error("The row was saved, but the email notification failed:", notificationError);
    }

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" was not found.`);
  return sheet;
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  const needsHeaders = HEADERS.some((header, index) => current[index] !== header);
  if (needsHeaders) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function parsePayload_(e) {
  if (!e) return {};
  const raw = e.postData && e.postData.contents;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      // Fall through to standard form parameters.
    }
  }
  return e.parameter || {};
}

function clean_(value) {
  return String(value || "").trim().slice(0, 500);
}

// Prevent spreadsheet-formula injection from public form fields.
function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
