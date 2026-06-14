import { Outlet } from "react-router-dom";
import { AnnouncementsProvider } from "@features/announcements/context/AnnouncementsProvider";

// Shared parent for Feed/Detail/Bookmarks — stays mounted between them, so data is fetched once
export function AnnouncementsScope() {
  return (
    <AnnouncementsProvider>
      <Outlet />
    </AnnouncementsProvider>
  );
}
