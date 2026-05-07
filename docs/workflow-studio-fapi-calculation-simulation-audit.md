# Workflow Studio FAPI Calculation Simulation Audit

Date: 2026-05-05

Status: **PASS for deterministic local calculation simulation**.

This is not a certification that Workflow Studio is production-ready for FAPI. It means the current generic fiscal Workflow Studio can run the existing working FAPI-style sample through Source, Logic, Review / Validation, Protected, and Output blocks using the local runner, and the expected calculation values match within tolerance.

Workflow run status from the smoke run was `needs_review`, not `success`, because the sample intentionally contains one unmatched row and one low-confidence mapped row. Formula consistency passed.

## Scope

This audit verifies the current app shape. The latest pass adds a split aggregation/calculation path while preserving the existing combined Rollup & Calculation Engine. It does not add a Calculation Sheet. It does not make Workflow Studio FAPI-only.

Public workflow vocabulary remains:

`Source -> Logic -> Review / Validation -> Protected -> Output`

FAPI remains the first sample fiscal workflow.

## Files Inspected

Runtime and workflow definitions:

- `lib/local-fiscal-workflow.ts`
- `lib/local-tool-registry.ts`
- `lib/local-tool-runner.ts`
- `lib/workflow/sample-workflows/working-source-rules-demo.ts`
- `lib/workflow/sample-workflows/expanded-mapping-pipeline-demo.ts`

Backend-style blocks:

- `backend/blocks/source/manual-table/run.ts`
- `backend/blocks/source/keyword-rules/*`
- `backend/blocks/source/aggregation-rules/*`
- `backend/blocks/source/fapi-inputs/*`
- `backend/blocks/source/currency-rate/*`
- `backend/blocks/logic/keyword-mapper/*`
- `backend/blocks/logic/hierarchy-aggregator/*`
- `backend/runtime/*`

UI and output surfaces:

- `components/workflow/source-viewers/excel-utils.ts`
- `components/workflow/source-viewers/*`
- `components/workflow/logic-viewers/*`
- `components/workflow/inspector/code-preview/*`
- `components/workflow/data-viewer/*`
- `components/workflow/workspace/*`

Reference docs:

- `docs/workflow-studio-aggregation-calculation-audit.md`
- `docs/05-regression-checklist.md`

## Source Data Used

The expected workbook name is `workflow_studio_fapi_sample_source.xlsx`, but that file was not present in the repository. The audit did not block on that.

For the smoke run, I injected equivalent Trial Balance rows into the existing `Uploaded Workbook` Source block in `createWorkingSourceRulesDemoWorkflow()`. No app behavior was changed by this fixture injection; it only happens inside `scripts/smoke-fapi-calculation-simulation.ts`.

Simulated workbook sheets:

- Trial Balance
- Keyword Rules
- Aggregation Rules
- FAPI Inputs
- Expected Results

The Excel upload parser exists in `components/workflow/source-viewers/excel-utils.ts` and can import those sheet names into the existing source/rulebook blocks. The local smoke test bypassed the physical `.xlsx` file only because it was not available in the repo.

## Current Capability Summary

| Capability | Result | Notes |
| --- | --- | --- |
| Excel Source upload shape | Present | `.xlsx` parsing and Excel-like workbook structures exist. Smoke used injected rows because the real file was absent. |
| Keyword Rules Source | Present | Rule / Knowledge Source emits editable keyword rules. |
| Aggregation Rules Source | Present | Rule / Knowledge Source emits rollup and formula rules. |
| Keyword Mapper | Pass | Produced mapped, unmatched, low-confidence, conflict, and summary outputs. |
| Rollup & Calculation Engine | Pass | Existing `logic.hierarchy_aggregator` calculated official and final values. |
| FX / currency source | Partial | Local deterministic override works. Bank of Canada API-shaped lookup function exists for later integration, but no live dependency was used. |
| Formula consistency validation | Pass | Compared actual values to expected results at tolerance `0.01`. |
| Mapping warnings | Present | Low-confidence and unmatched rows were flagged. |
| Protected results | Review-ready | Candidate values are emitted, but unresolved unmatched rows prevent clean-final runtime locking by default. |
| Evidence Preview | Present | Generated local evidence preview with warnings and trace data. |
| Canonical JSON | Present | Generated canonical JSON with mapping, aggregation, formula trace, protected results, and warnings. |

