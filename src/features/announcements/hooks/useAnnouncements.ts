import { useContext } from "react";
import {
  AnnouncementsContext,
  type AnnouncementsContextValue,
} from "@features/announcements/context/AnnouncementsContext";

export function useAnnouncements(): AnnouncementsContextValue {
  const context = useContext(AnnouncementsContext);
  if (context === null) {
    throw new Error(
      "useAnnouncements must be used within an <AnnouncementsProvider>.",
    );
  }
  return context;
}
