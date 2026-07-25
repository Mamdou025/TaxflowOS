# Assistant Specialists — "one assistant, many hats"

*Added 2026-07-18. Owner: `lib/assistant-runtime/agents/specialists.ts` + `app/api/copilotkit/route.ts` + `components/assistant/specialist-presence.tsx`. Status: `[LIVE]`.*

## The idea

Multiple agents doing different things — **done the right way**. There is still ONE conductor and ONE conversation, but for each turn the assistant *becomes* the domain specialist that fits: **Sofi** for FAPI, **Théo** for the art. 85 rollover, **Mira** for expense reimbursement, **Nova** for campaign budgets. What changes per turn is the **persona + domain expertise** (and the already route-scoped tools) — not a separate independent agent competing for the conversation. This avoids the failure mode of parallel agents contradicting each other or fighting over the reply.

It builds directly on the intent layer: the classifier already resolves the workflow a turn is about, so mapping that to the owning specialist is one lookup.

## Selection (pure, `agents/specialists.ts`)

`selectSpecialist(route)`:
- `route.target` is a resolved workflow (`fapi|roulement|expense|campaign`) → that workflow's specialist (from `lib/agents.ts` — Sofi/Théo/Mira/Nova).
- otherwise (general / navigation) → `null` → the coordinating Workspace Assistant stays in charge.

Each specialist carries concise, real domain `expertise` (FAPI line build + 95(2) + FX/CAD; §85 election bounds PBR↔FMV + T2057; per-diem caps + net payable; channel-spend election floor↔ceiling).

## Brain — server-side persona injection

In the `/api/copilotkit` middleware (same one that runs the intent gate + model tiering), when a specialist is selected the persona is added as a **context item** (`SPECIALIST FOR THIS TURN — You are Sofi …`) so it reaches the model without touching the message thread. The `INSTRUCTIONS()` system prompt tells the model to adopt the per-turn persona, switch when the domain changes, and stay itself for general turns. Reuses the route the gate already computed (no extra classification). Controlled by `ASSISTANT_SPECIALISTS` (default on).

## Face — who's working (`specialist-presence.tsx`)

A headless component (mounted once in `app-shell`) reuses the SAME pure classifier on the client to read the latest user turn and, while a reply streams, sets the live coworker indicator (`CoworkerActivity`) to that specialist — "Sofi · FAPI specialist · Reviewing your question…". It is **purely cosmetic**: it only writes the presence atom, never the message thread or the model, so a mis-read simply shows no hat (it can't break the chat). It **yields entirely to a live workflow run**, which owns the indicator, and only ever clears a hat it set itself.

**Per-message avatars** (`components/assistant/message-specialists.tsx`): every PAST assistant message shows its specialist's avatar too, not just the live one. A plain reply carries no tool call (so `coworkerForMessage` can only say "Workspace Assistant"), so `ThreadMessages` builds a `{ assistantMessageId → specialist }` map by classifying each message's *preceding user turn* with the same pure classifier, and shares it via `MessageSpecialistContext`. `AsideAssistantMessage` uses the specialist **only** when the message has the generic attribution — a `runWorkflow`/`generateUI`/page-op message keeps its specific tool attribution. Memoized on the message id/role signature (no recompute per stream tick); purely visual.

## Why not the OpenAI Agents SDK?

This is the "one assistant, many hats" shape (flavor A). The Agents SDK is only needed for genuine handoffs / sub-delegation and resumable approvals (flavor B/C) — a deliberate later project. Everything here sits on the intent + memory layers already built, so nothing is throwaway if you adopt it later.

## Verification

- `pnpm assistant:evals` includes specialist-selection checks (workflow turn → its specialist; general → none) — all pass, offline.
- `tsc` clean for the slice. **Not verified here:** the live persona in a running chat + the streaming presence indicator (needs the running app) — drive one domain question after `pnpm dev` to see "As Sofi, …" and the indicator.

## Rollback

`ASSISTANT_SPECIALISTS=off` disables the brain (persona injection). Remove `<SpecialistPresence/>` from `app-shell.tsx` to drop the cosmetic indicator. Both are additive.