## Smoke Test Added

Added:

- `scripts/smoke-fapi-calculation-simulation.ts`

Command:

```bash
pnpm exec tsx scripts/smoke-fapi-calculation-simulation.ts
```

The smoke check asserts these expected values:

- `GROSS = 5650`
- `DEDUCTIONS = 400`
- `FAPI_BRUT = 5250`
- `FAT_DEDUCTION = 190`
- `NET_FAPI = 5060`
- `NET_FAPI_CAD = 6831`

It exits non-zero if calculated values do not match expected values.

## Aggregation/Calculation Split Path

The smoke test now verifies both paths:

- Compatibility path: existing `logic.hierarchy_aggregator` continues to produce category totals, official line values, final totals, formula trace, validation results, protected candidates, Evidence Preview, and Canonical JSON.
- Split path: `logic.category_rollup_aggregator` produces rollup-only totals, and `logic.calculation_engine` produces formula-only calculated results.

Split rollup result:

| Value | Expected | Actual | Status |
| --- | ---: | ---: | --- |
| `income_bucket` | 5500 | 5500 | pass |
| `expense_bucket` | 550 | 550 | pass |

Split calculation result:

| Result | Expected | Actual | Status |
| --- | ---: | ---: | --- |
| `GROSS` | 5650 | 5650 | pass |
| `DEDUCTIONS` | 400 | 400 | pass |
| `FAPI_BRUT` | 5250 | 5250 | pass |
| `FAT_DEDUCTION` | 190 | 190 | pass |
| `NET_FAPI` | 5060 | 5060 | pass |
| `NET_FAPI_CAD` | 6831 | 6831 | pass |

The working UI workflow remains on the combined engine for this pass. The split tools are available in the Logic catalog and can be wired into a parallel workflow without deleting or changing the combined compatibility path.

## Mapping Stage

Input:

- 21 Trial Balance rows
- Keyword rules from the connected Keyword Rulebook

Output:

| Metric | Count |
| --- | ---: |
| Source rows | 21 |
| Mapped rows | 20 |
| Unmatched rows | 1 |
| Low-confidence rows | 1 |
| Conflicts | 0 |

Categories found:

- `accountingExpenses`
- `businessLosses`
- `capGains`
- `cfaIncome`
- `debtForgiveness`
- `dividendDeductions`
- `dividends`
- `faclCarryforward`
- `generalExpenses`
- `interestIncome`
- `legalExpenses`
- `otherFapiIncome`
- `partnershipDividends`
- `prescribedAmount`
- `prescribedAmountF1`
- `priorYearG`
- `rents`
- `royalties`

Example mapped rows:

| Row | Label | Amount | Category | Rule | Keyword | Confidence |
| --- | --- | ---: | --- | --- | --- | ---: |
| `trial-balance-row-002` | Interest income | 1000 | `interestIncome` | `rule-interest-income` | interest income | 0.95 |
| `trial-balance-row-003` | Bank interest revenue | 450 | `interestIncome` | `rule-interest-income` | interest earned | 0.95 |
| `trial-balance-row-004` | Rental income | 2000 | `rents` | `rule-rents` | rental income | 0.92 |
| `trial-balance-row-005` | Lease income | 750 | `rents` | `rule-rents` | lease income | 0.92 |
| `trial-balance-row-006` | Royalty income | 600 | `royalties` | `rule-royalties` | royalty income | 0.90 |
| `trial-balance-row-007` | Dividend income | 400 | `dividends` | `rule-dividends` | dividend income | 0.90 |

