// ─────────────────────────────────────────────────────────────────────────────
// Transient-vs-terminal error classification + a small retry/backoff helper.
//
// This is the "backpressure instead of collapse" primitive for document
// processing: a SATURATED dependency (an embedding-provider 429, a timeout, a
// 5xx, a network blip) should back off and retry, NOT mark the document failed.
// A genuinely BAD request (401/403 auth, 400 invalid input, 404 missing) is
// terminal and should fail fast. `isRetryableError` draws that line;
// `withRetry` applies a bounded exponential backoff around a single call so short
// blips never even reach the job queue.
// ─────────────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** HTTP statuses that mean "the dependency is saturated / flaky", not "bad request". */
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
/** HTTP statuses that mean "this request is wrong" — retrying will not help. */
const TERMINAL_STATUS = new Set([400, 401, 403, 404, 422]);

function readStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as { status?: unknown; statusCode?: unknown };
  if (typeof e.status === "number") return e.status;
  if (typeof e.statusCode === "number") return e.statusCode;
  return null;
}

/**
 * Decide whether an error is worth retrying. Errors carrying an HTTP status
 * (e.g. the OpenAI SDK's APIError) are classified by status; anything without a
 * status is assumed to be a network/transport blip (ECONNRESET, fetch failed, …)
 * and is retryable.
 */
export function isRetryableError(err: unknown): boolean {
  const status = readStatus(err);
  if (status != null) {
    if (RETRYABLE_STATUS.has(status)) return true;
    if (TERMINAL_STATUS.has(status)) return false;
    // Unknown 4xx → treat as terminal; unknown 5xx → retryable.
    return status >= 500;
  }
  return true;
}

/**
 * Exponential backoff with full jitter. `attempt` is 1-based, so the delays grow
 * baseMs, 2·baseMs, 4·baseMs, … capped at capMs. Jitter keeps concurrent jobs
 * from synchronizing their retries into a thundering herd.
 */
export function backoffMs(
  attempt: number,
  baseMs = 10_000,
  capMs = 5 * 60_000,
): number {
  const exp = Math.min(capMs, baseMs * 2 ** Math.max(0, attempt - 1));
  return Math.floor(exp / 2 + Math.random() * (exp / 2));
}

/**
 * Run `fn`, retrying on retryable errors with exponential backoff. Terminal
 * errors — and the final attempt — rethrow. Used inside a single embedding batch
 * so a brief rate-limit never bubbles up to the job queue; the queue's own
 * per-job retry accounting is the second, longer-horizon line of defense.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: {
    attempts?: number;
    baseMs?: number;
    onRetry?: (err: unknown, attempt: number) => void;
  } = {},
): Promise<T> {
  const attempts = opts.attempts ?? 4;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt >= attempts || !isRetryableError(err)) throw err;
      opts.onRetry?.(err, attempt);
      await sleep(backoffMs(attempt, opts.baseMs ?? 2_000, 60_000));
    }
  }
  throw lastErr;
}
