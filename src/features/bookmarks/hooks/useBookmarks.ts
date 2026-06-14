import { useSyncExternalStore } from "react";
import * as store from "@features/bookmarks/store/bookmarksStore";

export interface UseBookmarksResult {
  bookmarkedIds: readonly number[];
  count: number;
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
  clearBookmarks: () => void;
}

/**
 * Subscribes to the bookmarks store via useSyncExternalStore.
 */
export function useBookmarks(): UseBookmarksResult {
  const bookmarkedIds = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return {
    bookmarkedIds,
    count: bookmarkedIds.length,
    isBookmarked: store.isBookmarked,
    toggleBookmark: store.toggleBookmark,
    clearBookmarks: store.clearBookmarks,
  };
}
