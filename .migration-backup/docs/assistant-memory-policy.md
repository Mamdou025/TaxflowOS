# Assistant Memory Policy — durable facts & preferences

*Added 2026-07-18. Owner: `lib/assistant-runtime/memory/` + `app/api/assistant/memory/route.ts` + `components/assistant/memory-copilot.tsx`. Status: `[LIVE]` code; **requires a DB migration to activate** (see below).*

## What "memory" means here

The assistant can durably remember **facts and preferences the user explicitly asks it to save** — e.g. "remember Acme's 2025 FX is 1.3978", "always report in CAD", "my default client is Northstar". These survive refresh, reload, and returning the next day, because they live in **Postgres**, not the browser.

This is **not** full conversation-transcript archival (that's a separate, larger CopilotKit-thread project). It is the working-memory layer: the assistant stops forgetting the durable facts you've told it.

## Data model

Table **`assistant_memories`** (migration `drizzle/0005_strange_deathstrike.sql`):

| column | meaning |
|---|---|
| `user_id` | **tenant boundary** — enforced server-side; a user only ever reads/writes their own rows |
| `client_id` | scope filter — null = a global preference; else tied to one client |
| `fiscal_year`, `workflow_id` | further optional scope filters |
| `kind` | `preference` \| `fact` \| `scope` |
| `subject`, `content` | short label + the remembered sentence |
| `source` | `user` \| `assistant` |
| `created_at`, `updated_at` | timestamps |

## No cross-client bleed

The retrieval policy (`memory/retrieval.ts`, pure + unit-tested) enforces:
- A **global** memory (`client_id = null`) is always eligible.
- A **client-specific** memory surfaces **only** when it matches the active client.
- When the active client is **unknown**, only global memories surface — a client-specific fact is *never* shown for a different client.
- A year-tagged memory is dropped only when the active year is known and differs.
Ranking: client-specific first, then keyword overlap with the message, then recency (cap 20).

## Flow

- **Read:** `components/assistant/memory-copilot.tsx` (headless, mounted once in `app-shell`) reads the active client (`selectedClientAtom`), `GET /api/assistant/memory?clientId=…`, and publishes the result as a `useCopilotReadable` grounding block. The `INSTRUCTIONS()` MEMORY section tells the model to use these and never invent.
- **Write:** the model calls **`rememberFact`** (only when the user explicitly asks) → `POST /api/assistant/memory` scoped to the current client (or `global` for an all-clients preference). **`forgetFact`** → `DELETE ?id=`.
- **Auth + fail-soft:** every route authenticates via better-auth (`auth.api.getSession`); with no session or no DB it returns empty / a structured error and the chat keeps working. Explicit, opt-in only — nothing is auto-remembered (memory policy).

## Activation — you need a Postgres database + `DATABASE_URL`

Memory (and sign-in, and saved workflows) needs a Postgres database. As of 2026-07-18 the repo had **no `DATABASE_URL` and no database** — `pnpm db:migrate` failed with `password authentication failed for user "Mamad"` because `drizzle-kit` fell back to a `localhost` default.

Two fixes were needed:
1. **Config (done):** `drizzle.config.ts` now loads `.env.local` (was `.env` only), so it picks up a `DATABASE_URL` set there.
2. **You provide a database:** add its connection string to `.env.local`:
   ```
   DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
   ```
   Fastest path is a free hosted Postgres (e.g. **Neon** — neon.tech, instant, no install; or Supabase / Vercel Postgres). Or a local Postgres if you have one. Then:
   ```
   pnpm db:migrate     # creates all tables incl. assistant_memories
   ```

Until a `DATABASE_URL` + database exist, saving returns "the database is not available" (fail-soft) and reads are empty — the rest of the chat is unaffected. Sign-in is required to persist (anonymous better-auth sessions count, so memory works for anonymous users too, scoped to that anonymous id).

## Verification

- `pnpm assistant:evals` includes memory-retrieval checks (scoping, no cross-client bleed, year filter, global-only when client unknown) — all pass, offline.
- `pnpm db:generate` produced the migration; `tsc` clean for the slice.
- **Not verified here:** the live DB round-trip (save → reload → recall) — needs a running Postgres (`pnpm db:migrate`). Drive it once after migrating.

## Rollback

Remove `<MemoryCopilot/>` from `app-shell.tsx` (chat reverts to no memory), or leave the DB un-migrated (fail-soft = inert). The table is additive and unused by anything else.
