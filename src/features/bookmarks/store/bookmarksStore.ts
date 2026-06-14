import { readJSON, writeJSON } from "@shared/storage/storage";
import { BOOKMARKS_STORAGE_KEY } from "@features/bookmarks/constants";

/**
 * Bookmarks store (pub/sub + localStorage).
 *
 * State is an immutable number[] (newest first) so useSyncExternalStore's
 * reference check works correctly. A derived Set is kept for O(1) lookups.
 * Cross-tab sync is handled via the storage event.
 */

type Listener = () => void;

let bookmarkedIds: readonly number[] = readJSON<number[]>(
  BOOKMARKS_STORAGE_KEY,
  [],
);
let idSet = new Set(bookmarkedIds);
const listeners = new Set<Listener>();

/** Notify every subscriber that the snapshot changed. */
function emit(): void {
  for (const listener of listeners) listener();
}

/** Replace state, persist, refresh the derived Set, and emit. */
function commit(next: readonly number[]): void {
  bookmarkedIds = next;
  idSet = new Set(next);
  writeJSON(BOOKMARKS_STORAGE_KEY, next as number[]);
  emit();
}

// --- Public store API -----------------------

/** Subscribe to changes */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current snapshot */
export function getSnapshot(): readonly number[] {
  return bookmarkedIds;
}

export function isBookmarked(id: number): boolean {
  return idSet.has(id);
}

/** Toggle a bookmark (LIFO — newest first). */
export function toggleBookmark(id: number): void {
  commit(
    idSet.has(id)
      ? bookmarkedIds.filter((existing) => existing !== id)
      : [id, ...bookmarkedIds],
  );
}

export function clearBookmarks(): void {
  if (bookmarkedIds.length === 0) {
    return;
  }
  commit([]);
}

// Re-sync from localStorage when another tab writes, so UI stays in sync
function initCrossTabSync(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== BOOKMARKS_STORAGE_KEY) {
      return;
    }

    bookmarkedIds = readJSON<number[]>(BOOKMARKS_STORAGE_KEY, []);
    idSet = new Set(bookmarkedIds);
    emit();
  });
}

initCrossTabSync();
