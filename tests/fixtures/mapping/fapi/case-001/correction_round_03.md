# FAPI Eval 3 Feedback Log
## Source
- Reviewed workbook: `Case 001 - Eval 3.xlsx`
- Reviewed sheet: `All Facts`
- Reviewer comments source: red notes in the final column, `review notes`
- Purpose: convert Eval 3 reviewer feedback into reusable mapping-rule updates for the FAPI source-to-engine mapping agent.

## Eval 3 outcome summary
- Source-fact rows reviewed: 38
- Rows with reviewer notes: 38
- Rows marked as perfect treatment: 33
- Rows requiring rulebook updates / attention: 5

### Rows by FA
- FA_1 SAS: 19
- FA_2 Corp: 18
- FA_3 gmbh: 1

### Recommended-treatment distribution
- (missing): 3
- context_only: 4
- do_not_map: 5
- map_to_engine: 2
- manual_review_required: 3
- overhead_allocation_candidate: 7
- deductible_expense_candidate: 1
- schedule_1_adjustment_candidate: 7
- manual_input_required: 3
- client_question: 3

## High-level conclusion
Eval 3 is strong enough to become the first agent-ready mapping rulebook baseline. Most rows were accepted as correct. The remaining feedback focuses on missing legal-name confirmation facts, missed meals/entertainment accounts in French-labelled financial statements, and the need to provide benchmark-only insights for FA_3 where primary source support is missing.

## Reusable rulebook updates from Eval 3

### 1. Add legal-name confirmation facts for every FA
The agent should always include a source fact confirming the legal/source name of each foreign affiliate and mapping it to the working FA alias. This applies before numeric mapping. The fact should cite the source document, worksheet/page, and location where the legal name appears.

**Rule:** For each FA context, include an `fa_identity_confirmation` or equivalent context row. If legal-name support is missing or aliases are uncertain, flag `manual_review_required` or `client_question` before mapping numeric fields.

### 2. Keep accepted treatment taxonomy from Eval 3
Reviewer comments confirmed the treatment logic for context-only revenue, third-party revenue exclusions, FAPI income mapping, overhead allocation candidates, Schedule 1 addback candidates, realized FX review, unrealized FX exclusion, prepaid manual inputs, tax depreciation manual inputs, and intercompany balance client questions.

**Rule:** Preserve the Eval 3 treatment taxonomy and continue to require a controlled `Recommended treatment` value for every row.

### 3. Meals and entertainment detection must search French and English labels
The agent correctly identified some meals/travel accounts but missed additional French-labelled accounts, including `meals` and `épicerie`.

**Rule:** When searching for meals and entertainment / partial addback candidates, the agent must search both English and French labels. Examples include `meals`, `meal`, `entertainment`, `travel`, `repas`, `déplacements`, `voyage`, `épicerie`, `restaurant`, `réception`, and similar account descriptions.

**Rule:** If a discovered meals/entertainment amount does not reconcile to the historical addback, flag a source discrepancy or review bridge request rather than assuming the agent-found amount is complete.

### 4. Accounting tax expense may need proration
The treatment of accounting tax expense as a Schedule 1 addback candidate was accepted, with a note that the amount may also need to be prorated.

**Rule:** Accounting tax expense should be surfaced as an `additions` candidate, but if the tax expense relates to both FAPI and non-FAPI activities, the agent should flag potential proration/allocation. Do not treat accounting tax expense as foreign accrual tax without separate support.

### 5. FA_3 missing primary support should not suppress historical insights
For FA_3, reviewer feedback says the agent should still provide insights based on available historical workbook information even where primary source support is missing.

**Rule:** If an FA has no primary source support in the source package, the agent should not invent primary source facts or borrow facts from other FAs. However, it should still surface benchmark-only facts and mapping insights from the historical workbook when those facts are available, clearly marked as `benchmark_only` or `source_missing`.

**Rule:** Benchmark-only insights may be used to understand historical treatment and generate reviewer questions, but they must not be treated as primary source evidence for live engine inputs.

