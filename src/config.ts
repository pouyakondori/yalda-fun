export const appsScriptConfig = {
  endpoint: import.meta.env.VITE_APPS_SCRIPT_URL ?? '',
};

export const sheetConfig = {
  columns: {
    name: import.meta.env.VITE_GOOGLE_SHEET_NAME_COLUMN ?? 'Name',
    partner: import.meta.env.VITE_GOOGLE_SHEET_PARTNER_COLUMN ?? 'Partner',
    dishes: import.meta.env.VITE_GOOGLE_SHEET_DISHES_COLUMN ?? 'Selected Dishes',
  },
};
