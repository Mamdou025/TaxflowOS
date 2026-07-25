# Workflow Studio Next Steps

Date: 2026-05-04

This document lists the next maintainability steps for Workflow Studio. The target product model remains:

`Source -> Logic -> Review / Validation -> Protected -> Output`

## Current Focus

Stabilize the Structure Sheet as a generated worksheet/runtime preview. It should explain hierarchy and runtime shape without duplicating inspector formula/code editing.

## Completed In Current Pass

- Moved pure Structure tree generation into `src/runtime/generate-structure-view.ts`.
- Kept Structure rendering in `components/workflow/workflow-studio-shell.tsx`.
- Kept Source rows read-only in Structure by using a generated row editability helper and existing action guards.
- Routed Structure edge creation through the command-backed `connectBlocksAtom` instead of direct edge state mutation.
- Added a code comment explaining the boundary between canvas, inspector, and Structure.
- Clarified the Bank of Canada FX Rate Source canvas icon so it reads as API-backed while preserving the normal Source shape and existing review/protected FX path.
- Stabilized the local Run action so workbook-backed Source/Logic/Review/Protected/Output workflows use the local runner, always clear the loading state, and do not backend-poll local run ids.
- Fixed run output coherence so mapped categories feed Aggregator inputs, Aggregator totals feed named Protected candidate values, and Evidence/Canonical outputs include calculation totals and formula traces.
- Fixed workspace run visibility so the Input/Output panes read the current in-memory local run before falling back to compacted browser run history.
- Relabeled the combined Hierarchy Aggregator as Rollup & Calculation Engine in user-facing UI while keeping the existing runtime tool id and subtype.
- Added clearer rollup/formula/constant/final-result/official-line grouping in the Aggregation Rulebook, Code tab, Runs proof, and output table views.
- Wired Required Input Check and Output Readiness Check into the working FAPI-style graph.
- Added validation-gated protected finality so unresolved blocking unmatched rows keep protected result candidates review-ready instead of clean-final.
- Updated the FAPI smoke guard to assert calculation values, validation status, output readiness, and review-ready finality.
- Added split-path v1 tools for Category Rollup Aggregator, Rollup Rules Source, Calculation Engine, and Calculation Rules Source while keeping the combined Rollup & Calculation Engine available.
- Updated the FAPI smoke guard to verify both the combined compatibility path and the split rollup/calculation path.
- Made Calculation Rules Source optional for Calculation Engine (2026-05-06):
  - Calculation Engine now supports two modes: inline formulas (stored in block config) and external rules (from connected Calculation Rules Source).
  - Auto mode (default) uses external rules if connected, else inline formulas.
  - The default working FAPI-style workflow now uses inline formula mode; no Calculation Rules Source edge is required.
  - Inline formula editor added to the Calculation Engine Properties tab (mode selector, available values panel, formula list with edit/delete/add).
  - Code tab shows active mode and generated formula list.
  - Runs tab shows formula trace, calculated results, and resolved formula mode.
  - Calculation Rules Source remains available in the catalog for advanced/governed formula packs.

## Next Refactor Steps

1. Move Structure rendering into `components/workflow/structure-sheet/`.
2. Add unit tests for `generateStructureView` with these shapes:
   - Output -> Protected -> Logic -> Source.
   - Protected root without Output.
   - Logic with child Logic and Source leaves.
   - Cycle protection.
3. Add command-level tests for Structure actions:
   - Add child Logic.
   - Create downstream Logic from Source.
   - Rename non-Source row.
   - Toggle runtime visibility.
   - Block Source edit/delete attempts.
4. Continue moving direct workflow mutations into `src/state/workflow-commands.ts`.
5. Split `workflow-studio-shell.tsx` so it only composes panels and does not own Structure internals.
6. Keep formula/code editing in inspector Code tabs only.
7. Keep the Vercel connector-pull -> default block -> configuration menu -> Properties/Code/Runs flow intact.
8. Continue reducing modal visual noise panel by panel, especially nested border-heavy source, logic, and run preview cards.
9. Split Aggregation Rulebook editing out of `rule-source-editor.tsx` into a focused aggregation rulebook editor component.
10. Teach the Aggregation Rulebook editor to discover category options from the connected Keyword Rulebook, not only from the current aggregation rules.
11. Add tests around calculator-built aggregation nodes:
   - category rollup only;
   - node plus number formula;
   - multiply and divide formulas;
   - invalid/missing references.
