/**
 * Tiny `clsx`-style classname combiner.
 *
 * Joins truthy class values into a single space-separated string
 *
 * @example
 *   cx(styles.button, styles[size], active && styles.active)
 *   cx(styles.chip, { [styles.active]: isActive })
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) {
      continue;
    }

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cx(...input);
      if (nested) {
        classes.push(nested);
      }
    } else {
      // Object form: include each key whose value is truthy.
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}