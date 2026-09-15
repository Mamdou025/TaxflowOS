# User journeys and acceptance criteria

These are target acceptance scenarios, not claims of passing tests. Use synthetic
data and isolated workspaces. Refer to the [product requirements](product-spec.md)
and [pending decisions](decisions.md) before implementing a dependent behavior.

## J-1 — Ask a source-grounded question

An authorized user opens Chat, selects an agent and asks a question about available
sources. The context strip shows explicit selections. Additional retrieval follows
D-03. The user can inspect the evidence and return to the conversation.

- **J1-01:** Given an accessible synthetic document stating a project deadline,
  the answer identifies the stated date and links to the supporting document
  location and revision. An independently authored fixture defines the expected fact.
- **J1-02:** A source actually used appears in the answer's evidence/context
  details. Merely available sources are not presented as used evidence.
- **J1-03:** When sources are missing, conflicting, stale or unreadable, the answer
  explains the limitation and distinguishes an inference from a sourced fact.
- **J1-04:** A document in another workspace is not returned or disclosed without
  access. Source text instructing the agent to ignore policy does not authorize tools.
- **J1-05:** Opening a citation preserves the conversation and selected context.
  Returning from the detail restores usable keyboard focus.
- **J1-06:** With selected-only retrieval chosen in D-03, an unselected document
  cannot silently influence the answer. With broader retrieval chosen, authorized
  additional sources are visibly identified when used.

Owners: Agent, Knowledge, Sources, Workspace UI, Platform. Verification: source
and retrieval contract tests, real access integration tests, a browser citation
journey and an agent evaluation for groundedness/appropriate uncertainty.

## J-2 — Build a workflow through chat

The user describes a process. The agent resolves material ambiguities, proposes
a graph with identifiable blocks and source requirements, and opens it in the
builder. A draft is saved through the workflow application's rules.

- **J2-01:** A request to classify records and total a category produces a
  reviewable graph/configuration proposal with its required input fields.
- **J2-02:** Missing business rules or ambiguous output meaning are surfaced.
  Routine layout choices may use disclosed reversible defaults.
- **J2-03:** Saving and opening the proposal does not execute it or manufacture
  sample results. Sample inputs require an explicit user choice and labeling.
- **J2-04:** The graph can be edited directly; returning to Chat and reopening
  the builder preserves in-progress field content and the selected draft.
- **J2-05:** A validated save creates an identifiable saved version. The object
  linked by Chat is the same object found in Workflows.
- **J2-06:** An invalid binding or unsupported block produces a specific finding;
  the agent cannot bypass that finding by writing directly to storage.

Owners: Workflow, Agent, Workspace UI. Verification: proposal/command contracts,
graph validation tests and a browser chat-to-builder draft-preservation journey.

## J-3 — Modify an existing workflow safely

The user requests a change to a named workflow. The agent resolves its identity
and base revision, proposes the precise change and applies it under D-02.

- **J3-01:** If the name matches multiple workflows, resolve the intended object
  before mutation. A missing requested version does not select another version.
- **J3-02:** The proposal shows changed fields and its base revision. The effect
  on downstream validation/review is visible.
- **J3-03:** An authorized accepted patch changes the intended draft only. Saved
  historical versions and prior runs remain unchanged.
- **J3-04:** If another edit changes the base revision, applying the old proposal
  reports a conflict and preserves both the current draft and the proposed patch.
- **J3-05:** Without an applicable action grant, the agent does not apply the
  change. With a valid reusable grant, behavior follows that grant without a
  redundant confirmation solely because the actor is an agent.
- **J3-06:** Changing an input or rule invalidates the applicable previous review
  state. Saving or recalculating does not silently reapprove it.

Owners: Workflow, Agent, Platform. Verification: immutable version and concurrent
patch tests, permission integration tests, browser proposal review, agent tool-use
evaluation. D-02 must be resolved before selecting the default interaction.

## J-4 — Execute and inspect a workflow

The user asks Chat to run a workflow with selected data. The system identifies
the version and inputs, validates the request, starts the authorized run, and
shows a card linking to results in Workflows.

- **J4-01:** Missing/invalid records produce actionable field errors. An empty
  upload never selects samples. Missing workflow identity/version is resolved
  before execution, with no silent latest-version substitution.
- **J4-02:** As an independent calculation fixture, an explicitly configured
  Document Calculator that totals matching "Item" amounts and doubles the sum,
  given amounts 120 and 80, produces 400. This is an acceptance example, not a
  default formula imposed on all workflows.
