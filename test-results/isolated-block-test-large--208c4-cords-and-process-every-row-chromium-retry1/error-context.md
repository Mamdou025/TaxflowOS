# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: isolated-block-test.spec.ts >> large example imports paginate editable records and process every row
- Location: e2e/isolated-block-test.spec.ts:209:5

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
  - generic [ref=e3]:
    - group [ref=e4]:
      - 'generic "Workspace: Synthetic workspace (owner)" [ref=e5] [cursor=pointer]'
      - option "Select…" [disabled]
      - option "Synthetic workspace (owner)" [selected]
      - option "Viewer" [selected]
      - option "Editor"
      - option "Owner"
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - button "Open chat" [ref=e11] [cursor=pointer]:
            - generic [ref=e12]: InScope
          - button "Collapse sidebar" [ref=e13] [cursor=pointer]
        - button "New chat" [ref=e17] [cursor=pointer]
        - button "Workspace" [ref=e19] [cursor=pointer]
        - button "Chat" [ref=e23] [cursor=pointer]
        - button "Workflows" [ref=e29] [cursor=pointer]
        - button "Sources" [ref=e37] [cursor=pointer]
        - button "Connections" [ref=e45] [cursor=pointer]
        - button "Recent conversations" [ref=e55] [cursor=pointer]
        - generic [ref=e59]: No saved chats yet.
        - button "Workflows" [ref=e60] [cursor=pointer]
        - generic [ref=e64]:
          - group [ref=e65]:
            - generic "Workflow storage status" [ref=e66]: Saved to server
          - button "Library" [ref=e67] [cursor=pointer]
          - button "Run history" [ref=e70] [cursor=pointer]
          - button "New workflow" [ref=e75] [cursor=pointer]
          - generic [ref=e77]:
            - generic [ref=e78]: MY WORKFLOWS
            - button "Document calculation fixture — Imported" [ref=e79] [cursor=pointer]
          - generic [ref=e80]:
            - generic [ref=e81]: Platform services
            - button "Scope Service" [ref=e82] [cursor=pointer]
            - button "Tax Position Summary Workpaper" [ref=e95] [cursor=pointer]
            - button "Data Readiness Service" [ref=e108] [cursor=pointer]
            - button "Execution Readiness & Review Checklist" [ref=e121] [cursor=pointer]
          - generic [ref=e134]:
            - generic [ref=e135]: Foundation
            - button "Ownership Graph Workpaper" [ref=e136] [cursor=pointer]
            - button "Tax Attribute Continuity Workpaper" [ref=e143] [cursor=pointer]
            - button "Portfolio Calendar & Requests Workpaper" [ref=e150] [cursor=pointer]
          - generic [ref=e157]:
            - generic [ref=e158]: Tier 1
            - button "FAPI Calculation (portfolio)" [ref=e159] [cursor=pointer]
            - button "T1134 Affiliate Reporting Workpaper" [ref=e165] [cursor=pointer]
            - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=e171] [cursor=pointer]
            - button "T106 Transaction Workpaper" [ref=e177] [cursor=pointer]
            - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=e183] [cursor=pointer]
            - button "T2 Taxable Income Bridge Workpaper" [ref=e189] [cursor=pointer]
            - button "Corporate Tax Provision Workpaper" [ref=e195] [cursor=pointer]
            - button "Part XIII Withholding Workpaper" [ref=e201] [cursor=pointer]
        - generic [ref=e207]:
          - button "Settings" [ref=e209] [cursor=pointer]
          - button "Help" [ref=e216] [cursor=pointer]
          - group "Theme" [ref=e224]:
            - button "Light" [pressed] [ref=e225] [cursor=pointer]
            - button "Dark" [ref=e232] [cursor=pointer]
      - generic [ref=e235]:
        - generic [ref=e236]:
          - generic [ref=e237]:
            - button "Workflows" [ref=e239] [cursor=pointer]
            - generic [ref=e245]:
              - generic [ref=e246]: Document calculation fixture — Imported
              - generic [ref=e247]: Unsaved changes
              - button "Overview" [ref=e249] [cursor=pointer]
              - button "Build" [ref=e250] [cursor=pointer]
              - button "Run" [ref=e251] [cursor=pointer]
              - button "Results" [ref=e252] [cursor=pointer]
              - button "Agent Lab" [ref=e253] [cursor=pointer]
              - button "Undo" [disabled] [ref=e258]
              - button "Redo" [disabled] [ref=e262]
              - button "Fit" [ref=e266] [cursor=pointer]
              - button "Save" [ref=e273] [cursor=pointer]
              - button "Run" [ref=e278] [cursor=pointer]
          - generic [ref=e285]:
            - group [ref=e287]:
              - generic "Test data — upload document or enter examples" [ref=e288] [cursor=pointer]
              - option "Document" [selected]
            - generic [ref=e290]:
              - generic:
                - generic: Fiscal Flow
                - generic: Source → Logic → Review / Validation
                - generic: Protected → Output
              - application [ref=e291]:
                - generic [ref=e293]:
                  - generic:
                    - generic:
                      - img:
                        - group "Edge from pf-document-calculator--start to pf-document-calculator--document" [ref=e294] [cursor=pointer]
                      - img:
                        - group "Edge from pf-document-calculator--document to pf-document-calculator--rules" [ref=e297] [cursor=pointer]
                      - img:
                        - group "Edge from pf-document-calculator--rules to pf-document-calculator--groups"
                      - img:
                        - group "Edge from pf-document-calculator--groups to pf-document-calculator--calculate"
                      - img:
                        - group "Edge from pf-document-calculator--calculate to pf-document-calculator--result" [ref=e300] [cursor=pointer]
                    - generic:
                      - group [ref=e303] [cursor=pointer]:
                        - button "Start" [ref=e310]
                      - group [ref=e311] [cursor=pointer]:
                        - button "Document" [ref=e315]
                      - group [ref=e319] [cursor=pointer]:
                        - button "Keyword rules" [ref=e323]
                      - group [ref=e327] [cursor=pointer]:
                        - button "Aggregation groups" [ref=e331]
                      - group [ref=e335] [cursor=pointer]:
                        - button "Calculate" [ref=e339]
                      - group [ref=e343] [cursor=pointer]:
                        - button "Final result" [ref=e347]
                - group [ref=e352]:
                  - button "Zoom in" [ref=e353] [cursor=pointer]
                  - button "Zoom out" [ref=e354] [cursor=pointer]
                  - button "Fit view" [ref=e355] [cursor=pointer]
                  - button "Show minimap" [ref=e356] [cursor=pointer]
                - link "React Flow attribution" [ref=e358] [cursor=pointer]:
                  - /url: https://reactflow.dev/attribution
                  - text: React Flow
        - separator "Drag to resize" [ref=e361]
        - generic [ref=e363]:
          - generic [ref=e364]:
            - generic [ref=e365]: Chat panel
            - button "Hide chat panel" [ref=e366] [cursor=pointer]
            - button "Expand chat panel" [ref=e370] [cursor=pointer]
          - generic [ref=e377]:
            - generic [ref=e378]:
              - generic [ref=e379]:
                - text: Agent
                - combobox "Chat agent" [ref=e380]:
                  - option "Sina" [selected]
                  - option "MicroSina · Foundry"
              - button "Mkoro computer settings" [ref=e381] [cursor=pointer]:
                - generic [ref=e384]: Mkoro computer
                - generic [ref=e385]: Unverified
            - generic [ref=e386]:
              - generic [ref=e387]:
                - button "Choose client — Scope reads their worksheets & documents" [ref=e388] [cursor=pointer]
                - generic [ref=e444]:
                  - button "N Northstar Inc" [ref=e445] [cursor=pointer]:
                    - generic [ref=e446]: "N"
                    - generic [ref=e447]: Northstar Inc
                  - button "Work" [ref=e452] [cursor=pointer]
              - 'button "Context: 0 selected, 0 used" [ref=e461] [cursor=pointer]'
              - button "Tools" [ref=e467] [cursor=pointer]:
                - generic [ref=e470]: "9"
            - generic [ref=e474]:
              - generic [ref=e475]:
                - generic [ref=e476]: Good morning, Sophia
                - generic [ref=e477]: What would you like to work on?
              - generic [ref=e480]:
                - textbox "Ask Scope, or describe a task…" [ref=e481]
                - generic [ref=e482]:
                  - button "Add — search, workflows, worksheets" [ref=e483] [cursor=pointer]
                  - button "Attach files" [ref=e485] [cursor=pointer]
                  - 'button "Chat agent: Sina" [ref=e488] [cursor=pointer]': Sina
                  - button "Send" [disabled] [ref=e499]
    - region "Notifications alt+T"
  - generic [ref=e508]:
    - generic [ref=e510]:
      - heading "Block workspace" [level=2] [ref=e511]
      - button "Close" [ref=e512] [cursor=pointer]
    - generic [ref=e513]:
      - button "Test block" [ref=e514] [cursor=pointer]
      - button "Test with upstream blocks" [ref=e515] [cursor=pointer]
      - text: Test this block alone, or run the blocks supplying its inputs.
    - region "Individual block test" [ref=e516]:
      - generic [ref=e517]:
        - heading "Test Keyword rules on its own" [level=3] [ref=e518]
        - paragraph [ref=e519]: Only this block executes. You can reuse its recorded output in another block test.
        - generic [ref=e520]:
          - text: Test inputs
          - combobox "Block test input source" [ref=e521]:
            - option "Current block settings only"
            - option "Example inputs" [selected]
            - option "Recorded upstream outputs"
        - paragraph [ref=e522]: Examples are only used for this test. They do not replace workflow documents or saved API data.
        - generic [ref=e523]:
          - text: Input editor
          - combobox "Block test input editor" [ref=e524]:
            - option "Form" [selected]
            - option "JSON"
        - generic [ref=e525]:
          - heading "Numbers for calculations" [level=4] [ref=e526]
          - button "Add test value" [ref=e527] [cursor=pointer]
        - generic [ref=e528]:
          - heading "Example records" [level=4] [ref=e529]
          - generic [ref=e530]:
            - text: Supply records as
            - combobox "Test record type" [ref=e531]:
              - option "Document records" [selected]
              - option "Categorized records"
          - button "Add test record" [ref=e532] [cursor=pointer]
          - group [ref=e533]:
            - generic "Test data — upload document or enter examples" [ref=e534] [cursor=pointer]
            - generic [ref=e535]:
              - generic [ref=e536]:
                - text: Document source
                - combobox "Document source" [ref=e537]:
                  - option "Example document" [selected]
              - button "Upload test document" [ref=e538]
              - button "Enter example data / JSON" [ref=e539] [cursor=pointer]
              - generic [ref=e540]:
                - paragraph [ref=e541]: Check the extracted records before using them. Text without numbers can still be classified; enter numerical fields when needed for calculations.
                - generic [ref=e542]:
                  - generic [ref=e543]:
                    - text: Text to classify
                    - combobox "Text to classify" [ref=e544]:
                      - option "Use existing fields" [selected]
                      - option "label"
                      - option "amount"
                  - generic [ref=e545]:
                    - text: Number to calculate
                    - combobox "Number to calculate" [ref=e546]:
                      - option "Use existing fields" [selected]
                      - option "label"
                      - option "amount"
                - generic [ref=e547]:
                  - text: Decimal separator
                  - combobox "Document decimal separator" [ref=e548]:
                    - 'option "Point: 1,234.56" [selected]'
                    - 'option "Comma: 1.234,56"'
                - generic "Document extraction review" [ref=e549]:
                  - paragraph [ref=e550]: 500 records · edit values and choose numeric columns before applying.
                  - table [ref=e552]:
                    - rowgroup [ref=e553]:
                      - row [ref=e554]:
                        - columnheader "label Text" [ref=e555]:
                          - text: label
                          - combobox "Column type label" [ref=e556]:
                            - option "Text" [selected]
                            - option "Number"
                        - columnheader "amount Number" [ref=e557]:
                          - text: amount
                          - combobox "Column type amount" [ref=e558]:
                            - option "Text"
                            - option "Number" [selected]
                        - columnheader "Remove" [ref=e559]
                    - rowgroup [ref=e560]:
                      - row [ref=e561]:
                        - cell [ref=e562]:
                          - textbox "Row 1 label" [ref=e563]: Item 1
                        - cell [ref=e564]:
                          - textbox "Row 1 amount" [ref=e565]: "1"
                        - cell [ref=e566]:
                          - button "Remove row 1" [ref=e567] [cursor=pointer]: Remove
                      - row [ref=e568]:
                        - cell [ref=e569]:
                          - textbox "Row 2 label" [ref=e570]: Item 2
                        - cell [ref=e571]:
                          - textbox "Row 2 amount" [ref=e572]: "2"
                        - cell [ref=e573]:
                          - button "Remove row 2" [ref=e574] [cursor=pointer]: Remove
                      - row [ref=e575]:
                        - cell [ref=e576]:
                          - textbox "Row 3 label" [ref=e577]: Item 3
                        - cell [ref=e578]:
                          - textbox "Row 3 amount" [ref=e579]: "3"
                        - cell [ref=e580]:
                          - button "Remove row 3" [ref=e581] [cursor=pointer]: Remove
                      - row [ref=e582]:
                        - cell [ref=e583]:
                          - textbox "Row 4 label" [ref=e584]: Item 4
                        - cell [ref=e585]:
                          - textbox "Row 4 amount" [ref=e586]: "4"
                        - cell [ref=e587]:
                          - button "Remove row 4" [ref=e588] [cursor=pointer]: Remove
                      - row [ref=e589]:
                        - cell [ref=e590]:
                          - textbox "Row 5 label" [ref=e591]: Item 5
                        - cell [ref=e592]:
                          - textbox "Row 5 amount" [ref=e593]: "5"
                        - cell [ref=e594]:
                          - button "Remove row 5" [ref=e595] [cursor=pointer]: Remove
                      - row [ref=e596]:
                        - cell [ref=e597]:
                          - textbox "Row 6 label" [ref=e598]: Item 6
                        - cell [ref=e599]:
                          - textbox "Row 6 amount" [ref=e600]: "6"
                        - cell [ref=e601]:
                          - button "Remove row 6" [ref=e602] [cursor=pointer]: Remove
                      - row [ref=e603]:
                        - cell [ref=e604]:
                          - textbox "Row 7 label" [ref=e605]: Item 7
                        - cell [ref=e606]:
                          - textbox "Row 7 amount" [ref=e607]: "7"
                        - cell [ref=e608]:
                          - button "Remove row 7" [ref=e609] [cursor=pointer]: Remove
                      - row [ref=e610]:
                        - cell [ref=e611]:
                          - textbox "Row 8 label" [ref=e612]: Item 8
                        - cell [ref=e613]:
                          - textbox "Row 8 amount" [ref=e614]: "8"
                        - cell [ref=e615]:
                          - button "Remove row 8" [ref=e616] [cursor=pointer]: Remove
                      - row [ref=e617]:
                        - cell [ref=e618]:
                          - textbox "Row 9 label" [ref=e619]: Item 9
                        - cell [ref=e620]:
                          - textbox "Row 9 amount" [ref=e621]: "9"
                        - cell [ref=e622]:
                          - button "Remove row 9" [ref=e623] [cursor=pointer]: Remove
                      - row [ref=e624]:
                        - cell [ref=e625]:
                          - textbox "Row 10 label" [ref=e626]: Item 10
                        - cell [ref=e627]:
                          - textbox "Row 10 amount" [ref=e628]: "10"
                        - cell [ref=e629]:
                          - button "Remove row 10" [ref=e630] [cursor=pointer]: Remove
                      - row [ref=e631]:
                        - cell [ref=e632]:
                          - textbox "Row 11 label" [ref=e633]: Item 11
                        - cell [ref=e634]:
                          - textbox "Row 11 amount" [ref=e635]: "11"
                        - cell [ref=e636]:
                          - button "Remove row 11" [ref=e637] [cursor=pointer]: Remove
                      - row [ref=e638]:
                        - cell [ref=e639]:
                          - textbox "Row 12 label" [ref=e640]: Item 12
                        - cell [ref=e641]:
                          - textbox "Row 12 amount" [ref=e642]: "12"
                        - cell [ref=e643]:
                          - button "Remove row 12" [ref=e644] [cursor=pointer]: Remove
                      - row [ref=e645]:
                        - cell [ref=e646]:
                          - textbox "Row 13 label" [ref=e647]: Item 13
                        - cell [ref=e648]:
                          - textbox "Row 13 amount" [ref=e649]: "13"
                        - cell [ref=e650]:
                          - button "Remove row 13" [ref=e651] [cursor=pointer]: Remove
                      - row [ref=e652]:
                        - cell [ref=e653]:
                          - textbox "Row 14 label" [ref=e654]: Item 14
                        - cell [ref=e655]:
                          - textbox "Row 14 amount" [ref=e656]: "14"
                        - cell [ref=e657]:
                          - button "Remove row 14" [ref=e658] [cursor=pointer]: Remove
                      - row [ref=e659]:
                        - cell [ref=e660]:
                          - textbox "Row 15 label" [ref=e661]: Item 15
                        - cell [ref=e662]:
                          - textbox "Row 15 amount" [ref=e663]: "15"
                        - cell [ref=e664]:
                          - button "Remove row 15" [ref=e665] [cursor=pointer]: Remove
                      - row [ref=e666]:
                        - cell [ref=e667]:
                          - textbox "Row 16 label" [ref=e668]: Item 16
                        - cell [ref=e669]:
                          - textbox "Row 16 amount" [ref=e670]: "16"
                        - cell [ref=e671]:
                          - button "Remove row 16" [ref=e672] [cursor=pointer]: Remove
                      - row [ref=e673]:
                        - cell [ref=e674]:
                          - textbox "Row 17 label" [ref=e675]: Item 17
                        - cell [ref=e676]:
                          - textbox "Row 17 amount" [ref=e677]: "17"
                        - cell [ref=e678]:
                          - button "Remove row 17" [ref=e679] [cursor=pointer]: Remove
                      - row [ref=e680]:
                        - cell [ref=e681]:
                          - textbox "Row 18 label" [ref=e682]: Item 18
                        - cell [ref=e683]:
                          - textbox "Row 18 amount" [ref=e684]: "18"
                        - cell [ref=e685]:
                          - button "Remove row 18" [ref=e686] [cursor=pointer]: Remove
                      - row [ref=e687]:
                        - cell [ref=e688]:
                          - textbox "Row 19 label" [ref=e689]: Item 19
                        - cell [ref=e690]:
                          - textbox "Row 19 amount" [ref=e691]: "19"
                        - cell [ref=e692]:
                          - button "Remove row 19" [ref=e693] [cursor=pointer]: Remove
                      - row [ref=e694]:
                        - cell [ref=e695]:
                          - textbox "Row 20 label" [ref=e696]: Item 20
                        - cell [ref=e697]:
                          - textbox "Row 20 amount" [ref=e698]: "20"
                        - cell [ref=e699]:
                          - button "Remove row 20" [ref=e700] [cursor=pointer]: Remove
                      - row [ref=e701]:
                        - cell [ref=e702]:
                          - textbox "Row 21 label" [ref=e703]: Item 21
                        - cell [ref=e704]:
                          - textbox "Row 21 amount" [ref=e705]: "21"
                        - cell [ref=e706]:
                          - button "Remove row 21" [ref=e707] [cursor=pointer]: Remove
                      - row [ref=e708]:
                        - cell [ref=e709]:
                          - textbox "Row 22 label" [ref=e710]: Item 22
                        - cell [ref=e711]:
                          - textbox "Row 22 amount" [ref=e712]: "22"
                        - cell [ref=e713]:
                          - button "Remove row 22" [ref=e714] [cursor=pointer]: Remove
                      - row [ref=e715]:
                        - cell [ref=e716]:
                          - textbox "Row 23 label" [ref=e717]: Item 23
                        - cell [ref=e718]:
                          - textbox "Row 23 amount" [ref=e719]: "23"
                        - cell [ref=e720]:
                          - button "Remove row 23" [ref=e721] [cursor=pointer]: Remove
                      - row [ref=e722]:
                        - cell [ref=e723]:
                          - textbox "Row 24 label" [ref=e724]: Item 24
                        - cell [ref=e725]:
                          - textbox "Row 24 amount" [ref=e726]: "24"
                        - cell [ref=e727]:
                          - button "Remove row 24" [ref=e728] [cursor=pointer]: Remove
                      - row [ref=e729]:
                        - cell [ref=e730]:
                          - textbox "Row 25 label" [ref=e731]: Item 25
                        - cell [ref=e732]:
                          - textbox "Row 25 amount" [ref=e733]: "25"
                        - cell [ref=e734]:
                          - button "Remove row 25" [ref=e735] [cursor=pointer]: Remove
                  - generic [ref=e736]:
                    - button "Previous records" [disabled] [ref=e737]
                    - generic [ref=e738]: Page 1 of 20
                    - button "Next records" [ref=e739] [cursor=pointer]
                    - button "Add record" [ref=e740] [cursor=pointer]
                  - generic [ref=e741]:
                    - textbox "New document field" [ref=e742]:
                      - /placeholder: New field name
                    - button "Add field" [disabled] [ref=e743]
                - group [ref=e744]:
                  - generic "Original structured preview / JSON" [ref=e745]
                - button "Use this test data" [active] [ref=e746] [cursor=pointer]
                - button "Cancel" [ref=e747] [cursor=pointer]
        - group [ref=e748]:
          - generic "Expected inputs" [ref=e749]
      - generic [ref=e750]:
        - generic [ref=e751]:
          - generic [ref=e752]:
            - heading "Run this block" [level=3] [ref=e753]
            - paragraph [ref=e754]: Executes this block using the supplied test inputs. Results are labeled as a block test.
          - button "Run block" [ref=e755] [cursor=pointer]
        - paragraph [ref=e758]: This block hasn't been run yet. Press Run block to execute Keyword rules and see its real output — the same executor the full workflow uses.
    - generic [ref=e759]:
      - button "Properties" [ref=e760] [cursor=pointer]
      - button "Input & Output" [ref=e764] [cursor=pointer]:
        - generic [ref=e765]: I/O
        - text: Input & Output
      - button "Runs" [ref=e766] [cursor=pointer]
