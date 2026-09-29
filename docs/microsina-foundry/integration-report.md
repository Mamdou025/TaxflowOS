# MicroSina integration review — 2026-09-29

## Outcome and scope

Local Inscope code offers MicroSina as a second chat agent using the existing
Express backend, CopilotKit runtime and application tools. Sina remains the
initial default. The owning modules are the chat adapter/UI and API provider
adapter. No workflow calculation rules, database schema, dependencies, production
settings or Foundry definitions were changed in this integration step.

The user clarified that Azure backend credentials are not configured. MicroSina
cannot answer through Foundry until an application identity is configured and the
changes are deployed. Nothing was committed, pushed or deployed.

Acceptance checked locally: agent selection before a conversation; selection
retained in saved chats; legacy Sina restoration; pinned Foundry requests;
streaming text/function calls; shared tool registration; visible errors without
provider fallback. Live behavioral parity remains an acceptance task.

## File-by-file meaning

Paths below are relative to the repository root. “Before” means the working-tree
state at the start of this integration, including unrelated uncommitted work.

| File                                                                                        | Purpose and before → after behavior                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/lib/foundry-model.ts`                                             | New server transport. Previously there was no Foundry connection; now obtains/caches Azure OAuth tokens, pins MicroSina's version and streams Responses through CopilotKit's existing SDK. Sends host function tools/context without overriding the Foundry definition.                            |
| `artifacts/api-server/src/routes/copilotkit.ts`                                             | Existing chat endpoint. Previously selected only Replit/Vercel; now an allowlisted agent header selects the Foundry adapter. Both paths retain orphan-call repair and the existing access middleware. Sina's provider selection is unchanged.                                                      |
| `artifacts/ai-workflow-builder/src/components/app-shell.tsx`                                | Provider mounting. Previously sent only the workspace header; now also sends the selected chat agent. Uses the same endpoint and mounted tool components.                                                                                                                                          |
| `artifacts/ai-workflow-builder/src/shared/stores/chat-store.ts`                             | Scoped UI state. Adds a saved agent preference alongside the active thread ID, with Sina as the initial default.                                                                                                                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-agent.ts`           | New persistence helper. Tags the first stored message with agent metadata and reads it on restore. Metadata is outside prompt text; absent metadata means legacy Sina; unknown values fail visibly.                                                                                                |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-chat-persistence.ts` | Conversation saving/restoration. Saves the agent tag, including saves before computer delegation, and restores the agent before resuming the chat. Existing message codec and server JSON contract remain usable.                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`              | Chat header and prompt input. Adds the selector, locks it once a conversation starts, labels recovery correctly and displays model errors. MicroSina receives dynamic catalogs and existing workspace additions; its static base prompt comes from Foundry. Sina retains its existing base prompt. |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/agent-run-review.tsx`              | Workflow approval requests. Previously always attributed requests to Sina; now records the selected agent. Existing review and execution rules are unchanged.                                                                                                                                      |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`             | Session action approval requests. Uses the selected agent ID instead of the Sina literal. Existing grants remain scoped to their original agent.                                                                                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/aside-thread.tsx`           | Reply attribution. MicroSina replies show MicroSina's name/initials; tool-specific attribution remains intact. No tool execution behavior change intended.                                                                                                                                         |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/specialist-presence.tsx`           | Activity indicator. Shows the selected agent while answering and still yields to workflow activity. No execution behavior change intended.                                                                                                                                                         |
| `tests/unit/microsina-foundry.test.ts`                                                      | New adapter/metadata coverage: request boundaries, missing configuration, token reuse, sanitized failure, actual SDK stream parsing and legacy chat restoration. No application behavior change intended.                                                                                          |
| `e2e/microsina-chat.spec.ts`                                                                | New isolated browser test for selection, headers, shared tools, persistence/restoration, locked selection and visible failure without fallback. All API/provider responses are synthetic. No application behavior change intended.                                                                 |
| `playwright.reliability.config.mjs`                                                         | Includes the new browser case in the reliability suite. No application behavior change intended.                                                                                                                                                                                                   |
| `tests/integration/workspace-access.test.mjs`                                               | Adds session, viewer and foreign-workspace denials for MicroSina, including path case/trailing-slash variants. No application behavior change intended.                                                                                                                                            |
| `docs/ARCHITECTURE.md`                                                                      | Adds the provider ownership and persistence seam. Documentation only; no behavior change intended.                                                                                                                                                                                                 |
| `docs/FUNCTIONALITY.md`                                                                     | Describes the second-agent option and its activation limits. Documentation only; no behavior change intended.                                                                                                                                                                                      |
| `docs/microsina-foundry/README.md`                                                          | Updates the prior Foundry experiment record with integration behavior, backend setup and outstanding live verification. Documentation only; no behavior change intended.                                                                                                                           |
| `docs/microsina-foundry/integration-report.md`                                              | This review record: scope, file meanings, evidence and limits. No behavior change intended.                                                                                                                                                                                                        |

