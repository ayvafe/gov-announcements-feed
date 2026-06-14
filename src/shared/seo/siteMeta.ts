/** Site-wide SEO/sharing constants */
export const SITE_NAME = "Gov Announcements";

export const SITE_DESCRIPTION =
  "Browse, search, filter and bookmark public government announcements across Health, Transport, Education and Infrastructure.";

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "");

/** Default social-share image */
export const SITE_OG_IMAGE = `${SITE_URL}/favicon.svg`;
