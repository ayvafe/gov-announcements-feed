import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { isAbortError } from "@shared/api/client";
import {
  asyncError,
  asyncLoading,
  asyncSuccess,
  type AsyncState,
} from "@shared/types/async";
import { fetchAnnouncements } from "@features/announcements/api/announcementsApi";
import {
  AnnouncementsContext,
  type AnnouncementsContextValue,
} from "./AnnouncementsContext";
import type { Announcement } from "@features/announcements/types";

/**
 * Fetches the announcement list once and shares it via context.
 * Detail pages reuse the cache to avoid a second network request.
 */
export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AsyncState<Announcement[]>>(asyncLoading);

  // Cancel the previous request on refetch or unmount
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState(asyncLoading());

    fetchAnnouncements(controller.signal)
      .then((announcements) => {
        if (!controller.signal.aborted) {
          setState(asyncSuccess(announcements));
        }
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) {
          return; // Stale request — ignore
        }
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading announcements.";
        setState(asyncError(message));
      });
  }, []);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  // recomputed only when the list changes
  const byId = useMemo(() => {
    const map = new Map<number, Announcement>();
    if (state.status === "success") {
      for (const announcement of state.data)
        map.set(announcement.id, announcement);
    }
    return map;
  }, [state]);

  const getById = useCallback((id: number) => byId.get(id), [byId]);

  const value = useMemo<AnnouncementsContextValue>(
    () => ({ state, refetch: load, getById }),
    [state, load, getById],
  );

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
}
