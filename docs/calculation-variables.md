# Calculation variables and Trigger readiness

Calculation inputs are independent of a specific document, API or tax workflow.
Formula requirements now generate the missing-input form at the Trigger, retaining
source alternatives, labels, descriptive units and current readiness.

## Current behavior

- Write a formula such as `amount * exchangeRate`, or insert a named variable in
  the calculation editor before connecting a source. Formula results are excluded
  from the external input list, so intermediate calculations do not become form fields.
- For each numeric variable, choose an entered value, a connected value with the
  same name, or an exact connected block and output path. Label and unit are optional.
- API Source's declared numeric outputs appear as selectable fields before a
  fetch. Execution still requires the actual captured source value.
- Explicit manual and source bindings are authoritative. If the selected value
  is missing or invalid, another value with the same name or a default cannot
  silently replace it. Zero remains valid; blank is missing.
- Chat and Run render the same generated form at the Trigger, grouped by calculation.
  A formula such as `amount * exchangeRate` generates both fields even without
  `inputDefinitions`. Workflows without a Trigger show the form at the calculator.
  Resolved fields retain their value and provider; missing fields explain what is
  needed. Stale or failed source results do not satisfy a requirement.
- Each field offers the saved workflow setting, an entered number for this run,
  or an exact field from a direct connected source. Declared API outputs can be
  selected before capture; only actual current values satisfy the requirement.
  Selecting a provider does not automatically fill or infer a missing value.
- Sources can collect data while calculation fields are incomplete. The shared
  session stops before executing a calculation missing required values. Trigger,
  session readiness and calculation execution use shared requirement resolution;
  the form does not store a second set of variable definitions.
- Applying values or provider choices updates this run only, invalidates dependent
  results and approval, and retains the saved version and historical evidence.
  Runtime patches cannot change formulas, saved bindings or graph connections.
  Source changes require review of affected unapplied edits before applying them.

Provider alternatives do not skip graph-required source steps or review checkpoints.
For a form-only workflow, configure a calculation without those source dependencies.
Conditional source-step execution is outside this increment.

The first constraints are required, finite numbers. Units are descriptive metadata;
they do not validate dimensions or convert currencies. Existing legacy advisory
Trigger conditions remain advisory. General workflow fields, custom min/max rules,
currency/period checks, reviewed AI mapping suggestions, and SQL/document source
generalization remain follow-up work. No new tax or accounting rules are supplied.
The PNL workbook and the user's saved FAPI workflow are not changed or certified by
these synthetic calculation checks.

## Configuration and compatibility

`inputDefinitions` is an optional array on the calculation block. Each entry has
`name`, optional `label`/`unit`, `type: 'number'`, and an optional binding:
`{ kind: 'manual' }` or `{ kind: 'source', blockId, path: string[] }`.
`inputValues` holds the finite numbers for manual definitions. A runtime patch
replaces the entire map, so the form preserves other manual values when editing
one field; removing a key makes that field missing. Existing saved manual values
and connected/default precedence remain compatible.

Guided runs use an optional `inputChoices` map keyed by inferred external variable
name. An entry is `{ kind: 'manual', value?: number }` or
`{ kind: 'source', blockId, path: string[] }`. Missing entries retain the workflow's
setting. An explicit blank manual choice remains missing rather than falling back;
removing a choice restores the saved provider. A patch replaces the entire map.
Commands reject unknown variables, nonfinite numbers, unsafe paths and source
blocks without a direct active connection. The choices belong to the calculation's
session overrides, so two calculations can use the same variable name independently.

Refreshing an external rulebook keeps the run readable. Its last successful rule
structure may describe fields during refresh or failure; it never supplies stale
numeric values or satisfies the source dependency. If a new rulebook retires a
variable, the form lists the obsolete choice and removes it only on deliberate
Apply. Earlier choices and results remain in execution history. Fresh edits still
reject names outside the current requirements.

Formula dependencies come from the same parser used by execution. The calculation
mode still chooses inline or connected rules. Bindings remain on the calculation
block even when formulas belong to an external rulebook. Source paths resolve
against direct upstream output records, preserving block identity. Existing
unbound named-value/default precedence remains compatible; ambiguous legacy bare
names are not redesigned by this increment. Choosing an explicit field avoids
depending on that implicit merge behavior.

Known legacy boundary: an empty or invalid Calculation Rules Source still uses
its old sample-rule fallback. Before source execution the form projects configured
rules; after execution it follows the actual current rulebook output, including
that legacy fallback if the source emitted it. Configure real rules before using
an external rulebook. Changing that legacy source policy is outside this increment.
Build source-value previews are labelled as last-run values; rerun after editing a
source. The session form uses current run evidence.

