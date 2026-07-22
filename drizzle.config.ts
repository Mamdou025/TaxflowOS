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
    url: process.env.DATABASE_URL || "postgres://localhost:5432/workflow",
  },
} satisfies Config;
