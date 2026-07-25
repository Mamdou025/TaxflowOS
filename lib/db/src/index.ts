import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";

// Re-export commonly-used drizzle-orm operators so dependents share
// the same drizzle-orm instance (avoids "shouldInlineParams" type conflicts
// when pnpm peer-dep resolution creates multiple drizzle-orm instances).
export { eq, and, or, desc, asc, isNull, sql } from "drizzle-orm";
