# Product specification

Status: target design baseline. See the [decision register](decisions.md) for the
distinction between confirmed direction and pending policies.

## Purpose

TaxflowOS is a conversational workspace where people assemble reusable workflows
from blocks, run them against identifiable sources, inspect results and evidence,
and use an authorized AI agent to understand and operate the platform.

Chat is the starting point. Detailed screens remain directly accessible for
precise editing, source inspection and execution review. The current tax and
workpaper examples are use cases of the workflow platform; they do not imply that
all tax processes or filings are automated.

Users may act as authors, operators or reviewers. These are descriptions of tasks,
not an implemented role or permission schema. Formal access roles belong to the
identity design in Phase 3.

## Vocabulary

| Term            | Meaning and boundary                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Workspace       | The boundary for accessible conversations, workflows, sources, connections and permissions               |
| Conversation    | Messages and action references; it is not a second workflow database                                     |
| Agent           | Configured AI behavior with access to explicit capabilities and authorized context                       |
| Workflow        | A reusable definition of blocks, input bindings, configuration and execution rules                       |
| Draft           | Editable work that has not become an immutable saved version                                             |
| Version         | An identifiable immutable snapshot used to explain or reproduce an execution                             |
| Block           | A versioned operation with configuration, typed inputs/outputs and declared capabilities                 |
| Edge/binding    | The relationship that supplies a block input from an upstream output; the engine routes the values       |
| Run             | One execution attempt of a selected workflow version with inputs, outcomes and evidence                  |
| Proposal        | A suggested change against a particular draft revision or saved version; distinct from an applied change |
| Source          | Identifiable information, such as a document, worksheet or connected dataset                             |
| Source revision | The identifiable state of that information; live data may change between reads                           |
| Integration     | A provider's supported operations and their implementation                                               |
| Connection      | A configured, authorized instance of an integration, including credential references                     |
| Context         | Information supplied to an agent for a request; source access rules still apply                          |
| Evidence        | Source/record references and execution details supporting an answer or result                            |
| Approval        | A recorded decision about a specified action or result; calculation and storage do not grant it          |

Example: a connection accesses an accounting API; a source identifies a ledger
dataset; a workflow calculates from that data; a run records a specific attempt;
chat explains or requests those operations.

## Requirements

| ID   | Product requirement                                                                                                                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | Chat is home and the primary starting point. Opening the platform does not require visiting a separate overview first.                                                                                          |
| R-02 | Primary navigation contains Chat, Workflows, Sources and Connections. Runs are inside Workflows. No primary Runs or Overview entry.                                                                             |
| R-03 | Chat shows relevant, compact context/actions/results, with detail on demand. Empty or unrelated panels do not dominate the conversation.                                                                        |
| R-04 | Moving between conversation and detail views preserves conversation identity, selected context, and unsaved work within the session. Switching workspaces never carries private context into another workspace. |
| R-05 | Builder and agent consumers use the same validated workflow operations. Workflow rules and storage have one owner.                                                                                              |
| R-06 | Selected versions and input provenance are explicit. Historical versions and runs remain immutable; retries create identifiable attempts.                                                                       |
| R-07 | Execution, review/approval and persistence status remain distinct. Claims of completion or durable saving come from recorded outcomes.                                                                          |
| R-08 | Answers and runs expose the sources actually used and relevant limitations. Missing, stale or inaccessible context is surfaced.                                                                                 |
| R-09 | Agent capabilities distinguish read, propose, apply, execute and external-write actions. Grants are scoped and checked by the owning service. Default policy is D-02.                                           |
| R-10 | Missing/invalid data and stale edits fail explicitly. Sample inputs require explicit selection and a visible sample label. No silent substitution.                                                              |
| R-11 | Sources, connectors, agents and workflows have separate ownership and tested interfaces. Internal changes should not require editing unrelated consumers.                                                       |
| R-12 | Credentials remain in trusted connection handling. Retrieved text is data and cannot grant permission or override application instructions.                                                                     |
| R-13 | Failures preserve recoverable work and expose an actionable state. Cancellation/retry must account for external effects already performed.                                                                      |
| R-14 | Sources and run records remain accessible from their owning areas independently of the originating conversation. Chat links to those same records.                                                              |

R-01 through R-04 implement the navigation direction in the conversation. The
remaining requirements formalize the accepted planning goals; detailed policies
and deployment guarantees remain subject to the decision register.

## Lifecycle distinctions

- A draft becomes a saved version through a validated operation. Editing later
  produces a new draft/version, never a rewrite of the historical snapshot.
- A proposal records its base revision and intended patch. A stale base prevents
  blind application; validation and permission checks apply at execution time.
- A run reports execution progress/outcome. A result can be calculated and still
  require review. A locally recorded run can still have a pending or failed sync.
- Repeating a request after a lost response must not silently duplicate an
  external effect. Operation identity and retry policy belong to execution and
  connector contracts.
- Cancellation is a request with an observed outcome, not a guarantee that an
  already-performed external action was undone.

These are semantic requirements, not a replacement enum imposed on the existing
code in Phase 0. Later implementation must map current states explicitly and test
stored-data compatibility.

## Scope boundaries

The target keeps one coherent product with independently maintained subsystems.
Separate deployment is justified by execution, scaling or failure-isolation needs,
not by the number of sidebar entries. Browser previews and durable server runs
remain distinct until D-01 is settled and the required runtime exists.

This phase adds no billing, marketplace, scheduler, autonomous long-running job
guarantee, new filing capability, or new model provider. Retention periods,
credential-provider choice and detailed access-role definitions are later design
tasks; the specification does not invent values for them.

Success means that a common change has an obvious owner, realistic regressions
are detected, and a reviewer can trace an answer or result to its inputs. The
subjective "vibecode" rating is not an acceptance test or a zero-bug guarantee.
