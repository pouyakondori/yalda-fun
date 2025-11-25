# Yalda Party – Food Selection

Simple two-page React/Vite app for coordinating our Yalda dinner dishes. The home page submits to a Google Form, while the results page reads from the connected Google Sheet.

## Environment Variables

Create a `.env` file (or configure in Vercel) with the following keys:

```
VITE_GOOGLE_FORM_ID=FORM_ID_FROM_URL
VITE_GOOGLE_FORM_NAME_ENTRY=123456
VITE_GOOGLE_FORM_PARTNER_ENTRY=987654  # optional
VITE_GOOGLE_FORM_DISHES_ENTRY=456789
VITE_GOOGLE_SHEET_ID=SHEET_ID_FROM_URL
VITE_GOOGLE_SHEET_NAME_COLUMN=Name
VITE_GOOGLE_SHEET_PARTNER_COLUMN=Partner
VITE_GOOGLE_SHEET_DISHES_COLUMN=Selected Dishes
```

- The form entry values are the numeric identifiers from the Google Form inputs (add the digits only — the app will prefix `entry.` for you).
- The sheet column names should match the header titles inside the connected Google Sheet.

Once those are configured you can run:

```bash
npm install
npm run dev
```
