// @ts-nocheck — server-only file; not compiled in the Vite frontend build.
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  accounts,
  apiKeys,
  assistantMemories,
  chatMessages,
  chatMessagesRelations,
  chatThreads,
  chatThreadsRelations,
  documentChunks,
  documentChunksRelations,
  documents,
  documentsRelations,
  integrations,
  sessions,
  users,
  verifications,
  workflowExecutionLogs,
  workflowExecutions,
  workflowExecutionsRelations,
  workflows,
} from "./schema";

// Construct schema object for drizzle. Every table must be listed here so the
// relational query builder (db.query.*) knows about it; repositories may also
// import tables directly for plain select/insert.
const schema = {
  users,
  sessions,
  accounts,
  verifications,
  workflows,
  workflowExecutions,
  workflowExecutionLogs,
  workflowExecutionsRelations,
  apiKeys,
  integrations,
  assistantMemories,
  chatThreads,
  chatMessages,
  chatThreadsRelations,
  chatMessagesRelations,
  documents,
  documentChunks,
  documentsRelations,
  documentChunksRelations,
};

// App queries go through DATABASE_URL. On Supabase + Vercel this MUST be the
// Supavisor *transaction* pooler URL (port 6543) — see the note below on prepare.
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/workflow";

// Migrations (drizzle-kit + migrationClient) need a *direct* connection that
// supports DDL and prepared statements — the transaction pooler does not.
// DIRECT_URL (Supabase port 5432) is preferred; fall back to DATABASE_URL for
// local/single-connection setups.
const migrationConnectionString =
  process.env.DIRECT_URL || connectionString;

// For migrations
export const migrationClient = postgres(migrationConnectionString, { max: 1 });

// Use global singleton to prevent connection exhaustion during HMR
const globalForDb = globalThis as unknown as {
  queryClient: ReturnType<typeof postgres> | undefined;
  db: PostgresJsDatabase<typeof schema> | undefined;
};

// For queries - reuse connection in development.
// `prepare: false` is REQUIRED when DATABASE_URL points at Supabase's transaction
// pooler (pgBouncer transaction mode): it does not support prepared statements, so
// leaving prepare on throws "prepared statement already exists" under load. It is a
// harmless no-op cost on direct/local connections.
const queryClient =
  globalForDb.queryClient ??
  postgres(connectionString, { max: 10, prepare: false });
export const db = globalForDb.db ?? drizzle(queryClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.queryClient = queryClient;
  globalForDb.db = db;
}
