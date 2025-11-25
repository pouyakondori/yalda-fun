const ensureEntryPrefix = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return value.startsWith('entry.') ? value : `entry.${value}`;
};

export const googleFormConfig = {
  formId: import.meta.env.VITE_GOOGLE_FORM_ID ?? '',
  entries: {
    name: ensureEntryPrefix(import.meta.env.VITE_GOOGLE_FORM_NAME_ENTRY),
    partner: ensureEntryPrefix(import.meta.env.VITE_GOOGLE_FORM_PARTNER_ENTRY),
    dishes: ensureEntryPrefix(import.meta.env.VITE_GOOGLE_FORM_DISHES_ENTRY),
  },
};

export const googleSheetConfig = {
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID ?? '',
  columns: {
    name: import.meta.env.VITE_GOOGLE_SHEET_NAME_COLUMN ?? 'Name',
    partner: import.meta.env.VITE_GOOGLE_SHEET_PARTNER_COLUMN ?? 'Partner',
    dishes: import.meta.env.VITE_GOOGLE_SHEET_DISHES_COLUMN ?? 'Selected Dishes',
  },
};

export const buildFormAction = (formId?: string) =>
  formId ? `https://docs.google.com/forms/d/${formId}/formResponse` : null;

export const buildSheetCsvUrl = (sheetId?: string) =>
  sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv` : null;
