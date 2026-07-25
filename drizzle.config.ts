import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load .env.local FIRST (where this project keeps DATABASE_URL and secrets), then
// fall back to .env. First file wins for duplicate keys. Without this, drizzle-kit
// only reads .env and never sees a DATABASE_URL set in .env.local.
config({ path: [".env.local", ".env"] });

export default {
  schema: "./platform/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations run DDL + prepared statements, which the Supabase transaction
    // pooler (DATABASE_URL, port 6543) does not support. Use DIRECT_URL (port
    // 5432) when set; fall back to DATABASE_URL for local/single-connection dev.
    url:
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      "postgres://localhost:5432/workflow",
  },
} satisfies Config;
