# Current functionality

This is the current capability guide. The product blueprint describes the target;
phase records preserve historical implementation and verification evidence.

## Chat workspace

The chat frontend now uses assistant-ui for its conversation, streaming Markdown,
scroll-to-latest control, message copying, composer draft and pending attachments.
It keeps the InScope appearance, Scope controls, focus/docked modes, Sina/MicroSina
selection, Computer controls and the Chat, Workflows, Sources and Connections
navigation. Saved conversations still use the application's existing backend.
The model connection, readable context, tool execution and approval rules remain
with the existing CopilotKit/application adapters.

Stop remains available during a reply even when a follow-up is being drafted.
Sending that follow-up stops the current reply before continuing the conversation.
For a failed text reply, **Retry reply** resends the existing user turn without
adding another user message. Retry is unavailable once that failed turn has called
a tool, so it cannot silently repeat a workflow change or computer action. Earlier
completed tool results remain in the conversation.

An active workflow remains a shared, editable session in the conversation at its
opening message. Later replies reuse that card and its existing forms. The FAPI
stages, prescribed worksheet, result provenance and calculation commands described
below remain owned by Workflows; assistant-ui renders their existing components.
Selecting a saved conversation restores its recorded workflow/run binding.
The normal chat shell remains visible while it opens, with sending and Scope
changes disabled until restoration is resolved. A bounded navigation attempt
reports failure with Retry and New chat actions instead of waiting indefinitely.
Retry targets the requested conversation, including when a different chat was
previously active. An unsettled old agent run is not bypassed to start fresh.

One centered, orb-led **Scope** menu shows this chat's company/year labels,
selected workflow and unique selected-source count. An empty selection is
**General chat**. The same panel edits labels, adds/removes sources and shows
loading, unavailable and local-only states. It distinguishes an active saved run
from a draft reference; earlier work and evidence are expandable history, not new
selections. The separate Context button and repeated context strip are removed.
Chat and Sources both support adding text; a saved document can be added with
**Use in this chat**.
Selections restore with the conversation and are cleared for a new chat. Selecting
a company does not load a company dataset or unrelated documents. Changed source
revisions require deliberate reselection. Local workbook attachments require their
browser cache; missing data is reported instead of replaced with sample content.

Workflow discovery displays clickable names in chat, with saved-version or draft
status and dates. A name query prefers exact full-name matches over similar names;
duplicates remain separate choices. Choosing a saved card opens the version shown
on that card through the existing workflow commands, while a draft choice opens
Build without saving or calculating. Missing workflows or versions produce an
error rather than selecting a substitute. Both Sina and MicroSina receive the same
host guidance for names, choices and the predefined workflow worksheet; internal
IDs are tool arguments, not required user input.
Template selection starts a fresh instance independently of saved copies. Existing
saved runs have explicit Resume actions. Clicks produce a saved application
acknowledgment and supply the exact selection to the next model request. Listing,
opening and resuming do not by themselves calculate or approve a workflow.

File selection and removal use assistant-ui's pending attachment list. Send hands
the actual files to the existing workbook/document import flow, including mapping,
validation and source selection. Cancelling an import retains the unsent draft.
Connecting/unavailable notices leave the workspace usable. File preparation and
workflow controls remain available when chat cannot connect; sending to the model
requires an available agent. An unavailable reply preserves the message and files
for another attempt and displays the actual import status separately.
Image-shaped message parts can be projected for display, but this migration does
not establish a complete image upload, model-delivery and saved-history round trip.
The existing OpenUI-backed `generateUI` capability remains in place while its
future replacement is considered. See [migration scope and verification](assistant-ui-migration.md).
Its renderer is loaded on demand. The integrated context, workflow details and
loading changes are recorded in [chat/workflow integration](chat-workflow-integration.md).

## ChatGPT plugin development

The current code adds an [editable workflow workspace](chatgpt-workspace-editing.md)
with Workflow, Inputs, Sources and Changes tabs in the same embedded panel.
Owner/Editor users with separately granted write access can start a paused working
run, upload and capture an Excel/JSON/PDF/Word source, review exact input/source
changes and apply them. Apply preserves the conversation and run identity and
marks only affected results outdated. Recalculation is a separate action requiring
execute access; it stops at missing inputs, unsupported tools and review gates.
Saved versions, earlier attachments and execution attempts remain intact. Read-only
grants retain read-only access. This code expansion has its own verification and
rollout record; the live evidence below describes the earlier installed reader.

The [ChatGPT development pilot](chatgpt-plugin.md) lists server-saved workflows
and inspects exact versions/runs with a separately built recorded-workflow viewer.
Optional [OAuth account linking](chatgpt-account-linking.md) reuses InScope sign-in,
explicitly shares one workspace, and supports expiry and revocation in Connections.
It requires configured client/callback settings and an account allowlist; it is
disabled otherwise. As of 2026-10-08, the isolated synthetic pilot has verified
live account linking, saved-workflow reads, embedded viewer rendering,
selected-block context in native chat and expansion beside chat in the same tab
in ChatGPT Work. The explanation button, denial after revocation and fresh access
after reconnect also passed. This private pilot is ready within that tested
read-only scope; the temporary runtime limits are documented in the pilot guide.
After the metadata refresh, a fresh Work check correctly described the viewer and
confirmed the empty recorded-run history. Those earlier tools exposed no editing,
execution, approval, source search or computer control; the current editing
expansion is described above and requires its separate consent.

