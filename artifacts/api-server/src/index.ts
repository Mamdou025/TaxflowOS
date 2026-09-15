import app from "./app";
import { logger } from "./lib/logger";
import { startIngestWorker } from "./lib/ingest-worker";
import { startWorkflowRunWorker } from './lib/workflow-run-worker';
import { pool } from "@workspace/db";

// Schema changes are applied by the migration command, never at request time.
await pool.query("SELECT id FROM workspaces LIMIT 0");

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);
// Only the owned test child uses an OS-assigned local port and IPC readiness.
const testRun = process.connected && process.env.TAXFLOW_TEST_RUN_ID;
const isolatedTest = typeof testRun === "string" && /^[a-f0-9]{8}-[a-f0-9-]{36}$/.test(testRun);

if (!Number.isInteger(port) || port < 0 || (port === 0 && !isolatedTest) || port > 65535) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(isolatedTest ? { port, host: "127.0.0.1" } : { port }, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  if (isolatedTest) {
    const address = server.address();
    if (address && typeof address !== "string") {
      process.send?.({ type: "taxflow-test-ready", runId: testRun, port: address.port });
    }
  }

  // Drain the durable ingest_jobs queue in the background (RAG document
  // processing). Disable with INGEST_WORKER=0 to run it as a separate process.
  startIngestWorker();
  startWorkflowRunWorker();
});
