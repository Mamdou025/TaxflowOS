# FAPI Final Mapping Rules

## Purpose

These rules govern a FAPI source-mapping agent. The agent does **not** calculate FAPI. Its job is to identify, classify, cite, and map source facts from financial statements, tax returns, trial balances, historical workbooks, and client fact documents into candidate inputs for a deterministic FAPI engine.

The agent must build one context per foreign affiliate (FA), one row per source fact or mapping candidate, and must preserve source citations and reviewer uncertainty.

---

## 1. Evidence hierarchy

1. **Source documents are primary numeric evidence.** Use P&L, trial balance, balance sheet, tax return, GL, and client source schedules as the primary basis for values.
2. **Historical FAPI workbooks are secondary evidence.** Use them to understand historical treatment, source priority, labels, exclusions, adjustment logic, and benchmark treatment.
3. **Do not map historical workbook summary outputs as direct engine inputs.** Summary outputs, T1134 results, 91(1) inclusions, 91(4) deductions, and final RÉATB/FAPI totals are benchmark or validation evidence unless explicitly identified as an engine input.
4. If historical treatment is clear and source support exists, do not ask unnecessary review questions. Apply the historical treatment and cite the support.
5. If source support is missing, incomplete, or conflicting, flag the item rather than silently choosing.

---

## 2. FA-specific context rules

1. Build a separate context for each FA.
2. Identify the legal/source FA name and map it to the working FA alias.
3. Include a legal-name / entity-confirmation fact for each FA before mapping numeric facts.
4. Multi-FA sources may appear in multiple FA contexts, but only FA-attributable rows, tabs, columns, or sections may map to that FA.
5. Do not leak values across FAs.
6. If a source file covers multiple FAs, identify the FA at the lowest possible level: sheet, section, row, account, entity code, column, or formula precedent.
7. If the FA attribution is unclear, classify the row as `manual_review_required`, `client_question`, or `source_missing`; do not map it to the engine.

---

## 3. Required output columns

Each row should include at least:

| Column | Purpose |
|---|---|
| FA | Working FA alias / legal name |
| Year | Tax year or source period |
| Source fact label | Account, line item, or fact label |
| Source value | Amount or fact value |
| Currency | Explicit source currency; do not infer if unclear |
| Source file | Primary source file |
| Source location | Sheet/cell/page/account/row/section |
| Source period | Period covered by the source |
| Related income stream | Income stream or activity the fact relates to |
| Recommended treatment | Controlled treatment value |
| Rationale | Why the treatment was selected |
| Competing / rejected values | Tempting alternatives and why rejected |
| Discrepancy flag | Yes/No |
| Review question | Only if needed |
| Historical workbook support used | Historical support used as logic/benchmark evidence |
| Proposed engine field, if any | Actual engine field name where known |
| Transformation / allocation logic | Direct, addback, allocation, manual, etc. |
| Confidence | High/Medium/Low |

---

## 4. Allowed recommended treatments

Use only these values unless the rulebook is updated:

| Treatment | Meaning |
|---|---|
| `map_to_engine` | Source fact should be mapped to a named engine field. |
| `deductible_expense_candidate` | Expense appears directly connected to a FAPI income stream and may be deductible against that stream. |
| `overhead_allocation_candidate` | Expense is broad overhead that may need allocation to FAPI and non-FAPI streams. |
| `schedule_1_adjustment_candidate` | Item is a book-to-tax / Schedule 1 adjustment candidate. |
| `manual_input_required` | Source fact is insufficient; reviewer or external schedule required. |
| `client_question` | Fact should trigger a client/reviewer question, usually because legal or factual context is missing. |
| `context_only` | Useful for reconciliation, denominator, or narrative context, but not a direct engine input. |
| `benchmark_only` | Useful only to benchmark or validate historical result, not as primary source evidence. |
| `source_missing` | Relevant source support is missing. |
| `source_discrepancy` | Sources that should agree do not agree. |
| `do_not_map` | Fact should not feed the engine. |

---

## 5. Engine field mapping rules

Use actual engine field names where known.

