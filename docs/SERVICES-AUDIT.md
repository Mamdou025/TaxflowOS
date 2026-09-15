# External Services & API Audit — TaxflowOS

_Generated 2026-07-31. A living inventory of every external app, API, and service the codebase touches, so you can track accounts, keys, and billing in one place._

> **How this was built:** swept `.env.example`, `.env.local`, `docker-compose.yml`, `.replit`, every `package.json`, and the code (service SDK imports + the workflow-builder plugin catalog). "Status" reflects what is actually wired, not just declared.

---

## 1. At a glance — what you're actually running on

These are the services with a **real key set in `.env.local`** — i.e. live today:

| Service | Role | Paying for |
|---|---|---|
| **Vercel AI Gateway** | Primary LLM router (chat, Agent Lab, GenUI, embeddings) | ✅ yes |
| **Supabase** | Postgres DB + private file Storage (saved chats, document RAG) | ✅ yes |
| **Firecrawl** | Sina web search + builder scrape/search | ✅ yes |
| **Replit** | Hosting / deploy target (autoscale) | ✅ yes |
| **OpenAI** | Direct fallback + GenUI (mostly reached *through* the Gateway) | ➖ optional |

Everything else below is either a **framework** (no external account), a **dormant** integration (wired but no key set), or a **builder connector** (only needs a key if/when a workflow uses it).

> ⚠️ **Vercel ≠ your host.** You use three Vercel *products* — AI Gateway, v0, and Blob — but the app is **hosted on Replit**, not Vercel. See §5.

---

## 2. Core runtime services (the app itself)

