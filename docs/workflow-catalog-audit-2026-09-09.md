**Workflow catalog execution audit — September 9, 2026**

**The full catalog is not ready for an end-to-end demo.** Of the 17 workflows listed in the workflow sidebar, Document Calculator completed successfully and FAPI completed with a documented unmatched-record warning. The other 15 produced execution errors. All 17 accepted an upload and retained two distinct runs after reload, but those successful UI actions did not make their underlying calculations successful.

The earlier 59-test regression pass covered builder behavior, safeguards, persistence, and selected end-to-end workflows. It was not verification of every template. This broader audit found missing implementations and defects outside that coverage; the earlier pass must not be used as a catalog-wide approval.

**Scope and method.** The audit covered all 17 registered catalog entries, three additional runtime workflows, and four builder examples: 24 definitions in total. Each definition was executed through the local graph runner. Configured runtime workflows received their bundled sample records; Document Calculator received controlled records of 120 and 80. Initially empty sources were tested both before and after providing records where appropriate.

Each of the 17 catalog entries was also tested through Chromium: open Build, upload a JSON document, apply the preview, switch to Run, save and execute, reload, select the saved workflow, and execute version 1 again. Tests read the actual saved run status, errors, transferred inputs, and calculated outputs. For structural platform/foundation entries without a complete input fixture, the upload was a generic two-record probe, not a claim that every domain input had been supplied. Their missing rules, inappropriate default formulas, and disconnected inputs were separately inspected.

Additional checks compared the older runtime completion loop with the graph result, independently checked selected arithmetic, inspected the expense export payload, and fetched the real holiday API through the source editor. The tests used isolated browser storage and an isolated save-service fixture; they did not inspect or modify private personal workflow copies in the user's browser. The earlier separate persistence audit covers the real server save service. This audit ran against the local development app and API; it does not certify fiscal compliance or arbitrary documents.

| Catalog workflow | Observed outcome | Reason / evidence |
|---|---|---|
| Document Calculator | **Pass for tested data** | Two records totaling 200 produce 400. The uploaded source is consumed by Keyword rules, and the result survives a saved rerun. |
| FAPI Calculation | **Pass with review warning** | Bundled records produce gross 25,000, net FAPI 24,600, and net CAD 33,210 under the configured assumptions. A 4,500 management-fee record remains unmatched and is explicitly flagged. |
| Statutory Holiday Payroll Accrual | **Fail** | Real API fetch returns 31 records but zero usable rows. Supplied sample rows get past the source but expose self-referencing calculation rules. Generic upload adds a disconnected source. |
| Universal Execution Sequence | **Fail / incomplete blueprint** | Readiness/review calculators contain default FAPI formulas and request unrelated inputs such as `capGains`, `rtf`, and `income_bucket`. |
| Scope Service | **Fail / incomplete blueprint** | Keyword Mapper has no usable data/rules. Upload adds an unconnected document source. |
| Tax Position Summary Service | **Fail / incomplete blueprint** | Keyword Mapper has no usable data/rules. Upload adds an unconnected document source. |
| Data Readiness Service | **Fail / incomplete blueprint** | Uploaded trial-balance data reaches the check, but its required keyword rules are absent. |
| Foreign Affiliate Ownership & Entity Graph | **Fail / incomplete blueprint** | Uploaded structure records reach normalization, but its required classification rules are absent. The graph is not an implemented ownership engine. |
| Tax Attribute & Continuity Ledgers | **Fail / incomplete blueprint** | Classification lacks required data/rules and calculation inputs are incomplete. Upload reaches only the reconciliation branch. |
| Portfolio Tax Calendar, Client Requests & Review | **Fail / incomplete blueprint** | Deadline/risk calculators contain default FAPI formulas. Generic upload is disconnected. |
| T1134 Foreign Affiliate Reporting | **Fail** | The selected runnable graph has empty Compute and Summary formulas. |
| Foreign Affiliate Surplus | **Fail** | Empty Compute and Summary formulas. |
| T106 Related-Party Transaction Reporting | **Fail** | Empty Compute and Summary formulas. |
| EIFEL | **Fail** | Empty Compute and Summary formulas. |
| T2 Corporate Income Tax Compliance Suite | **Fail** | Empty Compute and Summary formulas. |
| Corporate Tax Provision | **Fail** | Empty Compute and Summary formulas. |
| Part XIII Withholding Tax | **Fail** | Empty Compute and Summary formulas. |

