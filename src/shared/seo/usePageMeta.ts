import { useEffect } from "react";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from "./siteMeta";

export interface PageMeta {
  /** Page title (the site name is appended automatically). */
  title: string;
  description?: string;
  /** Absolute image URL for share cards. Defaults to the site image. */
  image?: string;
  /** Open Graph type — `article` for a single announcement, else `website`. */
  type?: "website" | "article";
  /** Canonical path (e.g. `/announcements/5`). Defaults to the live pathname. */
  path?: string;
  /** Exclude from search indexes (user-specific or transient pages). */
  noIndex?: boolean;
  /** Optional JSON-LD structured data (e.g. a NewsArticle for SEO rich results). */
  jsonLd?: Record<string, unknown> | null;
}

const JSONLD_ELEMENT_ID = "page-jsonld";

/** Create-or-update a `<meta>` tag keyed by `name` or `property`. */
function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Create-or-update a `<link rel>` tag (used for canonical). */
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Imperatively manage document head tags for the current route — title,
 * description, Open Graph, Twitter cards, canonical link and optional JSON-LD.
 */
export function usePageMeta(meta: PageMeta): void {
  const {
    title,
    description = SITE_DESCRIPTION,
    image = SITE_OG_IMAGE,
    type = "website",
    path,
    noIndex = false,
    jsonLd = null,
  } = meta;

  // Serialize JSON-LD so an inline object literal doesn't refire the effect.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    // Open Graph (Facebook, LinkedIn, Slack, iMessage, …)
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);

    // Twitter / X
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertLink("canonical", url);

    // JSON-LD structured data — add/replace/remove a single managed script tag.
    const existing = document.getElementById(JSONLD_ELEMENT_ID);
    if (jsonLdString) {
      const script =
        (existing as HTMLScriptElement | null) ??
        document.createElement("script");
      script.id = JSONLD_ELEMENT_ID;
      script.setAttribute("type", "application/ld+json");
      script.textContent = jsonLdString;
      if (!existing) {
        document.head.appendChild(script);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, image, type, path, noIndex, jsonLdString]);
}
