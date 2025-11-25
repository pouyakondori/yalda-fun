const rawAppsScriptEndpoint = import.meta.env.VITE_APPS_SCRIPT_URL ?? '';

export const appsScriptConfig = {
  endpoint: rawAppsScriptEndpoint ? '/api/apps-script' : '',
  rawEndpoint: rawAppsScriptEndpoint,
  configured: Boolean(rawAppsScriptEndpoint),
};

export const sheetConfig = {
  columns: {
    name: import.meta.env.VITE_GOOGLE_SHEET_NAME_COLUMN ?? 'Name',
    partner: import.meta.env.VITE_GOOGLE_SHEET_PARTNER_COLUMN ?? 'Partner',
    dishes: import.meta.env.VITE_GOOGLE_SHEET_DISHES_COLUMN ?? 'Selected Dishes',
  },
};
