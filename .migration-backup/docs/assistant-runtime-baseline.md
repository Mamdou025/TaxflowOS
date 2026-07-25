# Assistant Runtime — Baseline (Phase 0)

*Recorded 2026-07-18, before adding the intent gate. Snapshot of the AS-IS chat runtime so the change can be understood and rolled back.*

## Stack actually installed (not the aspirational spec)

- **Chat UI/runtime:** CopilotKit `1.62.3` (`@copilotkit/react-core`, `react-ui`, `runtime`, `runtime-client-gql`).
- **Model inference:** OpenAI SDK `openai@6.8.1`; the CopilotKit runtime bundles `ai@6` (Vercel AI SDK) internally; the app also depends on `ai@5.0.102` for other routes.
- **Validation:** `zod@4.1.12`. **DB:** Drizzle `0.44.7` + `postgres@3.4.7`. **Auth:** better-auth `1.3.34`. **State:** jotai `2.15.1`. **Framework:** Next `16.0.10`, React `19.2.1`.
- **Not installed:** `@openai/agents` (the aspirational spec assumed it). Not added — not needed for this slice.
- **Model IDs in the spec (`gpt-5.6-terra`, …) are fictional.** Real: `OPENAI_CHAT_MODEL` (default `gpt-4o`) for chat, `GENUI_MODEL` (default `gpt-4.1`) for GenUI.

## Current chat request path

1. Client `<CopilotChat instructions={INSTRUCTIONS()} …>` (`components/assistant/assistant-thread.tsx`) posts to `/api/copilotkit`.
2. `app/api/copilotkit/route.ts` builds `new OpenAIAdapter({ model: OPENAI_CHAT_MODEL })` + an explicit default `BuiltInAgent`, with one `agent.use(...)` middleware doing **trace** + **orphan-repair**.
3. All frontend actions (`useCopilotAction` in `use-assistant.tsx` + `builder-copilot.tsx`) arrive per-request as `input.tools` and stream back to the client to run.

### The "brain": `components/assistant/use-assistant.tsx`
Registers ~14 actions — `runWorkflow`, `showWorkflowElement`, `openPage`, `focusAnchor`, `editField`, `closePage`, `closeAll`, `openWorkflowBuilder`, `commandPage`, `bringIntoChat`, `generateUI`, `explainWorksheetLine`, `whyWorksheetValue`, `searchWorksheet` — plus 6 `useCopilotReadable` context blocks (route, open pages, page surfaces, active run, editable field values, live workflow data). The system prompt `INSTRUCTIONS()` lives in `assistant-thread.tsx`.

### How a workflow runs today
`runWorkflow` is **non-blocking**: it renders a `RunProposalCard`; the live `WorkflowRunFlow` mounts only after the user clicks **Start**. A separate deterministic path (`launchStartWorkflow`) bypasses the model entirely (sidebar/@-commands/roster). Targets: `WORKFLOW_CONFIGS = { fapi, roulement, expense, campaign }` (`lib/workflow-runs/index.ts`).

### Persistence
No chat/thread/agent-run tables exist. Chat/run/work state is jotai + `localStorage` (`workspace-store.ts`, `work-store.ts`, `resource-registry.tsx`). Postgres backs auth + workflows + integrations only, and API routes fail soft when it's absent.

### Orphan-tool-call safety
`lib/copilot-orphan-repair.ts` injects synthetic tool results so `ai@6`'s `convertToLanguageModelPrompt` never throws `MissingToolResultsError`. The gate is composed *before* this repair.

## Gap this slice addresses

There was **no intent layer**: the model saw every tool every turn → workflow mentions could trigger `runWorkflow`, and explicit commands could be missed. See `assistant-routing-policy.md`.

## Baseline verification state

- `pnpm exec tsc --noEmit` on the working tree reports **2 pre-existing errors**, both in `lib/local-ai-workflow-assistant.ts` (`protectedBlock`/`block` possibly null, lines 376 & 410) — uncommitted changes present before this task, **not touched by this slice**. The added `lib/assistant-runtime/` modules and the `route.ts` wiring type-check clean.
- `pnpm assistant:evals` → 118/118, 0 false executions, 0 missed commands, 4/4 gate checks.