## Field worksheet integration

The [Field worksheet](field-worksheet.md) is another view of these requirements,
not another calculation or input schema. Declared lines reference calculator
result keys and can be inspected before those calculators execute. Supporting
inputs use the same effective formulas, bindings and freshness rules as Trigger.
Linked earlier calculator results can expand into their own formulas and inputs.

Opening **Edit inputs** in the worksheet reuses `SessionInputForms`, including the
saved provider, run-only manual value and exact connected source alternatives.
Trigger and worksheet forms share transient draft, busy and error state for each
calculator inside the session panel. Closing a worksheet input section does not
discard that draft. Apply still invokes the existing revision-checked command;
the worksheet projection updates from applied session state, not unsaved edits.
Forms in one panel reuse prepared requirements and source choices from that
session revision. The cache remains scoped to the panel and to each calculator;
input/source changes rebuild it, including same-value source refreshes. This does
not change value precedence, source eligibility or command revision checks.
The source-change review guard also remains in effect for these shared drafts.

When more than 100 connected fields are available, **Browse connected fields**
opens one searchable picker with 50 results per page instead of mounting the
entire source list for every variable. All fields remain available. Small lists,
the selected provider, unavailable selections and manual/default behavior remain
unchanged. This keeps workbook and API evidence from overwhelming the form.

Field labels and units are presentation metadata. They do not create formula
variables, perform arithmetic or select a currency conversion. No new source,
review or approval bypass is introduced. Build remains responsible for changing
formula definitions and worksheet declarations; existing runs retain their version.

`calculation_summary.inputRequirements` records each requirement's name, metadata,
binding, status, origin and value when available. Numeric strings in source outputs
retain the existing numeric-field coercion; manual entries must be actual numbers.
Persisted block configuration is already extensible, so no database migration or
saved-version rewrite is needed.

## First increment: change inventory and verification

Earlier uncommitted API-source changes were present before this increment and are
preserved. Only the new variable/session/checklist additions are claimed here.

Paths below are relative to the repository. This historical inventory describes
the first increment; the requirements-generated form increment is recorded below.
Each row states the purpose and before/after behavior at that checkpoint.

