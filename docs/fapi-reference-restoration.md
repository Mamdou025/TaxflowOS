# FAPI reference display restoration

## Scope and reference

The user selected `DevReplit` (`c667c8b`) as the FAPI display/output reference on
2026-10-09, and clarified that duplicate removal applies to FAPI rather than other
workflow types. This change restores that presentation on the current saved-session
engine. It does not install assistant-ui, modify tax formulas, delete personal
workflows or change authentication, approval policy or server persistence.

The working tree already contained extensive unrelated work, including generic
calculation-input forms, Field worksheets, API sources and the ChatGPT plugin.
Those changes are preserved. The file inventory below describes this task's delta
against its starting working-tree snapshot, not the entire Git diff against HEAD.

## Observable behavior

- One Calculate FAPI discovery/menu entry opens the canonical workflow. The extra
  FAPI Build, source, output, worksheet-gallery and page menu choices are removed.
  Compatibility links still resolve; other workflow types remain available.
- Compatible FAPI runs show Collect, Classify, Compute and Review stages, using the
  reference's source/rule/engine/checkpoint tones and staged entrance, progress halo
  and completion animations. Reduced-motion preferences disable animation.
- The stages group actual saved blocks. Opening them never executes those blocks.
  Forms remain bound to the active session; folding preserves unapplied changes.
  Apply uses the existing validation and affected-step recalculation commands.
  Switching an open Run panel to Results also retains its unfinished form edits.
- The application always presents a prescribed FAPI result table from recorded
  fields: Gross, Deductions, FAPI brut, FAT deduction and Net FAPI, with source
  currency and CAD columns. Supporting worksheet lines follow the reference's
  FX, A, expenses, B, 95(2), A.1/A.2/C, D–H and FAT sections.
- The full worksheet is available inline and in Results for the exact session or
  historical snapshot. CSV export includes version/revision, source references,
  recorded precision and explicit availability states. Missing, invalid and stale
  amounts are never converted to zero or freshly calculated by the view.
- Available results do not imply human approval. An input change continues to
  invalidate dependent results and their review through the existing commands.

The historical UI's hardcoded company/year and sample/zero fallbacks are excluded.
Its nonfunctional Excel-export control is replaced with a working, explicitly
labelled CSV export. Highly customized FAPI graphs with incompatible output fields
or currency units retain the generic workflow display rather than mislabelling
their results. Generic Field worksheets remain unchanged for other workflows.

## Ownership and changed files

Paths are relative to the repository root. Every row describes purpose and
before/after behavior for this task; pre-existing edits in these files are separate.

| File                                                                                                   | Purpose and change                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-workflow-steps.tsx`                     | New presentation adapter: exposes four reference stages over saved blocks, retaining mounted forms instead of building a second execution state.                                                       |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-timeline.css`                       | New reference animation styles with reduced-motion handling; no execution behavior.                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-session-result.ts`                      | New read projection for prescribed result fields, graph compatibility and revision-specific CSV. Reads values instead of calculating them.                                                             |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-session-worksheet.tsx`                  | New prescribed summary/full worksheet view, with explicit value states, provenance, recorded formulas and export. Replaces generic FAPI output presentation.                                           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`                  | Composes the reference FAPI preview, stages, live forms and worksheet in Chat/Run; retains generic rendering for other definitions and all existing commands.                                          |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/saved-workflow-run.tsx`                      | Results renders the prescribed FAPI worksheet for the exact current session or captured historical session; viewing does not execute or update it.                                                     |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/fapi/fapi-template.ts`             | Canonical active definition moved out of sample-workflows. Formula, source and graph behavior is unchanged.                                                                                            |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/sample-workflows/fapi-template.ts` | Old location becomes a compatibility re-export; no intended behavior change.                                                                                                                           |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/fapi.ts`                  | Template construction imports the new definition owner. No intended behavior change.                                                                                                                   |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/fapi.ts`               | Runtime metadata imports the same rules from their new owner. No intended calculation change.                                                                                                          |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts`  | Removes an unused alternate FAPI blueprint, imports the canonical definition and names its entry FAPI Calculation. Other templates and saved definitions are unchanged.                                |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/workflow-composer-search.ts`                  | FAPI search returns one workflow instead of parallel Build/source/output/page choices.                                                                                                                 |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx`                            | Removes redundant FAPI menu commands and reuses Calculate FAPI in the command palette and Workflows menu.                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`                         | Routes new FAPI requests toward the canonical workflow rather than advertising a legacy worksheet alias.                                                                                               |
| `artifacts/ai-workflow-builder/src/shared/stores/resource-registry.tsx`                                | Marks the old FAPI page as compatibility-only: still resolvable for saved links but absent from discovery.                                                                                             |
| `artifacts/ai-workflow-builder/src/components/worksheet-shell.tsx`                                     | Removes the duplicate FAPI gallery card; other worksheet types stay available.                                                                                                                         |
| `tests/unit/fapi-session-result.test.ts`                                                               | Adds independent assertions for missing/zero, recorded CAD values, stale/invalid data, compatible field contracts and export precision/provenance. No application behavior.                            |
| `e2e/fapi-reference-display.spec.ts`                                                                   | Adds isolated browser coverage for stages, reduced motion, persistent inputs, prescribed output, recalculation, history and export. No application behavior.                                           |
| `playwright.reliability.config.mjs`                                                                    | Includes the new browser regression file in the existing isolated reliability suite. No application behavior.                                                                                          |
| `e2e/phase-7-navigation.spec.ts`                                                                       | Tests one FAPI discovery choice and continued historical-link navigation without executing or losing the chat draft.                                                                                   |
| `e2e/workflow-reliability.spec.ts`                                                                     | Updates the existing canonical FAPI name assertion; other edits were present before this task. No application behavior.                                                                                |
| `e2e/workflow-session.spec.ts`                                                                         | Opens the existing collapsed Document step before asserting upload visibility in the chat-restore test. Identity, history and no-execution expectations are unchanged; no application behavior change. |
| `tests/smoke/production-ui.mjs`                                                                        | Updates the same canonical-name selector for the production UI check. No application behavior.                                                                                                         |
| `docs/ARCHITECTURE.md`                                                                                 | Records the FAPI presentation owner, canonical definition location and calculation-free view boundary. No application behavior.                                                                        |
| `docs/FUNCTIONALITY.md`                                                                                | Describes the restored FAPI experience and scope of duplicate removal. No application behavior.                                                                                                        |
| `docs/unified-workflow-execution.md`                                                                   | Distinguishes the four FAPI display stages from the generic block accordion; execution semantics remain authoritative. No application behavior.                                                        |
| `docs/product/decisions.md`                                                                            | Records the user-selected reference and scope without changing the separate ChatGPT plugin apply/recalculate policy. No application behavior.                                                          |
| `docs/fapi-reference-restoration.md`                                                                   | This scope, file inventory and verification record. No application behavior.                                                                                                                           |

