# New FAPI Calc

This folder contains the replacement definition for **New FAPI Calc**, built with generic blocks. Its main worksheet now presents FAPI lines and accounting support together. It does not alter the global FAPI template or other saved workflows.

`new-fapi-calc.backup.json` contains one portable draft and saved version 1, with no runs, approvals, mock results, or entered tax values. Its portable identity remains `custom:new-fapi-calc-2024` and its name is `New FAPI Calc`. To replace an already saved app workflow, select that workflow in **Workflows**, open its storage status, select this file under **Replacement workflow backup**, review the preview, and choose **Replace workflow & save version**. The command preserves the selected app workflow's identity, older versions, runs and sessions; it also checkpoints an unsaved draft before creating the replacement version. Confirm **Saved to server** separately after replacement. Import creates a separate copy and is not a replacement operation. Artifact generation alone does not update the saved app workflow.

## What the workflow does

The supplied `PNL-anonymisé (1).xlsx` was read through the application's Excel parser. It describes January–December 2024 in EUR. The saved source includes its parsed cell grid, 72 normalized rows, row coordinates, extraction revision, and SHA-256. It does not include the original Excel binary or pretend that one is stored. Keep the original file; the source exposes an `ORIGINAL_NOT_STORED` warning.

Exact account-code keyword rules classify 69 detail accounts into accounting categories. Exact full-label rules classify Gross Profit, Operating Profit and Net Profit/(Loss) as three comparison references. No profit reference is included in the four financial rollup groups. Unknown accounts remain unmatched for review. Account `68010 — Loyer`, EUR 223,519.91, is office rent expense. The original amount signs are preserved, including the credits and debits among the other items.

The first generic Calculation Engine exposes four accounting subtotals and rebuilds the P&L from detail categories:

| Component                        |          EUR |
| -------------------------------- | -----------: |
| Sales and revenue                | 3,866,031.62 |
| Cost of sales                    | 2,564,053.61 |
| Gross profit                     | 1,301,978.01 |
| Overheads                        |   813,452.21 |
| Operating profit                 |   488,525.80 |
| Other items, with original signs |  -180,446.38 |
| Net profit                       |   308,079.42 |

Gross profit is sales minus cost of sales. Operating profit subtracts overheads. Net profit adds the signed other items. Three comparison formulas subtract the separate workbook profit references, and the review block checks that all three differences are zero within EUR 0.01. Its configuration contains no fixed expected profit, so a replacement workbook with compatible reviewed mappings can reconcile to its own references.

The second generic Calculation Engine retains the existing FAPI line and summary formulas unchanged. Its 17 tax operands are explicitly required manual inputs and have no default values. They are listed in `verification-evidence.json`, with user-facing labels in the workflow. Reviewed FAPI income and eligible FAPI expenses are distinct from accounting revenue and expenses; the accounting mapping does not establish their tax treatment. Enter reviewed values, including explicit zero when appropriate, or explicitly select an appropriate directly connected source value. Provider choices change this run only and do not bypass required source or review steps. This separate engine lets the P&L results remain visible while tax inputs are missing.

The generic **FAPI worksheet** Field declares 36 lines: all 26 existing FAPI lines and EUR/CAD summary results, plus 10 accounting support lines covering the four subtotals, three profits and three reconciliation differences. **Net FAPI in EUR and CAD** are the two primary results, without a repeated group heading. Under **Calculation summary**, nine summaries show gross FAPI, deductions, FAPI before foreign-tax deduction and foreign tax deduction in both currencies, plus the exchange rate. The remaining 15 tax lines and 10 accounting lines open under **FAPI lines** and **Accounting support**. Money displays two decimals; the exchange rate and relevant tax factor display six. Display rounding does not change calculation values.

The takeaway from the worksheet comparison is to put the main result first and let the user open its formula and supporting values. This artifact expresses that through generic `presentation`, `group`, `description` and `decimalPlaces` metadata. Each line still identifies its calculator and result key, so matching names in another calculator cannot silently replace it. The worksheet displays declared results before calculation and links them to formula inputs, providers and evidence. The Field owns presentation; formulas and value resolution stay with the existing calculation engine. Trigger and the worksheet use the same run-input commands.

Before reviewed tax inputs are supplied, the real workbook produces EUR 308,079.42 accounting net profit and zero reconciliation differences; **Net FAPI remains missing and the checklist identifies the 17 required tax operands**. Accounting income does not automatically become taxable FAPI income. Once the required values are explicitly supplied or bound to reviewed sources and the calculation runs, the same primary result cells show the resulting FAPI amounts. Missing values are never displayed as zero.

The API block uses the generic API source with the public Bank of Canada Valet request for EUR/CAD observations during 2024. It retains the actual response, response metadata, fetch time and exact request signature. The calculation binds `fxRate` to the API's `namedValues.fxRate`. The captured arithmetic mean is 1.4817683999999995 CAD per EUR (250 observations). Currency conversion occurs in the existing calculation formulas. The choice of an annual mean is contextual configuration, not a conclusion that this method is legally required for this filing. No manual FX fallback was supplied.

The graph contains a trigger/checklist, workbook source, keyword mapper, unmatched review, category rollup, P&L calculator, reconciliation review, generic worksheet Field, API source, FAPI calculator and final evidence output. It retains the existing 11 block IDs; `new-fapi-pnl-results` now identifies the worksheet Field. All 14 connections use declared family relationships and compatible data ports. Both calculators feed the Field, which feeds the final evidence output. Both reviews still feed the final evidence output. Trigger connections initiate collection without inventing data ports on a source. The saved app's existing document readiness condition is retained with its existing advisory semantics. No workflow-specific new block type was introduced.

