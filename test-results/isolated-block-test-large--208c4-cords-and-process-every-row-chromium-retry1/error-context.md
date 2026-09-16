# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: isolated-block-test.spec.ts >> large example imports paginate editable records and process every row
- Location: e2e/isolated-block-test.spec.ts:198:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('region', { name: 'Individual block test' }).getByRole('textbox', { name: /^Test row .* text$/ })
Expected: 25
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('region', { name: 'Individual block test' }).getByRole('textbox', { name: /^Test row .* text$/ })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - group [ref=e3]:
      - 'generic "Workspace: Synthetic workspace (owner)" [ref=e4] [cursor=pointer]'
      - option "Select…" [disabled]
      - option "Synthetic workspace (owner)" [selected]
      - option "Viewer" [selected]
      - option "Editor"
      - option "Owner"
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - button "Open chat" [ref=e10] [cursor=pointer]:
            - generic [ref=e11]: InScope
          - button "Collapse sidebar" [ref=e12] [cursor=pointer]
        - button "New chat" [ref=e16] [cursor=pointer]
        - button "Workspace" [ref=e18] [cursor=pointer]
        - button "Chat" [ref=e22] [cursor=pointer]
        - button "Workflows" [ref=e28] [cursor=pointer]
        - button "Sources" [ref=e36] [cursor=pointer]
        - button "Connections" [ref=e44] [cursor=pointer]
        - button "Recent conversations" [ref=e54] [cursor=pointer]
        - generic [ref=e58]: No saved chats yet.
        - button "Workflows" [ref=e59] [cursor=pointer]
        - generic [ref=e63]:
          - group [ref=e64]:
            - generic "Workflow storage status" [ref=e65]: Saved to server
          - button "Library" [ref=e66] [cursor=pointer]
          - button "Run history" [ref=e69] [cursor=pointer]
          - button "New workflow" [ref=e74] [cursor=pointer]
          - generic [ref=e76]:
            - generic [ref=e77]: MY WORKFLOWS
            - button "Document Calculator — My workflow" [ref=e78] [cursor=pointer]
          - generic [ref=e79]:
            - generic [ref=e80]: Runnable demos
            - button "Document Calculator" [ref=e81] [cursor=pointer]
            - button "Employee Expense Reimbursement" [ref=e86] [cursor=pointer]
          - generic [ref=e91]:
            - generic [ref=e92]: Platform services
            - button "Scope Service" [ref=e93] [cursor=pointer]
            - button "Tax Position Summary Workpaper" [ref=e106] [cursor=pointer]
            - button "Data Readiness Service" [ref=e119] [cursor=pointer]
            - button "Execution Readiness & Review Checklist" [ref=e132] [cursor=pointer]
          - generic [ref=e145]:
            - generic [ref=e146]: Foundation
            - button "Ownership Graph Workpaper" [ref=e147] [cursor=pointer]
            - button "Tax Attribute Continuity Workpaper" [ref=e154] [cursor=pointer]
            - button "Portfolio Calendar & Requests Workpaper" [ref=e161] [cursor=pointer]
          - generic [ref=e168]:
            - generic [ref=e169]: Tier 1
            - button "FAPI Calculation (portfolio)" [ref=e170] [cursor=pointer]
            - button "T1134 Affiliate Reporting Workpaper" [ref=e176] [cursor=pointer]
            - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=e182] [cursor=pointer]
            - button "T106 Transaction Workpaper" [ref=e188] [cursor=pointer]
            - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=e194] [cursor=pointer]
            - button "T2 Taxable Income Bridge Workpaper" [ref=e200] [cursor=pointer]
            - button "Corporate Tax Provision Workpaper" [ref=e206] [cursor=pointer]
            - button "Part XIII Withholding Workpaper" [ref=e212] [cursor=pointer]
        - generic [ref=e218]:
          - button "Settings" [ref=e220] [cursor=pointer]
          - button "Help" [ref=e227] [cursor=pointer]
          - group "Theme" [ref=e235]:
            - button "Light" [pressed] [ref=e236] [cursor=pointer]
            - button "Dark" [ref=e243] [cursor=pointer]
      - generic [ref=e246]:
        - generic [ref=e247]:
          - generic [ref=e248]:
            - button "Workflows" [ref=e250] [cursor=pointer]
            - generic [ref=e256]:
              - generic [ref=e257]: Document Calculator — My workflow
              - generic [ref=e258]: Unsaved changes
              - button "Overview" [ref=e260] [cursor=pointer]
              - button "Build" [ref=e261] [cursor=pointer]
              - button "Run" [ref=e262] [cursor=pointer]
              - button "Results" [ref=e263] [cursor=pointer]
              - button "Agent Lab" [ref=e264] [cursor=pointer]
              - button "Undo" [disabled] [ref=e269]
              - button "Redo" [disabled] [ref=e273]
              - button "Fit" [ref=e277] [cursor=pointer]
              - button "Save" [ref=e284] [cursor=pointer]
              - button "Run" [ref=e289] [cursor=pointer]
          - generic [ref=e296]:
            - group [ref=e298]:
              - generic "Test data — upload document or enter examples" [ref=e299] [cursor=pointer]
              - option "Document" [selected]
            - generic [ref=e301]:
              - generic:
                - generic: Fiscal Flow
                - generic: Source → Logic → Review / Validation
                - generic: Protected → Output
              - application [ref=e302]:
                - generic [ref=e304]:
                  - generic:
                    - generic:
                      - img:
                        - group "Edge from pf-document-calculator--start to pf-document-calculator--document" [ref=e305] [cursor=pointer]
                      - img:
                        - group "Edge from pf-document-calculator--document to pf-document-calculator--rules" [ref=e308] [cursor=pointer]
                      - img:
                        - group "Edge from pf-document-calculator--rules to pf-document-calculator--groups"
                      - img:
                        - group "Edge from pf-document-calculator--groups to pf-document-calculator--calculate"
                      - img:
                        - group "Edge from pf-document-calculator--calculate to pf-document-calculator--result" [ref=e311] [cursor=pointer]
                    - generic:
                      - group [ref=e314] [cursor=pointer]:
                        - button "Start" [ref=e321]
                      - group [ref=e322] [cursor=pointer]:
                        - button "Document" [ref=e326]
                      - group [ref=e330] [cursor=pointer]:
                        - button "Keyword rules" [ref=e334]
                      - group [ref=e338] [cursor=pointer]:
                        - button "Aggregation groups" [ref=e342]
                      - group [ref=e346] [cursor=pointer]:
                        - button "Calculate" [ref=e350]
                      - group [ref=e354] [cursor=pointer]:
                        - button "Final result" [ref=e358]
                - group [ref=e363]:
                  - button "Zoom in" [ref=e364] [cursor=pointer]
                  - button "Zoom out" [ref=e365] [cursor=pointer]
                  - button "Fit view" [ref=e366] [cursor=pointer]
                  - button "Show minimap" [ref=e367] [cursor=pointer]
                - link "React Flow attribution" [ref=e369] [cursor=pointer]:
                  - /url: https://reactflow.dev/attribution
                  - text: React Flow
        - separator "Drag to resize" [ref=e372]
        - generic [ref=e374]:
          - generic [ref=e375]:
            - generic [ref=e376]: Chat panel
            - button "Hide chat panel" [ref=e377] [cursor=pointer]
            - button "Expand chat panel" [ref=e381] [cursor=pointer]
          - generic [ref=e388]:
            - generic [ref=e389]:
              - generic [ref=e390]:
                - button "Choose client — Scope reads their worksheets & documents" [ref=e391] [cursor=pointer]
                - generic [ref=e447]:
                  - button "N Northstar Inc" [ref=e448] [cursor=pointer]:
                    - generic [ref=e449]: "N"
                    - generic [ref=e450]: Northstar Inc
                  - button "Work" [ref=e455] [cursor=pointer]
              - 'button "Context: 0 selected, 0 used" [ref=e464] [cursor=pointer]'
              - button "Tools" [ref=e470] [cursor=pointer]:
                - generic [ref=e473]: "9"
            - generic [ref=e477]:
              - generic [ref=e478]:
                - generic [ref=e479]: Good evening, Sophia
                - generic [ref=e480]: What would you like to work on?
              - generic [ref=e483]:
                - textbox "Ask Scope, or describe a task…" [ref=e484]
                - generic [ref=e485]:
                  - button "Add — search, workflows, worksheets" [ref=e486] [cursor=pointer]
                  - button "Attach files" [ref=e488] [cursor=pointer]
                  - 'button "Chat agent: Sina" [ref=e491] [cursor=pointer]': Sina
                  - button "Send" [disabled] [ref=e502]
    - region "Notifications alt+T"
  - generic [ref=e511]:
    - generic [ref=e513]:
      - heading "Block workspace" [level=2] [ref=e514]
      - button "Close" [ref=e515] [cursor=pointer]
    - generic [ref=e516]:
      - button "Test block" [ref=e517] [cursor=pointer]
      - button "Test with upstream blocks" [ref=e518] [cursor=pointer]
      - text: Test this block alone, or run the blocks supplying its inputs.
    - region "Individual block test" [ref=e519]:
      - generic [ref=e520]:
        - heading "Test Keyword rules on its own" [level=3] [ref=e521]
        - paragraph [ref=e522]: Only this block executes. You can reuse its recorded output in another block test.
        - generic [ref=e523]:
          - text: Test inputs
          - combobox "Block test input source" [ref=e524]:
            - option "Current block settings only"
            - option "Example inputs" [selected]
            - option "Recorded upstream outputs"
        - paragraph [ref=e525]: Examples are only used for this test. They do not replace workflow documents or saved API data.
        - generic [ref=e526]:
          - text: Input editor
          - combobox "Block test input editor" [ref=e527]:
            - option "Form" [selected]
            - option "JSON"
        - generic [ref=e528]:
          - heading "Numbers for calculations" [level=4] [ref=e529]
          - button "Add test value" [ref=e530] [cursor=pointer]
        - generic [ref=e531]:
          - heading "Example records" [level=4] [ref=e532]
          - generic [ref=e533]:
            - text: Supply records as
            - combobox "Test record type" [ref=e534]:
              - option "Document records" [selected]
              - option "Categorized records"
          - button "Add test record" [ref=e535] [cursor=pointer]
          - group [ref=e536]:
            - generic "Test data — upload document or enter examples" [ref=e537] [cursor=pointer]
            - generic [ref=e538]:
              - generic [ref=e539]:
                - text: Document source
                - combobox "Document source" [ref=e540]:
                  - option "Example document" [selected]
              - button "Upload test document" [ref=e541]
              - button "Enter example data / JSON" [ref=e542] [cursor=pointer]
              - generic [ref=e543]:
                - paragraph [ref=e544]: Check the extracted records before using them. Text without numbers can still be classified; enter numerical fields when needed for calculations.
                - generic [ref=e545]:
                  - generic [ref=e546]:
                    - text: Text to classify
                    - combobox "Text to classify" [ref=e547]:
                      - option "Use existing fields" [selected]
                      - option "label"
                      - option "amount"
                  - generic [ref=e548]:
                    - text: Number to calculate
                    - combobox "Number to calculate" [ref=e549]:
                      - option "Use existing fields" [selected]
                      - option "label"
                      - option "amount"
                - generic [ref=e550]:
                  - text: Decimal separator
                  - combobox "Document decimal separator" [ref=e551]:
                    - 'option "Point: 1,234.56" [selected]'
                    - 'option "Comma: 1.234,56"'
                - generic "Document extraction review" [ref=e552]:
                  - paragraph [ref=e553]: 500 records · edit values and choose numeric columns before applying.
                  - table [ref=e555]:
                    - rowgroup [ref=e556]:
                      - row [ref=e557]:
                        - columnheader "label Text" [ref=e558]:
                          - text: label
                          - combobox "Column type label" [ref=e559]:
                            - option "Text" [selected]
                            - option "Number"
                        - columnheader "amount Number" [ref=e560]:
                          - text: amount
                          - combobox "Column type amount" [ref=e561]:
                            - option "Text"
                            - option "Number" [selected]
                        - columnheader "Remove" [ref=e562]
                    - rowgroup [ref=e563]:
                      - row [ref=e564]:
                        - cell [ref=e565]:
                          - textbox "Row 1 label" [ref=e566]: Item 1
                        - cell [ref=e567]:
                          - textbox "Row 1 amount" [ref=e568]: "1"
                        - cell [ref=e569]:
                          - button "Remove row 1" [ref=e570] [cursor=pointer]: Remove
                      - row [ref=e571]:
                        - cell [ref=e572]:
                          - textbox "Row 2 label" [ref=e573]: Item 2
                        - cell [ref=e574]:
                          - textbox "Row 2 amount" [ref=e575]: "2"
                        - cell [ref=e576]:
                          - button "Remove row 2" [ref=e577] [cursor=pointer]: Remove
                      - row [ref=e578]:
                        - cell [ref=e579]:
                          - textbox "Row 3 label" [ref=e580]: Item 3
                        - cell [ref=e581]:
                          - textbox "Row 3 amount" [ref=e582]: "3"
                        - cell [ref=e583]:
                          - button "Remove row 3" [ref=e584] [cursor=pointer]: Remove
                      - row [ref=e585]:
                        - cell [ref=e586]:
                          - textbox "Row 4 label" [ref=e587]: Item 4
                        - cell [ref=e588]:
                          - textbox "Row 4 amount" [ref=e589]: "4"
                        - cell [ref=e590]:
                          - button "Remove row 4" [ref=e591] [cursor=pointer]: Remove
                      - row [ref=e592]:
                        - cell [ref=e593]:
                          - textbox "Row 5 label" [ref=e594]: Item 5
                        - cell [ref=e595]:
                          - textbox "Row 5 amount" [ref=e596]: "5"
                        - cell [ref=e597]:
                          - button "Remove row 5" [ref=e598] [cursor=pointer]: Remove
                      - row [ref=e599]:
                        - cell [ref=e600]:
                          - textbox "Row 6 label" [ref=e601]: Item 6
                        - cell [ref=e602]:
                          - textbox "Row 6 amount" [ref=e603]: "6"
                        - cell [ref=e604]:
                          - button "Remove row 6" [ref=e605] [cursor=pointer]: Remove
                      - row [ref=e606]:
                        - cell [ref=e607]:
                          - textbox "Row 7 label" [ref=e608]: Item 7
                        - cell [ref=e609]:
                          - textbox "Row 7 amount" [ref=e610]: "7"
                        - cell [ref=e611]:
                          - button "Remove row 7" [ref=e612] [cursor=pointer]: Remove
                      - row [ref=e613]:
                        - cell [ref=e614]:
                          - textbox "Row 8 label" [ref=e615]: Item 8
                        - cell [ref=e616]:
                          - textbox "Row 8 amount" [ref=e617]: "8"
                        - cell [ref=e618]:
                          - button "Remove row 8" [ref=e619] [cursor=pointer]: Remove
                      - row [ref=e620]:
                        - cell [ref=e621]:
                          - textbox "Row 9 label" [ref=e622]: Item 9
                        - cell [ref=e623]:
                          - textbox "Row 9 amount" [ref=e624]: "9"
                        - cell [ref=e625]:
                          - button "Remove row 9" [ref=e626] [cursor=pointer]: Remove
                      - row [ref=e627]:
                        - cell [ref=e628]:
                          - textbox "Row 10 label" [ref=e629]: Item 10
                        - cell [ref=e630]:
                          - textbox "Row 10 amount" [ref=e631]: "10"
                        - cell [ref=e632]:
                          - button "Remove row 10" [ref=e633] [cursor=pointer]: Remove
                      - row [ref=e634]:
                        - cell [ref=e635]:
                          - textbox "Row 11 label" [ref=e636]: Item 11
                        - cell [ref=e637]:
                          - textbox "Row 11 amount" [ref=e638]: "11"
                        - cell [ref=e639]:
                          - button "Remove row 11" [ref=e640] [cursor=pointer]: Remove
                      - row [ref=e641]:
                        - cell [ref=e642]:
                          - textbox "Row 12 label" [ref=e643]: Item 12
                        - cell [ref=e644]:
                          - textbox "Row 12 amount" [ref=e645]: "12"
                        - cell [ref=e646]:
                          - button "Remove row 12" [ref=e647] [cursor=pointer]: Remove
                      - row [ref=e648]:
                        - cell [ref=e649]:
                          - textbox "Row 13 label" [ref=e650]: Item 13
                        - cell [ref=e651]:
                          - textbox "Row 13 amount" [ref=e652]: "13"
                        - cell [ref=e653]:
                          - button "Remove row 13" [ref=e654] [cursor=pointer]: Remove
                      - row [ref=e655]:
                        - cell [ref=e656]:
                          - textbox "Row 14 label" [ref=e657]: Item 14
                        - cell [ref=e658]:
                          - textbox "Row 14 amount" [ref=e659]: "14"
                        - cell [ref=e660]:
                          - button "Remove row 14" [ref=e661] [cursor=pointer]: Remove
                      - row [ref=e662]:
                        - cell [ref=e663]:
                          - textbox "Row 15 label" [ref=e664]: Item 15
                        - cell [ref=e665]:
                          - textbox "Row 15 amount" [ref=e666]: "15"
                        - cell [ref=e667]:
                          - button "Remove row 15" [ref=e668] [cursor=pointer]: Remove
                      - row [ref=e669]:
                        - cell [ref=e670]:
                          - textbox "Row 16 label" [ref=e671]: Item 16
                        - cell [ref=e672]:
                          - textbox "Row 16 amount" [ref=e673]: "16"
                        - cell [ref=e674]:
                          - button "Remove row 16" [ref=e675] [cursor=pointer]: Remove
                      - row [ref=e676]:
                        - cell [ref=e677]:
                          - textbox "Row 17 label" [ref=e678]: Item 17
                        - cell [ref=e679]:
                          - textbox "Row 17 amount" [ref=e680]: "17"
                        - cell [ref=e681]:
                          - button "Remove row 17" [ref=e682] [cursor=pointer]: Remove
                      - row [ref=e683]:
                        - cell [ref=e684]:
                          - textbox "Row 18 label" [ref=e685]: Item 18
                        - cell [ref=e686]:
                          - textbox "Row 18 amount" [ref=e687]: "18"
                        - cell [ref=e688]:
                          - button "Remove row 18" [ref=e689] [cursor=pointer]: Remove
                      - row [ref=e690]:
                        - cell [ref=e691]:
                          - textbox "Row 19 label" [ref=e692]: Item 19
                        - cell [ref=e693]:
                          - textbox "Row 19 amount" [ref=e694]: "19"
                        - cell [ref=e695]:
                          - button "Remove row 19" [ref=e696] [cursor=pointer]: Remove
                      - row [ref=e697]:
                        - cell [ref=e698]:
                          - textbox "Row 20 label" [ref=e699]: Item 20
                        - cell [ref=e700]:
                          - textbox "Row 20 amount" [ref=e701]: "20"
                        - cell [ref=e702]:
                          - button "Remove row 20" [ref=e703] [cursor=pointer]: Remove
                      - row [ref=e704]:
                        - cell [ref=e705]:
                          - textbox "Row 21 label" [ref=e706]: Item 21
                        - cell [ref=e707]:
                          - textbox "Row 21 amount" [ref=e708]: "21"
                        - cell [ref=e709]:
                          - button "Remove row 21" [ref=e710] [cursor=pointer]: Remove
                      - row [ref=e711]:
                        - cell [ref=e712]:
                          - textbox "Row 22 label" [ref=e713]: Item 22
                        - cell [ref=e714]:
                          - textbox "Row 22 amount" [ref=e715]: "22"
                        - cell [ref=e716]:
                          - button "Remove row 22" [ref=e717] [cursor=pointer]: Remove
                      - row [ref=e718]:
                        - cell [ref=e719]:
                          - textbox "Row 23 label" [ref=e720]: Item 23
                        - cell [ref=e721]:
                          - textbox "Row 23 amount" [ref=e722]: "23"
                        - cell [ref=e723]:
                          - button "Remove row 23" [ref=e724] [cursor=pointer]: Remove
                      - row [ref=e725]:
                        - cell [ref=e726]:
                          - textbox "Row 24 label" [ref=e727]: Item 24
                        - cell [ref=e728]:
                          - textbox "Row 24 amount" [ref=e729]: "24"
                        - cell [ref=e730]:
                          - button "Remove row 24" [ref=e731] [cursor=pointer]: Remove
                      - row [ref=e732]:
                        - cell [ref=e733]:
                          - textbox "Row 25 label" [ref=e734]: Item 25
                        - cell [ref=e735]:
                          - textbox "Row 25 amount" [ref=e736]: "25"
                        - cell [ref=e737]:
                          - button "Remove row 25" [ref=e738] [cursor=pointer]: Remove
                  - generic [ref=e739]:
                    - button "Previous records" [disabled] [ref=e740]
                    - generic [ref=e741]: Page 1 of 20
                    - button "Next records" [ref=e742] [cursor=pointer]
                    - button "Add record" [ref=e743] [cursor=pointer]
                  - generic [ref=e744]:
                    - textbox "New document field" [ref=e745]:
                      - /placeholder: New field name
                    - button "Add field" [disabled] [ref=e746]
                - group [ref=e747]:
                  - generic "Original structured preview / JSON" [ref=e748]
                - button "Use this test data" [active] [ref=e749] [cursor=pointer]
                - button "Cancel" [ref=e750] [cursor=pointer]
        - group [ref=e751]:
          - generic "Expected inputs" [ref=e752]
      - generic [ref=e753]:
        - generic [ref=e754]:
          - generic [ref=e755]:
            - heading "Run this block" [level=3] [ref=e756]
            - paragraph [ref=e757]: Executes this block using the supplied test inputs. Results are labeled as a block test.
          - button "Run block" [ref=e758] [cursor=pointer]
        - paragraph [ref=e761]: This block hasn't been run yet. Press Run block to execute Keyword rules and see its real output — the same executor the full workflow uses.
    - generic [ref=e762]:
      - button "Properties" [ref=e763] [cursor=pointer]
      - button "Input & Output" [ref=e767] [cursor=pointer]:
        - generic [ref=e768]: I/O
        - text: Input & Output
      - button "Runs" [ref=e769] [cursor=pointer]
