import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@shared/hooks/useDebounce";
import {
  QUERY_PARAMS,
  SEARCH_DEBOUNCE_MS,
} from "@features/announcements/constants";
import type { CategoryFilter } from "@features/announcements/types";
import { parseCategory } from "@features/announcements/utils/parseCategory";

export interface AnnouncementFilters {
  searchInput: string;
  setSearchInput: (value: string) => void;
  query: string;
  category: CategoryFilter;
  setCategory: (category: CategoryFilter) => void;
  isFiltering: boolean;
}

/**
 * filters (search + category) synced to the URL.
 * debounced writes keep history clean; back/refresh restore state for free.
 */
export function useAnnouncementFilters(): AnnouncementFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get(QUERY_PARAMS.search) ?? "";
  const category = parseCategory(searchParams.get(QUERY_PARAMS.category));

  // Seed from URL so refresh/back-nav restores the input
  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedQuery = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  // Update one param, preserve the other, drop empty/default values for clean URLs
  const updateParams = useCallback(
    (next: { query?: string; category?: CategoryFilter }) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);

          if (next.query !== undefined) {
            if (next.query.trim() === "") {
              params.delete(QUERY_PARAMS.search);
            } else {
              params.set(QUERY_PARAMS.search, next.query);
            }
          }
          if (next.category !== undefined) {
            if (next.category === "All") {
              params.delete(QUERY_PARAMS.category);
            } else {
              params.set(QUERY_PARAMS.category, next.category);
            }
          }
          return params;
        },
        // replace to avoid polluting history on every keystroke
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Mirror the debounced query into the URL when it diverges from what's there.
  useEffect(() => {
    if (debouncedQuery !== urlQuery) {
      updateParams({ query: debouncedQuery });
    }
  }, [debouncedQuery, urlQuery, updateParams]);

  const setCategory = useCallback(
    (next: CategoryFilter) => updateParams({ category: next }),
    [updateParams],
  );

  return {
    searchInput,
    setSearchInput,
    query: debouncedQuery,
    category,
    setCategory,
    isFiltering: debouncedQuery.trim() !== "" || category !== "All",
  };
}