The last seven entries are explicitly marked `representative: true` in their runtime configurations. Their separate `computeExtra` functions perform generic income-minus-expense demonstrations. The graph's calculation blocks are empty, and these functions are not the actual domain implementations suggested by the workflow names. Adding the real rules and expected-result fixtures is required before approving those workflows for domain use. The [T1134 screenshot](workflow-catalog-evidence/pf-t1134.png) shows that the document condition is met while execution still fails with “No formulas found.”

**Additional runtime workflows and examples.**

| Definition | Observed outcome |
|---|---|
| Employee Expense Reimbursement | Calculations pass for the sample: submitted 2,462, policy-disallowed 137, net payable 2,325, CAD 3,138.75. The payroll export has zero data rows and is not a satisfactory final deliverable. |
| Roulement fiscal | Fails after source records are supplied. The graph cannot resolve `contrepartie_autre`, `jvm_total`, `montant_elu`, and `taux_inclusion`. |
| Marketing Campaign Budget Allocation | Fails after source records are supplied. `committed_spend`, `budget_cap`, and `montant_elu` do not reach the calculation. |
| Single-item pipeline example | Its bundled example reports success without execution errors. This is a sample-path result, not validation against arbitrary data. |
| Expanded mapping pipeline example | Runs to its intended review checkpoints: one unmatched record and two low-confidence mappings. It is not a fully approved result. |
| Working source/rules example | With a supplied FAPI document it calculates without execution errors but remains in review. Its fixed expected-result assertions refer to a different sample, so the uploaded amounts trigger expected-versus-actual findings; an unmatched row also remains. |
| Older FAPI sample graph | Still fails after workbook rows are supplied. The combined rollup/calculation block lacks `mapped_rows` and `aggregation_rules`, followed by downstream failures and incomplete approvals. |

**Highest-priority findings.**

1. **False completion in the older runtime loop.** Ten of twelve runtime configurations have an underlying `error` status yet `runToCompletion` returns `done: true` and a completion message. The affected configurations are holiday payroll, Roulement, campaign, and all seven representative tax configurations. For example, T1134 reports completion and 247,000 even though its graph has no formulas. `runTemplateCore` preserves the error status but still calls `computeExtra`; `runTemplateLoop` then allows approval and completion without rejecting that error. The current saved-graph Run tab displays these errors correctly, so the problem is specifically the additional runtime path. This must be fixed before trusting completion claims from consumers of that path. [Recorded contradictions](workflow-catalog-evidence/completion-claims.json)

2. **Holiday API records are discarded.** The connector specifies `defaultAmount: 1` so a holiday can be counted without a monetary field. The source editor omits that option from its request, and `/api/http-source` also omits it when calling `mapRecordsToRows`. The real request succeeded with HTTP 200 and 31 records; all 31 were skipped, leaving zero rows. No response was pinned, so Run subsequently reports “No API response is saved.” This is application mapping behavior, not an unavailable provider. [Live response](workflow-catalog-evidence/holiday-live-response.json), [saved run](workflow-catalog-evidence/holiday-live-execution.json), [screenshot](workflow-catalog-evidence/holiday-live-failure.png)

3. **Holiday calculations are independently incomplete.** Even with the bundled rows supplied directly, the graph errors on rules such as `HOURS_FLOOR → HOURS_FLOOR`, `HOURS_PER_HOLIDAY → HOURS_PER_HOLIDAY`, and `TOTAL_LIABILITY → TOTAL_LIABILITY`. These values are calculated outside the graph by `computeExtra`, not supplied as valid upstream operands to those rules. Repairing the API row mapping alone will not make this workflow execute successfully. The sample also leaves a holiday unmatched and produces hierarchy warnings. [Engine inventory](workflow-catalog-evidence/engine-inventory.json)

4. **Uploaded data can be unused.** Holiday Payroll, Scope Service, Tax Position Summary, and Portfolio Operations accept a document into a newly created source that has no outgoing connection. The recorded transfer list confirms no block consumes it. The source selector currently targets only compatible workbook/manual-table sources; “Add a document source” does not establish its connection. Users need an explicit target/connection and a clear indication of whether the uploaded data will be consumed.

