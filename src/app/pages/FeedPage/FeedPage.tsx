import { useCallback, useMemo } from "react";
import { usePageMeta } from "@shared/seo/usePageMeta";
import { Button } from "@components/Button/Button";
import { EmptyState } from "@components/EmptyState/EmptyState";
import { ErrorState } from "@components/ErrorState/ErrorState";
import { SearchInput } from "@components/SearchInput/SearchInput";
import { AnnouncementCard } from "@features/announcements/components/AnnouncementCard/AnnouncementCard";
import { AnnouncementCardSkeleton } from "@features/announcements/components/AnnouncementCard/AnnouncementCardSkeleton";
import { CategoryFilter } from "@features/announcements/components/CategoryFilter/CategoryFilter";
import { useAnnouncementFilters } from "@features/announcements/hooks/useAnnouncementFilters";
import { useAnnouncements } from "@features/announcements/hooks/useAnnouncements";
import { filterAnnouncements } from "@features/announcements/utils/filterAnnouncements";
import styles from "./FeedPage.module.css";

const SKELETON_COUNT = 6;

export function FeedPage() {
  usePageMeta({
    title: "Announcements",
    description:
      "Browse the latest public government announcements. Search by title and filter by category.",
    path: "/announcements",
  });

  const { state, refetch } = useAnnouncements();
  const {
    searchInput,
    setSearchInput,
    query,
    category,
    setCategory,
    isFiltering,
  } = useAnnouncementFilters();

  // Recompute only when the data or active filters change — not on every render.
  const results = useMemo(() => {
    if (state.status !== "success") {
      return [];
    }
    return filterAnnouncements(state.data, query, category);
  }, [state, query, category]);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setCategory("All");
  }, []);

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Announcements</h1>
        <p className={styles.subheading}>
          Browse public announcements. Search, filter by category, and bookmark
          the ones that matter to you.
        </p>
      </header>

      <div className={styles.controls}>
        <SearchInput
          label="Search announcements by title"
          placeholder="Search by title…"
          value={searchInput}
          onChange={setSearchInput}
        />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {/* --- Error state: fetch failed --- */}
      {state.status === "error" && (
        <ErrorState
          title="Couldn’t load announcements"
          message={state.error}
          onRetry={refetch}
        />
      )}

      {/* --- Loading state --- */}
      {(state.status === "loading" || state.status === "idle") && (
        <div className={styles.grid} aria-busy="true">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* --- Success state --- */}
      {state.status === "success" &&
        (results.length > 0 ? (
          <>
            <p className={styles.resultCount} aria-live="polite">
              {results.length} result{results.length === 1 ? "" : "s"}
              {isFiltering ? " (filtered)" : ""}
            </p>
            <ul className={styles.grid}>
              {results.map((announcement) => (
                <li key={announcement.id}>
                  <AnnouncementCard announcement={announcement} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          /* --- SuccEmptyess state --- */
          <EmptyState
            icon="🔍"
            title={
              isFiltering ? "No matching announcements" : "No announcements yet"
            }
            message={
              isFiltering
                ? "Try a different search term or category."
                : "There are no announcements to show right now."
            }
            action={
              isFiltering ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ))}
    </section>
  );
}