Review findings:

| Row | Finding | Cause | Expected action |
| --- | --- | --- | --- |
| `trial-balance-row-008` Other FAPI income | Low confidence | Rule confidence is `0.72`, below threshold `0.75` | Review or improve Keyword Rules Source if needed. |
| `trial-balance-row-022` Unknown adjustment | Unmatched | No keyword rule matched the row | Add a rule in a new Keyword Rules Source version or leave as reviewed unmatched evidence. |

## Category Totals

| Category | Actual |
| --- | ---: |
| `interestIncome` | 1450 |
| `rents` | 2750 |
| `royalties` | 600 |
| `dividends` | 400 |
| `otherFapiIncome` | 300 |
| `generalExpenses` | -120 |
| `legalExpenses` | -250 |
| `accountingExpenses` | -180 |
| `capGains` | 800 |
| `debtForgiveness` | 50 |
| `priorYearG` | 75 |
| `cfaIncome` | 125 |
| `businessLosses` | 200 |
| `faclCarryforward` | 90 |
| `prescribedAmount` | 40 |
| `prescribedAmountF1` | 10 |
| `dividendDeductions` | 35 |
| `partnershipDividends` | 25 |

The expense bucket uses `sum_abs`, so `-120`, `-250`, and `-180` roll up to `550`.

## Official / Input Line Values

| Result | Formula / Source | Expected | Actual | Status |
| --- | --- | ---: | ---: | --- |
| A | `max(income_bucket - expense_bucket, 0)` | 4950 | 4950 | pass |
| A1 | `debtForgiveness * 2` | 100 | 100 | pass |
| A2 | `priorYearG` | 75 | 75 | pass |
| B | `capGains * inclusionRate` | 400 | 400 | pass |
| C | `cfaIncome` | 125 | 125 | pass |
| D | `businessLosses` | 200 | 200 | pass |
| E | `faclCarryforward` | 90 | 90 | pass |
| F | `prescribedAmount` | 40 | 40 | pass |
| F1 | `prescribedAmountF1` | 10 | 10 | pass |
| G | `dividendDeductions` | 35 | 35 | pass |
| H | `partnershipDividends` | 25 | 25 | pass |
| FAT_PAID | FAPI Inputs Source | 100 | 100 | pass |
| RTF | FAPI Inputs Source | 1.9 | 1.9 | pass |
| FX_RATE | Protected reviewed FX input | 1.35 | 1.35 | pass |

## Summary Results

| Result | Formula | Expected | Actual | Status |
| --- | --- | ---: | ---: | --- |
| GROSS | `A + A1 + A2 + B + C` | 5650 | 5650 | pass |
| DEDUCTIONS | `D + E + F + F1 + G + H` | 400 | 400 | pass |
| FAPI_BRUT | `max(GROSS - DEDUCTIONS, 0)` | 5250 | 5250 | pass |
| FAT_DEDUCTION | `min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)` | 190 | 190 | pass |
| NET_FAPI | `max(FAPI_BRUT - FAT_DEDUCTION, 0)` | 5060 | 5060 | pass |
| NET_FAPI_CAD | `NET_FAPI * FX_RATE` | 6831 | 6831 | pass |

No calculation mismatches were found in the smoke simulation.

## Formula Trace

Key trace entries emitted by `logic.hierarchy_aggregator`:

