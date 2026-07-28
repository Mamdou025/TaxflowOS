---
name: CopilotKit orphaned tool calls
description: Fix + rule for the "can't send a follow-up after the AI replied" error — Tool result is missing for tool call <id> — via server-side orphan repair on the LIVE api-server route.
---

# CopilotKit orphaned tool calls ("can't reply after the AI")

## The symptom

Sending a follow-up message after the assistant has replied fails immediately with a
`RUN_ERROR`:

```
Code: agent_run_error_event
Message: Tool result is missing for tool call call_XXXXXXXX.
  type: "RUN_ERROR", threadId: "…", runId: "…", agentId: "default"
Error: Tool result is missing for tool call call_XXXXXXXX.
    at Object.onRunErrorEvent (…chunk-….js)
```

Once it starts, **every** later message in that thread fails — one orphan poisons the
whole conversation. (Starting a New Chat clears it, because the poisoned thread is gone.)

## Root cause

The CopilotKit React client persists the **whole thread** and replays it — as GraphQL
`generateCopilotResponse` input — on every turn. When a run is aborted **after** the
assistant emitted a tool call but **before** its result was sent back, the persisted
thread keeps the tool-call message with **no matching result**. On the next turn the
runtime converts that thread for the model and it throws
`"Tool result is missing for tool call <id>."`.

A run gets aborted this way by: pressing **Stop**, **navigating away** / route change
while a run is mounted (very common right after a workflow, when you go inspect the
result), **unmount / hot-reload** during a stream, or a frontend `useCopilotAction`
whose handler never resolved.

## Why it came back (the important part)

This bug was fixed **once** — but only in the Next.js route
[`app/api/copilotkit/route.ts`](../../artifacts/ai-workflow-builder/src/app/api/copilotkit/route.ts)
(explicit v2 `BuiltInAgent` + a `repairOrphanToolCalls` middleware).

**That route is DEAD in local/Replit dev.** Since the 2026-07-25 migration the app is a
3-service split (Vite web + Express **api-server** + Postgres) — there is no Next.js
server running. The Vite dev server proxies `/api/copilotkit`
([app-shell.tsx](../../artifacts/ai-workflow-builder/src/components/app-shell.tsx) `runtimeUrl`)
to the Express **api-server**, whose route
[`artifacts/api-server/src/routes/copilotkit.ts`](../../artifacts/api-server/src/routes/copilotkit.ts)
had **no orphan repair at all**. So the "fixed" code never runs; the live code was never fixed.

## The fix (implemented 2026-07-28)

Server-side orphan repair ported to the **live** Express api-server route:

- **[artifacts/api-server/src/lib/copilot-orphan-repair.ts](../../artifacts/api-server/src/lib/copilot-orphan-repair.ts)** —
  `repairOrphanToolCalls(messages)`. Walks the CopilotKit **v1 GraphQL** message array
  and injects a synthetic `resultMessage` for every tool call
  (`actionExecutionMessage`, whose call id is the entry's `id`) still unanswered before
  each user/system boundary and before end-of-thread. Positional (per-boundary),
  reference-stable (returns the same array when nothing needed repair), deterministic.
  *(This is the v1-GQL twin of the web app's AG-UI-shape
  `lib/copilot-orphan-repair.ts`; the shapes differ — GraphQL
  `actionExecutionMessage`/`resultMessage` vs AG-UI `toolCalls`/`toolCallId` — so they
  cannot share one file.)*
- **[artifacts/api-server/src/routes/copilotkit.ts](../../artifacts/api-server/src/routes/copilotkit.ts)** —
  an Express middleware runs **before** the CopilotKit handler and rewrites
  `req.body.variables.data.messages` in place. This works because `app.ts` applies
  `express.json()` globally, so `req.body` is already the parsed GraphQL request, and
  GraphQL Yoga (inside CopilotKit) reads that same `req.body`. Fail-open: wrapped in
  try/catch so a repair bug can never break a chat turn.

## The rule (to avoid recurrence)

**The live CopilotKit runtime is the Express api-server route, not the Next.js route.**
Any server-side chat behavior — orphan repair, intent gate, model tiering, tracing —
must live in (or be ported to)
`artifacts/api-server/src/routes/copilotkit.ts`. A fix that exists only in
`app/api/copilotkit/route.ts` is dead code in local/Replit dev and will silently not run.

- The two routes run **different CopilotKit APIs**: api-server is v1
  (`@copilotkit/runtime@^1.63.2`, `copilotRuntimeNodeExpressEndpoint`, GraphQL wire
  shape); the Next.js route uses v2 `BuiltInAgent`. Do not assume a v2 middleware
  approach ports over — repair at the **request-body / GraphQL boundary** in the
  api-server instead.
- When you change assistant server behavior, grep **both** routes and keep them in sync,
  or treat the api-server as the single source of truth.

## Detection signals

- Client console: `RUN_ERROR` / `onRunErrorEvent` with `"Tool result is missing for tool call …"`.
- The `call_…` id is an OpenAI tool-call id; `agentId: "default"`.
- Chat works until the first aborted/navigated run, then every follow-up fails; **New Chat** recovers.
- api-server log line `copilotkit: repaired orphaned tool call(s) with synthetic results` confirms the repair fired.

## Verification status

Repair algorithm is **runtime-verified** (9/9 logic cases incl. the exact reported
`call_T2mlwmlbkZr46K17CdJ6Tb8W` case) and the lib **typechecks** clean under the
project's strict settings. Not yet verified against a live container run (host has no
api-server `node_modules` — deps are containerized).