## Row-level feedback extracted from reviewer notes
| Excel row | FA | Source fact label | Treatment | Proposed engine field | Reviewer note | Action |
|---:|---|---|---|---|---|---|
| 2 | FA_1 SAS |  |  |  | missing fact: confirming the legal name of the FA, like previously done | Add FA legal-name confirmation rule. |
| 3 | FA_1 SAS | Total sales / total income | context_only |  | perfect treatment | Keep rule as-is. |
| 4 | FA_1 SAS | 42100 - Ventes | do_not_map |  | perfect treatment | Keep rule as-is. |
| 5 | FA_1 SAS | 42110 - Prestations de services - Europe | do_not_map |  | perfect treatment | Keep rule as-is. |
| 6 | FA_1 SAS | 42200 - Revenus - intercos | map_to_engine | otherFapiIncome | perfect treatment | Keep rule as-is. |
| 7 | FA_1 SAS | 43100 - Variation TEC/RR | context_only |  | perfect treatment | Keep rule as-is. |
| 8 | FA_1 SAS | 44220 - Autres revenus | manual_review_required | otherFapiIncome | perfect treatment | Keep rule as-is. |
| 9 | FA_1 SAS | Total cost of sales | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 10 | FA_1 SAS | 52200 - Sous-traitants - intercos | deductible_expense_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 11 | FA_1 SAS | Total administrative salaries and social charges | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 12 | FA_1 SAS | Total selling and administrative expenses | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 13 | FA_1 SAS | 53100 / 53150 project meals and travel | schedule_1_adjustment_candidate | additions | reviewer should confirm whether this shloud be a schedule 1 add back as meals and enterteinment. However, 2 other accounts were missed : B:73 (meals)  and B:88 (épicerie). Agent should be aware of both french and english keywords because a lot of Quebec companies prepare their financials in french or english or both. | Expand French/English meals and entertainment keyword search; flag incomplete addback bridge. |
| 14 | FA_1 SAS | 82100 - Amortissement immob. Corporelles | schedule_1_adjustment_candidate | additions | perfect treatment | Keep rule as-is. |
| 15 | FA_1 SAS | 90010 - Impôts exigibles | schedule_1_adjustment_candidate | additions | perfect treatment, this may also need to be prorated. | Keep rule as-is. |
| 16 | FA_1 SAS | 83200 - Intérêts et pénalités | schedule_1_adjustment_candidate | additions | perfect treatment | Keep rule as-is. |
| 17 | FA_1 SAS | 85500 - Échange devises réalisé | manual_review_required | realized_fx_candidate | perfect treatment | Keep rule as-is. |
| 18 | FA_1 SAS | 85660 - Unrealized Gain/Loss | do_not_map |  | perfect treatment | Keep rule as-is. |
| 19 | FA_1 SAS | 15100 - Frais payés d'avance | manual_input_required | additions or deductions | perfect treatment | Keep rule as-is. |
| 20 | FA_1 SAS | 27200 - Avance de Canco_1 Inc | client_question |  | perfect treatment | Keep rule as-is. |
| 21 | FA_2 Corp |  |  |  | missing fact: confirming the legal name of the FA, like previously done | Add FA legal-name confirmation rule. |
| 22 | FA_2 Corp | Total income | context_only |  | perfect treatment | Keep rule as-is. |
| 23 | FA_2 Corp | 42100 - Ventes | do_not_map |  | perfect treatment | Keep rule as-is. |
| 24 | FA_2 Corp | 42200 - Revenus - intercos | map_to_engine | otherFapiIncome | perfect treatment | Keep rule as-is. |
| 25 | FA_2 Corp | 43100 - Variation TEC/RR | context_only |  | perfect treatment | Keep rule as-is. |
| 26 | FA_2 Corp | Total cost of sales | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 27 | FA_2 Corp | Total administrative salaries and social charges | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 28 | FA_2 Corp | Total selling and administrative expenses | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 29 | FA_2 Corp | Facility expenses | overhead_allocation_candidate | generalExpenses | perfect treatment | Keep rule as-is. |
| 30 | FA_2 Corp | 53100 / 64010 meals | schedule_1_adjustment_candidate | additions | discrepency is because you missed B68: epicerie. | Review for rulebook update. |
| 31 | FA_2 Corp | 82100 / 82150 amortization | schedule_1_adjustment_candidate | additions | perfect treatment | Keep rule as-is. |
| 32 | FA_2 Corp | 90100 - Impôts U.S. | schedule_1_adjustment_candidate | additions | perfect treatment | Keep rule as-is. |
| 33 | FA_2 Corp | 85500 - Échange devises réalisé | manual_review_required | realized_fx_candidate | perfect treatment | Keep rule as-is. |
| 34 | FA_2 Corp | 85550 - Rounding Gain/Loss | do_not_map |  | perfect treatment | Keep rule as-is. |
| 35 | FA_2 Corp | 15100 - Frais payés d'avance | manual_input_required | additions or deductions | perfect treatment | Keep rule as-is. |
| 36 | FA_2 Corp | Tax depreciation / CCA | manual_input_required | tax_depreciation_manual_input | perfect treatment | Keep rule as-is. |
| 37 | FA_2 Corp | 12200 - Comptes clients - intercos | client_question |  | perfect treatment | Keep rule as-is. |
| 38 | FA_2 Corp | 21020 - Comptes fournisseurs - intercos | client_question |  | perfect treatment | Keep rule as-is. |
| 39 | FA_3 gmbh |  |  |  | mssinf facts for FA_3 GmbH. Althought there is primary source to compare to historical workbook, the agent should still provide insights based on info about FA_3 that is available is the hustorical workbook. | Add FA_3 benchmark-only/source-missing handling rule. |

