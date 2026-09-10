---
name: CopilotKit orphaned tool calls
description: Fix + rule for the "can't send a follow-up after the AI replied" error — Tool result is missing for tool call <id> — via a BuiltInAgent orphan-repair middleware on the LIVE api-server route.
---

# CopilotKit orphaned tool calls ("can't reply after the AI")

## The symptom

Sending a follow-up message after the assistant has replied fails immediately with a
`RUN_ERROR`:

```
Code: agent_run_error_event
Message: Tool result is missing for tool call call_XXXXXXXX.
  type: "RUN_ERROR", threadId: "…", runId: "…", agentId: "default"
    at Object.onRunErrorEvent (…chunk-….js)
```

Once it starts, **every** later message in that thread fails — one orphan poisons the
whole conversation. (Starting a New Chat clears it, because the poisoned thread is gone.)

## Root cause

The CopilotKit React client persists the **whole thread** and replays it on every turn.
When a run is aborted **after** the assistant emitted a tool call but **before** its result
was sent back, the persisted thread keeps the tool call with **no matching result**. On the
next turn the runtime hands that thread to the AI SDK, whose `convertToLanguageModelPrompt`
throws:

```
MissingToolResultsError [AI_MissingToolResultsError]: Tool result is missing for tool call call_XXXX.
    at convertToLanguageModelPrompt (…/ai@6.0.235/…/convert-to-language-model-prompt.ts:156)
    at streamStep (…/ai@6.0.235/…/generate-text/stream-text.ts)
```

A run gets aborted this way by: pressing **Stop**, **navigating away** / route change while a
run is mounted (very common right after a workflow, when you go inspect the result),
**unmount / hot-reload** during a stream, or a frontend `useCopilotAction` whose handler
never resolved.

## What's actually running (verified in-container 2026-07-28)

- `@copilotkit/runtime@1.63.2` — has a `./v2` subpath and exports **`BuiltInAgent`**.
- The chat runs through a **BuiltInAgent → `ai@6.0.235` `streamText`** pipeline. (CopilotKit
  bundles its OWN `ai@6`, separate from the app's `ai@7.0.37`.) The error is thrown by that
  bundled `ai@6`'s `convertToLanguageModelPrompt`.
- Inside the BuiltInAgent, the thread is the **AG-UI message shape** (`role` + `toolCalls[]`
  + `toolCallId`) — NOT the GraphQL wire shape (`actionExecutionMessage`/`resultMessage`).
  CopilotRuntime converts GraphQL → AG-UI before the agent sees it. **This is why an
  HTTP-body / GraphQL-shape repair does nothing — repair must run inside the agent, on the
  AG-UI messages.**

## Why it came back (the important part)

This bug was fixed **once** — but only in the Next.js route
[`app/api/copilotkit/route.ts`](../../artifacts/ai-workflow-builder/src/app/api/copilotkit/route.ts)
(explicit `BuiltInAgent` + a `repairOrphanToolCalls` middleware).

**That route is DEAD in local/Replit dev.** Since the 2026-07-25 migration the app is a
3-service split (Vite web + Express **api-server** + Postgres) — there is no Next.js server
running. Vite proxies `/api/copilotkit`
([app-shell.tsx](../../artifacts/ai-workflow-builder/src/components/app-shell.tsx) `runtimeUrl`)
to the Express **api-server**, whose route
[`artifacts/api-server/src/routes/copilotkit.ts`](../../artifacts/api-server/src/routes/copilotkit.ts)
had a **bare `CopilotRuntime()` with no orphan repair**. So the "fixed" code never ran.

## The fix (implemented + verified 2026-07-28)

Mirror the Next.js fix in the **live** Express api-server route:

- **[artifacts/api-server/src/routes/copilotkit.ts](../../artifacts/api-server/src/routes/copilotkit.ts)** —
  register an **explicit default `BuiltInAgent`** (`new BuiltInAgent({ model:
  serviceAdapter.getLanguageModel() })`) wrapped in a `CopilotRuntime({ agents: { default:
  agent } })`, and attach `agent.use((input, next) => next.run({ ...input, messages:
  repairOrphanToolCalls(input.messages) }))`. The middleware runs **before** the agent
  converts `input.messages` for the AI SDK, so the exact thread the SDK validates is always
  tool-call/result paired. Frontend `useCopilotAction` tools are unaffected (they arrive as
  `input.tools`).
- **[artifacts/api-server/src/lib/copilot-orphan-repair.ts](../../artifacts/api-server/src/lib/copilot-orphan-repair.ts)** —
  `repairOrphanToolCalls(messages)` on the **AG-UI shape** (same logic as the web app's
  `lib/copilot-orphan-repair.ts`): injects a synthetic `role:"tool"` result for every
  assistant tool call still unanswered before each user/system boundary and before
  end-of-thread. Positional, reference-stable (returns the same array on a no-op).

A prior attempt that repaired `req.body.variables.data.messages` at the HTTP layer (GraphQL
shape) did **nothing** — wrong layer AND wrong shape (see "What's actually running").

## The rule (to avoid recurrence)

**The live CopilotKit runtime is the Express api-server route, not the Next.js route.**
Any server-side chat behavior — orphan repair, intent gate, model tiering, tracing — must
live in (or be ported to) `artifacts/api-server/src/routes/copilotkit.ts`. A fix that exists
only in `app/api/copilotkit/route.ts` is dead code in local/Replit dev.

- Repair the **AG-UI thread inside a `BuiltInAgent` middleware**, not the HTTP/GraphQL body.
  CopilotRuntime converts GraphQL → AG-UI before the agent, and the AI SDK error comes from
  the agent's conversion — so that is the only layer where a repair takes effect.
- When you change assistant server behavior, grep **both** routes and keep them in sync, or
  treat the api-server as the single source of truth.

## Detection signals

- Client console: `RUN_ERROR` / `onRunErrorEvent` with `"Tool result is missing for tool call …"`.
- api-server log: `MissingToolResultsError` at `convertToLanguageModelPrompt` (ai@6) +
  `Agent execution failed`.
- When the fix is working, the api-server logs `[copilotkit] repaired orphaned tool call(s):
  injected N synthetic result(s)` and the request completes 200 with NO MissingToolResults.

## Verification (how it was confirmed)

Restarted the api container (rebuild via esbuild), then observed real traffic replaying the
poisoned thread: **7 repair events, 0 `MissingToolResultsError`, 0 `Tool result is missing`,
0 `Agent execution failed`**. Typecheck (`pnpm --filter @workspace/api-server typecheck`) and
build both clean in-container. To re-verify after changes, grep the api logs for the two
counters above while sending a follow-up on a thread that had an aborted tool call.
