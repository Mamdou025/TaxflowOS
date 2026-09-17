# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-builder-roundtrip.spec.ts >> uploading CSV into a blank workflow adds a source and preserves its Start block
- Location: e2e/workflow-builder-roundtrip.spec.ts:146:5

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 0
Received array:  []
```

# Page snapshot

```yaml
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
          - generic "Workflow storage status" [ref=e65]: Ready to save to server
        - button "Library" [ref=e66] [cursor=pointer]
        - button "Run history" [ref=e69] [cursor=pointer]
        - button "New workflow" [ref=e74] [cursor=pointer]
        - generic [ref=e76]:
          - generic [ref=e77]: Runnable demos
          - button "Document Calculator" [ref=e78] [cursor=pointer]
          - button "Employee Expense Reimbursement" [ref=e83] [cursor=pointer]
        - generic [ref=e88]:
          - generic [ref=e89]: Platform services
          - button "Scope Service" [ref=e90] [cursor=pointer]
          - button "Tax Position Summary Workpaper" [ref=e103] [cursor=pointer]
          - button "Data Readiness Service" [ref=e116] [cursor=pointer]
          - button "Execution Readiness & Review Checklist" [ref=e129] [cursor=pointer]
        - generic [ref=e142]:
          - generic [ref=e143]: Foundation
          - button "Ownership Graph Workpaper" [ref=e144] [cursor=pointer]
          - button "Tax Attribute Continuity Workpaper" [ref=e151] [cursor=pointer]
          - button "Portfolio Calendar & Requests Workpaper" [ref=e158] [cursor=pointer]
        - generic [ref=e165]:
          - generic [ref=e166]: Tier 1
          - button "FAPI Calculation (portfolio)" [ref=e167] [cursor=pointer]
          - button "T1134 Affiliate Reporting Workpaper" [ref=e173] [cursor=pointer]
          - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=e179] [cursor=pointer]
          - button "T106 Transaction Workpaper" [ref=e185] [cursor=pointer]
          - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=e191] [cursor=pointer]
          - button "T2 Taxable Income Bridge Workpaper" [ref=e197] [cursor=pointer]
          - button "Corporate Tax Provision Workpaper" [ref=e203] [cursor=pointer]
          - button "Part XIII Withholding Workpaper" [ref=e209] [cursor=pointer]
      - generic [ref=e215]:
        - button "Settings" [ref=e217] [cursor=pointer]
        - button "Help" [ref=e224] [cursor=pointer]
        - group "Theme" [ref=e232]:
          - button "Light" [pressed] [ref=e233] [cursor=pointer]
          - button "Dark" [ref=e240] [cursor=pointer]
    - generic [ref=e243]:
      - generic [ref=e244]:
        - generic [ref=e245]:
          - button "Workflows" [ref=e247] [cursor=pointer]
          - generic [ref=e253]:
            - generic [ref=e254]: New workflow
            - generic [ref=e255]: Template
            - button "Overview" [ref=e257] [cursor=pointer]
            - button "Build" [ref=e258] [cursor=pointer]
            - button "Run" [ref=e259] [cursor=pointer]
            - button "Results" [ref=e260] [cursor=pointer]
            - button "Agent Lab" [ref=e261] [cursor=pointer]
            - button "Undo" [disabled] [ref=e266]
            - button "Redo" [disabled] [ref=e270]
            - button "Fit" [ref=e274] [cursor=pointer]
            - button "Save" [ref=e281] [cursor=pointer]
            - button "Run" [ref=e286] [cursor=pointer]
        - generic [ref=e293]:
          - group [ref=e295]:
            - generic "Test data — upload document or enter examples" [ref=e296] [cursor=pointer]
            - generic [ref=e297]:
              - generic [ref=e298]:
                - text: Document source
                - combobox "Document source" [ref=e299]:
                  - option "Connect a document source in Build first" [selected]
              - button "Upload test document" [ref=e300]
              - button "Enter example data / JSON" [ref=e301] [cursor=pointer]
              - generic [ref=e302]:
                - paragraph [ref=e303]: Check the extracted records before using them. Text without numbers can still be classified; enter numerical fields when needed for calculations.
                - generic [ref=e304]:
                  - generic [ref=e305]:
                    - text: Text to classify
                    - combobox "Text to classify" [ref=e306]:
                      - option "Use existing fields" [selected]
                      - option "Product"
                      - option "Quantity"
                  - generic [ref=e307]:
                    - text: Number to calculate
                    - combobox "Number to calculate" [ref=e308]:
                      - option "Use existing fields" [selected]
                      - option "Product"
                      - option "Quantity"
                - generic [ref=e309]:
                  - text: Decimal separator
                  - combobox "Document decimal separator" [ref=e310]:
                    - 'option "Point: 1,234.56" [selected]'
                    - 'option "Comma: 1.234,56"'
                - generic "Document extraction review" [ref=e311]:
                  - paragraph [ref=e312]: 2 records · edit values and choose numeric columns before applying.
                  - table [ref=e314]:
                    - rowgroup [ref=e315]:
                      - row [ref=e316]:
                        - columnheader "Product Text" [ref=e317]:
                          - text: Product
                          - combobox "Column type Product" [ref=e318]:
                            - option "Text" [selected]
                            - option "Number"
                        - columnheader "Quantity Number" [ref=e319]:
                          - text: Quantity
                          - combobox "Column type Quantity" [ref=e320]:
                            - option "Text"
                            - option "Number" [selected]
                        - columnheader "Remove" [ref=e321]
                    - rowgroup [ref=e322]:
                      - row [ref=e323]:
                        - cell [ref=e324]:
                          - textbox "Row 1 Product" [ref=e325]: Pens
                        - cell [ref=e326]:
                          - textbox "Row 1 Quantity" [ref=e327]: "12"
                        - cell [ref=e328]:
                          - button "Remove row 1" [ref=e329] [cursor=pointer]: Remove
                      - row [ref=e330]:
                        - cell [ref=e331]:
                          - textbox "Row 2 Product" [ref=e332]: Paper
                        - cell [ref=e333]:
                          - textbox "Row 2 Quantity" [ref=e334]: "0"
                        - cell [ref=e335]:
                          - button "Remove row 2" [ref=e336] [cursor=pointer]: Remove
                  - generic [ref=e337]:
                    - button "Previous records" [disabled] [ref=e338]
                    - generic [ref=e339]: Page 1 of 1
                    - button "Next records" [disabled] [ref=e340]
                    - button "Add record" [ref=e341] [cursor=pointer]
                  - generic [ref=e342]:
                    - textbox "New document field" [ref=e343]:
                      - /placeholder: New field name
                    - button "Add field" [disabled] [ref=e344]
                - group [ref=e345]:
                  - generic "Original structured preview / JSON" [ref=e346]
                - button "Use this test data" [active] [ref=e347] [cursor=pointer]
                - button "Cancel" [ref=e348] [cursor=pointer]
          - generic [ref=e350]:
            - generic:
              - generic: Fiscal Flow
              - generic: Source → Logic → Review / Validation
              - generic: Protected → Output
            - application [ref=e351]:
              - group [ref=e354] [cursor=pointer]:
                - button "Start" [ref=e361]
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
              - generic [ref=e479]: Good morning, Sophia
              - generic [ref=e480]: What would you like to work on?
            - generic [ref=e483]:
              - textbox "Ask Scope, or describe a task…" [ref=e484]
              - generic [ref=e485]:
                - button "Add — search, workflows, worksheets" [ref=e486] [cursor=pointer]
                - button "Attach files" [ref=e488] [cursor=pointer]
                - 'button "Chat agent: Sina" [ref=e491] [cursor=pointer]': Sina
                - button "Send" [disabled] [ref=e502]
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e505]:
        - generic [ref=e511]: Choose a connected document source. Connect it to the calculation in Build before applying records.
