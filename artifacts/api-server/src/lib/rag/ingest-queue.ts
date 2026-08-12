// ─────────────────────────────────────────────────────────────────────────────
// Ingest queue — the durable-job data layer over the `ingest_jobs` table. The web
// route enqueues; the worker (src/lib/ingest-worker.ts) claims and drives jobs.
//
//   enqueueIngest   — queue a document for processing (replaces old fire-and-forget)
//   claimNextJob    — atomically take the next runnable job (FOR UPDATE SKIP LOCKED)
//   markJobDone     — a job finished successfully
//   requeueJob      — a transient failure → reschedule with exponential backoff
//   failJob         — a terminal failure / retries exhausted → give up
//   reapStalledJobs — recover jobs abandoned by a crashed/redeployed worker
//
// All state lives in Postgres, so the queue survives restarts and coordinates
// safely across concurrent workers via row-level locks.
// ─────────────────────────────────────────────────────────────────────────────

import { and, db, documents, eq, inArray, ingestJobs, sql } from "@workspace/db";
import { backoffMs } from "../retry";

export type ClaimedJob = {
  id: string;
  documentId: string;
  userId: string;
  attempts: number;
  maxAttempts: number;
};

/**
 * Queue a document for (re)processing. Any prior not-yet-running job for the same
 * document is cleared first so re-uploads don't pile up duplicates; an already
 * `active` job is left alone (re-ingest is idempotent if it does run twice).
 */
export async function enqueueIngest(userId: string, documentId: string): Promise<void> {
  await db
    .delete(ingestJobs)
    .where(
      and(
        eq(ingestJobs.documentId, documentId),
        inArray(ingestJobs.status, ["queued", "failed"]),
      ),
    );
  await db.insert(ingestJobs).values({
    userId,
    documentId,
    status: "queued",
    runAfter: new Date(),
  });
}

/**
 * Atomically claim the next runnable job. `FOR UPDATE SKIP LOCKED` lets multiple
 * workers (or concurrent slots) pull distinct jobs without blocking each other.
 * Increments `attempts` and stamps `claimedAt` so the reaper can detect stalls.
 */
export async function claimNextJob(): Promise<ClaimedJob | null> {
  const res = await db.execute(sql`
    UPDATE ingest_jobs SET
      status = 'active',
      claimed_at = now(),
      attempts = attempts + 1,
      updated_at = now()
    WHERE id = (
      SELECT id FROM ingest_jobs
      WHERE status = 'queued' AND run_after <= now()
      ORDER BY run_after ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING
      id,
      document_id AS "documentId",
      user_id AS "userId",
      attempts,
      max_attempts AS "maxAttempts";
  `);
  const row = (res as unknown as { rows?: ClaimedJob[] }).rows?.[0];
  return row ?? null;
}

export async function markJobDone(id: string): Promise<void> {
  await db
    .update(ingestJobs)
    .set({ status: "done", claimedAt: null, lastError: null, updatedAt: new Date() })
    .where(eq(ingestJobs.id, id));
}

/** Transient failure: back to `queued`, eligible again after an exponential delay. */
export async function requeueJob(
  id: string,
  attempt: number,
  error: string,
): Promise<void> {
  const runAfter = new Date(Date.now() + backoffMs(attempt));
  await db
    .update(ingestJobs)
    .set({
      status: "queued",
      claimedAt: null,
      runAfter,
      lastError: error.slice(0, 2000),
      updatedAt: new Date(),
    })
    .where(eq(ingestJobs.id, id));
}

/** Terminal failure / retries exhausted: stop trying. */
export async function failJob(id: string, error: string): Promise<void> {
  await db
    .update(ingestJobs)
    .set({
      status: "failed",
      claimedAt: null,
      lastError: error.slice(0, 2000),
      updatedAt: new Date(),
    })
    .where(eq(ingestJobs.id, id));
}

/**
 * Recover jobs abandoned mid-flight (worker crash/redeploy): an `active` job whose
 * `claimedAt` is older than `stallMs`. Those with attempts left go back to `queued`
 * for immediate retry; those out of attempts are failed and their document marked
 * failed so it never sits in `processing` forever. Returns how many were handled.
 */
export async function reapStalledJobs(stallMs: number): Promise<number> {
  const cutoff = new Date(Date.now() - stallMs);

  const requeued = await db.execute(sql`
    UPDATE ingest_jobs SET
      status = 'queued', claimed_at = null, run_after = now(), updated_at = now()
    WHERE status = 'active' AND claimed_at < ${cutoff} AND attempts < max_attempts
    RETURNING id;
  `);

  const dead = await db.execute(sql`
    UPDATE ingest_jobs SET
      status = 'failed', claimed_at = null,
      last_error = 'Processing stalled (worker crash/timeout), retries exhausted',
      updated_at = now()
    WHERE status = 'active' AND claimed_at < ${cutoff} AND attempts >= max_attempts
    RETURNING document_id AS "documentId";
  `);

  const deadRows = (dead as unknown as { rows?: { documentId: string }[] }).rows ?? [];
  for (const row of deadRows) {
    await db
      .update(documents)
      .set({
        status: "failed",
        error: "Processing stalled and could not be completed.",
        updatedAt: new Date(),
      })
      .where(eq(documents.id, row.documentId));
  }

  const requeuedCount = (requeued as unknown as { rows?: unknown[] }).rows?.length ?? 0;
  return requeuedCount + deadRows.length;
}
