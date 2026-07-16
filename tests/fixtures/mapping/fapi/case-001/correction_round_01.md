# FAPI Source Fact Feedback Rules v1

## Purpose

This document captures reviewer feedback from Case 001, Eval 1, and converts it into reusable rules for the FAPI source-mapping agent.

The agent is not calculating FAPI. Its role is to identify, classify, cite, and explain source facts that may feed a deterministic FAPI engine.

The agent should produce FA-specific source fact views and recommended treatments for each fact.

---

## Core operating principles

1. Source documents are primary evidence.
2. Historical FAPI workbooks are benchmark or logic-support evidence only.
3. Do not use workbook summary outputs as engine inputs.
4. Build one context view per foreign affiliate.
5. Multi-FA source files may appear in multiple FA views.
6. Do not leak facts across FAs.
7. Do not silently choose between conflicting sources.
8. Flag discrepancies between sources expected to agree.
9. Flag missing support rather than inferring values.
10. Manual-input items require reviewer confirmation.
11. Every proposed source fact must include FA, year, source file, source location, currency if available, and rationale.

---

## FA identity and source attribution

### Rule 1 - Legal/source identity matters

The agent must identify the legal or source-document name of each foreign affiliate and map it to the working FA alias.

The agent should not rely only on historical workbook labels such as FA_1, FA_2, or FA_3.

For each FA, the agent should identify:

- legal/source name;
- aliases;
- entity codes, if available;
- source files that appear to relate to the FA;
- source tabs, sections, rows, or columns that appear to relate to the FA.

If two similar names may refer to the same FA but the relationship is not clear, the agent should flag an entity-resolution review question.

### Rule 2 - Multi-FA source files

A source file may contain data for more than one FA.

The agent should not classify a whole file as belonging to only one FA if the file includes multiple FA-specific tabs, sections, rows, columns, or entity codes.

A multi-FA source can be included in multiple FA context views, but only the source locations attributable to a given FA should be mapped to that FA.

### Rule 3 - Cross-FA leakage

The agent must not use a fact from one FA as support for another FA.

If an amount appears to be a multi-FA total, the agent should not map it to a single FA unless the source provides a supported allocation or the reviewer explicitly accepts the amount.

---

## Period and currency

### Rule 4 - Period first

The agent must identify the source period before mapping a number.

If a number is from the wrong year or cannot be tied to the target year, classify it as `review_required`, `context_only`, or `do_not_map`, depending on the fact pattern.

### Rule 5 - Currency must be explicit where possible

The agent should identify the source currency before mapping a number.

If currency is not explicit, the agent should flag the uncertainty rather than assume CAD, USD, EUR, or any other currency.

### Rule 6 - Local currency is the default expectation

Unless the reviewer or engine field says otherwise, the agent should assume source-to-engine mapping is expected in the FA's local or functional currency.

If only CAD support is available for a local-currency input, the agent should flag the item for reviewer confirmation rather than silently treating CAD as correct.

Case-specific exception: if the reviewer marks a CAD-supported amount as tying to the benchmarked local-currency amount, the agent may treat it as an accepted benchmark tie for the historical eval only. This does not create a general CAD-source rule.

---

## Income classification

### Rule 7 - Do not map all revenue to FAPI

Revenue lines must be classified before mapping.

The agent should distinguish, where possible:

- active business income;
- interest income;
- rental income;
- royalty income;
- intercompany service income where relevant;
- passive or property income;
- other income;
- income that requires reviewer classification.

The agent should not map a revenue account to FAPI merely because it is revenue.

### Rule 8 - Active business income is generally not mapped as FAPI income without reviewer direction

If a revenue account appears to represent active business income, the agent should generally classify it as `do_not_map` or `context_only`, unless the reviewer or source package indicates it is relevant to a FAPI income stream.

### Rule 9 - FAPI income streams are broad

The agent should not assume FAPI is limited to intercompany service income.

Potential FAPI income streams may include, among others:

- interest income;
- rental income;
- royalty income;
- passive investment income;
- intercompany service income where the facts support FAPI relevance;
- other passive or property income streams;
- other reviewer-identified FAPI-relevant income.

If the FAPI relevance of an income stream is unclear, classify it as `review_required` rather than mapping it definitively.

---

## Expense matching

### Rule 10 - Deductible expense candidate rule

The agent should identify expenses that appear directly connected to an identified or potential FAPI income stream.

If an expense account appears directly connected to that income stream, classify it as `deductible_expense_candidate` and identify the related income stream.

The agent should not assume that all intercompany, related-party, or general expenses are deductible against FAPI.

The agent should not assume all expenses are deductible against FAPI.

If the connection between an expense and a FAPI income stream is unclear, classify it as `review_required`.

If the expense is clearly unrelated to a FAPI income stream, classify it as `do_not_map` or `context_only`.

### Examples

Interest income stream:

- bank fees, financing charges, or other directly related costs may be `deductible_expense_candidate` if source support suggests a connection.

Rental income stream:

- repair and maintenance, property tax, management fees, or similar property expenses may be `deductible_expense_candidate` if they relate to the rental activity.

Intercompany service income stream:

- expenses directly related to earning the intercompany service income may be `deductible_expense_candidate` if the source support is clear.

---

## FX gains and losses

