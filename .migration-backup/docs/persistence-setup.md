# Persistence setup — Supabase (DB + Storage + pgvector)

This app persists **chats** and **company documents** to Supabase: Postgres for
structured data, pgvector for RAG embeddings, and Supabase Storage for the raw
document bytes. One platform covers all three.

Until `DATABASE_URL` is set, every DB call **fails soft** (returns empty/null) and
the app runs on localStorage only — so nothing here breaks the app before it's wired.

---

## 1. Environment variables (`.env.local` + Vercel project settings)

```bash
# ── Database (Supabase Postgres) ───────────────────────────────────────────────
# App queries: the Supavisor TRANSACTION pooler (port 6543). Required for Vercel
# serverless. The app sets postgres-js `prepare:false` for this connection.
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"

# Migrations only: the DIRECT connection (port 5432). Supports DDL + prepared
# statements, which the transaction pooler does not. Used by drizzle-kit + the
# prod migrate step. Falls back to DATABASE_URL if unset.
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

# ── Supabase Storage (large document bytes) — needed from Phase 2 ──────────────
SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"   # SERVER-ONLY. Never expose to the client.

# ── Embeddings (RAG) — needed from Phase 3. Already present in this project. ────
# Uses OPENAI_API_KEY (direct) or AI_GATEWAY_API_KEY (gateway) — no new key needed.
```

> Find these in the Supabase dashboard → **Project Settings → Database** (connection
> strings; choose "Transaction" for the pooler and "Session"/"Direct" for `DIRECT_URL`)
> and **Project Settings → API** (URL + service_role key).

## 2. One-time Supabase setup

1. **Run migrations** (creates every table — auth, workflows, chats, documents):
   ```bash
   pnpm db:migrate      # uses DIRECT_URL
   pnpm db:studio       # optional: browse the tables
   ```
   In production the build step runs this automatically (`scripts/migrate-prod.ts`
   → `pnpm db:migrate` when `VERCEL_ENV=production`).

2. **Enable pgvector** (Phase 3) — Dashboard → **Database → Extensions** → enable
   `vector`. (The Phase 3 migration also runs `CREATE EXTENSION IF NOT EXISTS vector;`
   as a safety net, but the direct connection role must be allowed to create it.)

3. **Create the Storage bucket** (Phase 2) — Dashboard → **Storage → New bucket** →
   name `company-documents`, **Private** (not public). Access is brokered by the
   server via signed URLs; the service-role key bypasses RLS.

## 3. Connection-pooling gotcha (read this)

Supabase-on-Vercel's classic failure is `prepared statement "s0" already exists`.
Cause: the transaction pooler (pgBouncer transaction mode) doesn't support prepared
statements. Fixes already applied in this repo:
- App queries use `DATABASE_URL` (pooler) with **`prepare: false`** (`platform/db/index.ts`).
- Migrations use `DIRECT_URL` (`drizzle.config.ts`, `migrationClient`).

## 4. Tenancy / security model

Access goes through the connection/service role, so Supabase **RLS is not the enforcement
layer** — every repository query is scoped by `session.user.id` server-side (the same
pattern as `app/api/workflows/route.ts`). RLS is optional later hardening. Never ship the
`SUPABASE_SERVICE_ROLE_KEY` to the browser; it's read only in `server-only` modules.
