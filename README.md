# Yalda Party – Food Selection

Simple two-page React/Vite app for coordinating our Yalda dinner dishes. The home page POSTs to a Google Apps Script endpoint, while the results page reads from the same sheet via the script’s JSON response. Each dish automatically closes after six households sign up, so the UI disables fully booked items in real time.

## Environment Variables

Create a `.env` file (or configure in Vercel) with the following keys:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
VITE_GOOGLE_SHEET_NAME_COLUMN=Name
VITE_GOOGLE_SHEET_PARTNER_COLUMN=Partner
VITE_GOOGLE_SHEET_DISHES_COLUMN=Selected Dishes
```

- `VITE_APPS_SCRIPT_URL` is the published web app URL from your Google Apps Script deployment (must be accessible to “anyone with the link”). It is used both in the React app (during dev) and inside the Vercel serverless proxy (`/api/apps-script`) that avoids CORS in production.
- The sheet column names should match the header titles inside the connected Google Sheet so the dashboard knows which values to read.

During local development the Vite dev server proxies `/api/apps-script` directly to `VITE_APPS_SCRIPT_URL`. In production the React client calls the same `/api/apps-script` path, which is backed by `api/apps-script.js` and forwards the request to Google Apps Script.

Once those are configured you can run:

```bash
npm install
npm run dev
```