```

# Test source

```ts
  53  |     entry = saveVersion(entry);
  54  |     const canvas = workflowDefinitionToCanvas(first);
  55  |     const run = runLocalWorkflowTools({ ...canvas, workflowName: first.name });
  56  |     const computation = first.blocks.find((block) =>
  57  |       /calculation.engine/.test(String(block.config.toolId)),
  58  |     );
  59  |     const terms = computation
  60  |       ? availableCalculationValues(computation, canvas.edges, canvas.nodes)
  61  |       : [];
  62  |     return {
  63  |       classified: run.result.results.some(result => Array.isArray(result.output.mappedRows) && result.output.mappedRows.some(row => row.rowId === "roundtrip" && row.matchedKeyword === keyword)),
  64  |       versions: entry.versions.length,
  65  |       savedKeyword: first.blocks.find((block) => block.id === rules.id)!.config
  66  |         .keywordRules[0].keywords,
  67  |       output: JSON.stringify(run.result.results),
  68  |       terms,
  69  |     };
  70  |   });
  71  |   expect(result.classified).toBeTruthy();
  72  |   expect(result.versions).toBe(2);
  73  |   expect(result.savedKeyword).toEqual(["unique roundtrip keyword"]);
  74  |   expect(result.output).toContain("4321");
  75  |   expect(result.output).toContain("unique roundtrip keyword");
  76  |   expect(result.output).toContain("customQuantity");
  77  |   expect(result.terms.length).toBeGreaterThan(0);
  78  |   expect(result.terms.some((term) => term.value === null)).toBeTruthy();
  79  | });
  80  | 
  81  | test("Build uploads create a personal workflow that survives Run and reload", async ({
  82  |   page,
  83  | }, testInfo) => {
  84  |   await page.goto("/w/pf-fapi");
  85  |   await page.getByRole("button", { name: "Build", exact: true }).click();
  86  |   await page
  87  |     .getByText("Test data — upload document or enter examples", { exact: true })
  88  |     .click();
  89  |   await page
  90  |     .getByLabel("Upload test document")
  91  |     .setInputFiles({
  92  |       name: "records.json",
  93  |       mimeType: "application/json",
  94  |       buffer: Buffer.from(
  95  |         JSON.stringify([
  96  |           { label: "Interest income", amount: 1234, quantity: 7 },
  97  |         ]),
  98  |       ),
  99  |     });
  100 |   await page
  101 |     .getByRole("button", { name: "Use this test data", exact: true })
  102 |     .click();
  103 |   await expect(page.getByText("MY WORKFLOWS", { exact: true })).toBeVisible();
  104 |   await page.getByRole("button", { name: "Run", exact: true }).first().click();
  105 |   await page
  106 |     .getByRole("button", { name: "Save changes and preview", exact: true })
  107 |     .click();
  108 |   const stored = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary(); });
  109 |   const entry = Object.values(stored)[0] as any;
  110 |   expect(Object.keys(stored)).toHaveLength(1);
  111 |   expect(
  112 |     entry.draft.blocks.some((block: any) =>
  113 |       block.config.rows?.some((row: any) => row.amount === 1234),
  114 |     ),
  115 |   ).toBeTruthy();
  116 |   expect(entry.runs).toHaveLength(1);
  117 |   expect(entry.runs[0].result.result.workflowId).toBe(entry.id);
  118 |   expect(JSON.stringify(entry.runs[0].result)).toContain("1234");
  119 |   await page.reload();
  120 |   await page.getByRole("button", { name: "Workflows", exact: true }).click();
  121 |   await page
  122 |     .getByRole("button", { name: entry.draft.name, exact: true })
  123 |     .click();
  124 |   await page.getByRole("button", { name: "Build", exact: true }).click();
  125 |   const after = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary(); });
  126 |   expect(Object.keys(after)).toHaveLength(1);
  127 |   expect(after[entry.id].draft.blocks).toEqual(entry.draft.blocks);
  128 |   const rulebook = entry.draft.blocks.find(
  129 |     (block: any) =>
  130 |       Array.isArray(block.config.keywordRules),
  131 |   );
  132 |   await page
  133 |     .locator(`.react-flow__node[data-id="${rulebook.id}"]`)
  134 |     .click();
  135 |   await page.getByRole("button", { name: "Test with upstream blocks", exact: true }).click();
  136 |   await expect(page.getByTestId("block-io-panel")).toBeVisible();
  137 |   await expect(
  138 |     page.getByRole("heading", { name: "Received", exact: true }),
  139 |   ).toBeVisible();
  140 |   await expect(
  141 |     page.getByRole("heading", { name: "Produced", exact: true }),
  142 |   ).toBeVisible();
  143 |   await page.screenshot({ path: testInfo.outputPath("block-test.png") });
  144 | });
  145 | 
  146 | test('uploading CSV into a blank workflow adds a source and preserves its Start block', async ({ page }) => {
  147 |   await page.goto('/w/pf-fapi');
  148 |   await page.getByRole('button', { name: 'New workflow', exact: true }).click();
  149 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  150 |   await page.getByLabel('Upload test document').setInputFiles({ name: 'inventory.csv', mimeType: 'text/csv', buffer: Buffer.from('Product,Quantity\nPens,12\nPaper,0') });
  151 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  152 |   const entries = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary()); }) as any[];