Hidden historical fixtures remain for saved-backup and regression compatibility.
The active graph still imports its existing shared keyword rules; moving the
definition did not change those rules. There is no database cleanup or automatic
deduplication of similarly named personal FAPI workflows.

## Verification

- Pinned task-local Node 24.21.0 and pnpm 10.26.1: doctor passed. The default shell's
  different bundled versions were rejected; no global runtime change or dependency
  install was made. Existing setup prose mentioning pnpm 10.33.2 is inconsistent
  with package.json and remains outside this change.
- `pnpm run test:unit`: 216 passed, 0 failed.
- `pnpm run verify`: passed contracts, architecture, maintained formatting,
  workspace/test types, 216 unit tests, 37 worker tests and 50 workflow-core tests.
  After the final presentation review fixes, frontend and test type checks passed
  again. The five focused projection tests also passed after the final caption,
  source-history and explicit-unit compatibility fixes.
- The initial browser attempt timed out during app preparation before assertions;
  checks were then sequenced in one isolated run. New test-fixture defects
  were corrected: transferring the entire history inside a short poll, trying
  to dismiss a menu by clicking its covered trigger, and using a menu only
  available after a conversation starts. The obsolete run was stopped before
  restarting corrected cases. Expected calculations and history/navigation
  assertions were retained; test timeouts were not raised.
- Frontend production build: passed (6m 16s). It emitted source-map diagnostics,
  Node-module browser externalization warnings and large-chunk warnings in existing
  application/dependency paths. Those warnings remain; source-map upload was
  disabled for this local build.
- Maintained formatting checks, Git whitespace checks and all 42 relative links
  in the five affected documents passed. Final baseline comparison matches the
  listed task changes; the root reliability configuration is checked separately.
- Corrected targeted browser run: 5 passed, 1 failed. FAPI recalculation, retained
  drafts, CSV export, current/historical Results, unique discovery, legacy links,
  template loading and generic input/recalculation/End checks passed. The separate
  initial reduced-motion/empty-result and primary-navigation cases also passed.
- The failing document-workflow test assumed its upload control was immediately
  visible. The final screenshot confirmed Chat opened, with Document collapsed
  because the existing accordion prioritizes required calculation inputs. The
  accordion and this priority match the starting snapshot. The test now expands
  Document before its existing assertions; no navigation or application fix was
  made. The first repeat had already loaded the older test. The final corrected
  chat-restore test passed (1 passed, 0 failed, 1.1m), including reloads, the exact
  historical run, refusal to substitute a missing run and zero executions.
- Full FAPI workflow/worksheet screenshot inspected successfully after removing
  the isolated fixture's inherited viewport clipping for capture only. The main
  FAPI calculation/export/history/draft test passed again with that capture.
- All eight selected browser cases therefore have passing final results across
  these focused runs. There are no remaining assertion failures in those cases.
  The entire reliability suite, live providers and production UI smoke suite were
  not run; the production bundle was built successfully.

These checks use synthetic records, mocked browser persistence and local engines.
The original user document was not provided, and no live Sina/MicroSina request,
deployed session, database migration or deployment was performed. The reference
branch establishes the requested display baseline, not proof of numerical parity
for an unseen document or a separately edited saved workflow.
