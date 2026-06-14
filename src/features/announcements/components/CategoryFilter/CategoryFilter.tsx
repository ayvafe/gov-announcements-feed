import { cx } from "@shared/utils/cx";
import { CATEGORY_FILTERS } from "@features/announcements/constants";
import type { CategoryFilter as CategoryFilterValue } from "@features/announcements/types";
import styles from "./CategoryFilter.module.css";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label="Filter by category"
    >
      {CATEGORY_FILTERS.map((category) => {
        const active = category === value;
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={active}
            className={cx(styles.chip, active && styles.active)}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
