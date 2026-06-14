/** HTTP client built on the browser `fetch` API */

/** Base URL comes from `VITE_API_BASE_URL` */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  /** Query params appended to the URL. Nullish values are omitted entirely */
  params?: Record<string, QueryValue>;
  /** Extra headers, merged over the defaults */
  headers?: Record<string, string>;
  /** AbortSignal for cancellation (used to drop stale in-flight requests) */
  signal?: AbortSignal;
}

/** A normalized error with an optional HTTP status for callers to branch on. */
export class ApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** True when an error is an `AbortController`-triggered cancellation. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** Build a `path?a=1&b=2` string, omitting nullish params and encoding the rest. */
function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = `${BASE_URL}${path}`;
  if (!params) {
    return url;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    search.append(key, String(value));
  }

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

export async function apiGet<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, signal } = options;
  let response: Response;

  try {
    response = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: { Accept: "application/json", ...headers },
      signal,
    });
  } catch (error) {
    // Re-throw aborts untouched so callers can ignore them; everything else
    // becomes a friendly network error.
    if (isAbortError(error)) {
      throw error;
    }
    throw new ApiError(
      "Network request failed. Please check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status === 404
        ? "The requested item could not be found."
        : `Request failed (status ${response.status}).`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("The server returned an invalid response.");
  }
}
