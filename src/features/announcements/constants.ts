/** Constants owned by the Announcements feature  */

export const CATEGORIES = [
  "Health",
  "Transport",
  "Education",
  "Infrastructure",
] as const;

/** Filter options — "All" plus every real category. */
export const CATEGORY_FILTERS = ["All", ...CATEGORIES] as const;

// Category = id % 4 (0→Health, 1→Transport, 2→Education, 3→Infrastructure).
export const CATEGORY_COUNT = CATEGORIES.length;

// Urgent = id % 7 === 0.
export const URGENT_ID_DIVISOR = 7;

/** URL query-param keys */
export const QUERY_PARAMS = {
  search: "q",
  category: "category",
} as const;

/** Debounce delay (ms) for the search input */
export const SEARCH_DEBOUNCE_MS = 250;