### Income fields

| Engine field | When to use |
|---|---|
| `otherFapiIncome` | Use for confirmed FAPI-relevant income streams, including intercompany/Canada-sourced service income when historical treatment clearly supports FAPI/RÉATB treatment. |

Do not map total income, total revenue, final FAPI, T1134, or taxpayer-share amounts into `otherFapiIncome`.

### Expense fields

| Engine field | When to use |
|---|---|
| `generalExpenses` | Use for direct expense candidates and overhead pools that may reduce a confirmed FAPI stream, subject to allocation/proration logic. |

### Schedule 1 / adjustment fields

| Engine field | When to use |
|---|---|
| `additions` | Use for Schedule 1 addback candidates such as book depreciation/amortization, accounting income tax expense, non-deductible meals/entertainment portion, and interest/penalties. |
| `additions or deductions` | Use only where the direction depends on a movement schedule or reviewer determination, such as prepaid expenses. |
| `tax_depreciation_manual_input` | Use for tax depreciation / CCA only when detailed support is not available. Do not derive it from summary workbook outputs. |

If an engine field is not known, leave the field blank and explain the likely treatment in the rationale.

---

## 6. Income classification rules

1. Do not map all revenue to FAPI.
2. First classify revenue as:
   - third-party active business revenue;
   - intercompany / related-party revenue;
   - interest income;
   - rental income;
   - royalty income;
   - passive or property income;
   - other income requiring review;
   - reconciliation / context only.
3. Third-party sales/business revenue is generally `do_not_map` unless source or historical treatment shows FAPI relevance.
4. Intercompany revenue is **not automatically FAPI**. Map it only where historical workbook treatment or source facts clearly identify the stream as FAPI/RÉATB-relevant.
5. WIP / unearned revenue movements are generally `context_only` unless historical treatment clearly maps them as standalone FAPI.
6. Other income labels such as “Autres revenus” require review unless the source or historical workbook clearly ties the specific amount to a FAPI income stream.

---

## 7. Expense matching and deduction rules

1. If an expense account appears directly connected to an identified or potential FAPI income stream, classify it as `deductible_expense_candidate` and link it to the related income stream.
2. FAPI income streams can include intercompany service income, interest, rents, royalties, passive investment income, or other passive/property income.
3. Do not assume all intercompany expenses are deductible.
4. Do not assume all expenses are deductible against FAPI.
5. Broad expense categories such as cost of sales, salaries, rent/facility costs, and selling/admin expenses should generally be `overhead_allocation_candidate` if the FA has both FAPI and non-FAPI streams.
6. If no better driver exists, propose an allocation concept such as FAPI income / total income, but do not calculate final FAPI.
7. If a better driver is available, such as direct tracing, headcount, space, contract, or account-level support, note it.
8. Accounting income tax expense and other Schedule 1 items may also need proration to the FAPI portion.

---

## 8. Schedule 1 adjustment rules

The agent must actively search for Schedule 1 candidates, including English and French labels.

### Common addback candidates

| Category | Example labels / keywords | Treatment |
|---|---|---|
| Book depreciation / amortization | depreciation, amortization, amortissement, dépréciation | `schedule_1_adjustment_candidate`; proposed engine field `additions` |
| Meals and entertainment | meals, entertainment, repas, représentation, épicerie, travel meals, project meals | `schedule_1_adjustment_candidate`; often 50% addback, reviewer confirmation required if source bridge differs |
| Accounting income tax expense | income tax expense, impôts exigibles, impôts U.S., provision for tax | `schedule_1_adjustment_candidate`; proposed engine field `additions`; do not map as FAT automatically |
| Interest and penalties | interest, penalties, intérêts, pénalités | `schedule_1_adjustment_candidate`; proposed engine field `additions`; de minimis policy may apply |
| Prepaid expenses | prepaid expenses, frais payés d'avance | `manual_input_required`; proposed engine field `additions or deductions`; requires PY/CY movement, not ending balance only |
| Tax depreciation / CCA | tax depreciation, CCA, amortissement fiscal | `manual_input_required`; proposed engine field `tax_depreciation_manual_input` unless detailed support is provided |