## Accepted treatments to preserve

### context_only
- FA_1 SAS: Total sales / total income
- FA_1 SAS: 43100 - Variation TEC/RR
- FA_2 Corp: Total income
- FA_2 Corp: 43100 - Variation TEC/RR

### do_not_map
- FA_1 SAS: 42100 - Ventes
- FA_1 SAS: 42110 - Prestations de services - Europe
- FA_1 SAS: 85660 - Unrealized Gain/Loss
- FA_2 Corp: 42100 - Ventes
- FA_2 Corp: 85550 - Rounding Gain/Loss

### map_to_engine
- FA_1 SAS: 42200 - Revenus - intercos → `otherFapiIncome`
- FA_2 Corp: 42200 - Revenus - intercos → `otherFapiIncome`

### manual_review_required
- FA_1 SAS: 44220 - Autres revenus → `otherFapiIncome`
- FA_1 SAS: 85500 - Échange devises réalisé → `realized_fx_candidate`
- FA_2 Corp: 85500 - Échange devises réalisé → `realized_fx_candidate`

### overhead_allocation_candidate
- FA_1 SAS: Total cost of sales → `generalExpenses`
- FA_1 SAS: Total administrative salaries and social charges → `generalExpenses`
- FA_1 SAS: Total selling and administrative expenses → `generalExpenses`
- FA_2 Corp: Total cost of sales → `generalExpenses`
- FA_2 Corp: Total administrative salaries and social charges → `generalExpenses`
- FA_2 Corp: Total selling and administrative expenses → `generalExpenses`
- FA_2 Corp: Facility expenses → `generalExpenses`

### deductible_expense_candidate
- FA_1 SAS: 52200 - Sous-traitants - intercos → `generalExpenses`

### schedule_1_adjustment_candidate
- FA_1 SAS: 82100 - Amortissement immob. Corporelles → `additions`
- FA_1 SAS: 90010 - Impôts exigibles → `additions`
- FA_1 SAS: 83200 - Intérêts et pénalités → `additions`
- FA_2 Corp: 82100 / 82150 amortization → `additions`
- FA_2 Corp: 90100 - Impôts U.S. → `additions`

### manual_input_required
- FA_1 SAS: 15100 - Frais payés d'avance → `additions or deductions`
- FA_2 Corp: 15100 - Frais payés d'avance → `additions or deductions`
- FA_2 Corp: Tax depreciation / CCA → `tax_depreciation_manual_input`

### client_question
- FA_1 SAS: 27200 - Avance de Canco_1 Inc
- FA_2 Corp: 12200 - Comptes clients - intercos
- FA_2 Corp: 21020 - Comptes fournisseurs - intercos

## Prompt changes for the next agent test
1. Require one FA legal-name confirmation row per FA before numeric rows.
2. Require French and English keyword searches for meals/entertainment, including `épicerie`.
3. Require the agent to mark meals/entertainment bridges as incomplete when source amounts do not reconcile to historical addback support.
4. Require accounting tax expense rows to state whether proration/allocation may be needed.
5. Require source-missing FAs to include benchmark-only historical workbook insights rather than omitting the FA entirely.
