# FAPI Eval 2 Feedback Log

## Source

Reviewer notes from `Case 001 - Eval 2.xlsx`, sheet `FAPI source facts`, last column `Reviewer Notes`.

## Overall finding

Eval 2 improved source-fact identification and treatment classification. The main remaining gap is that the model is too cautious where the historical workbook provides enough evidence to classify income streams and Schedule 1 treatments.

The next prompt should instruct the agent to use historical workpapers as classification evidence while still using source documents as primary numeric support.

---

## Reusable corrections

### 1. Historical workbook can reduce manual review

When a historical workbook is provided, the agent should inspect it to infer how income streams were treated. If the workbook clearly treats an income stream as FAPI, use `map_to_engine`; if it clearly excludes the stream, use `do_not_map` or `context_only`.

### 2. Intercompany service revenue can be mapped where historical logic supports FAPI treatment

Eval 2 often marked intercompany service revenue as `manual_review_required`. Reviewer clarified that, where historical workpaper shows it is FAPI, the better treatment is `map_to_engine`.

### 3. Non-FAPI revenue streams should be excluded when historical workbook excludes them

For FA_1 SAS, Europe service revenue and other income should have been `do_not_map` because the historical workbook did not treat them as FAPI.

### 4. Contra-revenue / WIP variation should follow historical treatment

For FA_2 Corp, unearned revenue / WIP variation should be treated as contra revenue and added to general expenses / allocation logic, not merely `context_only` if the historical logic supports this treatment.

### 5. Expense analysis should cover all overhead categories

The model correctly flagged cost of sales but missed that similar analysis should apply to administrative salaries and social charges, selling and administrative expenses, and other expenses.

### 6. Overhead allocation may be required

Where there is both FAPI and non-FAPI revenue, overhead expenses should be allocated to the FAPI portion using a reasonable ratio. In Case 001, reviewer identified:

```text
Revenue-intercos / total income
```

as the relevant proportion.

### 7. Do not single out rent unless there is rental FAPI income

Rent expense should not be singled out as a direct deductible expense where there is no rental FAPI income. It should be included in overhead allocation if connected to general operations supporting a FAPI stream.

### 8. Accounting tax expense is a Schedule 1 addback candidate based on TB/P&L support

Tax return support is not needed merely to treat accounting income tax expense as a Schedule 1 addback candidate.

### 9. Search for missed Schedule 1 candidates

The next agent run should actively search for:

- book amortization / depreciation addback
- meals and entertainment
- prepaid expenses, current and prior year
- tax depreciation manual input
- interest and penalties

### 10. Schedule 1 adjustments may need FAPI proration

Schedule 1 adjustments should be prorated to the FAPI portion where they relate to both FAPI and non-FAPI activity.

### 11. No review question where historical treatment is clear

If the historical workbook clearly supports the treatment, the agent should not ask an unnecessary review question.

### 12. FA_3 handling was good

FA_3 rows were correctly treated as `source_missing` or `benchmark_only` because no standalone primary source support was provided.

---

## Treatment changes implied by reviewer notes

| Pattern | Eval 2 model treatment | Reviewer-corrected treatment |
|---|---|---|
| Intercompany service income treated as FAPI in historical workbook | `manual_review_required` | `map_to_engine` |
| Income stream excluded by historical workbook | `manual_review_required` | `do_not_map` |
| Generic overhead expense with confirmed FAPI stream | `manual_review_required` | `overhead_allocation_candidate` |
| Accounting income tax expense | `schedule_1_adjustment_candidate` with tax-return support question | `schedule_1_adjustment_candidate`; TB/P&L sufficient for addback candidate |
| Tax depreciation | often missed | `manual_input_required` |
| FA_3 without source support | `source_missing` / `benchmark_only` | keep |

