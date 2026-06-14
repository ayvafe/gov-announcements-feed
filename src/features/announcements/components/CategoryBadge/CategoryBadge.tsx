import { Badge } from "@components/Badge/Badge";
import type { Category } from "@features/announcements/types";
import styles from "./CategoryBadge.module.css";

/** Maps each category to its themed CSS-module class */
const CATEGORY_CLASS: Record<Category, string | undefined> = {
  Health: styles.health,
  Transport: styles.transport,
  Education: styles.education,
  Infrastructure: styles.infrastructure,
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge withDot className={CATEGORY_CLASS[category]}>
      {category}
    </Badge>
  );
}
