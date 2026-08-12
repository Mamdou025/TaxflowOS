import app from "./app";
import { logger } from "./lib/logger";
import { startIngestWorker } from "./lib/ingest-worker";
import { db, users, eq } from "@workspace/db";

// Ensure the anonymous user row exists — it is the FK anchor for all data
// written before real auth is wired up. Safe to run on every startup (no-op
// if the row already exists).
const ANONYMOUS_USER_ID = "anonymous";
try {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, ANONYMOUS_USER_ID))
    .limit(1);
  if (!existing.length) {
    await db.insert(users).values({
      id: ANONYMOUS_USER_ID,
      name: "Guest",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAnonymous: true,
    });
    logger.info("Seeded anonymous user row");
  }
} catch (err) {
  // Non-fatal — DB may not have the users table yet (first deploy before migration).
  logger.warn({ err }, "Could not seed anonymous user; ensure migrations have run");
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Drain the durable ingest_jobs queue in the background (RAG document
  // processing). Disable with INGEST_WORKER=0 to run it as a separate process.
  startIngestWorker();
});
