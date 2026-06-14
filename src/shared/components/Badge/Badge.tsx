import type { ReactNode } from "react";
import { cx } from "@shared/utils/cx";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Small leading dot */
  withDot?: boolean;
}

export function Badge({ children, className, withDot = false }: BadgeProps) {
  return (
    <span className={cx(styles.badge, className)}>
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
