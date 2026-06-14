import { createContext } from "react";
import type { AsyncState } from "@shared/types/async";
import type { Announcement } from "@features/announcements/types";

export interface AnnouncementsContextValue {
  /** Async state for the full list fetch (idle/loading/success/error). */
  state: AsyncState<Announcement[]>;
  /** Re-run the list fetch */
  refetch: () => void;
  /**
   * Look up a single announcement already in the cached list.
   * Returns `undefined` when the list isn't loaded yet or the id isn't present
   */
  getById: (id: number) => Announcement | undefined;
}

export const AnnouncementsContext =
  createContext<AnnouncementsContextValue | null>(null);
