/** A valid announcement id is a positive integer. */
export function parseId(raw: string | undefined): number | null {
  if (raw === undefined) {
    return null;
  }
  const trimmed = raw.trim();
  // Reject empty, non-numeric, decimals, and non-positive ids.
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }
  const id = Number(trimmed);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
