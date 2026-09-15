# Current functionality

This is the current capability guide. The product blueprint describes the target;
phase records preserve historical implementation and verification evidence.

## Workflow execution

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
