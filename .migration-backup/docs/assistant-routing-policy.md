# Assistant Routing Policy — Ask / Propose / Execute

*Added 2026-07-18. Owner module: `lib/assistant-runtime/`. Status: `[LIVE]` (enforced by default; fully reversible via one env flag.)*

## The problem this fixes

The chat handed the model **every** CopilotKit action on every turn with no intent layer. Two failure modes followed:

1. **False activation** — merely *mentioning* or *asking about* a workflow could make the model call `runWorkflow`.
2. **Missed commands** — a plain "start the 2025 FAPI workflow" was inferred from a wall of tools and sometimes missed.

The fix is an explicit **Ask / Propose / Execute** decision made *before* the model sees its tools, embodying the rule: **a workflow name identifies a target; it is never, by itself, a command to run it.**

## Where it runs

`app/api/copilotkit/route.ts` already registers a `BuiltInAgent` middleware (`agent.use(...)`) for orphan-repair + tracing. The gate is added to that same middleware. The AG-UI middleware must return an `Observable` **synchronously**, so the enforced layer is **deterministic** (no blocking LLM call), zero-latency, and **fail-open**: any doubt or error → the input passes through unchanged, so the chat is never worse than before.

```
user turn ─▶ traceCopilotInput ─▶ computeGateDecision ─▶ applyGateDecision ─▶ repairOrphanToolCalls ─▶ model
                                         │                      │
                                classify + policy        withhold tools /
                                                          append directive
```

## The decision, step by step (`computeGateDecision`)

1. **Extract the current turn** — the last message, only if it is a *user* message with text (mid-tool-loop turns are skipped → fail-open).
2. **Classify deterministically** (`classifyDeterministic`), precedence:
   `slash-command > negation > information-question > hypothetical > "run it" > explicit-action verb > mention-only > general`.
   - Bilingual EN/FR verb, question, negation, and hypothetical banks live in `routing/command-parser.ts`.
   - Workflow **targets** (`fapi | roulement | expense | campaign`, with EN/FR aliases) resolve in `routing/workflow-targets.ts` — **separately** from action detection.
   - Quoted / reported-speech spans are stripped before action detection, and noun-`run` ("the FAPI run") is neutralized, so injected/quoted imperatives don't read as commands.
3. **Apply safety policy** (`route-policy.ts`) — can only make a route *safer*: a natural-language `execute` with low confidence, an ambiguous/missing target, or any negation is downgraded to `propose`/`ask`. Explicit slash commands and clicked UI actions are exempt.
4. **Enforce (in `enforce` mode)**:
   - **ask / propose** turns withhold the `execute` and `builder_mutate` tool groups (chiefly `runWorkflow`) — read/open/search/explain/field-edit/generate-UI stay available. Never strips the whole tool set.
   - **execute** turns keep all tools and (optionally) append a short `[assistant-routing]` directive naming the resolved workflow so the model calls `runWorkflow` with the right id.

## Modes (env `ASSISTANT_INTENT_GATE`)

| Mode | Behavior |
|---|---|
| `off` | Gate inert. Chat behaves exactly as before this feature. |
| `shadow` | Classifies + logs every turn (`[assistant-route] …`), changes nothing. Safe to run in prod to collect accuracy. |
| `enforce` *(default)* | Additionally withholds tools / appends directives as above. |

Directives can be disabled independently with `ASSISTANT_INTENT_DIRECTIVES=off` (tool-scoping still applies).

## Tool risk groups (`routing/tool-groups.ts`)

`execute` (`runWorkflow`, `runBuilderWorkflow`) · `builder_mutate` (add/connect/delete/save/rename/edit block) · `field_edit` (`editField`) · `page_command` (`commandPage`) · `generate_ui` (`generateUI`) · `read_nav` (open/focus/show/search/explain) · `unknown` (any unrecognized tool → never withheld).

Only `execute` + `builder_mutate` are ever withheld, and only on `ask`/`propose` turns above a 0.7 confidence floor.

## Evaluation

`pnpm assistant:evals` runs the deterministic classifier + policy over **118 bilingual cases** (`evals/routing-cases.ts`) plus 4 gate-enforcement smoke checks — offline, no API key. Priority metrics: **false-execution rate** (0), **missed-command rate** (0), target accuracy, negation/injection accuracy (16/16). The harness exits non-zero on any failure or safety violation. Current: **118/118 pass, 0 false executions, 0 missed commands.**

## Optional LLM router

`routing/intent-router.ts` (`classifyWithLLM`) produces the *same* `AssistantRoute` via a small structured-output call. It is **not** in the hot path — it's available for shadow comparison, an inspector, or a future pre-flight endpoint. The deterministic layer is what the runtime enforces.

## Rollback

Set `ASSISTANT_INTENT_GATE=off` (or `shadow`). No code change, no redeploy of the rest of the assistant. Removing the two added lines in `app/api/copilotkit/route.ts` fully reverts to the prior middleware.