> 153 |   expect(entries).toHaveLength(1);
      |                   ^ Error: expect(received).toHaveLength(expected)
  154 |   expect(entries[0].draft.blocks).toHaveLength(2);
  155 |   expect(entries[0].draft.blocks.some((block: any) => block.label === 'Start')).toBeTruthy();
  156 |   expect(entries[0].draft.blocks.find((block: any) => block.label === 'Document').config.rows[0].Product).toBe('Pens');
  157 | });
  158 | 
  159 | test("text-only records and custom fields survive parsing; empty input never becomes sample data", async ({
  160 |   page,
  161 | }) => {
  162 |   await page.goto("/");
  163 |   const result = await page.evaluate(async () => {
  164 |     const { parseManualTableRows } =
  165 |       await import("/src/shared/workflow-engine/execution/blocks/source/manual-table/schema.ts");
  166 |     const { presentToolOutput } =
  167 |       await import("/src/shared/workflow-engine/present-tool-output.ts");
  168 |     const fallbackRows = [{ rowId: "sample", label: "Sample", amount: 99 }];
  169 |     const rows = parseManualTableRows({
  170 |       config: {
  171 |         rows: [
  172 |           { label: "A document without numbers", department: "Operations" },
  173 |           { label: "Valid zero", amount: 0 },
  174 |         ],
  175 |       },
  176 |       fallbackRows,
  177 |     });
  178 |     const empty = parseManualTableRows({ config: { rows: [] }, fallbackRows });
  179 |     return {
  180 |       count: rows.length,
  181 |       missing: Number.isNaN(rows[0].amount),
  182 |       zero: rows[1].amount,
  183 |       raw: rows[0].raw,
  184 |       empty,
  185 |       display: presentToolOutput({
  186 |         output: {
  187 |           value: 0,
  188 |           absent: {},
  189 |           empty: [],
  190 |           bindingValidation: [],
  191 |           upstreamBlockIds: [],
  192 |         },
  193 |       } as any),
  194 |     };
  195 |   });
  196 |   expect(result.count).toBe(2);
  197 |   expect(result.missing).toBeTruthy();
  198 |   expect(result.zero).toBe(0);
  199 |   expect(result.raw?.department).toBe("Operations");
  200 |   expect(result.empty).toEqual([]);
  201 |   expect(result.display).toEqual({ value: 0 });
  202 | });
  203 | 
```