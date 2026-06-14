import styles from "./Spinner.module.css";

interface SpinnerProps {
  label?: string;
  size?: number;
}

export function Spinner({ label = "Loading…", size = 28 }: SpinnerProps) {
  return (
    <span className={styles.wrapper} role="status" aria-live="polite">
      <span
        className={styles.spinner}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
