# Executable workflow catalog — September 13, 2026

The live catalog contains 17 executable workflows: FAPI, Expense Reimbursement,
Document Calculator, and 14 portfolio workpapers. The workpaper scope is narrower
than the original structural blueprints. They validate supplied records and produce
reviewable results; they do not prepare complete statutory returns or submit filings.

| Workflow command ID | Implemented output |
|---|---|
| `document-calculator` | Matched document amounts, summed and multiplied by the configured formula |
| `fapi` | Existing FAPI calculation, configured inputs, FX and unmatched-record findings |
| `expense` | Graph-based policy calculations, receipt evidence and reimbursement totals |
| `scope-service` | Explicit client/entity/jurisdiction/year scope with duplicate checks |
| `tax-position-summary` | Supplied positions, assumptions, evidence references and confirmation findings |
| `data-readiness` | Required/received/reviewed checklist, readiness percentage and missing-item requests |
| `platform-sequence` | Scope, data, calculation and review checkpoint assessment before handoff |
| `ownership-graph` | Direct and indirect economic interests; duplicate, circular and excess-ownership checks |
| `attribute-ledgers` | Attribute opening/addition/usage/adjustment/closing reconciliation |
| `portfolio-ops` | Outstanding tasks and overdue days from supplied due dates and as-of dates |
| `t1134` | Affiliate register and financial-information/supplement preparation checklist |
| `surplus` | Supplied surplus-pool continuity and reported-closing reconciliation |
| `t106` | Reportable transaction grouping, preserving currency and payment/receipt direction |
| `eifel` | Fixed-ratio scenario from reviewed ATI, interest, revenue and capacity inputs |
| `t2-suite` | Accounting-income-to-taxable-income bridge using reviewed adjustments and loss usage |
| `tax-provision` | Current/deferred tax scenario from supplied rates and temporary differences |
| `part-xiii` | Per-payment withholding using reviewed rates, with remittance reconciliation |

Holiday Payroll, Section 85/Roulement and Campaign Budget are removed from the live
workflow registry, suggestions and catalog. Requests for those IDs return unavailable.
Historical source definitions and existing personal workflow copies are retained;
this is not a deletion of users' saved work.

## Running from chat

An explicit run command calls `runWorkflow` immediately with supplied JSON records,
numeric parameter overrides or uploaded source records. There is no additional
Start-card click in the command path. Missing data returns the required columns.
Sample data is used only when explicitly requested and is labeled in the saved copy.

Examples:

- `Run Document Calculator with these records: [{"label":"Item one","amount":120},{"label":"Item two","amount":80}]`
- `Run the ownership graph workpaper with sample data.`
- `Run the expense reimbursement sample with mealCap 100.`
- `What columns does the T106 workpaper need?`

The result card shows calculation status, business rows and review findings, and links
to the saved run and its exports. Computation is not professional approval. Each
execution retains the actual graph, source records, version and engine result in
the existing workflow library. Source evidence references are supplied by the user;
the workpapers do not independently retrieve or authenticate those documents.

## Reliability changes

- Opening a template in Build creates the personal copy before editing, preventing
  the first edit from remounting the editor and discarding in-progress number entry.
- Graph errors stop the guided runner before approval or completion. Missing
  headlines cannot silently become zero; thrown errors are visible.
- Empty or malformed command data is rejected. Empty guided-run data no longer
  falls back to samples. Duplicate source row IDs are rejected by chat commands.
- Source/election changes and edited parameters invalidate guided-run approval.
  The legacy sample preview no longer auto-approves or decides classifications.
- Generic income-minus-expense substitutes were replaced by the distinct workpaper
  implementations. Expense parameter changes now affect the graph calculation.
- API source requests preserve `defaultAmount` through the editor and server mapper.
- Uploads cannot be applied to disconnected sources. Workpapers validate their
  own named fields without requiring an unrelated monetary `amount` column.
- Excel exports preserve all workpaper business columns and rows, include review
  findings, and omit internal source keys from totals. Expense exports include
  receipt rows and are labeled review exports, not payroll-ready files.
- Windows native build dependencies are retained, and package-manager validation
  and the frontend build command are cross-platform.

## Tax scope

Applicability, elections, pool classification, rates, treaty entitlement, statutory
adjustments, loss eligibility and deferred-tax recognition remain reviewed inputs.
T1134/T106 completeness checks are workpapers, not complete form preparation.
EIFEL is explicitly a fixed-ratio scenario, not a full implementation of exemptions
and group elections. Ownership percentages are economic interests, not legal-control
determinations. Dates in the portfolio calendar are supplied, not inferred statutory deadlines.

These boundaries reflect the breadth of the official requirements: [CRA foreign
affiliate reporting](https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/information-been-moved/foreign-reporting/information-returns-relating-foreign-affiliates.html),
[CRA T106](https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t106.html),
and [CRA EIFEL](https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance/excessive-interest-financing-expenses-limitation-rules.html).

## Verification

Final regression run: **15 passed**, including all 17 workflow command paths.
Frontend and API TypeScript checks passed. Production bundling passed with existing
sourcemap/browser-externalization and bundle-size warnings; the subsequent editor
copy-timing fix was checked by TypeScript and the final browser regression suite.

`pnpm run test:workflow-reliability` exercises all 17 command paths with controlled
fixtures, exact workpaper export contents, independent arithmetic, missing required
fields, ownership cycles, currency/direction separation, invalid graphs, empty inputs,
removed workflows, the real chat handler's persistence, visible review findings and
an application upload/run/reload/rerun scenario. Browser storage and server writes
are isolated. These tests invoke the chat handler and deterministic routing directly;
they do not certify a live LLM provider or arbitrary tax data.

The test configuration starts or reuses the frontend on port 5188. It also runs the
existing calculation and shared-execution regressions. The earlier September 9
audit is historical evidence and is not the current catalog classification.