```

# Test source

```ts
  114 | 
  115 | test('standalone Compute accepts example numbers, flags stale results and validates inputs', async ({ page }, testInfo) => {
  116 |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  117 |   const panel = await openTest(page, 'Calculate');
  118 |   await expect(panel.getByLabel('Test value 1 name')).toHaveValue('item_total');
  119 |   await panel.getByLabel('Test value 1 number').fill('200');
  120 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  121 |   await expect(panel).toContainText('400');
  122 |   await panel.getByLabel('Test value 1 number').fill('220');
  123 |   await expect(panel.getByRole('status')).toContainText('Run again');
  124 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  125 |   await expect(panel).toContainText('440');
  126 |   await expect(panel.getByRole('status')).toHaveCount(0);
  127 |   await page.screenshot({ path: testInfo.outputPath('isolated-calculation.png'), fullPage: true });
  128 |   await panel.getByLabel('Test value 1 number').fill('');
  129 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  130 |   await expect(panel.getByRole('alert')).toContainText('Blank values are not zero');
  131 |   await panel.getByLabel('Block test input editor').selectOption('json');
  132 |   await panel.getByLabel('Block test input JSON').fill('null');
  133 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  134 |   await expect(panel.getByRole('alert')).toContainText('Enter an input object');
  135 |   await panel.getByLabel('Block test input JSON').fill('{"namedValues":{"item_total":0}}');
  136 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  137 |   await expect(panel.getByRole('alert')).toHaveCount(0);
  138 |   await expect(panel).toContainText('success');
  139 |   const stored = await page.evaluate(async () => {
  140 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  141 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  142 |     return { entries: Object.values(readWorkflowLibrary()), records: loadLocalRunRecords() };
  143 |   });
  144 |   expect(stored.entries.flatMap((e: any) => e.runs)).toHaveLength(0);
  145 |   expect(stored.records).toHaveLength(3);
  146 |   expect(stored.records.every(r => r.logs.length === 1)).toBe(true);
  147 |   expect(errors).toEqual([]);
  148 | });
  149 | 
  150 | test('example CSV uploads into one block without changing workflow data', async ({ page }) => {
  151 |   const panel = await openTest(page, 'Keyword rules');
  152 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  153 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'block-only.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,120\nItem two,80\nService,30\n') });
  154 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  155 |   await expect(panel.getByLabel('Test row 1 text')).toHaveValue('Item one');
  156 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  157 |   await expect(panel).toContainText('Items');
  158 |   const stored = await page.evaluate(async () => {
  159 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  160 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  161 |     return { entries: Object.values(readWorkflowLibrary()), result: loadLocalRunRecords()[0].logs[0].output };
  162 |   });
  163 |   expect(stored.result.output.mappedRows).toHaveLength(2);
  164 |   expect(stored.entries.every((entry: any) => entry.draft.blocks.every((b: any) => b.config.fileName !== 'block-only.csv'))).toBe(true);
  165 | });
  166 | 
  167 | test('recorded inputs are explicit and missing snapshots do not execute upstream blocks', async ({ page }) => {
  168 |   const panel = await openTest(page, 'Calculate');
  169 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  170 |   await expect(panel).toContainText('Aggregation groups');
  171 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  172 |   await expect(panel.getByRole('alert')).toContainText('No usable recorded result');
  173 |   const records = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords());
  174 |   expect(records).toHaveLength(0);
  175 | });
  176 | 
  177 | test('the UI reuses individual aggregation and calculation results after reload without running the workflow', async ({ page }, testInfo) => {
  178 |   let panel = await openTest(page, 'Aggregation groups');
  179 |   await expect(panel.getByLabel('Test record type')).toHaveValue('mappedRows');
  180 |   for (const [index, amount] of [120, 80].entries()) {
  181 |     await panel.getByRole('button', { name: 'Add test record', exact: true }).click();
  182 |     await panel.getByLabel(`Test row ${index + 1} text`).fill(`Item ${index + 1}`);
  183 |     await panel.getByLabel(`Test row ${index + 1} number`).fill(String(amount));
  184 |     await panel.getByLabel(`Test row ${index + 1} category`).fill('items');
  185 |   }
  186 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  187 |   await expect(panel).toContainText('200');
  188 |   panel = await openTest(page, 'Calculate');
  189 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  190 |   await expect(panel).toContainText('prior block test');
  191 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  192 |   await expect(panel).toContainText('400');
  193 |   await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  194 |   await expect(page.getByTestId('block-io-panel')).toContainText('Individual block test');
  195 |   panel = await openTest(page, 'Final result');
  196 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  197 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  198 |   await expect(panel).toContainText('400');
  199 |   await page.screenshot({ path: testInfo.outputPath('individual-final-output.png'), fullPage: true });
  200 |   const stored = await page.evaluate(async () => {
  201 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  202 |     return loadLocalRunRecords();
  203 |   });
  204 |   expect(stored).toHaveLength(3);
  205 |   expect(stored.every(r => r.logs.length === 1)).toBe(true);
  206 |   expect(stored[0].logs[0].output.output.canonicalJson.calculated_results.RESULT).toBe(400);
  207 | });
  208 | 
  209 | test('large example imports paginate editable records and process every row', async ({ page }) => {
  210 |   const panel = await openTest(page, 'Keyword rules');
  211 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  212 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'many-items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 500 }, (_, i) => `Item ${i + 1},${i + 1}`).join('\n')) });
  213 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
> 214 |   await expect(panel.getByRole('textbox', { name: /^Test row .* text$/ })).toHaveCount(25);
      |                                                                            ^ Error: expect(locator).toHaveCount(expected) failed
  215 |   await panel.getByRole('button', { name: 'Next test records', exact: true }).click();
  216 |   await expect(panel.getByLabel('Test row 26 text')).toHaveValue('Item 26');
  217 |   await panel.getByLabel('Test row 26 number').fill('0');
  218 |   const start = Date.now();
  219 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  220 |   const result = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords()[0].logs[0].output);
  221 |   expect(result.output.mappedRows).toHaveLength(500);
  222 |   expect(result.output.mappedRows[25].amount).toBe(0);
  223 |   expect(Date.now() - start).toBeLessThan(5000);
  224 | });
  225 | 
  226 | test('isolated calculation combines an aggregate snapshot with a source-qualified API field and literal numbers', async ({ page }) => {
  227 |   await page.goto('/');
  228 |   const result = await page.evaluate(async () => {
  229 |     const { DOCUMENT_CALCULATOR_CONFIG } = await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
  230 |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  231 |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  232 |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  233 |     const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
  234 |     const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
  235 |     const d = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  236 |     const compute = d.blocks.find(b => b.label === 'Calculate')!;
  237 |     const api = createWorkflowBlockFromCatalog('source:api-http-request', { id: 'api-rate', label: 'Exchange rate API', position: { x: 0, y: 0 } });
  238 |     const apiInput = exampleInput({ rawRows: [{ rate: 2.5 }] });
  239 |     apiInput.block = api; apiInput.result.blockId = api.id;
  240 |     compute.config.formulas[0].formulaExpression = `item_total * ${calculationValueKey(api.id, ['rawRows', '0', 'rate'])} * 500 / 2`;
  241 |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(d), workflowName: d.name, mode: 'isolated', selectedBlockId: compute.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } }), apiInput], testInputSource: 'recorded' }).result;
  242 |   });
  243 |   expect(result.results).toHaveLength(1);
  244 |   expect(result.errors).toEqual([]);
  245 |   expect(result.results[0].output.calculatedResults.RESULT).toBe(125000);
  246 | });
  247 | 
  248 | test('an unconfigured document source reports missing data in its own test', async ({ page }) => {
  249 |   const panel = await openTest(page, 'Document');
  250 |   await expect(panel.getByLabel('Block test input source')).toHaveValue('none');
  251 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  252 |   await expect(panel).toContainText('No document records supplied');
  253 |   await expect(panel).toContainText('error');
  254 | });
  255 | 
```