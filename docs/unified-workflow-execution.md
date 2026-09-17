# Shared interactive workflow execution

Chat, the Workflows Run tab and `/run/:workflowId` render the same
`WorkflowSessionPanel`. The panel reads the actual saved Build graph, rather than
the older template-specific calculation loop. The application commands in
`lib/workflow-core/src/application/sessions.ts` own transitions and dependency
rules. Browser adapters inject the existing tool registry.

## User journey

- Starting a guided run freezes a saved version. Opening an existing run resumes
  its identity and evidence, without executing it. Build edits do not alter it.
- Resume executes ready blocks using actual recorded predecessor results. The
  browser yields between blocks; Pause takes effect before the next block.
- Errors, unavailable tools and review checkpoints stop advancement. Reading or
  asking a question does not change execution state.
- Each block exposes its real input and output. A block can be rerun using the
  same executor. Dependent results become outdated, and approval is cleared.
- Source replacement/addition targets an explicit document source block. Previous
  attachments and execution attempts remain available. Row IDs are namespaced by
  attachment so adding documents cannot merge unrelated records accidentally.
- Approval is explicit and records a result revision in existing run history.
  A subsequent change leaves the historical record intact.

Chat receives a structured summary with exact workflow/run/version/revision IDs,
steps, dependencies, source identities and statuses. `inspectWorkflowBlock` reads
actual results. `controlWorkflowRun` proposes block execution, resume or source
changes under a one-time execution grant and rejects a changed run revision.
Pausing is immediate. Changing mapping rules still requires editing Build through
the existing draft/version authorization flow and starting a new version.

## Persistence and runtime boundaries

Sessions are an optional additive field in the existing workflow library contract.
Older backups remain readable. Current workspace storage and revision conflict
handling also cover guided sessions; server persistence is reported by the
existing workspace save status, never inferred from calculation completion.

Interactive advancement runs in the browser. Closing it stops advancement; saved
progress can be reopened and explicitly resumed. This does not replace the
existing server-managed background execution path. That path continues to run an
immutable version on the server and retains its existing controls in Run.

The earlier browser run-flow cache is not silently imported as a saved execution.
Previously attached workspace sources can be selected explicitly. There is no
sample-data fallback.

## Verification

Core tests cover frozen versions, exact dependency inputs, source history,
downstream invalidation, revision conflicts, checkpoint gating, unavailable tools
and backup roundtrips. Browser cases cover Run/Chat continuity, recomputation after
adding a source, approval and reload, as well as Build preview compatibility.
Workspace integration coverage includes saving and restoring guided session state
with stale-write rejection. These tests do not verify a live model's tool selection.

After building the frontend, `pnpm exec node tests/smoke/workflow-session-ui.mjs`
checks the production bundle with synthetic Excel files: Run → Chat, added-source
recomputation, explicit approval and reloading the same run. Its API writes are
isolated mocks; the workspace integration case covers the real storage API.
