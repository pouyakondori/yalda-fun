# Yalda Party – Food Selection

Simple two-page React/Vite app for coordinating our Yalda dinner dishes. The home page POSTs to a Google Apps Script endpoint, while the results page reads from the same sheet via the script’s JSON response.

## Environment Variables

Create a `.env` file (or configure in Vercel) with the following keys:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
VITE_GOOGLE_SHEET_NAME_COLUMN=Name
VITE_GOOGLE_SHEET_PARTNER_COLUMN=Partner
VITE_GOOGLE_SHEET_DISHES_COLUMN=Selected Dishes
```

- `VITE_APPS_SCRIPT_URL` is the published web app URL from your Google Apps Script deployment (must be accessible to “anyone with the link”).
- The sheet column names should match the header titles inside the connected Google Sheet so the dashboard knows which values to read.

Once those are configured you can run:

```bash
npm install
npm run dev
```
