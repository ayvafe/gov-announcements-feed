/** text helpers */

/**
 * Capitalize the first letter of each word, lowercasing the rest.
 * (e.g. "sunt aut  facere" → "Sunt Aut  Facere").
 */
export function capitalizeWords(input: string): string {
  return input
    .split(/(\s+)/)
    .map((token) =>
      /\s/.test(token)
        ? token
        : token.charAt(0).toUpperCase() + token.slice(1).toLowerCase(),
    )
    .join("");
}
