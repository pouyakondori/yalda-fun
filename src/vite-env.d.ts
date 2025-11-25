/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPS_SCRIPT_URL?: string;
  readonly VITE_GOOGLE_SHEET_NAME_COLUMN?: string;
  readonly VITE_GOOGLE_SHEET_PARTNER_COLUMN?: string;
  readonly VITE_GOOGLE_SHEET_DISHES_COLUMN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
