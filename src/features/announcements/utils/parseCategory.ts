import { CATEGORY_FILTERS } from "@features/announcements/constants";
import type { CategoryFilter } from "@features/announcements/types";

/** Narrow an arbitrary string from the URL to a valid CategoryFilter. */
export function parseCategory(raw: string | null): CategoryFilter {
  return (CATEGORY_FILTERS as readonly string[]).includes(raw ?? "")
    ? (raw as CategoryFilter)
    : "All";
}