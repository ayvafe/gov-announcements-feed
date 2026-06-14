import { Link } from "react-router-dom";
import { usePageMeta } from "@shared/seo/usePageMeta";
import { Button } from "@components/Button/Button";
import { EmptyState } from "@components/EmptyState/EmptyState";
import { ErrorState } from "@components/ErrorState/ErrorState";
import { AnnouncementCard } from "@features/announcements/components/AnnouncementCard/AnnouncementCard";
import { AnnouncementCardSkeleton } from "@features/announcements/components/AnnouncementCard/AnnouncementCardSkeleton";
import { useBookmarkedAnnouncements } from "@features/bookmarks/hooks/useBookmarkedAnnouncements";
import { useBookmarks } from "@features/bookmarks/hooks/useBookmarks";
import styles from "./BookmarksPage.module.css";

// Bookmarks page — ids from local store, content from cache or fetched on demand
export function BookmarksPage() {
  usePageMeta({
    title: "Bookmarks",
    description: "Your saved government announcements.",
    path: "/bookmarks",
    noIndex: true,
  });

  const { count, clearBookmarks } = useBookmarks();
  const { status, items, error, refetch } = useBookmarkedAnnouncements();

  return (
    <section>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Bookmarks</h1>
          <p className={styles.subheading}>
            {count > 0
              ? `You have ${count} saved announcement${count === 1 ? "" : "s"}.`
              : "Announcements you bookmark will appear here."}
          </p>
        </div>
        {count > 0 && (
          <Button variant="secondary" size="sm" onClick={clearBookmarks}>
            Clear all
          </Button>
        )}
      </header>

      {/* No bookmarks */}
      {count === 0 ? (
        <EmptyState
          icon="🔖"
          title="No bookmarks yet"
          message="Tap the star on any announcement to save it for later."
          action={
            <Link to="/announcements">
              <Button variant="primary">Browse announcements</Button>
            </Link>
          }
        />
      ) : status === "error" ? (
        // Error state
        <ErrorState
          title="Couldn’t load your bookmarks"
          message={error ?? "Please try again."}
          onRetry={refetch}
        />
      ) : status === "loading" && items.length === 0 ? (
        // Loading state with Skeleton
        <div className={styles.grid} aria-busy="true">
          {Array.from({ length: count }, (_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        // Bookmarks list
        <ul className={styles.grid}>
          {items.map((announcement) => (
            <li key={announcement.id}>
              <AnnouncementCard announcement={announcement} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