| File                                                                                                            | Purpose and change                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/domain/calculation-inputs.ts`                                                       | New optional numeric input definitions, bindings and requirement status types; previous configs had no explicit input contract.                                                       |
| `lib/workflow-core/src/core/formula-references.ts`                                                              | Moves the existing formula tokenizer/reference collector into the portable owner for reuse. No parser behavior change intended.                                                       |
| `lib/workflow-core/src/core/calculation-inputs.ts`                                                              | New formula dependency inference; internal result names are excluded from required external fields.                                                                                   |
| `lib/workflow-core/package.json`                                                                                | Exports the shared parser and inference modules. No independent end-user behavior change intended.                                                                                    |
| `lib/workflow-executors/src/calculation-inputs.ts`                                                              | New shared value resolution and readiness projection; explicit bindings reject missing/invalid values instead of falling back to another supplier.                                    |
| `lib/workflow-executors/src/execution/blocks/logic/calculation-engine/run.ts`                                   | Calls the shared resolver and records requirements on success/error; entered values can drive calculations without source blocks.                                                     |
| `lib/workflow-core/src/application/calculation-session-inputs.ts`                                               | New manual-input allowlist and effective-formula readiness helper. Numeric run edits cannot change bindings or formulas.                                                              |
| `lib/workflow-core/src/application/session-inputs.ts`                                                           | Previously accepted source data only; now accepts declared manual calculation values. Prior API override allowlist additions remain intact.                                           |
| `lib/workflow-core/src/application/sessions.ts`                                                                 | Calculation readiness now checks its manual dependencies; source execution can proceed before those fields are complete. Existing history/invalidation commands remain authoritative. |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-variable-model.ts`    | New effective-rule and source-field projection; recognizes declared numeric API outputs before execution.                                                                             |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-variable-insert.tsx`  | New variable insertion control; users can reference an input before attaching its source.                                                                                             |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-variable-panel.tsx`   | New required-variable editor for labels, descriptive units, manual values and exact connected fields.                                                                                 |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx`    | Mounts variable insertion and requirements in the full formula editor; source/rulebook ownership remains separate.                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx`     | Adds the same variable controls to the compact calculation editor.                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx` | Passes the calculation owner separately when editing an external rulebook; bindings stay on the engine.                                                                               |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-source-picker.tsx`    | Reuses available declared fields so API outputs can be selected before a captured value exists.                                                                                       |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/available-calculation-values.ts`  | Includes declared numeric API names in available references; no invented preview values.                                                                                              |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-calculation-inputs.tsx`                       | New number form for runtime manual fields; blank removes the value and zero remains explicit.                                                                                         |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-forms.tsx`                              | Selects calculation forms alongside source forms while reusing Apply, revision and stale-draft checks.                                                                                |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store.ts`                            | Automatic execution skips calculations waiting for manual data, allowing ready source collection first.                                                                               |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs-model.ts`                    | New live checklist projection from effective rules and current connected results; excludes stale/failed results.                                                                      |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs.tsx`                         | New Trigger checklist grouped by calculation, showing labels, numeric constraints, suppliers and current statuses. It does not mount duplicate editing forms.                         |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`                           | Displays the checklist inside the Trigger step in both Chat and Run.                                                                                                                  |
| `tests/core/calculation-session-inputs.test.ts`                                                                 | New run-boundary, source-collection, zero, missing-field, external-rule and immutable-history checks. No product behavior change intended.                                            |
| `tests/unit/calculation-inputs.test.ts`                                                                         | New manual/API resolution, binding precedence, missing/invalid values, legacy defaults and durable graph/provenance regressions. No product behavior change intended.                 |
| `tests/unit/workflow-required-inputs.test.ts`                                                                   | New current/stale/disconnected source, field grouping and external-rule checklist checks. No product behavior change intended.                                                        |
| `e2e/calculation-variables.spec.ts`                                                                             | New synthetic browser coverage for formula-first entry, API conversion and live Trigger checklist. No product behavior change intended.                                               |
| `e2e/calculation-variable-session.spec.ts`                                                                      | New shared Chat/Run session regression using the actual input form and execution commands. No product behavior change intended.                                                       |
| `playwright.reliability.config.mjs`                                                                             | Registers both new browser specifications in the existing reliability suite. No application behavior change intended.                                                                 |
| `docs/ARCHITECTURE.md`                                                                                          | Adds module ownership and session/checklist boundaries; preserves prior API-source summary. Documentation only.                                                                       |
| `docs/FUNCTIONALITY.md`                                                                                         | Describes the new numeric capabilities and deferred constraints/AI work; preserves prior API-source summary. Documentation only.                                                      |
| `docs/product/decisions.md`                                                                                     | Records the requested Trigger/checklist direction and the implemented increment's limits. Documentation only.                                                                         |
| `docs/calculation-variables.md`                                                                                 | New semantic behavior, compatibility, per-file inventory and verification record. Documentation only.                                                                                 |

The repository formatter also normalized the existing HTTP source executor file
`lib/workflow-executors/src/execution/blocks/source/http-json/run.ts` after the
required check flagged it. Its preexisting API-source comment changes are retained;
no HTTP source behavior change was made in this increment.

### Verification

- `pnpm run verify` passed with the pinned Node/pnpm toolchain: generated contracts,
  architecture, maintained formatting, library/application/test typechecks,
  **150 unit tests, 37 companion tests and 31 workflow-core tests**. No expected
  calculation, test threshold, dependency or architecture budget was weakened.
- Fourteen focused calculation/checklist unit tests also passed after the final
  malformed-metadata checks. These include API source evidence through the real
  graph adapter, repeated connections to the same source, explicit binding
  precedence, missing/invalid values, zero and current/stale checklist projection.
- The three distinct browser component scenarios passed: formula-first variable
  creation, entered amount multiplied by an API rate, and the Trigger checklist
  excluding an outdated source. Runs:
  `04a727d1-62e4dac7-bacb-4f8c-afb5-89e8215265e1` and
  `04a727d1-3e27ac32-2107-41fb-8ce3-d5122985edd7`.
- The real shared Chat session browser scenario passed in
  `04a727d1-500f829f-b218-4803-b0cb-c4dd4a69326b`: source collection proceeded with
  a missing manual amount; Apply calculated `100 * 1.5 = 150`, then `0 * 1.5 = 0`;
  clearing the amount stopped new calculation, marked the old result outdated,
  disabled approval and retained the earlier result and saved definition. The
  Trigger displayed one of two fields provided. The API/manual component case
  passed again in this run, including cleanup of dormant manual values after
  switching a variable to a source provider. The final frontend typecheck passed
  after this form correction. Four distinct browser scenarios passed overall.
- The full-session browser fixture initially failed because its synthetic library
  was replaced during initial app synchronization, then because its API snapshot
  signature omitted the source's default request settings. Fixture setup now
  awaits initialization and signs the actual effective settings. Expected results,
  permissions and timeouts were preserved. The final checklist screenshot was
  inspected for readable labels, values and missing/provided states.
- An initial verification attempt stopped on formatting; the affected files were
  formatted and the complete command subsequently passed. One browser invocation
  selected no tests because its filter misspelled the test title; the corrected
  invocation passed. Neither attempt is counted as a passing check.

These checks use isolated synthetic sources and controlled app services. They do
not validate a live model conversation, the user's PNL tax mappings or a deployed
environment. No commit, push, merge or deployment was performed.

## Requirements-generated form increment

The previous variable/checklist and API-source changes were already uncommitted
when this task began. This increment extends them; it does not claim those earlier
edits, the separate New FAPI Calc backup, or its workbook mappings as new work.
The implementation is generic numeric calculation input collection. No tax,
accounting, provider-selection or review exemption is inferred.

Current-run choices survive the existing session/backup representation. They do
not modify the saved version, draft formulas or edges. Required source steps still
run even if a variable is explicitly entered. Source and review bypass would be a
separate product-policy change. Legacy numeric aliases remain compatibility
behavior; this increment adds no FAPI-specific fields or conversion operation.

The following inventory records this increment's file-level purpose and before/after
behavior. Documentation and tests do not independently change runtime behavior.

| File                                                                                         | Purpose and change                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/domain/calculation-inputs.ts`                                    | Adds typed run-only manual/source choices alongside saved input definitions.                                                                                                                              |
| `lib/workflow-core/src/core/calculation-inputs.ts`                                           | Becomes the portable public entry for inference, requirements and value projection; consumers share one implementation.                                                                                   |
| `lib/workflow-core/src/core/calculation-input-inference.ts`                                  | Houses formula-reference inference separately from the public exports to avoid import cycles; no inference behavior change intended.                                                                      |
| `lib/workflow-core/src/core/calculation-input-resolution.ts`                                 | Moves numeric requirement resolution into core and applies explicit run choices before saved settings, with no fallback for blank/invalid choices.                                                        |
| `lib/workflow-core/src/core/calculation-input-rules.ts`                                      | Selects effective inline/external formula requirements for commands and forms; current rulebook output is used when available.                                                                            |
| `lib/workflow-core/src/core/calculation-input-sources.ts`                                    | Projects only current successful/warning numeric source results for requirements; stale/failed source values no longer satisfy readiness.                                                                 |
| `lib/workflow-core/src/core/calculation-input-values.ts`                                     | Moves existing numeric field/reference and legacy alias collection into the portable owner; no coercion or alias behavior change intended.                                                                |
| `lib/workflow-core/src/application/calculation-session-inputs.ts`                            | Replaces declared-manual-only readiness with inferred requirements and validates per-run names and direct source choices.                                                                                 |
| `lib/workflow-core/src/application/session-inputs.ts`                                        | Allows contextual, validated `inputChoices` patches while retaining legacy `inputValues`; formulas and saved bindings remain protected.                                                                   |
| `lib/workflow-core/src/application/sessions.ts`                                              | Supplies current source evidence to input validation/readiness and exposes requirements in session context; existing invalidation/history commands remain authoritative.                                  |
| `lib/workflow-executors/src/calculation-inputs.ts`                                           | Retains the executor import path as a compatibility export of the core implementation; no separate resolver remains.                                                                                      |
| `lib/workflow-executors/src/calculation-values.ts`                                           | Retains existing imports as exports of portable numeric field helpers; no independent behavior change intended.                                                                                           |
| `lib/workflow-executors/src/execution/blocks/logic/calculation-engine/schema.ts`             | Reuses the moved named-value collector; rule parsing and arithmetic remain unchanged.                                                                                                                     |
| `lib/workflow-executors/src/tools/backend-adapter.ts`                                        | Carries source status into numeric resolution and prevents unavailable results from supplying calculator values while preserving other consumers' review evidence.                                        |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-calculation-inputs.tsx`    | Replaces the declared-manual-only form with formula-derived fields and explicit saved/manual/source alternatives.                                                                                         |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-forms.tsx`           | Reuses draft/Apply handling for generated choices and compares upstream source identity before applying an old draft.                                                                                     |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs-model.ts` | Shares effective formulas/current source requirements and projects selectable fields plus source freshness identity.                                                                                      |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs.tsx`      | Extends the Trigger checklist into collection forms grouped by calculation, retaining current readiness.                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`        | Hosts forms at the Trigger in both surfaces and retains a calculator fallback for graphs without a Trigger.                                                                                               |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store.ts`         | Recognizes calculations waiting on generated choices so source collection can still proceed before missing values are entered.                                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/chat-workflow-steps.tsx`           | Opens the Trigger for missing calculation fields and preserves the user's expansion choices and drafts.                                                                                                   |
| `tests/core/calculation-session-inputs.test.ts`                                              | Covers inferred fields, scoped choices, rejected bindings and immutable session/history behavior; no runtime behavior change intended.                                                                    |
| `tests/unit/calculation-inputs.test.ts`                                                      | Covers choice precedence, blank/zero handling and source availability through shared execution; no runtime behavior change intended.                                                                      |
| `tests/unit/workflow-required-inputs.test.ts`                                                | Covers generated fields, current/stale source alternatives and source identity changes; no runtime behavior change intended.                                                                              |
| `tests/integration/workflow-storage.test.mjs`                                                | Extends the real database roundtrip to manual zero, blank and exact source choices; also asserts saved draft/version preservation. No runtime behavior change intended.                                   |
| `e2e/calculation-variable-session.spec.ts`                                                   | Exercises the actual Trigger forms in Run/Chat, independent calculations, provider switching, history, approval and stale drafts. No runtime behavior change intended.                                    |
| `e2e/calculation-session-fixture.ts`                                                         | Mounts a synthetic saved-version session using static module imports and the real library synchronization boundary so the browser tests exercise one store identity. No runtime behavior change intended. |
| `e2e/calculation-variables.spec.ts`                                                          | Adapts component checks to run-only choices while retaining independent arithmetic and missing/stale-value assertions. No runtime behavior change intended.                                               |
| `docs/calculation-variables.md`                                                              | Updates this semantic behavior summary, compatibility limits and per-file verification inventory; no runtime behavior change intended.                                                                    |
| `docs/ARCHITECTURE.md`                                                                       | Records the portable resolver owner and generated form/session boundary; no runtime behavior change intended.                                                                                             |
| `docs/FUNCTIONALITY.md`                                                                      | Replaces the declared-manual-only description with formula-generated input collection; no runtime behavior change intended.                                                                               |
| `docs/product/decisions.md`                                                                  | Records the user's next increment and preserves required source/review policy; no runtime behavior change intended.                                                                                       |
| `docs/unified-workflow-execution.md`                                                         | Documents shared Trigger collection and run-only source alternatives; no runtime behavior change intended.                                                                                                |