## Existing work preserved

Git showed extensive uncommitted document, workflow and Mkoro work before this
task. In particular, `assistant-thread.tsx`, `use-session-tools.tsx`,
`docs/ARCHITECTURE.md` and `docs/FUNCTIONALITY.md` already contained changes.
Their prior changes were preserved; only the additions described above belong
to this integration. The Foundry instruction snapshot also existed from the
earlier setup step and was not modified. Other preexisting changed/untracked
files are outside this report's scope. No bulk staging or cleanup was performed.

## Checks actually run

- Pinned toolchain: Node 24.21.0 and pnpm 10.26.1; `pnpm run doctor` passed.
- `pnpm run verify` passed, including contracts, architecture, maintained-file
  formatting, application/test type checks, unit tests, Mkoro worker tests and
  workflow-core tests. An earlier attempt caught a stream-reader type mismatch
  in the new test, which was fixed without weakening the assertion.
- Focused Foundry tests: 5 passed. The initial stream fixture omitted the required
  completed status on its function-call event; the fixture was corrected and the
  original tool-call assertion passed.
- `pnpm run test:workflow-reliability --grep 'MicroSina selection'`: 1 passed,
  including the later failure-display and shared-tool assertions. Latest evidence:
  `test-results/phase2/04a727d1-ca5f9125-16fc-478a-b05d-b2b2bb7a72a5/report.json`.
- API production build passed.
- Frontend production build passed with task-shell `PORT=5000`, `BASE_PATH=/`
  and `NODE_ENV=production`, with external source-map uploads disabled. The first
  invocation lacked the required port/base variables. The successful build
  reported sourcemap, browser-externalization and large-chunk warnings; these
  were not suppressed or addressed with unrelated changes.
- Targeted new-file/document formatting, local documentation links and
  `git diff --check` passed. Baseline comparisons confirmed that preexisting
  edits in the overlapping files were preserved.
- The focused real permission integration test could not start: `spawn docker
ENOENT`. No database assertions ran and no shared database was substituted.

## Assumptions and limits

- Both agents reuse tools and approval flow, but the saved Foundry model is
  `gpt-5`; Sina's configured model may differ. Identical responses/decisions are
  not established. Live function round trips, approvals, document provenance and
  Goose delegation need a representative comparison after authentication.
- The current adapter supports Microsoft public-cloud project endpoints and
  client-secret OAuth. Browser login is not a server credential. No Azure
  application, secret or role assignment was created.
- Foundry's base instructions/model come from the explicitly configured version.
  Saving a new version in Foundry does not silently switch Inscope; update the
  version setting deliberately after testing. Existing chat metadata identifies
  the agent, not a permanent per-chat Foundry version.
- Workspace fiscal settings and extra operator instructions still apply to both
  agents. Full Agent Lab migration and model routing are outside this change.
- The server constrains model tools to Inscope functions. Native hosted Foundry
  tools are intentionally outside this integration's tool set. Request history
  uses `store: false`; this does not certify service-level retention policies.
- MicroSina is a distinct ID for agent-scoped approvals; Sina-specific reusable
  grants do not transfer. Server-derived account/workspace permissions still
  apply before either provider is invoked.
- Shared authenticated chat users can select MicroSina. No new administrator-only
  access policy was invented. The provider header grants no workspace authority.
- Existing product blueprint/navigation requirements remain accurate: agent
  selection lives inside Chat. Their intended behavior was not rewritten.