The installed pilot update separates explicit presentation (`open_workflow_view`)
from data-only version/run reads, so an explanation can fetch selected-block
configuration without opening another widget. The embedded viewer's step overview
and expansion belong to the component, not a fixed native ChatGPT header. The
plugin skill supplies concise, evidence-based guidance; it does not automatically
invoke the main application's Sina or Foundry MicroSina agent. ChatGPT attachments
are not automatically ingested into InScope. The prior exported pilot package
contained no skill; version 1.0.2 includes it. A fresh Work chat verified skill
activation, one default steps viewer, exact selected-block explanations without
another viewer, expansion beside chat and in-place refresh. No live run was
executed; recorded progress states were checked with synthetic browser fixtures.
See the pilot guide for the separate verification record, instruction ownership
and the saved FAPI line A expression-precedence diagnostic.

## API sources

API Source supports named number, text, boolean and JSON outputs selected from a
saved response, alongside the existing table-row mode. The next step receives
`namedValues`; numbers may be averaged with an explicit mapping. Requests and
mappings are checked against the saved response before replay. Missing values and
invalid types fail visibly. FAPI now uses one API Source named Bank of Canada FX
Rate, with its existing explicit override precedence. Older drafts can use
**Upgrade FAPI API source**; saved versions and runs are not rewritten.
See [API source behavior and implementation](api-sources.md). SQL and document
sources are unchanged.

## Workflow execution

FAPI uses the DevReplit reference presentation: four colored, animated stages
(Collect, Classify, Compute, Review), live session input forms, and a prescribed
worksheet with the source-currency/CAD summary and supporting lines. Chat, Run and
Results read the same exact session or selected historical snapshot. Folding stages
preserves edits; applying inputs uses the existing recalculation commands. Missing
and outdated amounts are explicit, and CSV export identifies the recorded revision.
Chat discovery offers one FAPI workflow instead of separate Build/source/output/page
choices. Other workflow types and saved personal copies remain intact. Details and
verification limits are in [FAPI reference restoration](fapi-reference-restoration.md).

Calculation formulas now expose their required numeric variables. In Build, each
variable can use an entered value or an exact field from a connected source. A
conversion such as `amount * exchangeRate` uses the ordinary calculation engine;
it needs no dedicated conversion block. Shared Chat/Run forms at the Trigger are
generated from the formulas, including variables without a configured input
definition. Each field retains the workflow's provider or explicitly uses an entered
number or a directly connected source for this run. Missing values hold back the
calculation, zero is valid, and source collection can proceed. Saved definitions,
required source steps and review checkpoints remain unchanged by provider choices.
This increment supports required finite numbers and descriptive units, not arbitrary
Trigger constraints, automatic currency/period validation or AI mapping decisions.
See [calculation variables and readiness](calculation-variables.md).

A Field can now declare a worksheet of labelled results from directly connected
calculators. Its main lines appear in Chat and Run before the Field executes,
including when the Field is at the end of the graph. Expanding a line shows the
formula, supporting values, earlier calculations and available source evidence.
Optional display settings select prominent primary results, nearby summary rows
and collapsed groups of supporting details. Labels, descriptions, units and
decimal formatting do not change the recorded numbers or formulas. Missing input
guidance points back to the existing calculation forms; result availability is
separate from approval and completion of the workflow.
Missing and outdated values remain distinct from zero. The worksheet can open the
same input forms used at Trigger; edits to the same calculator share an unapplied
draft within the session panel. Field does not calculate, choose missing values or
convert units. Existing Fields without worksheet declarations keep their viewer.
See [Field worksheet behavior](field-worksheet.md).

Workflow storage can replace the selected personal workflow from a backup that
contains exactly one workflow. It preserves the target identity, existing runs and
versions, saves an unsaved draft as a version if needed, then creates the replacement
version. The action rejects a changed target draft; opening the file alone does not
replace it. Server saving and existing-run execution remain separate states.

The new-work catalog contains 15 templates: FAPI and 14 workpapers for scope,
tax-position summaries, data readiness, execution sequencing, ownership,
attribute ledgers, portfolio operations, T1134, surplus, T106, EIFEL, T2,
tax provisions and Part XIII. These require supplied records; their supported
scope is described below. Being executable does not imply a complete tax return
or an independently determined tax position.

