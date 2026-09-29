# Current functionality

This is the current capability guide. The product blueprint describes the target;
phase records preserve historical implementation and verification evidence.

## Workflow execution

The new-work catalog contains 15 templates: FAPI and 14 workpapers for scope,
tax-position summaries, data readiness, execution sequencing, ownership,
attribute ledgers, portfolio operations, T1134, surplus, T106, EIFEL, T2,
tax provisions and Part XIII. These require supplied records; their supported
scope is described below. Being executable does not imply a complete tax return
or an independently determined tax position.

Document Calculator and Employee Expense Reimbursement are retired from the
built-in catalog and Sina's suggestions. The builder no longer offers the Z,
Expanded Mapping or FAPI sample demos, or the retired Roulement starter. A fresh
builder opens blank; FAPI template choices open the executable calculation graph.
Existing personal workflows, saved versions, runs and backups remain available,
including copies originally made from retired templates. Internal calculation
fixtures remain for regression testing. Password-free guest access is unchanged.

Legacy FAPI, T1134 and Surplus chat links open their current workflow surfaces.
Their old sample worksheets and inline field shortcuts are no longer advertised;
use the shared run panel to supply records, adjust inputs and inspect results.
Source previews and worksheet explanations do not fill missing records with
sample figures. Explicit example runs remain labelled previews.

All 49 entries in `lib/workflow-executors/src/tools/registry.ts` are available to
both browser previews and durable server runs. This includes source tables and
pinned responses, mapping, rollups, calculation engines, workpapers, review gates,
protected values, fields and output packages. The keyword-classifier entry is a
compatibility alias. Unknown tools are rejected before a durable job is created.

Save and synchronize an immutable workflow version before starting a durable run.
The server continues that run after the browser closes; return to Workflows → Run
history to inspect it. Local previews require the tab to remain open. Successful
computation, human approval and server synchronization remain separate states.

## Supported scope

| Area         | Current behavior                                                    | Boundary                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sources      | Upload, extract, validate and save rows or connector responses      | Runs replay the saved inputs. Missing evidence is not replaced with examples. Explicit example mode remains available.                                            |
| Connectors   | Fetch and pin supported responses before execution                  | Live provider credentials and service availability are needed for acquisition. Running a saved version does not refresh its source.                               |
| Calculations | Deterministic rules, mapping, aggregation and explicit arithmetic   | Invalid or ambiguous formula operands fail; reference-only API blocks provide no invented numeric value.                                                          |
| Workpapers   | Validate supplied records, calculate figures and report differences | The preparer supplies applicability, rates and adjustments. The T2 bridge does not prepare or file a complete return.                                             |
| Outputs      | JSON, CSV, workbook specifications, PDF and evidence packages       | Workbook specifications are materialized for download by the browser. Taxprep/ONESOURCE handoffs are documented generic packages, not proprietary import formats. |
| Review       | Preserve review gates, warnings and source provenance               | A completed server run does not grant approval.                                                                                                                   |
| Agents       | Retrieve context and propose scoped workflow changes                | Proposal tools do not perform unapproved external writes. Provider-dependent behavior needs configured services.                                                  |
| Triggers     | Record manual, schedule or webhook context during an execution      | A schedule block is not a recurring scheduler; a webhook block does not provision an inbound endpoint.                                                            |

## Implementation and checks

Chat has one **Sina-led conversation**. Sina owns native platform tools, sources,
retrieval and workflows. It can delegate a structured external/local computer task
to a paired Goose companion when no native tool can do that step. The same chat
shows task progress, one-time permissions, Stop and optional refreshed desktop
screenshots. Computer settings retain the former Mkoro history and controls for
already active tasks. New direct Mkoro messages are no longer accepted.

Windows previews require the updated companion in the same interactive session
as Goose. They refresh roughly every two seconds while explicitly opened, are
view-only, and stay out of chat storage and model context. This is not live video
or remote keyboard/mouse control. Goose still needs its own configured CLI, model,
tools and account sessions. Local files are not automatically uploaded as Sources;
a finished model turn is not proof that a workflow succeeded. A generic local
browser/shell is not sandboxed by the delegation contract.
Read [Mkoro setup and limits](mkoro-connection.md) before a live test.

Agent Builder (`/api/agent-lab`) and live chat (`/api/copilotkit`) accept JSON
requests up to 4 MiB, including instructions, conversation history and documents.
Agent Builder checks the serialized UTF-8 body before sending any model column;
an oversized request leaves the draft and instructions intact. Retrieval mode
still uploads document text and counts toward this transport limit. Model context
limits are separate and provider-enforced; the displayed token count is only an
estimate, not a guarantee that a particular model can process the request.

After a successful access check, a temporary background verification failure
hides and disables the workspace without unmounting its editors or discarding
drafts. Retry or the next successful periodic check restores that same workspace.
Initial access remains gated; confirmed logout, denied access, membership removal,
and account/role changes still clear or reload the scoped UI as appropriate.

- Workflow commands and graph rules: `lib/workflow-core`.
- Shared deterministic executors: `lib/workflow-executors`; old editor import paths
  are compatibility exports with no second implementation.
- Durable API/queue: `artifacts/api-server/src/lib/workflow-runs`.
- Shared UI primitives: `artifacts/ai-workflow-builder/src/shared/ui`.
- Full shared UI and executor formatting is enforced. Legacy database and worksheet
  modules are included in frontend typechecking. Large feature editors remain debt.
- `test:unit` includes every executable template's browser/server result and
  provenance parity; `test:integration` uses disposable Postgres and real sessions.
- `test:production-ui` checks the built application's lazy chunks and navigation
  with synthetic API responses. It does not establish live-provider correctness.

See [verification commands](../TEST.md), [architecture](ARCHITECTURE.md), and
[cleanup and readiness evidence](readiness-2026-09-15.md).