5. **Named workflows are missing their execution definitions.** Seven representative tax graphs have no formulas, and seven platform/foundation graphs are incomplete blueprints. Some blueprint calculator blocks inherit FAPI rules despite being labeled readiness, deadline, or risk calculations. These entries need accurate readiness labeling and their actual execution rules, inputs, and domain-specific fixtures.

6. **Roulement/campaign parameter sources do not match their consumers.** Their parameter blocks use `source.fapi_inputs`, which emits a fixed set of FAPI fields. Their downstream calculations expect unrelated budget/election fields, and some connections name output roles that the source does not emit. The parameter contracts and formulas must be implemented in the saved graph so Build, Run, and other runtime consumers agree.

7. **Expense export is incomplete and too technical.** The reimbursement arithmetic is correct for the sample, but the Rows sheet has zero records. Its Totals sheet has 818 entries, including 778 internal `source:` keys. The workbook specification contains totals, so it is not literally an empty file; it is missing the expected business data rows and exposes internal metadata as totals. The export receives the calculation summary instead of a defined reimbursement table. [Payload and arithmetic evidence](workflow-catalog-evidence/arithmetic-and-expense-export.json)

**Arithmetic checks.** Independent assertions verified Document Calculator's `(120 + 80) × 2 = 400`, the configured FAPI sample's net 24,600 and CAD 33,210, and expense net payable 2,325. Lowering the expense meal cap from 250 to 100 through the older runtime reduces net payable to 2,175. Increasing the first input amount by 17 changes Document Calculator to 434, FAPI net to 24,617, and expense net to 2,342. These checks demonstrate that the tested calculations depend on their input values. JavaScript floating-point tails remain visible at full precision, for example 33,232.950000000004 after the FAPI perturbation; this is not arbitrary-precision decimal arithmetic.

**Timing and UI stability.** The 17 catalog UI cases completed in approximately six minutes. Build opening ranged from 6.74 to 13.82 seconds, with a median of 9.32 seconds, in development. Save/run/readback ranged from 0.24 to 0.92 seconds; fast failures are included, so this is not a successful-calculation benchmark. All 17 retained two distinct run IDs, reproduced the same outcome after reload, and captured no browser runtime errors. The API's own metadata and the measured complete UI fetch duration are preserved in the live-response artifact. The earlier production timings remain useful only for the previously rehearsed workflows.

**Release checks and reproducibility.** The audit collection cases intentionally record both good and bad workflow outcomes. Their test-runner “passed” status means the observation and persistence checks completed; it does not mean the workflow itself passed. Three explicit acceptance checks were subsequently run, and **all three failed**:

- Every catalog workflow executes without errors after its test document is supplied: **15 failures in the collected outcomes**.
- A runtime with an execution error does not claim completion: **10 contradictions**.
- The expense payroll export includes data rows: **0 rows**.

[UI collection report](workflow-catalog-evidence/ui-test-report.json) · [Release-check report](workflow-catalog-evidence/release-gate-report.json) · [Complete graph inventory](workflow-catalog-evidence/engine-inventory.json)

To regenerate the evidence and then evaluate the acceptance checks, run the following commands in this order from the repository root:

```powershell
pnpm exec playwright test --config playwright.catalog-audit.config.mjs --tsconfig e2e/tsconfig.json workflow-catalog-audit.spec.ts
pnpm exec playwright test --config playwright.catalog-audit.config.mjs --tsconfig e2e/tsconfig.json workflow-catalog-deep-checks.spec.ts
pnpm exec playwright test --config playwright.catalog-audit.config.mjs --tsconfig e2e/tsconfig.json workflow-catalog-release-gates.spec.ts
```

The acceptance checks read the collected evidence; rerun the collection after application changes. One initial live-API test attempt selected an unrelated disabled Send button after the response; narrowing the selector to the source editor's text button resolved the test issue. The subsequent attempt reproduced the actual zero-row application failure. That locator failure is separate from the application findings.

The changes made during this audit are tests and evidence. The application findings above remain open. For the demo, the currently verified catalog paths are Document Calculator and the rehearsed FAPI scenarios, with their documented review findings and input assumptions.
