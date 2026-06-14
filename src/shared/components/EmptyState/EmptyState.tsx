import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: ReactNode;
  action?: ReactNode;
}

/**
 * Reusable empty-state panel for "no results", "no bookmarks yet", etc.
 */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className={styles.empty} role="status">
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
