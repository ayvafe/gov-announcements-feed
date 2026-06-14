import type { CSSProperties } from "react";
import { cx } from "@shared/utils/cx";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  radius = "var(--radius-sm)",
  className,
}: SkeletonProps) {
  const style: CSSProperties = { width, height, borderRadius: radius };
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={style}
      aria-hidden="true"
    />
  );
}
