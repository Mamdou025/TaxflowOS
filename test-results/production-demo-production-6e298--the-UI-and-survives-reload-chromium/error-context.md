# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-demo.spec.ts >> production document-to-output rehearsal uses the UI and survives reload
- Location: e2e/production-demo.spec.ts:33:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('summary').filter({ hasText: /^Previous runs \(1\)/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('summary').filter({ hasText: /^Previous runs \(1\)/ })

```

```yaml
- group: "Workspace: Synthetic workspace (owner)"
- button "Open chat": InScope
- button "Collapse sidebar"
- button "New chat"
- button "Workspace"
- button "Chat"
- button "Workflows"
- button "Sources"
- button "Connections"
- button "Recent conversations"
- text: No saved chats yet.
- button "Workflows"
- group: Saved to server
- button "Library"
- button "Run history"
- button "New workflow"
- text: MY WORKFLOWS
- button "Demo rehearsal — widget sales"
- text: Runnable demos
- button "Document Calculator"
- button "Employee Expense Reimbursement"
- text: Platform services
- button "Scope Service"
- button "Tax Position Summary Workpaper"
- button "Data Readiness Service"
- button "Execution Readiness & Review Checklist"
- text: Foundation
- button "Ownership Graph Workpaper"
- button "Tax Attribute Continuity Workpaper"
- button "Portfolio Calendar & Requests Workpaper"
- text: Tier 1
- button "FAPI Calculation (portfolio)"
- button "T1134 Affiliate Reporting Workpaper"
- button "Foreign Affiliate Surplus Continuity Workpaper"
- button "T106 Transaction Workpaper"
- button "EIFEL Fixed-Ratio Scenario Workpaper"
- button "T2 Taxable Income Bridge Workpaper"
- button "Corporate Tax Provision Workpaper"
- button "Part XIII Withholding Workpaper"
- button "Settings"
- button "Help"
- group "Theme":
  - button "Light" [pressed]
  - button "Dark"
- button "Workflows"
- text: Demo rehearsal — widget sales Version 1
- button "Overview"
- button "Build"
- button "Run"
- button "Results"
- text: Workflow name
- textbox "Workflow name": Demo rehearsal — widget sales
- paragraph: Personal workflow · Saved version 1
- group: Test data — upload document or enter examples
- region "API data for next run":
  - heading "API data for next run" [level=3]
  - paragraph: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
  - strong: Bank of Canada FX Rate
  - paragraph: "Manual override active: 1.35. The fetched rate is not used."
  - paragraph: "Fetched: Not recorded"
- region "Trigger readiness":
  - heading "Workflow start conditions" [level=3]
  - paragraph: Advisory only — you can always start a manual run. Field checks use recorded source outputs; test again after changing data.
  - text: Document uploaded Met
  - paragraph: "Trial Balance · Uploaded: demo-sales.csv"
- paragraph: Build and Run share saved version 1
- text: Saved workflow version
- combobox "Saved workflow version":
  - option "Demo rehearsal — widget sales - Version 1" [selected]
- button "Preview saved version 1 in this browser"
- button "Run saved version 1 durably"
- button "Save changes and preview"
- paragraph: Runs the graph and rules shown in Build using its configured source data. Blocks without an executable tool are reported in the results.
- complementary "Workflow execution lifetime": Durable runs use an immutable saved version and continue on the server if this tab closes. All installed workflow tools are supported. Runs use the inputs and source responses saved in that version. Browser previews require this tab to stay open.
- heading "Version 1 · 9/16/2026, 10:38:14 PM · warning" [level=3]
- paragraph: Run ID local-tool-workflow-12d14af5-a773-4bf0-ab4b-eb990fbd88b3 · Started from run
- region "Final workflow results":
  - heading "Final results" [level=3]
  - text: Display precision
  - combobox "Result display precision":
    - option "Full precision" [selected]
    - option "0 decimal places"
    - option "2 decimal places"
    - option "4 decimal places"
    - option "6 decimal places"
  - paragraph: Display formatting does not change values sent to other blocks or exported in JSON.
  - group: Choose displayed results
  - table:
    - rowgroup:
      - row "Result Value Unit":
        - columnheader "Result"
        - columnheader "Value"
        - columnheader "Unit"
    - rowgroup:
      - row "Final widget sales FAPI Summary Engine 50,000 —":
        - cell "Final widget sales FAPI Summary Engine"
        - cell "50,000"
        - cell "—"
      - row "FX Rate FAPI Summary Engine 1.35 —":
        - cell "FX Rate FAPI Summary Engine"
        - cell "1.35"
        - cell "—"
      - row "Deductions FAPI Summary Engine 0 —":
        - cell "Deductions FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Gross FAPI Summary Engine 0 —":
        - cell "Gross FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Deductions CAD FAPI Summary Engine 0 —":
        - cell "Deductions CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Gross CAD FAPI Summary Engine 0 —":
        - cell "Gross CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "FAPI Brut FAPI Summary Engine 0 —":
        - cell "FAPI Brut FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "FAPI Brut CAD FAPI Summary Engine 0 —":
        - cell "FAPI Brut CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "FAT Deduction FAPI Summary Engine 0 —":
        - cell "FAT Deduction FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "FAT Deduction CAD FAPI Summary Engine 0 —":
        - cell "FAT Deduction CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Net FAPI FAPI Summary Engine 0 —":
        - cell "Net FAPI FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Net FAPI CAD FAPI Summary Engine 0 —":
        - cell "Net FAPI CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
  - group: 2 review messages
- region "API data used in this run":
  - heading "API data used in this run" [level=3]
  - paragraph: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
  - strong: Bank of Canada FX Rate
  - paragraph: "Manual override active: 1.35. The fetched rate is not used."
  - paragraph: "Fetched: Not recorded"
- group: Bank of Canada Valet API · warning
- group: Trial Balance · success
- group: FAPI Inputs · success
- group: Bank of Canada FX Rate · success
- group: Keyword Mapper · warning
- group: Category Rollup · success
- group: Income & Expense · success
- group: FAPI Lines Engine · success
- group: FAPI Lines A–H · success
- group: FAPI Summary Engine · success
- group: FAPI Summary · success
- group: Evidence Pack · warning
- group:
  - text: Canonical JSON · warning
  - paragraph: API reference only; this block contains no fetched numeric value.
  - paragraph: 1 row(s) were not matched by keyword rules.
  - heading "Input" [level=4]
  - button "Values"
  - button "JSON"
  - button "All details"
  - text: Keyword Mapper mapped Rows
  - table:
    - rowgroup:
      - row "label amount confidence category Label status":
        - columnheader "label"
        - columnheader "amount"
        - columnheader "confidence"
        - columnheader "category Label"
        - columnheader "status"
    - rowgroup:
      - row "Widget order one 120 0.85 Widget sales mapped":
        - cell "Widget order one"
        - cell "120"
        - cell "0.85"
        - cell "Widget sales"
        - cell "mapped"
      - row "Widget order two 80 0.85 Widget sales mapped":
        - cell "Widget order two"
        - cell "80"
        - cell "0.85"
        - cell "Widget sales"
        - cell "mapped"
  - text: unmatched Rows
  - table:
    - rowgroup:
      - row "label amount category Label confidence status":
        - columnheader "label"
        - columnheader "amount"
        - columnheader "category Label"
        - columnheader "confidence"
        - columnheader "status"
    - rowgroup:
      - row "Consulting service 50 Unmatched 0.35 unmatched":
        - cell "Consulting service"
        - cell "50"
        - cell "Unmatched"
        - cell "0.35"
        - cell "unmatched"
  - text: mapping Summary conflict Count 0 category Amount Totals widget sales 200 category Counts widget sales 2 low Confidence Count 0 mapped Count 2 rules Used Count 1 rule Source Count 19 total Rows 3 unmatched Count 1 rules Used
  - table:
    - rowgroup:
      - row "category Label confidence keywords match Mode priority":
        - columnheader "category Label"
        - columnheader "confidence"
        - columnheader "keywords"
        - columnheader "match Mode"
        - columnheader "priority"
    - rowgroup:
      - row "Interest Income 0.95 interest income interest earned bank interest contains 10":
        - cell "Interest Income"
        - cell "0.95"
        - cell "interest income interest earned bank interest":
          - list:
            - listitem: interest income
            - listitem: interest earned
            - listitem: bank interest
        - cell "contains"
        - cell "10"
      - row "Rents 0.92 rental income rent received lease income contains 10":
        - cell "Rents"
        - cell "0.92"
        - cell "rental income rent received lease income":
          - list:
            - listitem: rental income
            - listitem: rent received
            - listitem: lease income
        - cell "contains"
        - cell "10"
      - row "Royalties 0.9 royalty income royalties patent royalty contains 10":
        - cell "Royalties"
        - cell "0.9"
        - cell "royalty income royalties patent royalty":
          - list:
            - listitem: royalty income
            - listitem: royalties
            - listitem: patent royalty
        - cell "contains"
        - cell "10"
      - row "Dividends 0.9 dividend income portfolio shares contains 10":
        - cell "Dividends"
        - cell "0.9"
        - cell "dividend income portfolio shares":
          - list:
            - listitem: dividend income
            - listitem: portfolio shares
        - cell "contains"
        - cell "10"
      - row "Other FAPI Income 0.72 other fapi income miscellaneous fapi revenue contains 5":
        - cell "Other FAPI Income"
        - cell "0.72"
        - cell "other fapi income miscellaneous fapi revenue":
          - list:
            - listitem: other fapi income
            - listitem: miscellaneous fapi revenue
        - cell "contains"
        - cell "5"
      - row "General Expenses 0.9 general expenses operating expenses contains 10":
        - cell "General Expenses"
        - cell "0.9"
        - cell "general expenses operating expenses":
          - list:
            - listitem: general expenses
            - listitem: operating expenses
        - cell "contains"
        - cell "10"
      - row "Legal Expenses 0.9 legal expenses legal advisory contains 10":
        - cell "Legal Expenses"
        - cell "0.9"
        - cell "legal expenses legal advisory":
          - list:
            - listitem: legal expenses
            - listitem: legal advisory
        - cell "contains"
        - cell "10"
      - row "Accounting Expenses 0.9 accounting expenses accounting service contains 10":
        - cell "Accounting Expenses"
        - cell "0.9"
        - cell "accounting expenses accounting service":
          - list:
            - listitem: accounting expenses
            - listitem: accounting service
        - cell "contains"
        - cell "10"
      - row "Debt Forgiveness 0.9 debt forgiveness contains 10":
        - cell "Debt Forgiveness"
        - cell "0.9"
        - cell "debt forgiveness":
          - list:
            - listitem: debt forgiveness
        - cell "contains"
        - cell "10"
      - row "Prior Year G 0.9 prior year g contains 10":
        - cell "Prior Year G"
        - cell "0.9"
        - cell "prior year g":
          - list:
            - listitem: prior year g
        - cell "contains"
        - cell "10"
      - row "Capital Gains 0.9 capital gains cap gains contains 10":
        - cell "Capital Gains"
        - cell "0.9"
        - cell "capital gains cap gains":
          - list:
            - listitem: capital gains
            - listitem: cap gains
        - cell "contains"
        - cell "10"
      - row "CFA Income 0.9 cfa income contains 10":
        - cell "CFA Income"
        - cell "0.9"
        - cell "cfa income":
          - list:
            - listitem: cfa income
        - cell "contains"
        - cell "10"
      - row "Business Losses 0.9 business losses contains 10":
        - cell "Business Losses"
        - cell "0.9"
        - cell "business losses":
          - list:
            - listitem: business losses
        - cell "contains"
        - cell "10"
      - row "FACL Carryforward 0.9 facl carryforward contains 10":
        - cell "FACL Carryforward"
        - cell "0.9"
        - cell "facl carryforward":
          - list:
            - listitem: facl carryforward
        - cell "contains"
        - cell "10"
      - row "Prescribed Amount 0.9 prescribed amount contains 10":
        - cell "Prescribed Amount"
        - cell "0.9"
        - cell "prescribed amount":
          - list:
            - listitem: prescribed amount
        - cell "contains"
        - cell "10"
      - row "Prescribed Amount F1 0.9 prescribed amount f1 contains 10":
        - cell "Prescribed Amount F1"
        - cell "0.9"
        - cell "prescribed amount f1":
          - list:
            - listitem: prescribed amount f1
        - cell "contains"
        - cell "10"
      - row "Dividend Deductions 0.9 dividend deductions contains 10":
        - cell "Dividend Deductions"
        - cell "0.9"
        - cell "dividend deductions":
          - list:
            - listitem: dividend deductions
        - cell "contains"
        - cell "10"
      - row "Partnership Dividends 0.9 partnership dividends contains 10":
        - cell "Partnership Dividends"
        - cell "0.9"
        - cell "partnership dividends":
          - list:
            - listitem: partnership dividends
        - cell "contains"
        - cell "10"
      - row "Widget sales 0.85 Widget contains 19":
        - cell "Widget sales"
        - cell "0.85"
        - cell "Widget":
          - list:
            - listitem: Widget
        - cell "contains"
        - cell "19"
  - text: FAPI Summary Engine calculated Results FINAL WIDGET RESULT 50,000 FX RATE 1.35 DEDUCTIONS 0 GROSS 0 DEDUCTIONS CAD 0 GROSS CAD 0 FAPI BRUT 0 FAPI BRUT CAD 0 FAT DEDUCTION 0 FAT DEDUCTION CAD 0 NET FAPI 0 NET FAPI CAD 0 formula Trace FINAL WIDGET RESULT calculation Id FINAL_WIDGET_RESULT expression FINAL_WIDGET_RESULT = WIDGET_RESULT input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "WIDGET_RESULT 50,000":
        - cell "WIDGET_RESULT"
        - cell "50,000"
  - text: operation pass_through result 50,000 FX RATE calculation Id FX_RATE expression FX_RATE = pass_through(fxRate) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "fxRate 1.35":
        - cell "fxRate"
        - cell "1.35"
  - text: operation pass_through result 1.35 DEDUCTIONS calculation Id DEDUCTIONS expression DEDUCTIONS = add(D, E, F, F1, G, H) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "D 0":
        - cell "D"
        - cell "0"
      - row "E 0":
        - cell "E"
        - cell "0"
      - row "F 0":
        - cell "F"
        - cell "0"
      - row "F1 0":
        - cell "F1"
        - cell "0"
      - row "G 0":
        - cell "G"
        - cell "0"
      - row "H 0":
        - cell "H"
        - cell "0"
  - text: operation add result 0 GROSS calculation Id GROSS expression GROSS = add(A, A1, A2, B, C) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "A 0":
        - cell "A"
        - cell "0"
      - row "A1 0":
        - cell "A1"
        - cell "0"
      - row "A2 0":
        - cell "A2"
        - cell "0"
      - row "B 0":
        - cell "B"
        - cell "0"
      - row "C 0":
        - cell "C"
        - cell "0"
  - text: operation add result 0 DEDUCTIONS CAD calculation Id DEDUCTIONS_CAD expression DEDUCTIONS_CAD = multiply(DEDUCTIONS, FX_RATE) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "DEDUCTIONS 0":
        - cell "DEDUCTIONS"
        - cell "0"
      - row "FX_RATE 1.35":
        - cell "FX_RATE"
        - cell "1.35"
  - text: operation multiply result 0 GROSS CAD calculation Id GROSS_CAD expression GROSS_CAD = multiply(GROSS, FX_RATE) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "GROSS 0":
        - cell "GROSS"
        - cell "0"
      - row "FX_RATE 1.35":
        - cell "FX_RATE"
        - cell "1.35"
  - text: operation multiply result 0 FAPI BRUT calculation Id FAPI_BRUT expression FAPI_BRUT = max_subtract_zero(GROSS, DEDUCTIONS) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "GROSS 0":
        - cell "GROSS"
        - cell "0"
      - row "DEDUCTIONS 0":
        - cell "DEDUCTIONS"
        - cell "0"
  - text: operation max_subtract_zero result 0 FAPI BRUT CAD calculation Id FAPI_BRUT_CAD expression FAPI_BRUT_CAD = multiply(FAPI_BRUT, FX_RATE) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "FAPI_BRUT 0":
        - cell "FAPI_BRUT"
        - cell "0"
      - row "FX_RATE 1.35":
        - cell "FX_RATE"
        - cell "1.35"
  - text: operation multiply result 0 FAT DEDUCTION calculation Id FAT_DEDUCTION expression FAT_DEDUCTION = min_multiply_cap(FAT_PAID, RTF, FAPI_BRUT) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "FAT_PAID 100":
        - cell "FAT_PAID"
        - cell "100"
      - row "RTF 4":
        - cell "RTF"
        - cell "4"
      - row "FAPI_BRUT 0":
        - cell "FAPI_BRUT"
        - cell "0"
  - text: operation min_multiply_cap result 0 FAT DEDUCTION CAD calculation Id FAT_DEDUCTION_CAD expression FAT_DEDUCTION_CAD = multiply(FAT_DEDUCTION, FX_RATE) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "FAT_DEDUCTION 0":
        - cell "FAT_DEDUCTION"
        - cell "0"
      - row "FX_RATE 1.35":
        - cell "FX_RATE"
        - cell "1.35"
  - text: operation multiply result 0 NET FAPI calculation Id NET_FAPI expression NET_FAPI = max_subtract_zero(FAPI_BRUT, FAT_DEDUCTION) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "FAPI_BRUT 0":
        - cell "FAPI_BRUT"
        - cell "0"
      - row "FAT_DEDUCTION 0":
        - cell "FAT_DEDUCTION"
        - cell "0"
  - text: operation max_subtract_zero result 0 NET FAPI CAD calculation Id NET_FAPI_CAD expression NET_FAPI_CAD = multiply(NET_FAPI, FX_RATE) input Values
  - table:
    - rowgroup:
      - row "operand value":
        - columnheader "operand"
        - columnheader "value"
    - rowgroup:
      - row "NET_FAPI 0":
        - cell "NET_FAPI"
        - cell "0"
      - row "FX_RATE 1.35":
        - cell "FX_RATE"
        - cell "1.35"
  - text: operation multiply result 0 calculation Summary calculated Count 12 formula Mode auto:inline input Count 525 rule Count 12 warning Count 0 named Values source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ewidget sales@2Erow Count 2 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ewidget sales@2Evalue 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Einterest Income@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Einterest Income@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Erents@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Erents@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eroyalties@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eroyalties@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edividends@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edividends@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eother Fapi Income@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eother Fapi Income@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Egeneral Expenses@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Egeneral Expenses@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Elegal Expenses@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Elegal Expenses@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eaccounting Expenses@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eaccounting Expenses@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edebt Forgiveness@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edebt Forgiveness@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprior Year G@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprior Year G@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ecap Gains@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ecap Gains@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ecfa Income@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ecfa Income@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ebusiness Losses@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Ebusiness Losses@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Efacl Carryforward@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Efacl Carryforward@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprescribed Amount@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprescribed Amount@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprescribed Amount F1@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Eprescribed Amount F1@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edividend Deductions@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Edividend Deductions@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Epartnership Dividends@2Erow Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Total Details@2Epartnership Dividends@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Ewidget sales 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Einterest Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Erents 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eroyalties 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Edividends 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eother Fapi Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Egeneral Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Elegal Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eaccounting Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Edebt Forgiveness 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eprior Year G 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Ecap Gains 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Ecfa Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Ebusiness Losses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Efacl Carryforward 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eprescribed Amount 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Eprescribed Amount F1 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Edividend Deductions 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Acategory Totals@2Epartnership Dividends 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Eincome bucket@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Eexpense bucket@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Ecfa Income@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Edebt Forgiveness@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Ebusiness Losses@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Efacl Carryforward@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Total Details@2Ewidget total@2Eresult 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Eincome bucket 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Eexpense bucket 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Ecfa Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Edebt Forgiveness 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Ebusiness Losses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Efacl Carryforward 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Totals@2Ewidget total 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Ewidget sales 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Einterest Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Erents 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eroyalties 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Edividends 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eother Fapi Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Egeneral Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Elegal Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eaccounting Expenses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Edebt Forgiveness 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eprior Year G 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Ecap Gains 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Ecfa Income 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Ebusiness Losses 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Efacl Carryforward 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eprescribed Amount 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eprescribed Amount F1 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Edividend Deductions 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Epartnership Dividends 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eincome bucket 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Eexpense bucket 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Anamed Values@2Ewidget total 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aexcluded Rows Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Econfidence 0.85 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Eevidence Refs@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Eraw@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Esource Row@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Esource Row@2Eraw@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Esource Row@2Eevidence Refs@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Esource Row@2Esource Trace@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E0@2Esource Trace@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Econfidence 0.85 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Eevidence Refs@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Eraw@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Esource Row@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Esource Row@2Eraw@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Esource Row@2Eevidence Refs@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Esource Row@2Esource Trace@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Category@2Ewidget sales@2E1@2Esource Trace@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Econfidence 0.85 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Eevidence Refs@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Eraw@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Esource Row@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Esource Row@2Eraw@2Eamount 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Esource Row@2Eevidence Refs@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Esource Row@2Esource Trace@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E0@2Esource Trace@2E0@2Evalue Preview 120 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Econfidence 0.85 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Eevidence Refs@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Eraw@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Esource Row@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Esource Row@2Eraw@2Eamount 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Esource Row@2Eevidence Refs@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Esource Row@2Esource Trace@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Aincluded Rows By Rollup@2Ewidget total@2E1@2Esource Trace@2E0@2Evalue Preview 80 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Einput Values@2E1@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Einput Values@2E2@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Einput Values@2E3@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Einput Values@2E4@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eincome bucket@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eexpense bucket@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eexpense bucket@2Einput Values@2E1@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eexpense bucket@2Einput Values@2E2@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Eexpense bucket@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ecfa Income@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ecfa Income@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Edebt Forgiveness@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Edebt Forgiveness@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ebusiness Losses@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ebusiness Losses@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Efacl Carryforward@2Einput Values@2E0@2Evalue 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Efacl Carryforward@2Eresult 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ewidget total@2Einput Values@2E0@2Evalue 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Formula Trace@2Ewidget total@2Eresult 200 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Ecategory Count 19 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Eexcluded Row Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Emapped Row Count 2 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Enamed Value Count 22 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Erollup Count 7 source:fapi-logic-lines-engine:named Values.source@3Afapi-logic-category-rollup@3Arollup Summary@2Ewarning Count 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Efat Paid 100 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Efapi Year 2,025 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Einclusion Rate 0.5 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Ertf 4 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Ep Coefficient 1 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Ecanadian Rules95 4 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Eprior Year G 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Eprescribed Amount 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Eprescribed Amount F1 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Edividend Deductions 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Afapi Inputs@2Epartnership Dividends 0 source:fapi-logic-lines-engine:named Values.source@3Afapi-source-inputs@3Ainput Metadata@2Esource Version 1 source:fapi-logic-lines-engine:named Values.widget sales 200 source:fapi-logic-lines-engine:named Values.interest Income 0 source:fapi-logic-lines-engine:named Values.rents 0 source:fapi-logic-lines-engine:named Values.royalties 0 source:fapi-logic-lines-engine:named Values.dividends 0 source:fapi-logic-lines-engine:named Values.other Fapi Income 0 source:fapi-logic-lines-engine:named Values.general Expenses 0 source:fapi-logic-lines-engine:named Values.legal Expenses 0 source:fapi-logic-lines-engine:named Values.accounting Expenses 0 source:fapi-logic-lines-engine:named Values.debt Forgiveness 0 source:fapi-logic-lines-engine:named Values.prior Year G 0 source:fapi-logic-lines-engine:named Values.cap Gains 0 source:fapi-logic-lines-engine:named Values.cfa Income 0 source:fapi-logic-lines-engine:named Values.business Losses 0 source:fapi-logic-lines-engine:named Values.facl Carryforward 0 source:fapi-logic-lines-engine:named Values.prescribed Amount 0 source:fapi-logic-lines-engine:named Values.prescribed Amount F1 0 source:fapi-logic-lines-engine:named Values.dividend Deductions 0 source:fapi-logic-lines-engine:named Values.partnership Dividends 0 source:fapi-logic-lines-engine:named Values.income bucket 0 source:fapi-logic-lines-engine:named Values.expense bucket 0 source:fapi-logic-lines-engine:named Values.widget total 200 source:fapi-logic-lines-engine:named Values.fat Paid 100 source:fapi-logic-lines-engine:named Values.fapi Year 2,025 source:fapi-logic-lines-engine:named Values.inclusion Rate 0.5 source:fapi-logic-lines-engine:named Values.rtf 4 source:fapi-logic-lines-engine:named Values.p Coefficient 1 source:fapi-logic-lines-engine:named Values.canadian Rules95 4 0 source:fapi-logic-lines-engine:named Values.FAT PAID 100 source:fapi-logic-lines-engine:named Values.RTF 4 source:fapi-logic-lines-engine:named Values.INCLUSION RATE 0.5 source:fapi-logic-lines-engine:named Values.WIDGET RESULT 50,000 source:fapi-logic-lines-engine:named Values.H 0 source:fapi-logic-lines-engine:named Values.G 0 source:fapi-logic-lines-engine:named Values.F1 0 source:fapi-logic-lines-engine:named Values.F 0 source:fapi-logic-lines-engine:named Values.E 0 source:fapi-logic-lines-engine:named Values.D 0 source:fapi-logic-lines-engine:named Values.C 0 source:fapi-logic-lines-engine:named Values.B 0 source:fapi-logic-lines-engine:named Values.A2 0 source:fapi-logic-lines-engine:named Values.A1 0 source:fapi-logic-lines-engine:named Values.COMPUTATION 95 4 0 source:fapi-logic-lines-engine:named Values.EXPENSES 0 source:fapi-logic-lines-engine:named Values.A 0 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.input Values.0.value 200 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.input Values.1.operand 500 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.input Values.1.value 500 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.input Values.2.operand 2 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.input Values.2.value 2 source:fapi-logic-lines-engine:formula Trace.WIDGET RESULT.result 50,000 source:fapi-logic-lines-engine:formula Trace.RTF.input Values.0.value 4 source:fapi-logic-lines-engine:formula Trace.RTF.result 4 source:fapi-logic-lines-engine:formula Trace.FAT PAID.input Values.0.value 100 source:fapi-logic-lines-engine:formula Trace.FAT PAID.result 100 source:fapi-logic-lines-engine:formula Trace.H.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.H.result 0 source:fapi-logic-lines-engine:formula Trace.G.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.G.result 0 source:fapi-logic-lines-engine:formula Trace.F1.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.F1.result 0 source:fapi-logic-lines-engine:formula Trace.F.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.F.result 0 source:fapi-logic-lines-engine:formula Trace.E.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.E.result 0 source:fapi-logic-lines-engine:formula Trace.D.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.D.result 0 source:fapi-logic-lines-engine:formula Trace.C.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.C.result 0 source:fapi-logic-lines-engine:formula Trace.B.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.B.input Values.1.value 0.5 source:fapi-logic-lines-engine:formula Trace.B.result 0 source:fapi-logic-lines-engine:formula Trace.A2.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.A2.result 0 source:fapi-logic-lines-engine:formula Trace.A1.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.A1.input Values.1.operand 2 source:fapi-logic-lines-engine:formula Trace.A1.input Values.1.value 2 source:fapi-logic-lines-engine:formula Trace.A1.result 0 source:fapi-logic-lines-engine:formula Trace.COMPUTATION 95 4.input Values.0.value 0 source:fapi-logic-lines-engine:formula Trace.COMPUTATION 95 4.result 0 source:fapi-logic-lines-engine:formula Trace.EXPENSES.input Values.0.value 1 source:fapi-logic-lines-engine:formula Trace.EXPENSES.input Values.1.value 0 source:fapi-logic-lines-engine:formula Trace.EXPENSES.result 0 source:fapi-logic-lines-engine:formula Trace.A.input Values.0.value 1 source:fapi-logic-lines-engine:formula Trace.A.input Values.1.value 0 source:fapi-logic-lines-engine:formula Trace.A.input Values.2.value 0 source:fapi-logic-lines-engine:formula Trace.A.input Values.3.value 0 source:fapi-logic-lines-engine:formula Trace.A.result 0 source:fapi-logic-lines-engine:calculated Results.WIDGET RESULT 50,000 source:fapi-logic-lines-engine:calculated Results.RTF 4 source:fapi-logic-lines-engine:calculated Results.FAT PAID 100 source:fapi-logic-lines-engine:calculated Results.H 0 source:fapi-logic-lines-engine:calculated Results.G 0 source:fapi-logic-lines-engine:calculated Results.F1 0 source:fapi-logic-lines-engine:calculated Results.F 0 source:fapi-logic-lines-engine:calculated Results.E 0 source:fapi-logic-lines-engine:calculated Results.D 0 source:fapi-logic-lines-engine:calculated Results.C 0 source:fapi-logic-lines-engine:calculated Results.B 0 source:fapi-logic-lines-engine:calculated Results.A2 0 source:fapi-logic-lines-engine:calculated Results.A1 0 source:fapi-logic-lines-engine:calculated Results.COMPUTATION 95 4 0 source:fapi-logic-lines-engine:calculated Results.EXPENSES 0 source:fapi-logic-lines-engine:calculated Results.A 0 source:fapi-logic-lines-engine:result Details.WIDGET RESULT.result 50,000 source:fapi-logic-lines-engine:result Details.RTF.result 4 source:fapi-logic-lines-engine:result Details.FAT PAID.result 100 source:fapi-logic-lines-engine:result Details.H.result 0 source:fapi-logic-lines-engine:result Details.G.result 0 source:fapi-logic-lines-engine:result Details.F1.result 0 source:fapi-logic-lines-engine:result Details.F.result 0 source:fapi-logic-lines-engine:result Details.E.result 0 source:fapi-logic-lines-engine:result Details.D.result 0 source:fapi-logic-lines-engine:result Details.C.result 0 source:fapi-logic-lines-engine:result Details.B.result 0 source:fapi-logic-lines-engine:result Details.A2.result 0 source:fapi-logic-lines-engine:result Details.A1.result 0 source:fapi-logic-lines-engine:result Details.COMPUTATION 95 4.result 0 source:fapi-logic-lines-engine:result Details.EXPENSES.result 0 source:fapi-logic-lines-engine:result Details.A.result 0 source:fapi-logic-lines-engine:calculation Summary.calculated Count 16 source:fapi-logic-lines-engine:calculation Summary.input Count 213 source:fapi-logic-lines-engine:calculation Summary.rule Count 16 source:fapi-logic-lines-engine:calculation Summary.warning Count 0 source:fapi-source-fx-rate:exchange Rate 1.35 source:fapi-source-fx-rate:exchange Rate Info.exchange rate 1.35 source:fapi-source-fx-rate:exchange Rate Info.rate 1.35 source:fapi-source-fx-rate:exchange Rate Info.rate year 2,025 source:fapi-source-fx-rate:value 1.35 source:fapi-source-fx-rate:fapi Inputs.fx Rate 1.35 source:fapi-source-fx-rate:rate Metadata.source Version 1 source:fapi-logic-category-rollup:category Total Details.widget sales.row Count 2 source:fapi-logic-category-rollup:category Total Details.widget sales.value 200 source:fapi-logic-category-rollup:category Total Details.interest Income.row Count 0 source:fapi-logic-category-rollup:category Total Details.interest Income.value 0 source:fapi-logic-category-rollup:category Total Details.rents.row Count 0 source:fapi-logic-category-rollup:category Total Details.rents.value 0 source:fapi-logic-category-rollup:category Total Details.royalties.row Count 0 source:fapi-logic-category-rollup:category Total Details.royalties.value 0 source:fapi-logic-category-rollup:category Total Details.dividends.row Count 0 source:fapi-logic-category-rollup:category Total Details.dividends.value 0 source:fapi-logic-category-rollup:category Total Details.other Fapi Income.row Count 0 source:fapi-logic-category-rollup:category Total Details.other Fapi Income.value 0 source:fapi-logic-category-rollup:category Total Details.general Expenses.row Count 0 source:fapi-logic-category-rollup:category Total Details.general Expenses.value 0 source:fapi-logic-category-rollup:category Total Details.legal Expenses.row Count 0 source:fapi-logic-category-rollup:category Total Details.legal Expenses.value 0 source:fapi-logic-category-rollup:category Total Details.accounting Expenses.row Count 0 source:fapi-logic-category-rollup:category Total Details.accounting Expenses.value 0 source:fapi-logic-category-rollup:category Total Details.debt Forgiveness.row Count 0 source:fapi-logic-category-rollup:category Total Details.debt Forgiveness.value 0 source:fapi-logic-category-rollup:category Total Details.prior Year G.row Count 0 source:fapi-logic-category-rollup:category Total Details.prior Year G.value 0 source:fapi-logic-category-rollup:category Total Details.cap Gains.row Count 0 source:fapi-logic-category-rollup:category Total Details.cap Gains.value 0 source:fapi-logic-category-rollup:category Total Details.cfa Income.row Count 0 source:fapi-logic-category-rollup:category Total Details.cfa Income.value 0 source:fapi-logic-category-rollup:category Total Details.business Losses.row Count 0 source:fapi-logic-category-rollup:category Total Details.business Losses.value 0 source:fapi-logic-category-rollup:category Total Details.facl Carryforward.row Count 0 source:fapi-logic-category-rollup:category Total Details.facl Carryforward.value 0 source:fapi-logic-category-rollup:category Total Details.prescribed Amount.row Count 0 source:fapi-logic-category-rollup:category Total Details.prescribed Amount.value 0 source:fapi-logic-category-rollup:category Total Details.prescribed Amount F1.row Count 0 source:fapi-logic-category-rollup:category Total Details.prescribed Amount F1.value 0 source:fapi-logic-category-rollup:category Total Details.dividend Deductions.row Count 0 source:fapi-logic-category-rollup:category Total Details.dividend Deductions.value 0 source:fapi-logic-category-rollup:category Total Details.partnership Dividends.row Count 0 source:fapi-logic-category-rollup:category Total Details.partnership Dividends.value 0 source:fapi-logic-category-rollup:category Totals.widget sales 200 source:fapi-logic-category-rollup:category Totals.interest Income 0 source:fapi-logic-category-rollup:category Totals.rents 0 source:fapi-logic-category-rollup:category Totals.royalties 0 source:fapi-logic-category-rollup:category Totals.dividends 0 source:fapi-logic-category-rollup:category Totals.other Fapi Income 0 source:fapi-logic-category-rollup:category Totals.general Expenses 0 source:fapi-logic-category-rollup:category Totals.legal Expenses 0 source:fapi-logic-category-rollup:category Totals.accounting Expenses 0 source:fapi-logic-category-rollup:category Totals.debt Forgiveness 0 source:fapi-logic-category-rollup:category Totals.prior Year G 0 source:fapi-logic-category-rollup:category Totals.cap Gains 0 source:fapi-logic-category-rollup:category Totals.cfa Income 0 source:fapi-logic-category-rollup:category Totals.business Losses 0 source:fapi-logic-category-rollup:category Totals.facl Carryforward 0 source:fapi-logic-category-rollup:category Totals.prescribed Amount 0 source:fapi-logic-category-rollup:category Totals.prescribed Amount F1 0 source:fapi-logic-category-rollup:category Totals.dividend Deductions 0 source:fapi-logic-category-rollup:category Totals.partnership Dividends 0 source:fapi-logic-category-rollup:rollup Total Details.income bucket.result 0 source:fapi-logic-category-rollup:rollup Total Details.expense bucket.result 0 source:fapi-logic-category-rollup:rollup Total Details.cfa Income.result 0 source:fapi-logic-category-rollup:rollup Total Details.debt Forgiveness.result 0 source:fapi-logic-category-rollup:rollup Total Details.business Losses.result 0 source:fapi-logic-category-rollup:rollup Total Details.facl Carryforward.result 0 source:fapi-logic-category-rollup:rollup Total Details.widget total.result 200 source:fapi-logic-category-rollup:rollup Totals.income bucket 0 source:fapi-logic-category-rollup:rollup Totals.expense bucket 0 source:fapi-logic-category-rollup:rollup Totals.cfa Income 0 source:fapi-logic-category-rollup:rollup Totals.debt Forgiveness 0 source:fapi-logic-category-rollup:rollup Totals.business Losses 0 source:fapi-logic-category-rollup:rollup Totals.facl Carryforward 0 source:fapi-logic-category-rollup:rollup Totals.widget total 200 source:fapi-logic-category-rollup:named Values.widget sales 200 source:fapi-logic-category-rollup:named Values.interest Income 0 source:fapi-logic-category-rollup:named Values.rents 0 source:fapi-logic-category-rollup:named Values.royalties 0 source:fapi-logic-category-rollup:named Values.dividends 0 source:fapi-logic-category-rollup:named Values.other Fapi Income 0 source:fapi-logic-category-rollup:named Values.general Expenses 0 source:fapi-logic-category-rollup:named Values.legal Expenses 0 source:fapi-logic-category-rollup:named Values.accounting Expenses 0 source:fapi-logic-category-rollup:named Values.debt Forgiveness 0 source:fapi-logic-category-rollup:named Values.prior Year G 0 source:fapi-logic-category-rollup:named Values.cap Gains 0 source:fapi-logic-category-rollup:named Values.cfa Income 0 source:fapi-logic-category-rollup:named Values.business Losses 0 source:fapi-logic-category-rollup:named Values.facl Carryforward 0 source:fapi-logic-category-rollup:named Values.prescribed Amount 0 source:fapi-logic-category-rollup:named Values.prescribed Amount F1 0 source:fapi-logic-category-rollup:named Values.dividend Deductions 0 source:fapi-logic-category-rollup:named Values.partnership Dividends 0 source:fapi-logic-category-rollup:named Values.income bucket 0 source:fapi-logic-category-rollup:named Values.expense bucket 0 source:fapi-logic-category-rollup:named Values.widget total 200 source:fapi-logic-category-rollup:excluded Rows Count 0 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.amount 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.confidence 0.85 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.evidence Refs.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.raw.amount 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.source Row.amount 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.source Row.raw.amount 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.source Row.evidence Refs.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.source Row.source Trace.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.0.source Trace.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.amount 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.confidence 0.85 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.evidence Refs.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.raw.amount 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.source Row.amount 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.source Row.raw.amount 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.source Row.evidence Refs.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.source Row.source Trace.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Category.widget sales.1.source Trace.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.amount 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.confidence 0.85 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.evidence Refs.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.raw.amount 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.source Row.amount 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.source Row.raw.amount 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.source Row.evidence Refs.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.source Row.source Trace.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.0.source Trace.0.value Preview 120 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.amount 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.confidence 0.85 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.evidence Refs.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.raw.amount 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.source Row.amount 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.source Row.raw.amount 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.source Row.evidence Refs.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.source Row.source Trace.0.value Preview 80 source:fapi-logic-category-rollup:included Rows By Rollup.widget total.1.source Trace.0.value Preview 80 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.input Values.1.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.input Values.2.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.input Values.3.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.input Values.4.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.income bucket.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.expense bucket.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.expense bucket.input Values.1.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.expense bucket.input Values.2.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.expense bucket.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.cfa Income.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.cfa Income.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.debt Forgiveness.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.debt Forgiveness.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.business Losses.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.business Losses.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.facl Carryforward.input Values.0.value 0 source:fapi-logic-category-rollup:rollup Formula Trace.facl Carryforward.result 0 source:fapi-logic-category-rollup:rollup Formula Trace.widget total.input Values.0.value 200 source:fapi-logic-category-rollup:rollup Formula Trace.widget total.result 200 source:fapi-logic-category-rollup:rollup Summary.category Count 19 source:fapi-logic-category-rollup:rollup Summary.excluded Row Count 0 source:fapi-logic-category-rollup:rollup Summary.mapped Row Count 2 source:fapi-logic-category-rollup:rollup Summary.named Value Count 22 source:fapi-logic-category-rollup:rollup Summary.rollup Count 7 source:fapi-logic-category-rollup:rollup Summary.warning Count 0 source:fapi-source-inputs:fapi Inputs.fat Paid 100 source:fapi-source-inputs:fapi Inputs.fapi Year 2,025 source:fapi-source-inputs:fapi Inputs.inclusion Rate 0.5 source:fapi-source-inputs:fapi Inputs.rtf 4 source:fapi-source-inputs:fapi Inputs.p Coefficient 1 source:fapi-source-inputs:fapi Inputs.canadian Rules95 4 0 source:fapi-source-inputs:fapi Inputs.prior Year G 0 source:fapi-source-inputs:fapi Inputs.prescribed Amount 0 source:fapi-source-inputs:fapi Inputs.prescribed Amount F1 0 source:fapi-source-inputs:fapi Inputs.dividend Deductions 0 source:fapi-source-inputs:fapi Inputs.partnership Dividends 0 source:fapi-source-inputs:input Metadata.source Version 1 widget sales 200 interest Income 0 rents 0 royalties 0 dividends 0 other Fapi Income 0 general Expenses 0 legal Expenses 0 accounting Expenses 0 debt Forgiveness 0 prior Year G 0 cap Gains 0 cfa Income 0 business Losses 0 facl Carryforward 0 prescribed Amount 0 prescribed Amount F1 0 dividend Deductions 0 partnership Dividends 0 income bucket 0 expense bucket 0 widget total 200 fat Paid 100 fapi Year 2,025 inclusion Rate 0.5 rtf 4 p Coefficient 1 canadian Rules95 4 0 FAT PAID 100 RTF 4 INCLUSION RATE 0.5 WIDGET RESULT 50,000 H 0 G 0 F1 0 F 0 E 0 D 0 C 0 B 0 A2 0 A1 0 COMPUTATION 95 4 0 EXPENSES 0 A 0 fx Rate 1.35 FX RATE 1.35 FINAL WIDGET RESULT 50,000 DEDUCTIONS 0 GROSS 0 DEDUCTIONS CAD 0 GROSS CAD 0 FAPI BRUT 0 FAPI BRUT CAD 0 FAT DEDUCTION 0 FAT DEDUCTION CAD 0 NET FAPI 0 NET FAPI CAD 0
  - heading "Output" [level=4]
  - button "Values"
  - button "JSON"
  - button "All details"
  - text: FINAL WIDGET RESULT 50,000 FX RATE 1.35 DEDUCTIONS 0 GROSS 0 DEDUCTIONS CAD 0 GROSS CAD 0 FAPI BRUT 0 FAPI BRUT CAD 0 FAT DEDUCTION 0 FAT DEDUCTION CAD 0 NET FAPI 0 NET FAPI CAD 0
- group: Other runs (1)
- separator "Drag to resize"
- text: Chat panel
- button "Hide chat panel"
- button "Expand chat panel"
- button "Choose client — Scope reads their worksheets & documents"
- button "N Northstar Inc"
- button "Work"
- 'button "Context: 0 selected, 0 used"'
- button "Tools": "9"
- text: Good evening, Sophia What would you like to work on?
- textbox "Ask Scope, or describe a task…"
- button "Add — search, workflows, worksheets"
- button "Attach files"
- 'button "Chat agent: Sina"': Sina
- button "Send" [disabled]
- region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | 
  3   | test('production individual block tests show real inputs and outputs without becoming full workflow runs', async ({ page }, info) => {
  4   |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  5   |   const start = Date.now();
  6   |   await page.goto('/w/pf-document-calculator');
  7   |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  8   |   await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  9   |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  10  |   const panel = page.getByRole('region', { name: 'Individual block test' });
  11  |   await panel.getByLabel('Test value 1 number').fill('125.5');
  12  |   const runStart = Date.now();
  13  |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  14  |   await expect(panel.getByText('251', { exact: true })).toBeVisible();
  15  |   await expect(panel.getByText('125.5', { exact: true })).toBeVisible();
  16  |   await expect(panel).toContainText('Individual block test');
  17  |   const runMs = Date.now() - runStart;
  18  |   await page.screenshot({ path: info.outputPath('production-individual-block.png'), fullPage: true });
  19  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  20  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  21  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toHaveCount(0);
  22  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  23  |   await page.getByRole('button', { name: 'Final result', exact: true }).click();
  24  |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  25  |   await panel.getByLabel('Block test input source').selectOption('recorded');
  26  |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  27  |   await expect(panel).toContainText('251');
  28  |   await expect(panel).not.toContainText('No usable recorded result');
  29  |   expect(errors).toEqual([]);
  30  |   console.log(JSON.stringify({ scenario: 'individual-block', openMs: runStart - start, runMs, errors }));
  31  | });
  32  | 
  33  | test('production document-to-output rehearsal uses the UI and survives reload', async ({ page }, info) => {
  34  |   const errors: string[] = [];
  35  |   page.on('pageerror', error => errors.push(error.message));
  36  |   const start = Date.now();
  37  |   await page.goto('/w/pf-fapi');
  38  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  39  |   const initialBuildMs = Date.now() - start;
  40  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  41  |   await page.getByLabel('Upload test document').setInputFiles({ name: 'demo-sales.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nWidget order one,120\nWidget order two,80\nConsulting service,50') });
  42  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  43  |   await page.getByRole('button', { name: 'Keyword Mapper', exact: true }).click();
  44  |   await page.getByRole('button', { name: 'New', exact: true }).click();
  45  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category ID$/ }) }).locator('input').fill('widget_sales');
  46  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category label$/ }) }).locator('input').fill('Widget sales');
  47  |   await page.getByPlaceholder('Add contains keyword').fill('Widget');
  48  |   await page.getByPlaceholder('Add contains keyword').press('Enter');
  49  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  50  |   await page.getByRole('button', { name: 'Category Rollup', exact: true }).click();
  51  |   await page.getByRole('button', { name: 'New Group', exact: true }).click();
  52  |   await page.getByPlaceholder('e.g. income_base').fill('widget_total');
  53  |   await page.getByPlaceholder('e.g. Income Base').fill('Widget total');
  54  |   await page.getByRole('button', { name: 'Widget sales', exact: true }).click();
  55  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  56  |   await page.getByRole('button', { name: 'FAPI Lines Engine', exact: true }).click();
  57  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  58  |   await page.getByPlaceholder('KEY', { exact: true }).fill('WIDGET_RESULT');
  59  |   await page.getByPlaceholder('Label', { exact: true }).fill('Adjusted widget sales');
  60  |   await page.getByRole('button', { name: /^widget_total(?: = 200)?$/ }).click();
  61  |   await page.getByRole('button', { name: '×', exact: true }).click();
  62  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('500');
  63  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  64  |   await page.getByRole('button', { name: '÷', exact: true }).click();
  65  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('2');
  66  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  67  |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  68  |   await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText('50,000');
  69  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  70  |   await page.getByRole('button', { name: 'FAPI Summary Engine', exact: true }).click();
  71  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  72  |   await page.getByPlaceholder('KEY', { exact: true }).fill('FINAL_WIDGET_RESULT');
  73  |   await page.getByPlaceholder('Label', { exact: true }).fill('Final widget sales');
  74  |   await page.getByRole('button', { name: /^WIDGET_RESULT(?: = 50000)?$/ }).click();
  75  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  76  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  77  |   await page.getByLabel('Workflow name').fill('Demo rehearsal — widget sales');
  78  |   const runStart = Date.now();
  79  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  80  |   await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  81  |   const output = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Canonical JSON/ }) }).first();
  82  |   await expect(output).toContainText('50,000');
  83  |   const runAndInspectMs = Date.now() - runStart;
  84  |   const finalLabel = output.getByText('FINAL WIDGET RESULT', { exact: true }).last();
  85  |   await finalLabel.scrollIntoViewIfNeeded();
  86  |   await expect(finalLabel).toBeVisible();
  87  |   await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
  88  |   await page.screenshot({ path: info.outputPath('production-final-result.png'), fullPage: true });
  89  |   await page.reload();
  90  |   await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  91  |   await page.getByRole('button', { name: 'Demo rehearsal — widget sales', exact: true }).click();
  92  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  93  |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  94  |   await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  95  |   await expect(output).toContainText('50,000');