Workflow browsing now lives inside the Workflows page. Its local navigation holds
Library, Run history, New workflow and backup/saving controls, followed by Saved
workflows and Templates. Saved entries and templates use the same row layout;
template categories retain their existing meanings. The list can be hidden to
give the editor more room and stacks above the detail in narrow page panels.
Recent conversations no longer have a workflow list beneath them. This changes
presentation only: workflow identities, versions, runs, permissions and storage
commands remain unchanged. See [the change record](workflow-page-navigation.md).
On phones, an open page uses the available width; Chat stays mounted and is
reachable through the Chat action. Workflow header controls scroll when needed.

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

Chat displays its linked guided workflow directly after its opening tool receipt in the conversation, with the
shared source inputs and execution controls. Saved conversations retain the exact workflow/run reference, even
when started through the workflow UI before sending a message. Reopening does
not execute steps or select a newer run. Missing linked runs are reported, and
legacy chats without a link do not infer one. The inline card uses one colored
step accordion (four grouped stages for compatible FAPI workflows): each step expands its real form or recorded details underneath,
and folding preserves unapplied field edits. Opening a step stays in Chat and does
not execute it. Applying values recalculates this
work only, retaining completed calculations in Runs history. Sina proposes edits
for explicit review. Required document/scalar/rate inputs gate guided execution;
this is not a general company-information readiness assessment. Chat can interrupt
an assistant reply to send a follow-up, and End stops further workflow steps.
The Work menu holds the linked workflow/status and exact-run navigation. Agent and
computer controls share the composer; computer status reflects the existing
connection. Sina and MicroSina can handle successive replies in the same saved chat;
earlier replies and approvals retain their originating agent. Verification reuses the
normal Build canvas and bloc workspace in read-only recorded-run mode. These
surfaces share form components and workflow commands, not separate calculation rules.
See [shared execution](unified-workflow-execution.md).

Guided runs capture PDF page text, DOCX paragraph text and selected Excel/JSON
records with source revisions and content hashes. Chat and Build expose the same
recorded evidence, and Sina can inspect exact document locations. Parser blocks
reject missing/incompatible evidence; PDF table interpretation remains unavailable.
Original-file storage failures are explicit. See
[document evidence boundaries](unified-workflow-execution.md#captured-document-evidence).

Sina can propose document interpretation notes containing company/period/currency
observations, source quotations and open questions. Users explicitly save notes
to a paused run; stale proposals fail. These notes remain proposed interpretations
and do not set calculation inputs or approve tax treatment. See
[document interpretation notes](unified-workflow-execution.md#document-interpretation-notes).

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

Chat has one conversation with **Sina by default**, or **MicroSina through Foundry**.
The composer selects the agent for the next reply after the current reply/tool turn
settles. Switching preserves the chat, workflow, sources, prior message authorship
and pending actions. Saved chats retain the next selected agent separately from
each reply's author; legacy chats retain their original provider, defaulting to Sina
when no provider metadata was saved. MicroSina requires backend Azure authentication and an
explicit saved Foundry version. Connection failures do not fall back to Sina.
Both agents use the same tool and review surfaces; agent-specific permissions
remain separate. Local integration checks do not establish live model parity.
See [MicroSina setup and verification](microsina-foundry/README.md).

Sina owns native platform tools, sources,
retrieval and workflows. It can delegate a structured external/local computer task
to a paired Goose companion when no native tool can do that step. The same chat
shows task progress, one-time permissions, Stop and optional refreshed desktop
screenshots. Computer settings retain the former Mkoro history and controls for
already active tasks. New direct Mkoro messages are no longer accepted.
Settings explain which computer runs Goose, distinguish connection from delegation
readiness, confirm access revocation, and reconnect an existing offline or revoked
connection while preserving its ID and history. Reconnection rotates its credential
and resets automatic approval; active tasks must finish or confirm cancellation first.
The composer omits revoked registrations. Settings retain their IDs and timestamps
for review; existing same-name duplicates are never automatically merged or revoked.
Each personal computer also has an optional saved automatic-approval setting for
Mkoro tool requests, including pending ones. Server decisions remain one-action,
auditable and subject to Stop and current access; permanent Goose grants are not used.
The desktop viewer gives setup guidance when no screenshot arrives. A local
capture diagnostic in the updated companion bundle does not save or upload pixels.

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

Opening the application immediately shows the branded chat shell while the initial
session and workspace checks run, replacing the full-screen “Checking access” text.
The shell contains no saved chats, company names or other private data. Its navigation,
composer, Agent/Computer and Scope controls become available in the verified workspace;
they remain disabled during connection. Signed-out visitors still receive sign-in
and Try demo, and startup failures still offer retry. No demo is created automatically.

After a successful access check, a temporary background verification failure
hides and disables the workspace without unmounting its editors or discarding
drafts. A timeout, network failure or service error triggers one prompt recovery
check; manual Retry and periodic checks remain available. A successful session and
membership check restores that same workspace, including replies completed while
it was hidden.
Initial access to workspace data remains gated; confirmed logout, denied access,
membership removal, and account/role changes still clear or reload the scoped UI
as appropriate.

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