### Meals and entertainment keyword rule

The agent must search both English and French labels. In Quebec-company files, financial statements may include both languages. For meals/entertainment, the agent should search for examples such as:

- meals;
- entertainment;
- travel meals;
- project meals;
- repas;
- représentation;
- épicerie;
- frais de repas;
- frais de représentation.

If the historical workbook addback does not tie to the source rows initially identified, search for missed meal/entertainment-related rows before flagging a discrepancy.

---

## 9. FX rules

1. Realized FX gains/losses are generally `manual_review_required` unless the source or historical workbook clearly identifies treatment.
2. The agent should ask whether realized FX relates to intercompany balances, FAPI income streams, operating active business items, capital items, or other property.
3. Unrealized FX gains/losses are generally `do_not_map` and should not generate a review question unless the historical workbook explicitly treats them.
4. Immaterial rounding gain/loss should generally be `do_not_map`.

---

## 10. Balance sheet and intercompany context rules

1. Intercompany receivables, payables, advances, and loans are generally context facts, not income inputs.
2. They should trigger `client_question` if they may be interest-bearing or FX-generating.
3. Ask whether the balance generated interest or FX in the year and identify the counterparty, purpose, and terms where relevant.
4. Do not map balance sheet balances directly to FAPI income fields.

---

## 11. Total income and allocation denominator rules

1. Total income / total revenue is generally `context_only`.
2. Use total income as a reconciliation anchor or denominator candidate, not as a direct engine input.
3. If a FAPI allocation ratio is needed, propose but do not calculate unless instructed:

`FAPI income stream / total income`

4. Exclude final taxpayer-share or summary values from denominator mapping unless the engine explicitly requires that layer.

---

## 12. Source discrepancy rules

1. If two sources are expected to contain the same number for the same FA/year/field/currency/period, compare them.
2. If they differ, flag `source_discrepancy` and do not silently select one source.
3. Before flagging a discrepancy for Schedule 1 items, search for missed accounts and language variants.
4. A discrepancy caused by missing source rows should be described as a source-bridge issue.
5. Known accepted differences should be documented as accepted methodology differences, not ignored.

---

## 13. Missing source / benchmark-only rules

1. If primary source support is missing, do not infer from other FAs.
2. Use the historical workbook only as `benchmark_only` or secondary logic support.
3. If an FA has no primary source but the historical workbook contains relevant FA facts, still provide insight based on historical workbook support, clearly labelled as benchmark/secondary evidence.
4. Flag missing primary source support.

---

## 14. Review question rules

Ask a review question only where it would change mapping or treatment.

Do ask when:

- legal FA identity or alias mapping is unclear;
- currency, period, or entity attribution is unclear;
- an income stream nature is unclear;
- an expense appears connected to a FAPI stream but support is incomplete;
- realized FX treatment is unclear;
- intercompany balances may be interest-bearing or FX-generating;
- prepaid expense movements or tax depreciation support is missing.

Do not ask when:

- historical treatment and source support are clear;
- the item is clearly context-only;
- the item is clearly do-not-map, such as unrealized FX or immaterial rounding;
- the question would not affect engine mapping.

---

## 15. Confidence rules

| Confidence | Use when |
|---|---|
| High | Source, FA, period, currency, treatment, and historical support are clear. |
| Medium | Source fact is clear but treatment, allocation, bridge, or proration needs support. |
| Low | Source fact exists but nature, FA attribution, or treatment is uncertain. |

---

## 16. Final guardrails

1. The agent is not calculating FAPI.
2. The agent must not invent facts, source locations, currencies, or legal conclusions.
3. The agent must not infer tax depreciation, FAT, participating percentages, or final inclusions from summary outputs.
4. The agent must distinguish source facts, adjustment candidates, context facts, benchmark results, and manual inputs.
5. The agent must preserve source citations for every mapped or candidate fact.
6. Reviewer corrections override agent assumptions and should be converted into future mapping rules or eval hard negatives only when reusable.
