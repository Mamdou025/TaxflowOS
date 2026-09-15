# Phase 7 — Chat-first workspace composition

Phase 7 composes the product areas delivered in earlier phases into the intended
workspace navigation. Chat is the home surface. The primary sidebar contains Chat,
Workflows, Sources and Connections; Settings and Help remain utilities below the
conversation list. Runs are a Workflows concern and agents are managed from Chat.

This phase implements the workspace behavior in R-01 through R-04, R-06 through
R-08 and R-14. It adds navigation and read models around existing owners; it does
not move workflow, source, connector or agent rules into the workspace shell.

## Workspace composition

The Chat home presents three primary actions: ask about sources, build a workflow
and run a workflow. It can show one relevant continuation or attention item when
real unfinished work exists and hides the row when none exists. The selected agent
is visible in Chat and its management surface opens beside the conversation.

Opening Workflows, Sources, Connections, Help or agent management retains the Chat
workspace and opens the detail surface beside it. Returning to Chat restores the
full conversation surface. Recent conversations remain available in the primary
sidebar. The old Documents label and top navigation are no longer used for the
source library.

The context control reports selected and used counts separately. Its drawer keeps
explicitly attached or library-selected sources distinct from documents and web
pages recorded as retrieval evidence. Loading failures are shown as failures rather
than as an empty source library.

## Product-area ownership

| Surface     | Composition responsibility                                     | Owning behavior                                                                    |
| ----------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Chat        | Conversation, agent entry, context, actions and linked results | Agent operations remain in `lib/agent-runtime` and the assistant adapters          |
| Workflows   | Library, templates, editor, versions, runs and results         | Definitions, validation, versions and execution records remain in workflow modules |
| Sources     | Uploads, processing state, selection and source inspection     | Lifecycle and retrieval contracts remain in source modules                         |
| Connections | Configured integrations, health and connection actions         | Connector definitions and server authorization remain in connector/platform owners |

Connections reuse the existing integration endpoints and respect workspace roles.
Viewers can inspect configured connections, while mutation and connection tests are
available only to roles allowed to change the workspace. Failed reads expose a
retryable error instead of a false empty state.

## Workflow run identity

`lib/workflow-core/src/application/queries.ts` supplies the portable cross-workflow
run-history projection. It flattens saved executions, retains exact workflow and run
IDs, and orders them newest first without React or browser dependencies.

Run history is nested under Workflows. Each row identifies the workflow, version,
initiating surface, time, status and exact run ID. Opening a row selects that saved
execution and never starts a new execution. Chat result cards link to the same run
with `/w/:workflowId?run=:runId`; if the requested execution no longer exists, the
result view reports that condition instead of substituting the latest run. A new
execution explicitly selects the new record.

Action cards describe execution state, required review and persistence separately.
A successful calculation therefore does not imply approval or durable server sync.

## Routes and compatibility

`/sources`, `/connections` and `/workflows/runs` open the corresponding detail in
the Chat workspace, then normalize the browser location to `/`. Existing workflow
links continue to use `/w/:workflowId`, with an optional exact run query. The legacy
`/documents` route remains a compatibility adapter to Sources so saved links do not
return to the retired navigation.

## Acceptance evidence and limits

The Phase 7 browser case verifies the four primary items, Chat as the active home,
the three launch actions, agent management access, the context control, Sources,
Connections, nested run history, Help and Settings. It also checks that direct
Sources, Connections and history URLs use the same workspace shell. The portable
workflow-core test verifies cross-workflow ordering and exact run identity.

These checks strengthen J1-02, J2-04, J2-05, J4-04 and J4-05. Earlier focused suites
remain responsible for retrieval provenance, workflow execution, proposal safety,
workspace access, source lifecycle and persistence behavior. Browser-hosted runs
still have the lifecycle stated in D-01; Phase 7 does not claim durable continuation
after the browser closes. Live model and provider behavior remains outside the
isolated browser suite.

## Local verification

The final Phase 7 tree passes `pnpm run verify`, including architecture and type
checks, 40 unit tests and 12 workflow-core tests. The full reliability suite passed
all 19 browser cases, including both Phase 7 navigation cases. After the final
persistence label was added, the six affected workflow reliability cases passed
again. The frontend production build then passed with its required `PORT` and
`BASE_PATH` environment values. It retains the existing source-map,
browser-externalization and large-chunk warnings.
