/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_FORM_ID?: string;
  readonly VITE_GOOGLE_FORM_NAME_ENTRY?: string;
  readonly VITE_GOOGLE_FORM_PARTNER_ENTRY?: string;
  readonly VITE_GOOGLE_FORM_DISHES_ENTRY?: string;
  readonly VITE_GOOGLE_SHEET_ID?: string;
  readonly VITE_GOOGLE_SHEET_NAME_COLUMN?: string;
  readonly VITE_GOOGLE_SHEET_PARTNER_COLUMN?: string;
  readonly VITE_GOOGLE_SHEET_DISHES_COLUMN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