```

# Test source

```ts
  103 | 
  104 | test('standalone Compute accepts example numbers, flags stale results and validates inputs', async ({ page }, testInfo) => {
  105 |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  106 |   const panel = await openTest(page, 'Calculate');
  107 |   await expect(panel.getByLabel('Test value 1 name')).toHaveValue('item_total');
  108 |   await panel.getByLabel('Test value 1 number').fill('200');
  109 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  110 |   await expect(panel).toContainText('400');
  111 |   await panel.getByLabel('Test value 1 number').fill('220');
  112 |   await expect(panel.getByRole('status')).toContainText('Run again');
  113 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  114 |   await expect(panel).toContainText('440');
  115 |   await expect(panel.getByRole('status')).toHaveCount(0);
  116 |   await page.screenshot({ path: testInfo.outputPath('isolated-calculation.png'), fullPage: true });
  117 |   await panel.getByLabel('Test value 1 number').fill('');
  118 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  119 |   await expect(panel.getByRole('alert')).toContainText('Blank values are not zero');
  120 |   await panel.getByLabel('Block test input editor').selectOption('json');
  121 |   await panel.getByLabel('Block test input JSON').fill('null');
  122 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  123 |   await expect(panel.getByRole('alert')).toContainText('Enter an input object');
  124 |   await panel.getByLabel('Block test input JSON').fill('{"namedValues":{"item_total":0}}');
  125 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  126 |   await expect(panel.getByRole('alert')).toHaveCount(0);
  127 |   await expect(panel).toContainText('success');
  128 |   const stored = await page.evaluate(async () => {
  129 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  130 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  131 |     return { entries: Object.values(readWorkflowLibrary()), records: loadLocalRunRecords() };
  132 |   });
  133 |   expect(stored.entries.flatMap((e: any) => e.runs)).toHaveLength(0);
  134 |   expect(stored.records).toHaveLength(3);
  135 |   expect(stored.records.every(r => r.logs.length === 1)).toBe(true);
  136 |   expect(errors).toEqual([]);
  137 | });
  138 | 
  139 | test('example CSV uploads into one block without changing workflow data', async ({ page }) => {
  140 |   const panel = await openTest(page, 'Keyword rules');
  141 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  142 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'block-only.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,120\nItem two,80\nService,30\n') });
  143 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  144 |   await expect(panel.getByLabel('Test row 1 text')).toHaveValue('Item one');
  145 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  146 |   await expect(panel).toContainText('Items');
  147 |   const stored = await page.evaluate(async () => {
  148 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  149 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  150 |     return { entries: Object.values(readWorkflowLibrary()), result: loadLocalRunRecords()[0].logs[0].output };
  151 |   });
  152 |   expect(stored.result.output.mappedRows).toHaveLength(2);
  153 |   expect(stored.entries.every((entry: any) => entry.draft.blocks.every((b: any) => b.config.fileName !== 'block-only.csv'))).toBe(true);
  154 | });
  155 | 
  156 | test('recorded inputs are explicit and missing snapshots do not execute upstream blocks', async ({ page }) => {
  157 |   const panel = await openTest(page, 'Calculate');
  158 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  159 |   await expect(panel).toContainText('Aggregation groups');
  160 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  161 |   await expect(panel.getByRole('alert')).toContainText('No usable recorded result');
  162 |   const records = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords());
  163 |   expect(records).toHaveLength(0);
  164 | });
  165 | 
  166 | test('the UI reuses individual aggregation and calculation results after reload without running the workflow', async ({ page }, testInfo) => {
  167 |   let panel = await openTest(page, 'Aggregation groups');
  168 |   await expect(panel.getByLabel('Test record type')).toHaveValue('mappedRows');
  169 |   for (const [index, amount] of [120, 80].entries()) {
  170 |     await panel.getByRole('button', { name: 'Add test record', exact: true }).click();
  171 |     await panel.getByLabel(`Test row ${index + 1} text`).fill(`Item ${index + 1}`);
  172 |     await panel.getByLabel(`Test row ${index + 1} number`).fill(String(amount));
  173 |     await panel.getByLabel(`Test row ${index + 1} category`).fill('items');
  174 |   }
  175 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  176 |   await expect(panel).toContainText('200');
  177 |   panel = await openTest(page, 'Calculate');
  178 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  179 |   await expect(panel).toContainText('prior block test');
  180 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  181 |   await expect(panel).toContainText('400');
  182 |   await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  183 |   await expect(page.getByTestId('block-io-panel')).toContainText('Individual block test');
  184 |   panel = await openTest(page, 'Final result');
  185 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  186 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  187 |   await expect(panel).toContainText('400');
  188 |   await page.screenshot({ path: testInfo.outputPath('individual-final-output.png'), fullPage: true });
  189 |   const stored = await page.evaluate(async () => {
  190 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  191 |     return loadLocalRunRecords();
  192 |   });
  193 |   expect(stored).toHaveLength(3);
  194 |   expect(stored.every(r => r.logs.length === 1)).toBe(true);
  195 |   expect(stored[0].logs[0].output.output.canonicalJson.calculated_results.RESULT).toBe(400);
  196 | });
  197 | 
  198 | test('large example imports paginate editable records and process every row', async ({ page }) => {
  199 |   const panel = await openTest(page, 'Keyword rules');
  200 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  201 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'many-items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 500 }, (_, i) => `Item ${i + 1},${i + 1}`).join('\n')) });
  202 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
> 203 |   await expect(panel.getByRole('textbox', { name: /^Test row .* text$/ })).toHaveCount(25);
      |                                                                            ^ Error: expect(locator).toHaveCount(expected) failed
  204 |   await panel.getByRole('button', { name: 'Next test records', exact: true }).click();
  205 |   await expect(panel.getByLabel('Test row 26 text')).toHaveValue('Item 26');
  206 |   await panel.getByLabel('Test row 26 number').fill('0');
  207 |   const start = Date.now();
  208 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  209 |   const result = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords()[0].logs[0].output);
  210 |   expect(result.output.mappedRows).toHaveLength(500);
  211 |   expect(result.output.mappedRows[25].amount).toBe(0);
  212 |   expect(Date.now() - start).toBeLessThan(5000);
  213 | });
  214 | 
  215 | test('isolated calculation combines an aggregate snapshot with a source-qualified API field and literal numbers', async ({ page }) => {
  216 |   await page.goto('/');
  217 |   const result = await page.evaluate(async () => {
  218 |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  219 |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  220 |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  221 |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  222 |     const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
  223 |     const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
  224 |     const d = templateDefinition('pf-document-calculator')!;
  225 |     const compute = d.blocks.find(b => b.label === 'Calculate')!;
  226 |     const api = createWorkflowBlockFromCatalog('source:api-http-request', { id: 'api-rate', label: 'Exchange rate API', position: { x: 0, y: 0 } });
  227 |     const apiInput = exampleInput({ rawRows: [{ rate: 2.5 }] });
  228 |     apiInput.block = api; apiInput.result.blockId = api.id;
  229 |     compute.config.formulas[0].formulaExpression = `item_total * ${calculationValueKey(api.id, ['rawRows', '0', 'rate'])} * 500 / 2`;
  230 |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(d), workflowName: d.name, mode: 'isolated', selectedBlockId: compute.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } }), apiInput], testInputSource: 'recorded' }).result;
  231 |   });
  232 |   expect(result.results).toHaveLength(1);
  233 |   expect(result.errors).toEqual([]);
  234 |   expect(result.results[0].output.calculatedResults.RESULT).toBe(125000);
  235 | });
  236 | 
  237 | test('an unconfigured document source reports missing data in its own test', async ({ page }) => {
  238 |   const panel = await openTest(page, 'Document');
  239 |   await expect(panel.getByLabel('Block test input source')).toHaveValue('none');
  240 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  241 |   await expect(panel).toContainText('No document records supplied');
  242 |   await expect(panel).toContainText('error');
  243 | });
  244 | 
```