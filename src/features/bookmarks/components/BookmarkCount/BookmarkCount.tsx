import { useBookmarks } from "@features/bookmarks/hooks/useBookmarks";
import styles from "./BookmarkCount.module.css";

export function BookmarkCount() {
  const { count } = useBookmarks();

  return (
    <span className={styles.count} aria-label={`${count} bookmarked`}>
      {count}
    </span>
  );
}
