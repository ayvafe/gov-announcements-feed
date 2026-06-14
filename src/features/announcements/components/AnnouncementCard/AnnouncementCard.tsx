import { memo } from "react";
import { Link } from "react-router-dom";
import { BookmarkButton } from "@features/bookmarks/components/BookmarkButton/BookmarkButton";
import { CategoryBadge } from "@features/announcements/components/CategoryBadge/CategoryBadge";
import { UrgentTag } from "@features/announcements/components/UrgentTag/UrgentTag";
import type { Announcement } from "@features/announcements/types";
import styles from "./AnnouncementCard.module.css";

interface AnnouncementCardProps {
  announcement: Announcement;
}

function AnnouncementCardComponent({ announcement }: AnnouncementCardProps) {
  const { id, title, body, category, isUrgent } = announcement;

  return (
    <article className={styles.card}>
      <div className={styles.bookmark}>
        <BookmarkButton announcementId={id} />
      </div>

      <Link to={`/announcements/${id}`} className={styles.link}>
        <div className={styles.tags}>
          <CategoryBadge category={category} />
          {isUrgent && <UrgentTag />}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{body}</p>
        <span className={styles.readMore}>Read more →</span>
      </Link>
    </article>
  );
}

/** Feed list item. Memoized — stable props skip re-renders on search keystrokes */
export const AnnouncementCard = memo(AnnouncementCardComponent);
