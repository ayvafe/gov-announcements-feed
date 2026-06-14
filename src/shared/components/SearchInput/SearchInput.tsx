import { useId } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  hideLabel?: boolean;
}

/**
 * Controlled search field with a magnifier icon and a clear (✕)
 * button that appears once there's text
 */
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  hideLabel = true,
}: SearchInputProps) {
  const id = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input
          id={id}
          type="search"
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />
        {value !== "" && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