12. Decide whether rulebook blocks should replace the generic right output pane with a quieter rulebook output summary.
13. Wire Keyword Rulebook left-outline selection into the keyword category editor.
14. Continue reducing borders in source and output panes now that the overlay theme is light.
15. Add a friendlier aggregation formula picker that displays category labels while storing stable `category:<id>` and `node:<id>` refs.
16. Add runtime tests for formula expressions with precedence, parentheses, divide-by-zero, and missing references.
17. Decide whether constant leaves in the aggregation cascade should become selectable standalone constant nodes or remain editable through parent formulas.
18. Add a left-pane `New category` shortcut for Keyword Rulebook so creation can start from the outline, matching Aggregation Rulebook.
19. Add a small read-only audit viewer for `workflow-studio.change-log.v1`.
20. Move remaining sample/demo replacement mutations behind explicit workflow commands or documented fixture loaders.
21. Add a `duplicate-block` command before introducing block-level duplication in the UI.
22. Add command tests that assert local audit events are emitted for block, edge, protected, AI proposal, import, export, and publish actions.
23. Add an upload test that parses `workflow_studio_fapi_sample_source.xlsx` and asserts sheet imports for Trial Balance, Keyword Rules, Aggregation Rules, FAPI Inputs, and Expected Results.
24. Add runtime tests for the FAPI-style working workflow after the workbook import:
   - Keyword Mapper mapped count = 18.
   - Unmatched count = 1.
   - Low-confidence count = 1.
   - A = 4950.
   - Gross = 5650.
   - Deductions = 400.
   - FAPI Brut = 5250.
   - FAT Deduction = 190.
   - Net FAPI = 5060.
   - Net FAPI CAD = 6831.
25. Replace the Currency Rate Source placeholder FX lookup with the approved production rate provider once backend integration is in scope.
26. Review the icon taxonomy for API-like Sources so API request, API response, and currency-rate Sources share one intentional icon pattern without losing Source block shape.
27. Add a browser regression test for running the uploaded-workbook workflow from a saved route id.
28. Add a localStorage quota regression test for large workbook run records so compaction remains non-blocking.
29. Add a run-error summary view for missing required Source outputs, so a failed local run explains what to connect or upload next.
30. Add browser regression coverage for Input/Output pane role coherence:
   - Keyword Mapper `mapped_rows` appears as Hierarchy Aggregator `mapped_rows`.
   - Hierarchy Aggregator `final_totals.Net FAPI` appears as Protected Net FAPI candidate value.
   - Evidence Pack and Canonical JSON show category totals, node totals, final totals, and formula trace.
31. Add a browser quota regression that verifies current run outputs remain visible even when persisted local run history is compacted.
32. Add a small visible marker in the Runs panel when a stored local run is compacted and the user should re-run to inspect full row-level payloads.
33. Add browser regression coverage for Rollup & Calculation Engine Runs sections:
   - Category totals render as a table.
   - Rollup/group totals render separately from formula/final totals.
   - Formula trace renders as trace rows, not raw JSON.
34. Split the Aggregation Rulebook editor into focused components for cascade selection, mode-aware node editing, calculator expression building, and advanced JSON import/export.
35. Keep the combined Hierarchy Aggregator runtime available for compatibility while evaluating whether the split Category Rollup Aggregator and Calculation Engine should become the preferred working workflow path.
36. Add browser regression coverage for the uploaded workbook Run path so `Keyword Mapper.outputs.mapped_rows` and `Rollup & Calculation Engine.inputs.mapped_rows` populate immediately after clicking Run.
37. Add browser regression coverage for Required Input Check and Output Readiness Check after uploading the workbook.
38. Add a visible reviewer override workflow for unresolved unmatched rows so final locking can be explicit and auditable.
39. Decide whether low-confidence warnings should ever block Protected Result final locking in the generic workflow model.
40. Keep `scripts/smoke-fapi-calculation-simulation.ts` as a fast deterministic guard, and add a real `.xlsx` upload smoke once `workflow_studio_fapi_sample_source.xlsx` is available in the repo or test fixtures.

## Remaining Risks

- `components/workflow/workflow-studio-shell.tsx` still owns too much rendering and panel composition.
- Selection state still directly sets React Flow selected flags in the shell; this is UI state, but it remains mixed with workflow preview behavior.
- Structure actions now use command-backed atoms, but there is not yet a dedicated Structure command facade.
- Source read-only protection is enforced in Structure UI and partially in command metadata rules; broader command-level Source delete/edit policy still needs product confirmation for draft Sources.
- There are no unit tests yet for the generated Structure tree.
- The Aggregation Rulebook calculator derives categories locally; cross-block category discovery should be added once rulebook editors can read connected block context safely.
- The app chrome is now forced light while the canvas remains dark; any future theme toggle needs an explicit design for canvas-vs-workspace contrast.
- The local audit log is intentionally best-effort and is not yet synced to backend workflow persistence.
- Some workflow-level actions still use direct state replacement for fixtures/imports; they now record audit events but are not all routed through commands.
- Local run history is now compacted when payloads are too large, but oversized workbook scenarios still need automated browser coverage.
- The Input/Output panes now follow role bindings more closely, but multi-source inputs still need richer labels when several upstream roles feed one input role.
- Current-session run outputs now prefer in-memory state, but persisted history can still become summary-only for very large workbook runs.
- The FAPI-style smoke calculation passes with fixture rows, but the browser upload and Run button path still needs explicit regression coverage.
- Protected result finality now blocks on unmatched rows in the local sample, but the reviewer override UX is still only a configuration shape.
