import { Skeleton } from "@components/Skeleton/Skeleton";
import styles from "./AnnouncementCard.module.css";

export function AnnouncementCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.link}>
        <Skeleton width="40%" height="1.1rem" radius="var(--radius-pill)" />
        <Skeleton width="90%" height="1.25rem" />
        <Skeleton width="100%" height="0.85rem" />
        <Skeleton width="75%" height="0.85rem" />
      </div>
    </article>
  );
}
