import type {
  Announcement,
  CategoryFilter,
} from "@features/announcements/types";

// Case-insensitive title search AND category filter
export function filterAnnouncements(
  announcements: readonly Announcement[],
  query: string,
  category: CategoryFilter,
): Announcement[] {
  const normalizedQuery = query.trim().toLowerCase();

  return announcements.filter((announcement) => {
    // "All" skips category check
    const matchesCategory =
      category === "All" || announcement.category === category;

    if (!matchesCategory) {
      return false;
    }

    if (normalizedQuery === "") {
      return true;
    }
    return announcement.title.toLowerCase().includes(normalizedQuery);
  });
}
