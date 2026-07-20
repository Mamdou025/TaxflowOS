# Assistant Model Policy — per-turn model tiering ("smarter answers")

*Added 2026-07-18. Owner: `lib/assistant-runtime/model-policy.ts` + `config.ts`. Status: `[LIVE]` mechanism; a **no-op until distinct models are configured**.*

## The idea

The chat used one fixed model (`OPENAI_CHAT_MODEL`, default `gpt-4o`) for everything — a hard tax-analysis question and a "open the dashboard" navigation got the same brain. Model tiering picks the model **per turn** from the route the intent layer already computes:

| Tier | When | Env (default) |
|---|---|---|
| **deep** | hard reasoning — `explain_workflow`, `inspect_calculation`, `run_calculation`, `search_evidence`, `answer_question`, `modify_protected_value`, `find_workflow` | `ASSISTANT_MODEL_DEEP` (= chat model) |
| **fast** | navigation — `open_page`, `open_artifact`, `edit_field`, `general_conversation`, status/approve/reject/create-view | `ASSISTANT_MODEL_FAST` (= chat model) |
| **standard** | everything else — `start_workflow`, `continue/pause/cancel`, `unknown` | `OPENAI_CHAT_MODEL` (= `gpt-4o`) |

## Safe by default

**Every tier defaults to the chat model, so this changes nothing until you set `ASSISTANT_MODEL_FAST` / `ASSISTANT_MODEL_DEEP` to *distinct* models.** When a tier equals the baseline, the policy returns `modelSpec = null` → no override → the base model is used. So turning it on is risk-free; the upgrade happens the moment you point `DEEP` at a stronger model.

## How the override works

CopilotKit's `BuiltInAgent` supports per-run overrides via `input.forwardedProps.model` **only** when constructed with `overridableProperties`. In `app/api/copilotkit/route.ts` the agent is now built with `overridableProperties: ['model', 'providerOptions']`, and the same middleware that runs the intent gate sets `forwardedProps.model` from the tier decision. The runtime's `resolveModel` needs a **provider-prefixed** string, so bare ids are normalized: `gpt-4o → openai/gpt-4o`, `o3 → openai/o3`, `claude-… → anthropic/…`, `gemini-… → google/…`.

The route is reused from the gate (no double classification); the chosen `tier` appears in the `[assistant-route]` log line.

## Reasoning effort

`providerOptions.reasoningEffort` is attached **only** when `ASSISTANT_REASONING_ENABLED=on` **and** the deep tier actually overrides the model (reasoning effort applies to reasoning-capable models like the o-series / gpt-5; sending it to `gpt-4o` is pointless). Off by default. Per-tier effort: `ASSISTANT_REASONING_FAST|CONDUCTOR|DEEP`.

## Env summary

```
OPENAI_CHAT_MODEL=gpt-4o           # baseline (already used by the route)
ASSISTANT_MODEL_TIERING=on         # default on; no-op until FAST/DEEP differ
ASSISTANT_MODEL_FAST=              # e.g. openai/gpt-4o-mini (simple navigation)
ASSISTANT_MODEL_DEEP=              # e.g. openai/o3 (hard tax/analysis)
ASSISTANT_REASONING_ENABLED=off    # send reasoningEffort for the deep tier
ASSISTANT_REASONING_DEEP=high
```

## Rollback

`ASSISTANT_MODEL_TIERING=off`, or simply leave `FAST`/`DEEP` unset (the default) — either way every turn uses `OPENAI_CHAT_MODEL`, exactly as before.

## Verification

`pnpm assistant:evals` includes model-tiering checks (route → tier mapping; `modelSpec=null` when a tier equals the baseline; provider-prefix normalization). Current: all pass.

## Note — grounding

"Smarter answers" also depends on the model *seeing real data*. The chat already publishes strong `useCopilotReadable` context (editable field values, live per-workflow computed figures, active run) — see ARCHITECTURE.md → "Assistant grounding". This increment adds the model-tier half; deeper grounding is a separate, later step.
