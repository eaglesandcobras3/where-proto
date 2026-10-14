/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_UNIFIED_LISTING_DETAIL_LAYOUT?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace astroHTML.JSX {
  interface IntrinsicElements {
    "wa-button": any;
    "wa-checkbox": any;
    "wa-dialog": any;
    "wa-input": any;
    "wa-option": any;
    "wa-select": any;
    "wa-switch": any;
    "wa-textarea": any;
  }
}