The product blueprint remains accurate: workflows own execution and sources supply
values. Its broader intended capabilities are unchanged. Historical verification
sections above describe their own checkpoint, not this increment's test results.
The architecture explorer's existing session/store summaries still describe the
same owners, revision checks and invalidation rules. Its dated snapshot was not
regenerated or presented as fresh verification; the implementation details above
and the updated architecture/functionality guides describe this increment.

Verification for this increment:

- Final `pnpm run verify` passed: toolchain, generated contracts, architecture,
  maintained formatting, application/test TypeScript, 160 unit tests, 37 companion
  tests and 37 portable core tests (234 total). Evidence:
  `test-results/requirements-form-final-verify.log`.
- The real database test `guided run revisions and pause state roundtrip through
the real workspace library` passed with the new choices, including zero and
  blank. It retained the saved definition and rejected the stale server revision.
  Isolated run: `04a727d1-e21c6d09-07f5-41f9-876a-7065ba9cdced`.
- The first browser invocation passed all three component cases but failed four
  session fixtures before their forms could be exercised. Trace inspection showed
  duplicate timestamped module identities during development refresh. The fixture
  now uses static imports and the actual repository synchronization boundary; no
  arithmetic expectations, timeouts or application safeguards were weakened.
- The final reliability run passed all seven selected browser scenarios in
  `calculation-variable-session.spec.ts` and `calculation-variables.spec.ts`.
  These cover actual Chat and Run forms, no-definition inference, two calculations
  sharing an input name, internal-result exclusion, manual/source/default changes,
  zero/blank, preserved history, invalidated approval, and review of a draft after
  a same-value source refresh. Run: `04a727d1-e6195e88-c43d-4a39-b4a4-d53449ac36f3`.
- The real persistence browser scenario passed recovery in another browser,
  backup export/import, offline retry and stale-write protection. Run:
  `04a727d1-d1d8e7d5-4207-42e5-bed4-a246e8abc651`.
- `git diff --check` passed. Earlier API/source/template changes remain separate
  from this increment's inventory.

The form scenarios use synthetic workflows and a captured test API response;
the reliability suite mocks library HTTP writes. Separate database integration and
persistence checks above use real isolated storage. These checks do not certify
live API availability, the user's PNL tax treatment, or a deployed environment.
No commit, push, merge or deployment was performed.
