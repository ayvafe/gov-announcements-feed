import { useEffect, useRef, useState } from "react";
import { isAbortError } from "@shared/api/client";
import {
  asyncError,
  asyncLoading,
  asyncSuccess,
  type AsyncState,
} from "@shared/types/async";
import { fetchAnnouncementById } from "@features/announcements/api/announcementsApi";
import { useAnnouncements } from "./useAnnouncements";
import type { Announcement } from "@features/announcements/types";
import { parseId } from "@features/announcements/utils/parseParams";

/**
 * Resolves a single announcement for the detail page.
 * Cache-first: returns instantly from the feed cache when available,
 * fetches by id only on direct open. Aborts stale requests on id change.
 */
export function useAnnouncement(
  rawId: string | undefined,
): AsyncState<Announcement> {
  const { getById } = useAnnouncements();
  const id = parseId(rawId);
  const cached = id !== null ? getById(id) : undefined;

  const [state, setState] = useState<AsyncState<Announcement>>(asyncLoading);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // (1) invalid id - never hit the network.
    if (id === null) {
      setState(asyncError("Invalid announcement id."));
      return;
    }

    // (2) cache — reuse the already-fetched announcement
    if (cached) {
      setState(asyncSuccess(cached));
      return;
    }

    // (3) fetch the single announcement.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState(asyncLoading());

    fetchAnnouncementById(id, controller.signal)
      .then((announcement) => {
        if (!controller.signal.aborted) {
          setState(asyncSuccess(announcement));
        }
      })
      .catch((error: Error) => {
        if (isAbortError(error)) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "Could not load this announcement.";
        setState(asyncError(message));
      });

    return () => controller.abort();
  }, [id, cached]);

  return state;
}