```text
income_bucket: interestIncome(1450) + rents(2750) + royalties(600) + dividends(400) + otherFapiIncome(300) = 5500
expense_bucket: generalExpenses(-120) + abs legalExpenses(-250) + abs accountingExpenses(-180) = 550
A: max(income_bucket(5500) - expense_bucket(550), 0) = 4950
A1: debtForgiveness(50) * 2(2) = 100
B: capGains(800) * inclusionRate(0.5) = 400
GROSS: A(4950) + A1(100) + A2(75) + B(400) + C(125) = 5650
DEDUCTIONS: D(200) + E(90) + F(40) + F1(10) + G(35) + H(25) = 400
FAPI_BRUT: max(GROSS(5650) - DEDUCTIONS(400), 0) = 5250
FAT_DEDUCTION: min(max(fatPaid(100), 0) * rtf(1.9), FAPI_BRUT(5250)) = 190
NET_FAPI: max(FAPI_BRUT(5250) - FAT_DEDUCTION(190), 0) = 5060
NET_FAPI_CAD: (NET_FAPI(5060) * fxRate(1.35)) = 6831
```

## FX / Currency Behavior

The working demo uses `source.currency_rate` as a Source-family block named Bank of Canada FX Rate. It is API-shaped and emits:

- `exchange_rate`
- `rate_metadata`
- `fapi_inputs` with `fxRate`

Simulation behavior:

| Field | Value |
| --- | --- |
| documentCurrency | USD |
| reportingCurrency | CAD |
| fapiYear | 2025 |
| overrideRate | 1.35 |
| conversion_applied | true |
| NET_FAPI_CAD | 6831 |

The local source supports same-currency rate `1` and deterministic override behavior. A function named `fetchAnnualAverageExchangeRate` exists as the intended Bank of Canada lookup path for later integration, but local deterministic runs do not call a live external API. If no override is supplied for different currencies, the source warns and emits a missing-rate shape instead of crashing.

## Review / Validation

| Check | Present in working simulation | Result | Notes |
| --- | --- | --- | --- |
| Required Input Check | Wired into the working graph | Pass | Confirms Trial Balance rows, Keyword Rules, Aggregation Rules, FAT paid, RTF, FX rate, inclusion rate, and expected results are present. |
| Mapping Quality Check | Yes | Warning | One low-confidence row. |
| Unmatched Rows Check | Yes | Warning | One unmatched row. |
| Formula Consistency Check | Yes | Pass | `17` expected values checked, `0` failed, tolerance `0.01`. |
| Output Readiness Check | Wired before output handoff | Review-ready | Required protected summary results exist, but unresolved unmatched rows block clean finality. |

Validation warnings emitted:

- `1 row(s) were not matched by keyword rules.`
- `1 mapped row(s) are below confidence 0.75.`
- `1 row(s) remain unmatched.`

No formula mismatches were emitted.

## Protected Results

Protected result blocks were present for:

- A
- A1
- A2
- B
- C
- D
- E
- F
- F1
- G
- H
- FAT_PAID
- RTF
- Gross
- Deductions
- FAPI Brut
- FAT Deduction
- Net FAPI
- Net FAPI CAD

The reviewed FX rate is represented by a separate Protected Input block:

- Protected FX Rate = `1.35`

Smoke result:

| Protected status | Count |
| --- | ---: |
| Protected result blocks | 19 |
| Runtime locked | 0 |
| Review-ready / unlocked | 19 |
| Protected FX input | 1 |

The local mock Approval Gate is configured as approved, but Protected Result blocks no longer become clean-final while the blocking Unmatched Rows Check is unresolved. They emit candidate values with `finalityStatus = review_ready` and `runtimeLocked = false`.

## Finality and Validation Gating Update

This pass wired validation finality through the existing v1 graph without adding a separate Calculation Engine.

Protected Result blocks now distinguish:

- candidate value exists;
- mock reviewer approval exists;
- blocking validations passed;
- blocking validations remain unresolved;
- review-ready candidate value vs clean-final locked result.

Default FAPI sample behavior:

| Gate | Blocking | Result |
| --- | --- | --- |
| Required Input Check | Yes | Pass |
| Formula Consistency Check | Yes | Pass |
| Unmatched Rows Check | Yes | Fails because one row remains unmatched |
| Mapping Quality Check | No | Warning because one row is low confidence |
| Output Readiness Check | Yes | Review-ready, not final |