- **J4-03:** The run identifies workflow version, relevant block/engine versions,
  initiator, input/source revisions and results. Evidence links resolve to the
  inputs actually used, including recorded live-data provenance where applicable.
- **J4-04:** Chat, Workflows run history and the individual workflow's runs open
  the same run ID and agree on its state. Merely opening any view never reruns it.
- **J4-05:** Completed calculation, required review and pending/failed server
  synchronization can be represented together without claiming approval or a
  durable server save.
- **J4-06:** Navigating to another page does not create a second execution.
  Request deduplication protects against duplicate submission after a lost response.
- **J4-07:** Browser-close behavior follows D-01. Durable mode must demonstrate
  continuation and reattachment to the same server run. Browser mode must disclose
  its lifecycle limits and never imply guaranteed continuation.

Owners: Workflow, Sources, Connectors, Agent, Workspace UI. Verification: direct
arithmetic, command/record contracts, API persistence, duplicate-request and
external-operation tests, browser run-link journey. J4-07 requires runtime-specific
integration verification; a frontend mock cannot establish durability.

## J-5 — Recover from a failure or conflict

The user encounters invalid data, an unavailable provider, a save conflict or
damaged local storage. Chat/detail views identify the problem and expose an
appropriate correction or recovery path.

- **J5-01:** A timeout, permission denial or invalid provider response produces a
  visible failure/unknown state and useful next action; no fabricated successful output.
- **J5-02:** Offline save failure preserves the local work and pending state. Edits
  made during an in-flight save remain dirty until actually saved.
- **J5-03:** A remote revision conflict prevents silent overwrite. Local export
  and an explicit recovery path remain available.
- **J5-04:** Unreadable local bytes remain recoverable; loading an empty fallback
  does not erase them. An intentional empty library is not resurrected from an
  older remote copy.
- **J5-05:** A retry creates a linked attempt, preserves the earlier failure and
  states which version/inputs it will use. External writes with uncertain outcomes
  are reconciled or deduplicated before retrying.
- **J5-06:** A cancel request distinguishes requested cancellation from confirmed
  cancellation and completed external effects. It does not claim automatic rollback.
- **J5-07:** A late response from an old workspace cannot update the active
  workspace's content or sync status. Switching workspace clears inaccessible
  conversation context before further retrieval or operations.

Owners: Workflow, Sources/Connectors, Platform, Workspace UI. Verification:
deterministic state/race tests, real conflict integration tests, failure adapters
and a browser recovery journey.

## Traceability and existing coverage leads

| Requirements     | Primary acceptance coverage                                              |
| ---------------- | ------------------------------------------------------------------------ |
| R-01, R-02, R-03 | Navigation sketch; J-1 through J-5 start from Chat; J4-04                |
| R-04             | J1-05, J2-04, J5-07                                                      |
| R-05, R-11       | Ownership/interface checks, J2-06, J3-03, J4-04; consumer contract tests |
| R-06             | J2-05, J3-03, J4-03, J5-05                                               |
| R-07             | J3-06, J4-05                                                             |
| R-08, R-12       | J1-02 through J1-04, J4-03; trusted connector boundary tests             |
| R-09             | J3-05; denied/granted operation integration tests                        |
| R-10             | J2-02, J2-03, J2-06, J3-01, J4-01                                        |
| R-13             | J-5; J4-06                                                               |
| R-14             | J2-05, J4-04; access/deletion cases from the navigation sketch           |

Existing coverage to extend rather than discard:

- [Workflow contract tests](../../tests/unit/workflow-contracts.test.ts): versions,
  restore validation and executable-template roundtrips.
- [Sync tests](../../tests/unit/workflow-sync.test.ts): concurrent edits, conflicts,
  offline retry, deletion and stale responses.
- [Calculation tests](../../tests/unit/workpaper-calculations.test.ts): independently
  specified arithmetic and missing-field cases.
- [Shared execution browser test](../../e2e/workflow-shared-execution.spec.ts):
  Build/Run consistency and preservation of original graph/configuration.
- [Reliability browser suite](../../e2e/workflow-reliability.spec.ts): uploads,
  input errors, execution and result presentation.

Current tests do not establish all proposed journeys. Each implementation task
must identify the exact acceptance criteria it satisfies and checks it actually ran.