## Verification and limits

`build.ts` creates the definition using the normal catalog factory, `createWorkflow`, `saveVersion`, portable backup writer and import validator. It asserts that each family relationship is allowed, every data edge names real compatible ports, and all 36 worksheet lines identify a formula in a directly connected calculator. It executes the actual workbook and captured API through the shared durable executor, checks all mappings and original signs, checks that the three profit references are excluded from financial groups, and independently verifies all four category rollups and three profit figures. It also verifies that all 17 missing tax values stop FAPI and appear as required in guided-run readiness, while the workbook source is ready. A separate shared-projector check uses the actual accounting results before attempting tax: 10 accounting lines are current and 26 tax lines remain missing, without substituted zero values. Complete Field values and final workbook/API provenance are checked only in the explicitly synthetic arithmetic smoke test.

The separate synthetic arithmetic smoke test supplies invented numbers only in an in-memory clone to check the existing FAPI arithmetic and API binding. It produces EUR 800 net FAPI and converts that with the captured rate. Its test inputs/results are clearly marked in the verification report and never enter the importable workflow. The real workbook has no calculated FAPI result until reviewed tax inputs are supplied.

The generator also repeats that synthetic case through guided-session commands with 17 explicit run-only input choices. It checks every required block, all 36 current Field values, and final workbook/API provenance. This covers the isolated-block handoff of transitive source context, with no review acknowledgement used to bypass a missing or stale result. The synthetic session is discarded and never added to the backup.

The browser specification has two separate scenarios: the real workbook with 17 tax operands still missing, and an explicitly named synthetic run that enters all 17 values through the UI. Both passed on 2026-10-05 in run `04a727d1-dc03aeff-a20d-4905-8b8b-2ff037a36503`, alongside 13 generic calculation/worksheet browser cases. The synthetic run displayed EUR 800.00 and CAD 1,185.41 (raw CAD 1,185.41472), reached the final output and verified that saved definitions retain no tax values or defaults. It must not be treated as a result for the user's tax facts. The observer loads its modules before execution, polls compact state synchronously, and retains a separate DOM responsiveness check and the existing 30-second progress limit. Apply-to-completion took 15.1 seconds in that isolated development run; this is not a production latency guarantee. Screenshots and source/mapping checks passed. These fixtures mock workflow-library writes and do not verify live model replies or Chat conversation persistence.

Two inherited formula details remain visible for review: line A1 multiplies `debtForgiveness` by 2; the existing 95(2) line reads the identifier `canadianRules95_4`. These were preserved, not independently validated as tax policy. No assumption about the P coefficient, inclusion rate, relevant tax factor, foreign tax paid, or any tax adjustment was made.

The current application supports explicit review acknowledgements in guided runs. This artifact does not implement a new non-overridable approval policy. A raw full-graph verification returns an expected tax-input error while leaving the independent P&L results available. The worksheet UI can show those available values before the Field's full execution dependencies are ready; opening the worksheet does not bypass them or compute missing tax results. The previous standalone P&L evidence output has been replaced by this worksheet, so final evidence export still waits for the complete graph. Use the guided run for input collection and review; no final approval has been pre-recorded.

For a replacement workbook, use **Run → Upload run source → Replace**. The current Build upload/mapping-edit path can retain an older `documentExtractions` capture, so editing only that path may replay stale extracted rows. The Run replacement path is the verified path for replacing this captured source. Review the new account coverage, period, currency and API parameters after replacement.

## Files

- `build.ts`: artifact generator and repeatable core verification. Reads the real workbook; reuses the authentic captured API response when its request signature matches.
- `tsconfig.json`: checks the generator's types using the project's existing TypeScript settings; no runtime behavior change.
- `new-fapi-calc.backup.json`: portable saved workflow to import.
- `api-capture.json`: actual public API payload and provenance, separate from test data.
- `verification-evidence.json`: actual source hash, mapping counts, category/row trace, reconciliation, missing inputs, and the separately labelled synthetic smoke result.
- `browser-verification.spec.ts` and `playwright.config.mjs`: separate isolated-browser checks of normal import and guided-run behavior, maintained alongside the artifact.
- `browser-session-observer.ts`: test-only preloaded, compact observation of saved run state and browser responsiveness; changes no application behavior.
- `README.md`: explains this workflow instance, verification and known limits; it changes no platform behavior.

Run from the repository root with its pinned Node/pnpm toolchain available:

```powershell
node scripts/node_modules/tsx/dist/cli.mjs --tsconfig artifacts/ai-workflow-builder/tsconfig.json outputs/new-fapi-calc/build.ts --verify-only
pnpm exec tsc -p outputs/new-fapi-calc/tsconfig.json --noEmit
```

Both commands passed for this artifact. The `--verify-only` option repeats checks without rewriting any artifact. Omit it to regenerate the backup and report.

Set `FAPI_WORKBOOK_PATH` to the original file location on another machine. To capture a fresh public response, move the previous `api-capture.json` aside first. Rebuilding changes capture/extraction/build timestamps and rewrites the backup; coordinate with any already imported workflow before regenerating. Public API capture is network-dependent only when no matching retained capture is present.

This artifact adaptation changes the saved workflow definition and verification files only. The concurrent generic Field implementation has its own application-code inventory and semantic documentation; no global template or tax formula is changed by this generator.