> 96  |   await expect(page.locator('summary').filter({ hasText: /^Previous runs \(1\)/ })).toBeVisible();
      |                                                                                     ^ Error: expect(locator).toBeVisible() failed
  97  |   expect(errors).toEqual([]);
  98  |   console.log(JSON.stringify({ initialBuildMs, runAndInspectMs, errors }));
  99  |   await info.attach('production-timing', { contentType: 'application/json', body: JSON.stringify({ initialBuildMs, runAndInspectMs, errors }, null, 2) });
  100 | });
  101 | 
  102 | test('production load of 1000 rows persists two runs and displays the correct total', async ({ page }, info) => {
  103 |   const errors: string[] = [];
  104 |   page.on('pageerror', error => errors.push(error.message));
  105 |   await page.goto('/w/pf-fapi');
  106 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  107 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  108 |   await page.getByLabel('Upload test document').setInputFiles({ name: 'production-1000.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 1000 }, (_, index) => `Interest income ${index + 1},1`).join('\n')) });
  109 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  110 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  111 |   await page.getByLabel('Workflow name').fill('Production 1000-row rehearsal');
  112 |   const start = Date.now();
  113 |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  114 |   await page.locator('summary').filter({ hasText: /^Category Rollup/ }).click();
  115 |   const rollupOutput = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Category Rollup/ }) }).first();
  116 |   const total = rollupOutput.getByText('category Totals', { exact: true }).locator('..').getByText('interest Income', { exact: true }).locator('..');
  117 |   await expect(total).toContainText('1,000');
  118 |   const runAndInspectMs = Date.now() - start;
  119 |   const reopen = async () => {
  120 |     await page.reload();
  121 |     await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  122 |     await page.getByRole('button', { name: 'Production 1000-row rehearsal', exact: true }).click();
  123 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  124 |   };
  125 |   await reopen();
  126 |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  127 |   await reopen();
  128 |   await expect(page.locator('summary').filter({ hasText: /^Previous runs \(1\)/ })).toBeVisible();
  129 |   await page.locator('summary').filter({ hasText: /^Category Rollup/ }).click();
  130 |   await expect(total).toContainText('1,000');
  131 |   expect(errors).toEqual([]);
  132 |   console.log(JSON.stringify({ count: 1000, runAndInspectMs, persistedRuns: 2, errors }));
  133 |   await info.attach('production-load-timing', { contentType: 'application/json', body: JSON.stringify({ count: 1000, runAndInspectMs, persistedRuns: 2, errors }, null, 2) });
  134 | });
  135 | 
  136 | test('production PDF review calculates final values without downloading document parser bundles', async ({ page }, info) => {
  137 |   const errors: string[] = []; const assets: string[] = [];
  138 |   page.on('pageerror', error => errors.push(error.message));
  139 |   page.on('request', request => { if (request.url().includes('/assets/')) assets.push(request.url()); });
  140 |   const start = Date.now();
  141 |   await page.goto('/w/pf-document-calculator'); await page.getByRole('button', { name: 'Build', exact: true }).click();
  142 |   const openMs = Date.now() - start;
  143 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  144 |   const uploadStart = Date.now();
  145 |   await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/sales-check.pdf');
  146 |   await expect(page.getByLabel('Row 1 number_1')).toBeVisible({ timeout: 30000 });
  147 |   const previewMs = Date.now() - uploadStart;
  148 |   await page.getByLabel('Row 1 label', { exact: true }).fill('Item one');
  149 |   await page.getByLabel('Row 1 number_1', { exact: true }).fill('120');
  150 |   await page.getByLabel('Row 2 label', { exact: true }).fill('Item two');
  151 |   await page.getByLabel('Row 2 number_1', { exact: true }).fill('80');
  152 |   await page.getByLabel('Remove row 3', { exact: true }).click();
  153 |   await page.getByLabel('Number to calculate').selectOption('number_1'); await page.getByLabel('Confirm extracted values').check();
  154 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  155 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  156 |   await page.getByLabel('Workflow name').fill('Document Calculator — PDF rehearsal');
  157 |   const runStart = Date.now();
  158 |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  159 |   const summary = page.getByRole('region', { name: 'Final workflow results' });
  160 |   await expect(summary).toContainText('400'); await expect(summary).toContainText('units');
  161 |   await expect(page.locator('summary').filter({ hasText: /^Final result/ })).toHaveText('Final result \u00b7 success');
  162 |   await expect(summary).not.toContainText('review message');
  163 |   const runMs = Date.now() - runStart;
  164 |   await page.locator('summary').filter({ hasText: /^Final result/ }).click();
  165 |   await expect(page.locator('details').filter({ has: page.locator('summary', { hasText: /^Final result/ }) }).first()).toContainText('400');
  166 |   await summary.scrollIntoViewIfNeeded();
  167 |   await page.screenshot({ path: info.outputPath('neutral-pdf-final-result.png'), fullPage: true });
  168 |   expect(errors).toEqual([]);
  169 |   expect(assets.filter(url => /\/(spreadsheets|pdf-processing|word-processing)-/.test(url))).toEqual([]);
  170 |   console.log(JSON.stringify({ openMs, previewMs, runMs, errors, documentParserDownloads: 0 }));
  171 | });
  172 | 
```