# FAPI Calculation Simulation Report

Date: 2026-05-05

Status: Review-ready local simulation. Calculations match expected values, with mapping warnings that require review.

## 1. Source Workbook / Source Data Summary

Workbook expected by workflow: `workflow_studio_fapi_sample_source.xlsx`

The workbook file was not present in the repository for this audit. The simulation used equivalent Trial Balance fixture rows injected into the existing Excel Source block.

Sheets represented:

- Trial Balance
- Keyword Rules
- Aggregation Rules
- FAPI Inputs
- Expected Results

Source rows:

| Metric | Count |
| --- | ---: |
| Trial Balance rows | 21 |
| Rows mapped | 20 |
| Rows unmatched | 1 |
| Low-confidence mapped rows | 1 |

## 2. Mapping Summary

Keyword Mapper consumed:

- `Uploaded Workbook.selected_rows`
- `Keyword Rulebook.keyword_rules`

Keyword Mapper emitted:

- `mapped_rows`
- `unmatched_rows`
- `low_confidence_rows`
- `conflicts`
- `mapping_summary`

Review findings:

| Finding | Row | Notes |
| --- | --- | --- |
| Low confidence | `trial-balance-row-008` Other FAPI income | Confidence `0.72`, threshold `0.75`. |
| Unmatched | `trial-balance-row-022` Unknown adjustment | No keyword rule matched this row. |

No mapping conflicts were found.

## 3. Official Line Values

| Line | Value |
| --- | ---: |
| A | 4950 |
| A1 | 100 |
| A2 | 75 |
| B | 400 |
| C | 125 |
| D | 200 |
| E | 90 |
| F | 40 |
| F1 | 10 |
| G | 35 |
| H | 25 |
| FAT_PAID | 100 |
| RTF | 1.9 |
| FX_RATE | 1.35 |

## 4. Formula Trace

```text
income_bucket = interestIncome(1450) + rents(2750) + royalties(600) + dividends(400) + otherFapiIncome(300) = 5500
expense_bucket = abs(generalExpenses -120) + abs(legalExpenses -250) + abs(accountingExpenses -180) = 550
A = max(5500 - 550, 0) = 4950
A1 = debtForgiveness(50) * 2 = 100
A2 = priorYearG(75) = 75
B = capGains(800) * inclusionRate(0.5) = 400
C = cfaIncome(125) = 125
Deductions = D(200) + E(90) + F(40) + F1(10) + G(35) + H(25) = 400
Gross = A(4950) + A1(100) + A2(75) + B(400) + C(125) = 5650
FAPI Brut = max(5650 - 400, 0) = 5250
FAT Deduction = min(max(100, 0) * 1.9, 5250) = 190
Net FAPI = max(5250 - 190, 0) = 5060
Net FAPI CAD = 5060 * 1.35 = 6831
```

## 5. Aggregation/Calculation Split Path

The local smoke also verifies the clearer split path:

- Category Rollup Aggregator: `income_bucket = 5500`, `expense_bucket = 550`.
- Calculation Engine: `GROSS = 5650`, `DEDUCTIONS = 400`, `FAPI_BRUT = 5250`, `FAT_DEDUCTION = 190`, `NET_FAPI = 5060`, `NET_FAPI_CAD = 6831`.

The existing combined Rollup & Calculation Engine remains available for compatibility. The split path separates grouping/summing from formula evaluation without adding a separate Calculation Sheet.

## 6. Finality / Protected Results

The local sample protected 19 result blocks and one FX protected input.

| Result | Value | Status |
| --- | ---: | --- |
| Gross | 5650 | review-ready candidate, not runtime locked |
| Deductions | 400 | review-ready candidate, not runtime locked |
| FAPI Brut | 5250 | review-ready candidate, not runtime locked |
| FAT Deduction | 190 | review-ready candidate, not runtime locked |
| Net FAPI | 5060 | review-ready candidate, not runtime locked |
| Net FAPI CAD | 6831 | review-ready candidate, not runtime locked |
| Protected FX Rate | 1.35 | runtime locked |

Finality note: calculation values match expected results, but the package is review-ready rather than final because the blocking Unmatched Rows Check remains unresolved. Protected results become clean-final only when blocking validations pass or a reviewer override explicitly resolves the blocking finding.

## 7. Validation Results

Formula Consistency Check:

| Metric | Value |
| --- | ---: |
| Checked values | 17 |
| Failed values | 0 |
| Tolerance | 0.01 |

Result: pass.

Required Input Check:

- Result: pass.
- Required workbook rows, keyword rules, aggregation rules, FAT paid, RTF, FX rate, inclusion rate, and expected values are present.

Output Readiness Check:

- Result: review-ready.
- Required protected summary results exist.
- Finality is blocked by one unresolved unmatched row.

Mapping Quality Check:

- Warning: one row below confidence threshold.

Unmatched Rows Check:

- Warning: one row remains unmatched.

## 8. Warnings And Possible Corrections

| Issue | Likely cause | Recommended correction | Location |
| --- | --- | --- | --- |
| Other FAPI income low confidence | Rule confidence set to `0.72` | Review and adjust the rule if accepted | Keyword Rules Source |
| Unknown adjustment unmatched | No matching keyword rule | Add a new rule version or document as excluded evidence | Keyword Rules Source / Review |
| Output is review-ready, not final | One unmatched row is unresolved and blocking | Add a reviewer override or add a Keyword Rules Source v2 rule if the row belongs in a category | Review / Validation or Rule / Knowledge Source |
| Browser upload path needs regression coverage | Deterministic smoke injects workbook-equivalent rows | Add browser coverage once the real workbook fixture is present in the repo | Source / Test |

## 9. Canonical JSON Summary

Canonical JSON generation is available in the local output block. The generated package includes:

- workflow name
- source metadata
- mapped rows summary
- category totals
- node totals
- official line values
- final totals
- FX rate info
- formula trace
- validation results
- finalityStatus and validationSummary
- blockingIssues and nonBlockingWarnings
- protected results
- warnings

Simulation conclusion: calculation values match expected results, but the workflow remains review-ready because mapping warnings are unresolved.
