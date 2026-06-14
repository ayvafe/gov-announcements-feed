import { useEffect, useState } from "react";

/**
 * Return a debounced copy of `value` that only updates after `delayMs` of
 * quiet. Used to keep real-time search responsive without thrashing URL writes
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    // Clear on change/unmount so only the latest value ever "lands".
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
