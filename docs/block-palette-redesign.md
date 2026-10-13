# Block palette redesign — Phase 1 shipped, Phase 2 shipped for Calculate + Workpaper

## Status

**Phase 1 implemented and verified 2026-10-10.** **Phase 2's formula-engine
conditional support, and the shared `<WorkflowBlockCard>` shell for Calculate
and Workpaper, also implemented and verified 2026-10-10** (see "The shared
shell, built — 2026-10-10" below). The other 7 block types have not been
moved onto the shared shell yet — deliberately scoped narrow, see that
section. Phases 3–4 remain design only. This document extends the read-only
block-design review already recorded in [decisions.md](product/decisions.md)
("Scope bar correction — 2026-10-10" section, headed _Proposed next steps;
not approved defaults_) into a concrete, executor-by-executor plan. Phases
3–4 need a separate, explicit go-ahead before starting.

### Phase 1 — what shipped

- `logic:calculation-engine`'s catalog `defaultConfig.formulas` emptied
  (`artifacts/.../shared/workflow-engine/block-catalog-data.ts`). A fresh
  Calculation Engine block no longer starts pre-loaded with FAPI's 20-line
  formula set. Verified live: a newly added block shows "No terms yet."
  FAPI workflows are unaffected — `fapi-template.ts` never read from this
  catalog default to begin with (confirmed by reading it before touching
  anything).
- Added a `hidden?: boolean` field to `BlockCatalogItem`
  (`lib/workflow-contracts/src/domain/block-catalog.ts`) and set it on
  `trigger:schedule` and `trigger:webhook` — hidden from the add-block
  picker (`action-grid.tsx`) and from what Sina may suggest adding
  (`builder-copilot.tsx`'s `CATALOG_SUMMARY`), since neither actually
  schedules or receives events yet. Verified live: only "Manual Trigger"
  appears in the Trigger category now. The catalog entries and their
  executors are untouched, so any already-placed Schedule/Webhook block
  keeps working.
- **Not done in Phase 1** (deliberately deferred to later phases): the
  full palette reorganization into the 9 target block categories, an
  explicit FAPI-preset picker for Calculate, and the executor consolidation
  itself. The add-block picker still shows all ~39 remaining (un-hidden)
  entries under their current family groupings.

### Phase 2 — formula-engine conditional support shipped; shared shell not started

**Implemented and verified 2026-10-10**, the load-bearing half of Phase 2
called out below: the formula language had no comparison operators and no
conditional construct, so a threshold rule ("if income exceeds $500K, apply
rate B") could not be expressed at all — a real gap, not a labeling problem.

- Added `>`, `<`, `>=`, `<=`, `==`, `!=` as a new comparator precedence level
  (binds loosest, deliberately not chained) and `if(condition, then, else)`
  as a new supported function — both treat "nonzero is true," fitting the
  existing all-numeric `FormulaValue` model with no new type threading
  through the engine. Changed: `lib/workflow-core/src/core/formula-references.ts`
  (shared tokenizer) and
  `lib/workflow-executors/.../calculation-engine/run.ts` (parser/evaluator).
- Extended the Builder's own formula-editor token model
  (`calculation-editor-model.ts`) with matching comparator tokenizing and an
  `if` button, so this is actually authorable by clicking in the UI — not
  just a backend capability reachable only by hand-editing JSON config.
- Verified: 5 new engine tests (`tests/unit/calculation-engine-conditionals.test.ts`)
  covering the comparator truth table, `if` branching, a full progressive-bracket
  scenario (the exact "impossible before this change" example from design
  discussion), composition with the existing guard functions
  (`min_multiply_cap`, etc.), and a regression check that pure-arithmetic
  formulas are unaffected. 1 new UI-layer test confirming round-trip
  tokenization. `pnpm run test:unit` and `pnpm run test:workflow-core` both
  run clean except two pre-existing failures in `workflow-draft-removal.test.ts`
  (unit and core variants) — unrelated to calculation formulas, already
  present before this change (see "Known issues" below). Typecheck clean
  across `lib/workflow-core`, `lib/workflow-executors`, and the app.

**Also done 2026-10-10 — Calculate's own tab shell, adapted from the original
4-tab spec based on what the real code showed:**

Reading `calculation-engine-editor.tsx` in full before touching it surfaced
two things the original spec (written before this reading) got wrong:

1. `TwoPanelToolShell` already exists and is already shared by three editors
   (Calculate, and the rollup/keyword rulebook editors) — a real, working
   "consistent editor shell," just not yet named or extended to the rest.
2. Calculate already has a persistent `CalculationSettings` +
   `CalculationVariablePanel` area shown **above** its tabs regardless of
   which tab is active — this is the de facto Inputs context. Forcing it
   into a fourth tab would hide always-relevant readiness information behind
   a click, a regression, not the consistency this phase is after.

So Calculate's tab bar changed from `Edit | Summary` to **`Logic | Results |
Review`** (3 tabs, not 4) — Logic is the renamed Edit tab (unchanged
content), and `CalculationEngineRunSections` was given an optional
`sections` filter so Results (`summary`, `results`, `trace`) and Review
(`warnings`, with a new "nothing needs attention" empty state) split the
same read without duplicating its extraction logic. Changed:
`calculation-engine-editor.tsx`, `calculation-engine-run-sections.tsx`.

**Verified fully live**, not just typechecked: built `if(5 > 3, 100, 200)`
by clicking the actual Logic-tab buttons (including the new `if` and `>`
buttons), ran it via "Test block," got the correct result (**100**) from
the real executor, then confirmed the Results tab's structure and the
Review tab's new empty-state message both render correctly against that
real run. Typecheck clean.

**Not done, and bigger than the original one-line phase description
suggested**: `field-block-workspace.tsx` (the Workpaper editor) is 851
lines of data-extraction and trace-building logic with a fundamentally
different information architecture from Calculate's term-list-plus-editor
shape — not a two-panel index/workspace layout at all. Retrofitting it onto
the same shell isn't a quick wrapper swap; it needs its own dedicated
design pass (what does "Inputs/Logic/Results/Review" even mean for a block
that only _displays_ computed results and has no formulas of its own to
edit?) before any code moves. Attempting that blind, in the same pass as
everything else, was judged too risky for a component this size and this
central — deferred rather than rushed.

The shared `<WorkflowBlockCard>` component (used by every block type,
including the other 7 not yet touched) and the full Build-vs-Chat/Run
per-tab mode behavior remain not started.

### The Workpaper design pass, answered — 2026-10-10

The user answered the open "what does Inputs/Logic/Results/Review even mean
for Workpaper" question directly, describing the intended behavior: a
Workpaper declares a named set of output fields (e.g. FAPI's A–H, GROSS,
DEDUCTIONS); each field can be satisfied by a formula **or** a directly
given value; every declared field is always shown — even at zero, even if
it doesn't end up affecting the final headline number — with an honest
default when nothing's been computed or provided yet; and the whole thing
should be a clickable, traceable worksheet where opening a field shows its
formula, its supporting values, and the sources behind those, recursively.

**Reading `field-worksheet.ts` and `field-worksheet-view.tsx` in full before
answering found that almost all of this is already built**, which reframes
what "the Workpaper design pass" actually needed to be:

- **Declared field set** — already exists: `config.worksheetLines` (id,
  label, calculation block, result key, display role/group/precision).
- **Formula-or-direct-entry per field** — already exists: when a declared
  `resultKey` isn't produced by a formula rule, the projector falls back to
  the same `CalculationInputRequirement` system (manual / source / default
  origin) Phase 2 is already built on. A nested input with a declared
  `config.inputDefaults` fallback already shows as `current`, labeled
  "Workflow default."
- **Click-to-trace, recursively, down to sources** — already built, exactly
  as described: `FieldWorksheetView`'s `<details>` elements expand per
  line and per nested dependency, each showing its formula, "Calculated
  by…", further-expandable supporting values, and source evidence.
- **The one real gap**: a top-level declared line whose calculation simply
  hasn't produced a result yet showed status `missing` with no number at
  all (an em dash) — there was no way to say "if nothing's been computed or
  given, this one is legitimately zero," the exact case the user described
  (e.g. "debt forgiveness" being 0 when not applicable, not unknown).

**Implemented and verified 2026-10-10**: a new optional `defaultValue` on
`WorksheetLine` and a new `'default'` status (`lib/workflow-contracts`'s
`field-worksheet.ts` domain type), applied in `projectFieldWorksheet`
(`lib/workflow-core/src/application/field-worksheet.ts`) — **only** in
place of `missing`, never overriding `invalid` or `stale`, so a default
can never paper over a genuinely broken reference or a result that needs
rerunning. The UI (`field-worksheet-view.tsx`) labels it "Default"
alongside the existing "Available/Missing/Needs attention/Outdated." 5
tests in `tests/core/field-worksheet.test.ts` prove: the default fills a
true gap and is clearly labeled, a different declared default is honored
exactly, a real computed value always wins over the default once one
exists, and a genuinely invalid reference is never masked by a default.
Typecheck clean, full existing field-worksheet suites (17 tests) still
pass unchanged.

Given how much of the original ask was already built, Workpaper does **not**
need the large separate redesign effort implied earlier — the remaining
honest gap is folding it into the shared `<WorkflowBlockCard>` shell
alongside Calculate, which is now a much smaller, better-scoped task than
first estimated.

### The shared shell, built — 2026-10-10

Going to build `<WorkflowBlockCard>` surfaced that its real embedding point,
`configuration-overlay.tsx`, is a 1,963-line per-block-type dispatcher, not a
thin shell waiting for content — Calculate's and Workpaper's editors are two
branches among at least seven (Excel source, 3 kinds of rule-knowledge
source, Aggregator, Keyword Mapper, Trigger, Action), interleaved with
cross-cutting machinery unrelated to the Inputs/Logic/Results/Review
contract (source-lock/evidence-immutability banners, rulebook item
selection, standalone "Test block" vs "Test with upstream," and its own
outer `data`/`runs`/`properties` tabs). Asked the user how to scope the
rollout given that; chose **narrow**: build the shell for real, wire it into
Calculate and Workpaper's own content only, leave the other 7 branches and
the outer dispatcher's tabs/banners/test-buttons untouched.

**Built**: `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/block-card/workflow-block-card.tsx`
— compact header (icon badge reusing the existing canvas-node
`visualLevel`/`visualRole` color convention, so the color already means the
same thing on the canvas; one of 4 readiness badges — _Not configured /
Waiting on input / Computed / Needs review_; one key-result line) plus the
same 4 tabs in the same order for every block type that adopts it. A block
type supplies each tab's content; the shell owns chrome only. `TwoPanelToolShell`
(the existing shared term-list/editor split) gained an optional `title` so it
can be nested inside a tab without a redundant second header.

**Calculate** (`calculation-engine-editor.tsx`): Inputs moved from
"persistent above all tabs" (the Phase 2 compromise, see above) into a real
Inputs tab — `CalculationSettings` + `CalculationVariablePanel`. The earlier
objection ("hiding input readiness behind a tab is a regression") is now
handled structurally instead of by exception: the shell's compact-header
readiness badge is derived from the same `describeCalculationInputs` check
CalculationVariablePanel runs internally, so "still waiting on input" stays
visible from the Logic/Results/Review tabs too, without pinning the whole
panel open. Logic/Results/Review content unchanged, just re-homed under the
shared tab bar.

**Workpaper** (`field-block-workspace.tsx`): closed a real gap rather than
just moving code. `FieldWorksheetView`'s `renderInputs`/`editableCalculationIds`
props (built for the chat surface, `workflow-session-worksheet.tsx`, which
already uses them) were never wired on the **Build** surface — Build mode had
no way to supply or rewire a connected calculator's inputs from inside the
Workpaper block at all. The new Inputs tab finds every upstream Calculation
Engine feeding the block and renders a `CalculationVariablePanel` per
calculator — the same component Calculate's own Inputs tab uses — through a
new `onCalculatorConfigPatch(calculatorId, patch)` callback threaded from
`configuration-overlay.tsx` (mirrors the existing `onRuleConfigPatch`
pattern already used for Calculate's connected-rulebook case). Logic tab is
`FieldWorksheetEditor` (declare worksheet lines) when editable, a read-only
line list otherwise. Results tab is the existing `FieldWorksheetView` /
legacy extraction table, unchanged, just re-homed. Review tab recursively
walks the projection for `invalid`/`stale` lines. Readiness: `not_configured`
when nothing's declared (or no legacy data), `waiting_on_input` /
`needs_review` from the same line statuses the Results tab already shows.
`worksheet-page-view.tsx` (the read-only, multi-block "Worksheet" page
reached from chat) needed no changes — its existing `compact` flag now also
selects a content-sized card height (`fill="auto"`) instead of the Build
surface's fixed/fill height, so several Field blocks stack without an
artificial per-block scroll box.

**Verified live** against the real `FAPI Calculation` template, not just
typechecked: opened the "FAPI Lines Engine" Calculate block — all 4 tabs
render, Inputs tab lists its 17 required variables; opened "FAPI Lines A–H"
and "FAPI Summary" (both legacy/undeclared Workpaper blocks) — Inputs tab
correctly found each one's connected calculator ("FAPI Lines Engine" /
"FAPI Summary Engine") and rendered its variable panel; set a variable's
value source to "Enter value," typed a number, confirmed the status line
updated to the typed value live (proves `onCalculatorConfigPatch` round-trips
through `updateNodeData`), then reverted it. The other 7 block types'
branches (verified by opening a Source/API block) are untouched and render
exactly as before.

`pnpm exec tsc --noEmit` clean. `pnpm run verify` clean except the same 2
pre-existing `workflow-draft-removal.test.ts` failures noted below (confirmed
unrelated — nothing in this pass touches draft/removal logic). One
type-safety fix along the way: `tests/unit/calculation-engine-conditionals.test.ts`
(written earlier this session, never run through `tsc -p tests/tsconfig.json`
before) accessed a `ToolRunResult`'s loosely-typed `outputs` three levels
deep without narrowing — fixed with the same `asRecord` guard used
throughout the codebase, not a behavior change.

One process note worth keeping: an early attempt to format the files touched
here ran Prettier on the whole of `configuration-overlay.tsx`, which is not
in the project's Prettier-maintained allowlist (confirmed via
`pnpm run format:check`, which only checks maintained files and passes) and
reformatted all ~2,000 lines instead of the 8 actually touched. Caught before
committing anything; the file was restored from `git show HEAD:...` and the
8-line change reapplied by hand in the file's existing style. Noted here so
the same mistake isn't repeated against this file.

**Not done**: the other 7 block types (Source/Excel, 3 rule-knowledge source
kinds, Aggregator, Keyword Mapper, Trigger, Action) still render their own
bespoke layouts inside `configuration-overlay.tsx`; `WorkflowBlockCard` is
proven on 2 of 9 target block types, not yet the single chrome owner the
original "none render their own top-level layout" goal describes.

### Per-block AI-readable summaries — 2026-10-11

The user asked for a description on each block the assistant can read, to
help both building workflows and answering questions about one in chat.
Recommendation given and taken: derive it from the block's real config
instead of a hand-typed field, for the same reason the generated-code
preview was removed from the Build overlay earlier — a second,
non-executing description of a block is worse than none once it can drift
from what the block actually does.

**Built**: `describeWorkflowBlock(block, definition)` in
`lib/workflow-core/src/application/block-summary.ts` (new package export
`@workspace/workflow-core/block-summary`). Calculation Engine → lists its
real `resultKey = expression` terms (reading the same `formulas` /
`calculationRules` / `inlineFormulas` config keys the Builder's own formula
editor reads, truncated past 6 terms). Workpaper → lists its declared
worksheet lines and which calculator block each one's result comes from.
Every other block type falls back to the block's own `description` field,
then a generic `label — family / subtype` line — honest about not having a
structural summary yet, rather than inventing one.

**Wired into the two places the assistant actually reads workflow state**:
`sessionContext()` (`lib/workflow-core/src/application/sessions.ts`,
per-step loop) — the single choke point already shared by the live chat
readable (`use-session-tools.tsx`), the chat scope-bar headline, and the
session read-model, so this reaches an active/running session everywhere at
once; and `builder-copilot.tsx`'s whole-canvas and selected-block
`useCopilotReadable`s — the pre-run Build canvas, including the "what does
this block do" readable for whatever's currently selected.

**Verified**: 6 new tests in `tests/core/block-summary.test.ts` (real
formulas listed correctly, honest empty state, truncation past 6 terms,
Workpaper cross-references the calculator's label, undeclared Workpaper's
honest fallback, non-summarized block types fall back to description then
label). `pnpm run typecheck:libs`, the app typecheck, `check:architecture`,
and `format:check` all clean; `node scripts/run-workflow-core-tests.mjs`
59/60 (the 1 failure is the same pre-existing `workflow-draft-removal`
issue below, confirmed unrelated). Verified live in the browser — Sina
correctly quoted the FAPI Lines Engine's real formulas from the canvas
readable, including honestly reporting it couldn't see the truncated terms
rather than guessing.

### Foreign Tax Calculator — a from-scratch rebuild of FAPI, 2026-10-11

The user asked for a genuinely better FAPI calculator — not a copy — using
everything this session actually changed: wider keywords, the new
comparator/`if()` formula support, declared Workpaper `defaultValue`, and
responsible AI-assist (flag uncertainty, don't guess). New template
"Foreign Tax Calculator", registered alongside "FAPI Calculation" under
Tier 1 — the original is untouched.

**What changed, concretely** (`templates/fapi/foreign-tax-calculator-template.ts`):

- **Keyword rulebook widened** — every FAPI category went from ~2-3 literal
  keywords to 4-10 realistic trial-balance/GL phrasings (e.g. interest income:
  `"interest income"` alone → + `"interest earned", "bank interest", "interest
  revenue", "accrued interest income"`, etc.), grounded in actual accounting
  terminology, not invented.
- **Two review blocks after classification** — Mapping Confidence Check and
  Unmatched Rows Check, non-blocking, flag uncertain/unrecognized rows for
  review instead of silently absorbing or dropping them. This is the
  responsible shape of "AI assist" for this app: surface uncertainty, never
  guess silently.
- **FAPI Brut / FAT Deduction / Net FAPI rewritten with `if()`/comparators**
  instead of `max_subtract_zero`/`min_multiply_cap`, matching the statutory
  wording ("the amount, if any, by which X exceeds Y" / "the lesser of A and
  B") directly in the auditable formula text. Numerically identical — this is
  a legibility change, not a math change.
- **FAPI Lines A–H and FAPI Summary are now declared Workpapers** (worksheetLines
  + `defaultValue`), replacing the undeclared legacy Field blocks — the
  situational lines (A1/A2/C–H, the 95(2) amount) show "Default · 0" instead
  of a blank dash when nothing's been classified or computed yet, same
  contract the Workpaper default-value work established earlier this session.
  Income & Expense stays a legacy Field block — worksheetLines only accepts a
  `logic.calculation_engine` source, and that display reads from the
  Category Rollup Aggregator, a different tool.
- Same FAPI math throughout — not re-derived here. Every formula computes
  identically to its `fapi-template.ts` counterpart; see the file's own
  header comment for the full reasoning.

**A real bug found and fixed along the way**: the Build canvas doesn't
render a template from its declarative `PortfolioWorkflowDef.blocks/edges` at
all — `inline-builder.tsx` resolves a template strictly through
`buildRunnableWorkflowSnapshot(id)` (the `WORKFLOW_CONFIGS` runnable-engine
registry), falling back to a single-node blank canvas if that id isn't
registered there. The declarative spec only ever fed the Overview tab's
preview card. `canvasFromRunnable` — the flag both `EXECUTABLE_FAPI` and this
template set, whose doc comment reads "sends the Build tab to the real
configured graph" — is dead: grepped the whole `features/` tree, it's read
nowhere. First pass hit exactly this: a correct template definition that
rendered as an empty canvas. Fixed by registering a `WORKFLOW_CONFIGS['foreign-tax-calculator']`
entry (`runtime/workflow-runs/foreign-tax-calculator.ts`) backed by a
dedicated, unprefixed-id snapshot builder (`workflow/templates/foreign-tax-calculator.ts`,
mirrors `createFapiTemplateWorkflow` — deliberately NOT the generic
`createPortfolioWorkflow`, which prefixes every block id with `${def.id}--`
and would break the Workpaper's `calculationBlockId` references). Worth
noting for whoever next adds a Tier-1 template: the declarative spec alone is
not enough to make Build show anything.

**Scope boundary, disclosed**: the `TemplateConfig` includes real
`editableInputs` (same config keys as FAPI's) but omits `worksheetProvenance`
(the "what rows fed line A" chat drill-down) — a per-template row-filtering
function, optional, and specific enough to FAPI's row shape that porting it
blind risked getting it subtly wrong. Explain-by-formula still works without
it; only the row-level drill-down degrades gracefully.

**Verified live**: fresh tab, Build canvas shows all 14 blocks correctly
(confirmed via the accessibility tree's node count, not just a screenshot);
opened FAPI Lines Engine and FAPI Summary Engine directly — formulas render
exactly as written, including the three new `if()` expressions; asked Sina
in chat to run it, which opened a real guided-run worksheet showing the
Workpaper's `defaultValue` behavior live and correctly — A1/A2/C–H all
"Default · 0", while A/B (which need real data, no default declared)
correctly show "Missing". Typecheck, `check:architecture` and `format:check`
clean throughout both the broken-canvas diagnosis and the fix.

## Known issues found during verification, not caused by this work

- `tests/unit/workflow-draft-removal.test.ts` and
  `tests/core/workflow-draft-removal.test.ts` each have one failing test
  (dirty-state tracking and exact snapshot equality for workflow removal).
  Confirmed unrelated to this document's changes — nothing here touches
  draft/version/deletion logic, and this matches the "unfinished saved-draft
  removal work" already flagged as in-progress before this session's changes
  started. Not fixed here; flagged for whoever owns that feature.

## Authorization that changes the constraint this design works under

The user explicitly authorized discarding backward compatibility for existing
saved workflow **definitions and graphs** to get a cleaner block model:

> "I have no problem with deleting all the current workflows as they are if it
> means building better blocks that I can use to rebuild them."

This removes, **for this initiative only**, the general `AGENTS.md` rule to
"preserve historical versions... and saved-backup compatibility." It does
**not** extend to already-uploaded company data, documents, or sources —
those are untouched by this design. Confirm that scope reading once more
before anything is actually deleted; nothing has been deleted yet.

Because this reverses a standing rule for a scoped purpose, it should be
recorded in `decisions.md` directly (done alongside this document) so Codex
and any other session don't silently "preserve" workflows this decision
already discarded.

## Problem statement

A read-only inventory of the real registry (`lib/workflow-executors/src`,
grounded by reading the actual code, not just prior summaries) found 46+
distinct executors behind what the builder presents as "41 blocks." Concretely:

- **`source.*` conflates two different things**: real data ingestion
  (`web_url`, `pdf_document`, `database_query`, `http_json`) and configuration
  carriers wearing a "source" label (`calculation_rules`, `aggregation_rules`,
  `rollup_rules`, `fapi_inputs`). A "Source" block should mean "read something
  external," not "hold a rule."
- **`logic.*` is a junk drawer**: parsing/extraction, transformation/mapping,
  the actual calculation engine, and a second, separate workpaper mechanism
  (`logic.portfolio_workpaper`) all share one namespace with no structural
  distinction.
- **Two workpaper mechanisms compete**: `field.field_block` (declarative,
  projects recorded results, no owned arithmetic — the pattern Codex's review
  already recommended as the Workpaper starting point) and
  `logic.portfolio_workpaper` (a different approach). One needs to win before
  "Workpaper" can be one clean block type.
- **`protected.*` doesn't fit a pipeline-stage model at all.** Value locking
  ("this result is governed/can't silently change once approved") is a
  property a value can carry, not a stage a graph passes through.
- **`ai.proposal_only` has four different palette entries routing to one
  executor**, with no declared home in a 9-block pipeline model. It's a mode
  ("let Sina propose this, then I review it"), not a block type.
- **Two of three Start/trigger options are non-functional today.**
  `FUNCTIONALITY.md` already documents this: "a schedule block is not a
  recurring scheduler; a webhook block does not provision an inbound
  endpoint." A rebuilt palette shouldn't offer broken choices.
- **The Calculate executor's formula language is missing conditional logic.**
  Checked directly (`calculation-engine/run.ts`, `formula-references.ts`):
  supported operations are exactly `+ - * /` plus `abs`, `min`, `max`,
  `round`, `pass_through`, and two composites —
  `max_subtract_zero`, `min_multiply_cap`. The second of those is shaped
  for one specific FAPI formula (`min(rate × paid, cap)`, the ss.91(4) FAT
  deduction). **There are no comparison operators and no conditional/branch
  construct at all** — "if income exceeds $500K, apply rate B" cannot be
  expressed today. This is a real capability gap, not a labeling problem,
  and it blocks "good enough beyond FAPI" on its own.
- **Nine different block types currently imply nine different layouts.**
  Nothing stops each block's editor/result view from inventing its own visual
  structure.

## Target block palette

| Block            | Purpose                                             | Notes                                                                                                                                                                                                                                                                                                                               |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start**        | Define how work begins                              | Ship **Manual** only at first; keep Schedule/Webhook code present but hidden from discovery until they're genuinely functional, consistent with the existing "only advertise what the runtime supports" principle already in `decisions.md`.                                                                                        |
| **Input form**   | Collect typed information from the user             | New as an _explicit_ block type — today this exists implicitly via the Trigger/session-form mechanism. Formalizing it gives FAPI's input collection (`source.fapi_inputs`) a real, reusable home instead of living under "source."                                                                                                  |
| **Source**       | Read a document, workbook, table, or supported API  | Ingestion only. Config carriers currently misfiled here move to where they're actually used (see below).                                                                                                                                                                                                                            |
| **Prepare data** | Extract structure, map, classify, filter, group     | Absorbs today's parsing/extraction and transformation/aggregation logic, plus the rule configs that used to be fake "sources." Carries an optional **AI-assisted** mode (Sina proposes, you review) rather than a separate AI block type.                                                                                           |
| **Calculate**    | Apply named formulas to explicit inputs             | Keeps the good part of today's design (named formulas, typed inputs with units/rounding, full formula trace for evidence) and **adds conditional/comparison support** — see below. Starts empty; FAPI's formula set becomes an explicit preset, not a silent default.                                                               |
| **Validate**     | Check completeness, consistency, and exceptions     | Today's six separate `review.*` check types become configurable rules within one Validate block, matching the original proposal ("combine routine checks into configurable Validate rules"). `fx_rate_review` becomes a rule _template_ (generalized to "external value sanity check," FX as one preset) rather than its own block. |
| **Approval**     | Record a human review decision                      | Kept separate from Validate, as recommended. Actionable in Chat/Run (approve, flag, override-with-reason) — this already matches how approval gates behave today.                                                                                                                                                                   |
| **Workpaper**    | Present the predefined result and supporting detail | Built on `field.field_block`'s declarative model. `logic.portfolio_workpaper` is reconciled into it (port any capability it has that Field worksheets lack, then retire it) rather than keeping two mechanisms.                                                                                                                     |
| **Export**       | Produce the selected output format                  | Today's five generic formats plus the two named integration handoffs (Taxprep, ONESOURCE) become format/destination _choices_ within one Export block.                                                                                                                                                                              |

**Not a block type: value protection.** `protected.protected_input` /
`protected.protected_result` become a flag any block's input or output can
carry ("locked once approved"), not a 10th pipeline stage. Needs its own
small design (who sets/clears it, what overriding requires) but is out of
scope for the palette itself.

## Executor consolidation — current → target, every entry

| Current `toolId`                       | Target block                     | Disposition                                                                                                                                                                                                                                                                     |
| -------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger.manual`                       | Start                            | Keep, functional today.                                                                                                                                                                                                                                                         |
| `trigger.schedule`                     | Start                            | Keep code, hide from discovery until real.                                                                                                                                                                                                                                      |
| `trigger.webhook`                      | Start                            | Keep code, hide from discovery until real.                                                                                                                                                                                                                                      |
| `source.fapi_inputs`                   | Input form                       | Reclassify — becomes the FAPI preset of a generic typed-input collector.                                                                                                                                                                                                        |
| `source.web_url`                       | Source                           | Keep as-is.                                                                                                                                                                                                                                                                     |
| `source.pdf_document`                  | Source                           | Keep as-is (raw ingestion; parsing is a separate Prepare-data step, already true today).                                                                                                                                                                                        |
| `source.database_query`                | Source                           | Keep as-is.                                                                                                                                                                                                                                                                     |
| `source.http_json`                     | Source                           | Keep as-is.                                                                                                                                                                                                                                                                     |
| `source.currency_rate`                 | Source                           | Keep as-is — genuine external data, not a config carrier.                                                                                                                                                                                                                       |
| `source.manual_table`                  | Source                           | Keep as-is — user-typed data is legitimately a source.                                                                                                                                                                                                                          |
| `source.ai_search`                     | Source                           | Keep, flagged as the AI-assisted variant of Source rather than implying a different pipeline stage.                                                                                                                                                                             |
| `source.calculation_rules`             | Calculate (config)               | Fold into Calculate's own configuration. Preserve the current "external rules override inline" behavior as an **advanced** option (lets a separate rulebook feed a Calculate block), not a prominent top-level block.                                                           |
| `source.aggregation_rules`             | Prepare data (config)            | Fold into Prepare data's aggregation step config.                                                                                                                                                                                                                               |
| `source.rollup_rules`                  | Prepare data (config)            | Fold into Prepare data's rollup step config.                                                                                                                                                                                                                                    |
| `source.keyword_rules`                 | Prepare data (config)            | Fold into Prepare data's classification step config.                                                                                                                                                                                                                            |
| `logic.pdf_table_parser`               | Prepare data                     | Becomes an "extract structure" sub-option.                                                                                                                                                                                                                                      |
| `logic.pdf_text_parser`                | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.excel_table_reader`             | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.ocr_extract`                    | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.api_response_parser`            | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.transformation`                 | Prepare data                     | "Map/transform fields" sub-option.                                                                                                                                                                                                                                              |
| `logic.keyword_mapper`                 | Prepare data                     | "Classify" sub-option, using the folded-in keyword-rules config.                                                                                                                                                                                                                |
| `logic.category_rollup_aggregator`     | Prepare data                     | "Group/aggregate" sub-option.                                                                                                                                                                                                                                                   |
| `logic.hierarchy_aggregator`           | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.aggregation`                    | Prepare data                     | Same.                                                                                                                                                                                                                                                                           |
| `logic.calculation_engine`             | Calculate                        | Core stays; add conditional/comparison support; fix default config (see below).                                                                                                                                                                                                 |
| `logic.portfolio_workpaper`            | Workpaper                        | Reconcile into `field.field_block`'s model; retire once parity is confirmed.                                                                                                                                                                                                    |
| `review.required_input_check`          | Validate                         | Becomes a rule within Validate.                                                                                                                                                                                                                                                 |
| `review.unmatched_rows_check`          | Validate                         | Same.                                                                                                                                                                                                                                                                           |
| `review.low_confidence_warning`        | Validate                         | Same.                                                                                                                                                                                                                                                                           |
| `review.confidence_check`              | Validate                         | Same.                                                                                                                                                                                                                                                                           |
| `review.formula_consistency_check`     | Validate                         | Same.                                                                                                                                                                                                                                                                           |
| `review.output_readiness_check`        | Validate                         | Same.                                                                                                                                                                                                                                                                           |
| `review.fx_rate_review`                | Validate                         | Becomes a rule _template_ (generalize to "external value sanity check," FX as a preset).                                                                                                                                                                                        |
| `review.approval_gate`                 | Approval                         | Its own block, unchanged in spirit.                                                                                                                                                                                                                                             |
| `output.csv_export`                    | Export                           | Format choice within Export.                                                                                                                                                                                                                                                    |
| `output.excel_export`                  | Export                           | Same.                                                                                                                                                                                                                                                                           |
| `output.canonical_json`                | Export                           | Same.                                                                                                                                                                                                                                                                           |
| `output.pdf_report`                    | Export                           | Same.                                                                                                                                                                                                                                                                           |
| `output.evidence_pack_preview`         | Export                           | Same.                                                                                                                                                                                                                                                                           |
| `output.taxprep_handoff`               | Export                           | Destination choice within Export.                                                                                                                                                                                                                                               |
| `output.onesource_handoff`             | Export                           | Same.                                                                                                                                                                                                                                                                           |
| `ai.proposal_only` (4 palette entries) | Prepare data / Input form (mode) | Becomes an "AI-assisted" toggle on the block it currently masquerades as a sibling of, not its own type. The 4 existing named entries collapse into however many distinct AI-assist _contexts_ actually differ (classification suggestion, document interpretation note, etc.). |
| `field.field_block`                    | Workpaper                        | Becomes the Workpaper block's foundation.                                                                                                                                                                                                                                       |
| `protected.protected_input`            | (flag, not a block)              | See "Not a block type" above.                                                                                                                                                                                                                                                   |
| `protected.protected_result`           | (flag, not a block)              | Same.                                                                                                                                                                                                                                                                           |

Net effect: roughly 46 current tool IDs become something like 9 block types
each offering configuration (format/rule/sub-option choices), rather than a
near-1:1 executor-per-palette-entry model. Exact executor file consolidation
(which `run.ts` implementations actually merge vs. stay separate internally)
is an implementation-time decision per block, not fixed here.

## The Calculate block, specifically

Keep: named formulas, typed inputs with units/rounding/currency metadata,
full formula trace (expression + substituted values) for evidence — this
part of today's design is genuinely good and matches what fiscal (and most
serious) calculation work needs.

Fix:

1. **Default config** — new Calculate blocks start empty (or a one-line
   generic example), not pre-seeded with FAPI's formula list. FAPI's formula
   set becomes an explicit, named preset you choose.
2. **Add conditional logic to the formula language** — comparison operators
   (`>`, `<`, `>=`, `<=`, `==`) and an `if`/`case`-style construct. This is
   new engine work in `lib/workflow-core`'s formula parser and
   `calculation-engine/run.ts`'s evaluator, not a UI change. Treat as a
   prerequisite before calling Calculate "done" for general use — without
   it, any threshold- or bracket-based rule (common well beyond tax) can't be
   expressed.

## Shared visual shell — one component, not nine layouts

A single `<WorkflowBlockCard>` owns all chrome. Every block type supplies
_content_ into fixed slots; none render their own top-level layout. Register
this contract in `docs/chat-hub-registry.md` once built, so the existing
`ui-element-guard` skill catches a future one-off block layout before it ships.

**Compact state** (identical structure for every block type):

- Color-coded icon badge — one color per family (Start / Input form / Source
  / Prepare data / Calculate / Validate / Approval / Workpaper / Export),
  reused on the canvas node so the color means the same thing everywhere.
- Block name.
- One readiness badge — same four states and colors everywhere: _not
  configured_ / _waiting on input_ / _computed_ / _needs review_.
- One key-result line, same position and size everywhere, content varies:
  Source → "Loaded: Trial Balance.xlsx · 342 rows"; Calculate → "Gross:
  213,923 CAD"; Validate → "0 issues, 3 warnings"; Approval → "Approved by
  Sophia · Oct 10."

**Expanded state** — the same four tabs, same order, every block type:

1. **Inputs** — what it needs, where each value comes from, satisfied or not.
2. **Logic** — what the block does (formula, rule, mapping, document type),
   framed consistently as "here's the rule" regardless of block type.
3. **Results** — what it produced, with evidence/trace. Always read-only,
   everywhere, including Build — a result is a record, not something hand-edited.
4. **Review** — approval state, warnings, exceptions scoped to this block.

A tab with thin content for a given block type (e.g. Start's Logic, or
Approval's Results) still renders — with a consistent "nothing here" state —
rather than disappearing or the block type inventing a replacement structure.

### Build vs. Chat/Run — same component, mode-aware per tab, not two shells

Refined from "edit vs. view" into a precise per-tab rule, because it already
matches how Trigger forms and approval gates behave in this app today:

| Tab     | Build                                                        | Chat / Run                                                                                                       |
| ------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Inputs  | Can rewire what feeds this input (reconnect source/formula). | Can supply a value for something still missing (exactly like today's Trigger form) — can't rewire the graph.     |
| Logic   | Editable (change the formula/rule).                          | Read-only display of the rule.                                                                                   |
| Results | Read-only (everywhere, always).                              | Read-only.                                                                                                       |
| Review  | Can define what gets checked.                                | Can take the review action itself (approve, flag, override-with-reason) — already how approval gates work today. |

`mode` is a function of **surface** (build / chat / run-readonly) **and**
**role permission** (Owner/Editor/Viewer) — a Viewer in Build shouldn't see
edit affordances either, consistent with the existing access model
(`permits(workspace.role, 'execute')`).

**Open question, not yet decided**: whether this shell should also become
the same component chat's predefined cards use (`tool-result-card`,
`WorkflowChoiceList`, etc. — see `docs/chat-hub-registry.md`), giving the
whole app one visual card language, or stay a deliberately separate system
that just follows the same principle. Flagged for a future decision, not
blocking this design.

## Recommended sequence

1. **Simplify discovery, fix defaults.** Palette shows the 9 target blocks;
   FAPI defaults move into an explicit preset; Start advertises Manual only.
   No executor code changes yet.
2. **Build `<WorkflowBlockCard>` and the mode-aware tab behavior**, starting
   with Calculate and Workpaper (the two Codex's original review named as the
   starting pair). Add conditional/comparison support to the formula engine
   in this phase — it's load-bearing for Calculate being usable generally.
3. **Consolidate executors** per the mapping above, block by block, each with
   its own direct calculation/input-validation tests using independently
   specified expected values (per `AGENTS.md`'s existing verification table).
4. **Add branching and versioned, callable subworkflows**, then validate the
   whole design against both a real tax workflow and a general
   document-review workflow before expanding the palette again — per the
   original recommendation, and worth keeping as its own phase rather than
   folding into phase 3.

Each phase should ship and be verified independently; this is not a
single large change.

## Remaining open items

- Exact scope confirmation on "delete all current workflows" (definitions
  only, not uploaded source data — stated above, worth one more explicit
  confirmation before any deletion actually happens).
- Shared shell for chat cards too, or kept separate (see above).
- `protected.*` flag design (who sets/clears "locked," what overriding
  requires) — not designed here, called out as needed before Review tab
  behavior around overrides can be finalized.
- Which of today's `logic.portfolio_workpaper` capabilities (if any) need
  porting into `field.field_block` before the former can be retired —
  needs a direct read of both implementations, not done in this pass.