### Rule 11 - Realized FX requires classification

Realized foreign exchange gains or losses should usually be classified as `review_required` unless the source package clearly supports the treatment.

The agent should ask whether the gain or loss is on current account, capital account, or otherwise relevant to the FAPI income stream.

### Rule 12 - Unrealized FX is generally not mapped without override

Unrealized FX gains or losses should generally be classified as `do_not_map` unless the reviewer explicitly directs otherwise.

The agent does not need to ask a detailed review question for clearly unrealized FX unless there is evidence it may be relevant.

---

## Tax expense and foreign tax

### Rule 13 - Accounting tax expense is not automatically foreign accrual tax

The agent should not treat accounting income tax expense as foreign accrual tax automatically.

Accounting tax expense should be surfaced as a Schedule 1 or book-to-tax adjustment candidate where relevant.

The reviewer must distinguish among:

- accounting tax expense;
- tax paid;
- tax payable;
- foreign accrual tax;
- other tax-related adjustments.

### Rule 14 - Tax expense may be a Schedule 1 adjustment candidate

If accounting income tax expense is included in book income and is relevant to the FAPI computation, the agent should classify it as a `schedule_1_adjustment_candidate` or `review_required`, not as a final mapped foreign-tax value.

---

## Book income and reconciliation anchors

### Rule 15 - Book income is a reconciliation anchor

Book income or net profit should generally be treated as a reconciliation anchor or context fact.

The agent should not map book income directly as FAPI unless the engine field explicitly requires a book-income starting point.

The agent should collect book-to-tax adjustment candidates and cite their sources.

---

## Balance sheet and intercompany balances

### Rule 16 - Balance sheet items usually create context or questions

Intercompany receivables, payables, advances, loans, and similar balance sheet accounts should generally be surfaced as context or client-question items.

They should not be mapped directly to income fields.

The agent should use them to ask targeted questions about:

- counterparty;
- debt vs trade balance;
- purpose;
- related income or expense;
- interest terms;
- FX treatment;
- whether there is a related income stream in the P&L.

---

## Missing support and benchmark evidence

### Rule 17 - Missing primary support

If the primary source support for an FA or field is missing, the agent must not infer the answer from another FA.

It should classify the item as `source_missing`, `benchmark_only`, or `review_required`, depending on the available evidence.

### Rule 18 - Historical workbook benchmark use

Historical workbook values may be used as benchmark evidence in evals and to understand prior mapping logic.

They should not be used as primary source evidence for live engine inputs unless the reviewer explicitly accepts the workbook as support.

If a workbook value ties to an alternative source or benchmark, the agent should describe the tie-out and still flag missing primary support if source evidence is incomplete.

---

## Source discrepancies

### Rule 19 - Flag discrepancies instead of choosing silently

If two sources are expected to contain the same FA/year/field number but differ, the agent should flag a discrepancy.

The output should include:

- FA;
- year;
- field or source fact;
- source A file and location;
- source A value;
- source B file and location;
- source B value;
- difference;
- recommended reviewer action.

The agent should not silently choose one source unless the source-priority rule is explicit or the reviewer has already accepted the difference.

---

## Recommended treatment taxonomy

The agent must classify every source fact using one of the allowed recommended treatment values below.

### Allowed values

- `map_to_engine`
- `deductible_expense_candidate`
- `schedule_1_adjustment_candidate`
- `manual_review_required`
- `client_question`
- `context_only`
- `benchmark_only`
- `source_missing`
- `source_discrepancy`
- `do_not_map`

### Definitions

`map_to_engine`
: The fact appears directly mappable to a deterministic FAPI engine input, subject to reviewer approval.

`deductible_expense_candidate`
: The expense appears directly connected to an identified or potential FAPI income stream and should be reviewed as a deductible expense candidate against that stream.

`schedule_1_adjustment_candidate`
: The fact appears relevant as a book-to-tax or Schedule 1-style adjustment, but should not be treated as a final mapped FAPI income or foreign tax amount without review.

`manual_review_required`
: The fact may be relevant, but tax/accounting judgment or missing context prevents automatic mapping.

`client_question`
: The fact suggests a targeted question should be asked of the client or reviewer before mapping.

`context_only`
: The fact is useful context or reconciliation support but is not itself an engine input.

`benchmark_only`
: The fact is useful for tying to a historical workbook or benchmark but should not be treated as source support for a live engine input.

`source_missing`
: Expected primary source support is missing or could not be located.

`source_discrepancy`
: Two or more sources expected to agree contain different values or classifications.

`do_not_map`
: The fact should not feed the FAPI engine field based on the available evidence.

---

## Required output fields for Eval 2

For each source fact, the agent should output:

- FA;
- year;
- source fact label;
- source value;
- currency;
- source file;
- source location;
- source period;
- related income stream, if applicable;
- recommended treatment;
- rationale;
- competing or rejected values, if applicable;
- discrepancy flag;
- review question, if applicable.

---

## Reviewer feedback capture

Reviewer feedback should capture:

- accepted or corrected treatment;
- corrected field or classification;
- corrected source location;
- whether the item is actionable for the agent;
- whether tax judgment is required;
- reviewer explanation.

The most useful feedback explains why a source fact should be mapped, rejected, treated as benchmark-only, or flagged for review.
