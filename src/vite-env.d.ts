/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the announcements API */
  readonly VITE_API_BASE_URL?: string;
  /** Public site origin for canonical */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