Clean-final locking now requires approved protected values and no unresolved blocking validation findings. A future reviewer override can explicitly unblock unmatched rows, but no override is configured in the default smoke run.

## Output Generation

Evidence Pack Preview generated: yes.

Canonical JSON generated: yes.

The output payloads include:

- mapped rows
- low-confidence rows
- unmatched rows
- aggregation summary
- category totals
- node totals
- final totals
- official line values
- formula trace
- protected results
- warnings

Generated reviewer-facing report:

- `docs/generated-fapi-calculation-report.md`

## UI Run-State Risk From Current Screenshots

The simulation proves the local runner can produce mapped rows, aggregation results, final totals, protected review-ready candidates, Evidence Preview, and Canonical JSON.

The workspace run-state path now prefers current in-memory local run logs before compacted browser run history. After a full local Run, the same execution log state feeds the Block Workspace input/output panes, so downstream block outputs should not remain `Not executed` when that block produced output in the successful current run.

Execution behavior confirmed in code:

- The global Run button uses `runLocalWorkflowTools`, saves the local run record, sets `selectedExecutionId`, and writes per-block execution logs.
- `Execute Step` uses selected mode, which runs the selected block plus its upstream ancestors, then writes the selected run into the same execution-log state.
- Large persisted run records can still be compacted, but the open workspace uses the current in-memory run first.

## Possible Corrections / Follow-ups

| Issue | Likely cause | Correction | Where |
| --- | --- | --- | --- |
| Unknown adjustment unmatched | No keyword rule matches the row | Add a draft rule in Keyword Rules Source v2 or keep it as reviewed unmatched evidence | Rule / Knowledge Source or Review |
| Other FAPI income low confidence | Rule confidence is intentionally `0.72` | Review the rule and raise confidence only if fiscal team accepts it | Rule / Knowledge Source |
| Default result is review-ready, not final | Unmatched Rows Check is blocking and one row remains unmatched | Add a reviewer override or add a Keyword Rules Source v2 rule if the row should be classified | Review / Validation or Rule / Knowledge Source |
| Repeated browser proof is still manual | Smoke test is deterministic runner coverage, not a browser upload regression | Add browser coverage for upload then Run when the workbook fixture is available | Test / Source |
| Real workbook not present in repo | User uploads it manually | Add an upload smoke test once the workbook is available locally | Test / Source |
| Live Bank of Canada API not called | Current local deterministic run uses override | Keep override for tests; implement live fetch path only behind Source tool later | Source |
| No backend audit log | Current events are local draft/audit models | Persist draft events only when backend boundary is ready | Audit / Persistence |

## Reliability Gaps Before Real FAPI Use

- Real workbook upload needs browser-level regression coverage using the actual `.xlsx`.
- Validation finality now blocks on unmatched rows by default; product still needs to decide the exact override workflow.
- Low-confidence findings are non-blocking by default but remain visible in evidence.
- FX rate lookup remains deterministic override for local simulation; live Bank of Canada retrieval is not production wired.
- Evidence Preview and Canonical JSON are local generated payloads, not signed deliverables.
- The current sample uses local mock approval.
- The UI run-result display path needs follow-up if uploaded rows still do not show mapper/aggregator outputs after clicking Run.

## Conclusion

Classification: **PASS** for local deterministic FAPI-style calculation simulation.

The current Workflow Studio runtime can compute the expected values end to end when the existing working sample receives workbook-equivalent Trial Balance rows. Mapping, aggregation/calculation, formula consistency, protected review-ready candidates, Evidence Preview, and Canonical JSON all produce coherent local outputs.

The result is still review-ready rather than clean-final because the sample intentionally produces one low-confidence mapping and one unmatched row. The calculation engine is not the blocker; the remaining product choice is how reviewers should override or resolve blocking validation findings.
