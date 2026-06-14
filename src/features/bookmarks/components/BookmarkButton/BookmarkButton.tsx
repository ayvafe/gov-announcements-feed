import { cx } from "@shared/utils/cx";
import { useBookmarks } from "@features/bookmarks/hooks/useBookmarks";
import styles from "./BookmarkButton.module.css";
import { useCallback } from "react";

interface BookmarkButtonProps {
  announcementId: number;
  size?: "sm" | "md";
}

/**
 * Self-contained bookmark toggle. It reads and mutates the bookmarks store
 * directly, so it works identically
 */
export function BookmarkButton({
  announcementId,
  size = "sm",
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const active = isBookmarked(announcementId);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      toggleBookmark(announcementId);
    },
    [toggleBookmark, announcementId],
  );

  return (
    <button
      type="button"
      className={cx(styles.button, styles[size], active && styles.active)}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Add bookmark"}
      title={active ? "Remove bookmark" : "Add bookmark"}
      onClick={handleClick}
    >
      <span className={styles.icon} aria-hidden="true">
        {active ? "★" : "☆"}
      </span>
    </button>
  );
}
