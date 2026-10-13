import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Fail fast instead of hanging a request indefinitely on a stuck connection
  // or query (e.g. a dev-stack DB hiccup) — callers get a clear error instead
  // of silently burning their own request timeout waiting on the pool.
  connectionTimeoutMillis: 10_000,
  statement_timeout: 10_000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";

// Re-export commonly-used drizzle-orm operators so dependents share
// the same drizzle-orm instance (avoids "shouldInlineParams" type conflicts
// when pnpm peer-dep resolution creates multiple drizzle-orm instances).
export { eq, and, or, desc, asc, isNull, inArray, sql } from "drizzle-orm";