| Service | What it does here | Where in code | Env var(s) | Status |
|---|---|---|---|---|
| **Vercel AI Gateway** | One key → any provider/model. Powers Sina chat, Agent Lab, GenUI, model tiering (gpt-5.6-terra/sol/luna). | `platform/agent-tools`, `features/agent-lab`, api-server `copilotkit.ts`/`genui.ts` | `AI_GATEWAY_API_KEY` | 🟢 **Active** (real key) |
| **OpenAI** | Direct SDK for GenUI + embeddings; direct-chat fallback. Mostly routed via the Gateway. | `openai` + `@ai-sdk/openai` (api-server, web) | `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL` | 🟡 Commented out in `.env.local` (Gateway covers it) |
| **Supabase — Postgres** | Saved chat threads/messages, document metadata + pgvector RAG chunks, durable ingest queue. | `lib/db` (Drizzle), api-server | `DATABASE_URL` | 🟢 **Active** |
| **Supabase — Storage** | Private bucket holding uploaded company-document bytes. | `api-server/src/lib/storage.ts`, `@supabase/supabase-js` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` (= `Company`) | 🟢 **Active** |
| **Firecrawl** | Sina's web-search tool (whole internet) + builder scrape/search plugin. | `platform/agent-tools/registry.ts`, `plugins/firecrawl` | `FIRECRAWL_API_KEY` | 🟢 **Active** |
| **Sentry** | Front-end error monitoring (render-crash capture). No-ops silently until a DSN is set. | `src/lib/error-monitoring.ts`, `@sentry/react` | `VITE_SENTRY_DSN`, `VITE_RELEASE` | ⚪ **Wired but dormant** (no DSN) |
| **Google (OAuth)** | Drive + Gmail **read-only** access via better-auth's Google provider (REST, no `googleapis` dep). | `platform/integrations/google` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | ⚪ Wired, needs OAuth creds |

**Frameworks bundled in (no external account / key):** CopilotKit (chat runtime), better-auth (auth), Drizzle ORM (DB), OpenUI `@openuidev/*` (GenUI), Monaco (code editor).

---

## 3. Workflow-builder connector catalog

The builder ships **14 integration plugins**. These are *offered* to workflows; each only needs its key **when a workflow actually uses that action**. This is your "possible future spend" list.

| Connector | Vendor | Purpose | Env var(s) |
|---|---|---|---|
| **AI Gateway** | Vercel | LLM text/image gen in workflows | `AI_GATEWAY_API_KEY` |
| **Blob** | Vercel | File storage | `BLOB_READ_WRITE_TOKEN` |
| **v0** | Vercel | Generative UI (`v0-sdk`) | `V0_API_KEY` |
| **Clerk** | Clerk | User management | `CLERK_SECRET_KEY` |
| **fal** | fal.ai | Image/video generation, upscale, bg-removal | `FAL_API_KEY` |
| **Firecrawl** | Firecrawl | Scrape / search | `FIRECRAWL_API_KEY` |
| **GitHub** | GitHub | Issues (create/update) | `GITHUB_TOKEN` |
| **Linear** | Linear | Issue tracking (`@linear/sdk`) | `LINEAR_API_KEY`, `LINEAR_TEAM_ID` |
| **Perplexity** | Perplexity | Web-grounded search | `PERPLEXITY_API_KEY` |
| **Resend** | Resend | Transactional email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| **Slack** | Slack | Post messages (`@slack/web-api`) | `SLACK_API_KEY` (Bot token `xoxb-…`) |
| **Stripe** | Stripe | Payments | `STRIPE_SECRET_KEY` |
| **Superagent** | Superagent | Agent orchestration | `SUPERAGENT_API_KEY` |
| **Webflow** | Webflow | CMS | `WEBFLOW_API_KEY` |

> None of these have keys set today — they're capability surface area, not active spend.

---

## 4. Hosting, infra & dev tooling

| Thing | Role | Notes |
|---|---|---|
| **Replit** | Hosting + deploy | `.replit`: autoscale, Node 24 + Python 3.13 + Postgres 16. `@replit/connectors-sdk` + Vite dev plugins. |
| **Docker / Docker Compose** | Local dev stack | `db` (pgvector/pg16) + `api` + `web`. Windows can't run the Linux-only binaries bare-metal. |
| **pnpm workspace** | Monorepo package mgr | Node 24, `pnpm@10`. |
| **Vite** | Frontend build/dev | web app + inscope-pitch + mockup-sandbox. |
| **Playwright** | E2E / route-smoke tests | + the AI "virtual worker" browser tester. |
| **Drizzle Kit** | DB migrations | `pnpm --filter @workspace/db push`. |
| **esbuild / TypeScript / Tailwind** | Build toolchain | — |

**Your dev environment (Claude Code) — separate from the app runtime:** Figma MCP (connected); claude.ai Gmail / Google Calendar / Google Drive connectors (require authorization before use). These are your tooling, not TaxflowOS dependencies.

---

## 5. Master secrets checklist

Single source of truth for what needs a value, per environment. Set locally in `.env.local`; on Replit use the **Secrets** panel.

| Env var | Service | Required? | Set in `.env.local`? |
|---|---|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway | **Yes** (core) | ✅ |
| `DATABASE_URL` | Supabase Postgres | **Yes** (core) | ⚠️ container uses local Postgres; prod needs Supabase pooler URL |
| `SUPABASE_URL` | Supabase | For uploads/RAG | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | For uploads/RAG | ✅ (server-only — never expose) |
| `SUPABASE_STORAGE_BUCKET` | Supabase Storage | For uploads | ✅ (`Company`) |
| `FIRECRAWL_API_KEY` | Firecrawl | For web search | ✅ |
| `OPENAI_API_KEY` | OpenAI | Optional (Gateway covers it) | ⬜ commented |
| `OPENAI_CHAT_MODEL` | OpenAI/Gateway | Optional | ✅ (`gpt-5.6-terra`) |
| `ASSISTANT_MODEL_DEEP` / `_FAST` / `_TIERING` | Sina router | Optional | ✅ |
| `VITE_SENTRY_DSN` | Sentry | Optional (dormant) | ⬜ |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth | If Drive/Gmail used | ⬜ |
| _Builder connector keys_ (§3) | various | Per-workflow | ⬜ all |

---

## 6. ⚠️ Security action item — rotate committed keys

`.env.local` currently holds **real, live secrets** (AI Gateway key, Supabase service-role JWT, Firecrawl key, Supabase project ref). The file is gitignored now, but per project history **real keys were previously committed to git history**.

**Recommended:**
1. **Rotate** the AI Gateway, Supabase service-role, and Firecrawl keys (they may be exposed in history).
2. Confirm `.env.local` stays gitignored (it is).
3. Keep the **service-role** key server-side only — never ship it to the browser.
4. Consider a secrets manager (Replit Secrets / Doppler / 1Password) instead of a flat file long-term.

---

## 7. Quick account/billing tracker

Log in periodically and confirm usage/limits on each **active** account:

- [ ] **Vercel** — AI Gateway usage & spend (+ v0, Blob if you enable them)
- [ ] **Supabase** — DB size, Storage bytes, row/egress limits
- [ ] **Firecrawl** — request quota
- [ ] **Replit** — deployment/compute usage
- [ ] **OpenAI** — only if you switch off the Gateway fallback
- [ ] **Sentry** — only once you set a DSN
