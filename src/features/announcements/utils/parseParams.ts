import { CATEGORY_FILTERS } from "@features/announcements/constants";
import type { CategoryFilter } from "@features/announcements/types";

/** Narrow an arbitrary string from the URL to a valid CategoryFilter. */
export function parseCategory(raw: string | null): CategoryFilter {
  return (CATEGORY_FILTERS as readonly string[]).includes(raw ?? "")
    ? (raw as CategoryFilter)
    : "All";
}

/** A valid announcement id is a positive integer. */
export function parseId(raw: string | undefined): number | null {
  if (raw === undefined) {
    return null;
  }
  const trimmed = raw.trim();
  // Reject empty, non-numeric, decimals, and non-positive ids.
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }
  const id = Number(trimmed);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
