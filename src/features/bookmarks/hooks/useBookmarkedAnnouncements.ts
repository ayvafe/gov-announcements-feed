import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isAbortError } from "@shared/api/client";
import { fetchAnnouncementById } from "@features/announcements/api/announcementsApi";
import { useAnnouncements } from "@features/announcements/hooks/useAnnouncements";
import type { Announcement } from "@features/announcements/types";
import { useBookmarks } from "./useBookmarks";

type Status = "loading" | "error" | "success";

export interface BookmarkedAnnouncements {
  status: Status;
  items: Announcement[];
  error: string | null;
  refetch: () => void;
}

/**
 * Resolves full data for bookmarked announcements.
 * Cache-first: uses feed cache instantly when available,
 * fetches by id from the server only for misses.
 */
export function useBookmarkedAnnouncements(): BookmarkedAnnouncements {
  const { bookmarkedIds } = useBookmarks();
  const { getById } = useAnnouncements();

  // Individually fetched announcements (cache misses)
  const [fetched, setFetched] = useState<Map<number, Announcement>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  // Ids not yet in cache or fetched
  const missingIds = useMemo(
    () => bookmarkedIds.filter((id) => !getById(id) && !fetched.has(id)),
    [bookmarkedIds, getById, fetched],
  );
  // Stringify for stable dep comparison
  const missingKey = missingIds.join(",");

  useEffect(() => {
    if (missingIds.length === 0) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setError(null);

    Promise.all(
      missingIds.map((id) => fetchAnnouncementById(id, controller.signal)),
    )
      .then((results) => {
        if (controller.signal.aborted) {
          return;
        }

        setFetched((prev) => {
          const next = new Map(prev);
          for (const announcement of results)
            next.set(announcement.id, announcement);
          return next;
        });
      })
      .catch((err: Error) => {
        if (isAbortError(err)) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load bookmarks.",
        );
      });

    return () => controller.abort();
    // `missingKey` captures the actual id set; `reloadToken` drives manual retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingKey, reloadToken]);

  // Merge cache + fetched, preserving the store's most-recent-first ordering.
  const items = useMemo(
    () =>
      bookmarkedIds
        .map((id) => getById(id) ?? fetched.get(id))
        .filter((a): a is Announcement => a !== undefined),
    [bookmarkedIds, getById, fetched],
  );

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  // Status is derived (not stored) so it can't drift out of sync with the data.
  const status: Status = error
    ? "error"
    : missingIds.length > 0
      ? "loading"
      : "success";

  return { status, items, error, refetch };
}
