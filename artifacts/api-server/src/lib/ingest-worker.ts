// ─────────────────────────────────────────────────────────────────────────────
// Ingest worker — the durable background processor that drains the ingest_jobs
// queue. Runs IN-PROCESS inside the api-server by default (started from index.ts);
// set INGEST_WORKER=0 to disable it here and run it as its own dyno/service later
// (this file is the whole entry point — import startIngestWorker from a standalone
// process and it behaves identically).
//
// Each tick: (1) occasionally reap jobs abandoned by a crashed worker, then
// (2) claim up to INGEST_CONCURRENCY jobs and process them. Claims are atomic
// (FOR UPDATE SKIP LOCKED), so overlapping ticks and multiple workers never double
// -process a job. Concurrency is intentionally low so a bulk upload can't starve
// the HTTP event loop of the shared process.
//
//   INGEST_WORKER=0        disable the in-process worker
//   INGEST_CONCURRENCY=2   max jobs processed at once
//   INGEST_POLL_MS=2000    how often to poll for work
//   INGEST_STALL_MS=600000 how long an `active` job may run before it's reaped
// ─────────────────────────────────────────────────────────────────────────────

import { logger } from "./logger";
import { updateDocument } from "./rag/documents-repo";
import { ingestDocument } from "./rag/ingest";
import {
  claimNextJob,
  failJob,
  markJobDone,
  reapStalledJobs,
  requeueJob,
  type ClaimedJob,
} from "./rag/ingest-queue";

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const CONCURRENCY = numEnv("INGEST_CONCURRENCY", 2);
const POLL_MS = numEnv("INGEST_POLL_MS", 2_000);
const STALL_MS = numEnv("INGEST_STALL_MS", 10 * 60_000);
const REAP_EVERY_MS = 60_000;

let started = false;
let inFlight = 0;
let lastReap = 0;

/** Start the in-process worker. Idempotent; a no-op when INGEST_WORKER=0. */
export function startIngestWorker(): void {
  if (started) return;
  if (process.env.INGEST_WORKER === "0") {
    logger.info("Ingest worker disabled (INGEST_WORKER=0)");
    return;
  }
  started = true;
  logger.info({ concurrency: CONCURRENCY, pollMs: POLL_MS }, "Ingest worker started");
  const timer = setInterval(() => void tick(), POLL_MS);
  // Don't let the poll timer keep the process alive on its own.
  timer.unref?.();
}

async function tick(): Promise<void> {
  try {
    const now = Date.now();
    if (now - lastReap >= REAP_EVERY_MS) {
      lastReap = now;
      const reaped = await reapStalledJobs(STALL_MS);
      if (reaped) logger.warn({ reaped }, "Recovered stalled ingest jobs");
    }

    // Fill the available concurrency slots. claimNextJob is atomic, so a claim
    // that returns null means the queue is drained — stop until the next tick.
    while (inFlight < CONCURRENCY) {
      const job = await claimNextJob();
      if (!job) break;
      inFlight++;
      void runJob(job).finally(() => {
        inFlight--;
      });
    }
  } catch (err) {
    logger.error({ err }, "Ingest worker tick failed");
  }
}

async function runJob(job: ClaimedJob): Promise<void> {
  const { id, documentId, userId, attempts, maxAttempts } = job;
  try {
    const result = await ingestDocument(userId, documentId);

    if (result.ok) {
      await markJobDone(id);
      logger.info({ documentId, chunks: result.chunks }, "Document ingested");
      return;
    }

    if (result.retryable && attempts < maxAttempts) {
      await requeueJob(id, attempts, result.error);
      logger.warn(
        { documentId, attempt: attempts, maxAttempts, error: result.error },
        "Ingest retry scheduled (transient failure)",
      );
      return;
    }

    // Terminal failure, or a transient one that exhausted its retries.
    await failJob(id, result.error);
    if (result.retryable) {
      // ingestDocument left the document `processing`; surface the give-up.
      await updateDocument(userId, documentId, {
        status: "failed",
        error: `Processing failed after ${attempts} attempts: ${result.error}`,
      });
    }
    logger.error({ documentId, error: result.error }, "Ingest failed");
  } catch (err) {
    // ingestDocument is meant to be total; a throw here is unexpected. Treat it
    // like a transient failure so a genuine bug doesn't permanently lose the doc.
    const error = err instanceof Error ? err.message : "Unknown error";
    if (attempts < maxAttempts) {
      await requeueJob(id, attempts, error);
      logger.error({ err, documentId }, "Ingest job threw; will retry");
    } else {
      await failJob(id, error);
      await updateDocument(userId, documentId, {
        status: "failed",
        error: `Processing failed after ${attempts} attempts: ${error}`,
      });
      logger.error({ err, documentId }, "Ingest job threw; retries exhausted");
    }
  }
}
