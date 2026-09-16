# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: source-library.spec.ts >> chat spreadsheet selection preserves drafts on cancel and imports a complete mapped sheet
- Location: e2e/source-library.spec.ts:5:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Choose spreadsheet data' }).getByLabel('Account column', { exact: true })

```

# Page snapshot

```yaml
- generic:
  - generic:
    - group:
      - generic: "Workspace: Synthetic workspace (owner)"
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - button:
                - generic: InScope
              - button
            - button: New chat
            - button:
              - generic: Workspace
            - button:
              - generic: Chat
            - button:
              - generic: Workflows
            - button:
              - generic: Sources
            - button:
              - generic: Connections
            - button:
              - generic: Recent conversations
            - generic: No saved chats yet.
            - generic:
              - button:
                - generic: Settings
              - button:
                - generic: Help
              - generic:
                - group:
                  - button [pressed]: Light
                  - button: Dark
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - generic: InScope
                        - button
                      - generic:
                        - generic:
                          - generic:
                            - generic: Good evening, Sophia
                            - generic: What would you like to work on?
                          - generic:
                            - generic:
                              - generic:
                                - textbox:
                                  - /placeholder: Ask Scope, or describe a task…
                                  - text: Use this workbook
                                - generic:
                                  - generic: 1 attached
                                  - generic:
                                    - generic: synthetic-sap.xlsx
                                    - button
                                - generic: Reading your document…
                                - generic:
                                  - button
                                  - button [disabled]
                                  - button: Sina
                                  - button [disabled]
                          - generic:
                            - generic:
                              - button:
                                - generic:
                                  - generic: Ask about sources
                                  - generic: Find facts with visible evidence
                              - button:
                                - generic:
                                  - generic: Build a workflow
                                  - generic: Design and save a reusable process
                              - button:
                                - generic:
                                  - generic: Run a workflow
                                  - generic: Choose exact inputs and review the result
    - region "Notifications alt+T"
  - dialog [ref=e2]:
    - heading "Choose spreadsheet data" [level=2] [ref=e3]
    - paragraph [ref=e4]: Select the worksheet and columns to use. Hidden and empty sheets are excluded. The original file is kept unchanged.
    - paragraph [ref=e5]: synthetic-sap.xlsx
    - generic [ref=e6]:
      - text: Worksheet
      - combobox "Worksheet" [active] [ref=e7]:
        - option "Choose a worksheet…"
        - option "Summary"
        - option "SAP EXPORT" [selected]
    - generic [ref=e8]:
      - text: Header row
      - spinbutton "Header row" [ref=e9]: "1"
    - paragraph [ref=e10]: Preview shows the first five data rows. All rows from the selected sheet are read on import, up to 50,000.
    - generic [ref=e11]:
      - generic [ref=e12]:
        - text: Account column
        - combobox "Account column" [ref=e13]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e14]:
        - text: Label column
        - combobox "Label column" [ref=e15]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e16]:
        - text: Description column
        - combobox "Description column" [ref=e17]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e18]:
        - text: Amount column
        - combobox "Amount column" [ref=e19]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e20]:
        - text: Debit column
        - combobox "Debit column" [ref=e21]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e22]:
        - text: Credit column
        - combobox "Credit column" [ref=e23]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
      - generic [ref=e24]:
        - text: Currency column
        - combobox "Currency column" [ref=e25]:
          - option "Not mapped" [selected]
          - option "G/L Account"
          - option "Jrnl.Entry Item Text"
          - option "Amount in CC Crcy"
    - table [ref=e27]:
      - rowgroup [ref=e28]:
        - row [ref=e29]:
          - columnheader "G/L Account" [ref=e30]
          - columnheader "Jrnl.Entry Item Text" [ref=e31]
          - columnheader "Amount in CC Crcy" [ref=e32]
      - rowgroup [ref=e33]:
        - row [ref=e34]:
          - cell "41000" [ref=e35]
          - cell "Record 1" [ref=e36]
          - cell "1" [ref=e37]
        - row [ref=e38]:
          - cell "41001" [ref=e39]
          - cell "Record 2" [ref=e40]
          - cell "2" [ref=e41]
        - row [ref=e42]:
          - cell "41002" [ref=e43]
          - cell "Record 3" [ref=e44]
          - cell "3" [ref=e45]
        - row [ref=e46]:
          - cell "41003" [ref=e47]
          - cell "Record 4" [ref=e48]
          - cell "4" [ref=e49]
        - row [ref=e50]:
          - cell "41004" [ref=e51]
          - cell "Record 5" [ref=e52]
          - cell "5" [ref=e53]
    - status [ref=e54]: Map an account, label, or description column to identify the records.
    - status [ref=e55]: No amount column selected. These records cannot supply financial amounts until a numeric column is mapped.
    - generic [ref=e56]:
      - button "Cancel import" [ref=e57] [cursor=pointer]
      - button "Use selected data" [disabled] [ref=e58]
    - button "Close" [ref=e59] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | import { createRequire } from 'node:module';
  3   | import path from 'node:path';
  4   | 
  5   | test('chat spreadsheet selection preserves drafts on cancel and imports a complete mapped sheet', async ({
  6   |   page,
  7   | }) => {
  8   |   const XLSX = createRequire(path.resolve('artifacts/ai-workflow-builder/package.json'))('xlsx');
  9   |   const workbook = XLSX.utils.book_new();
  10  |   XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([]), 'Hidden SAP metadata');
  11  |   XLSX.utils.book_append_sheet(
  12  |     workbook,
  13  |     XLSX.utils.aoa_to_sheet([['Cover'], ['Instructions']]),
  14  |     'Summary',
  15  |   );
  16  |   XLSX.utils.book_append_sheet(
  17  |     workbook,
  18  |     XLSX.utils.aoa_to_sheet([
  19  |       ['G/L Account', 'Jrnl.Entry Item Text', 'Amount in CC Crcy'],
  20  |       ...Array.from({ length: 1100 }, (_, i) => [41000 + i, `Record ${i + 1}`, i + 1]),
  21  |     ]),
  22  |     'SAP EXPORT',
  23  |   );
  24  |   workbook.Workbook = { Sheets: [{ Hidden: 2 }, { Hidden: 0 }, { Hidden: 0 }] };
  25  |   await page.route('**/api/documents**', (route) =>
  26  |     route.fulfill({
  27  |       status: route.request().method() === 'POST' ? 503 : 200,
  28  |       json:
  29  |         route.request().method() === 'POST'
  30  |           ? { error: 'STORAGE_NOT_CONFIGURED' }
  31  |           : { documents: [] },
  32  |     }),
  33  |   );
  34  |   await page.route('**/api/copilotkit**', (route) =>
  35  |     route.fulfill({ status: 503, json: { error: 'No live model in this test.' } }),
  36  |   );
  37  |   await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  38  |   await page.goto('/');
  39  |   const composer = page.locator('.lc-console');
  40  |   const draft = composer.getByRole('textbox');
  41  |   await draft.fill('Use this workbook');
  42  |   await composer.getByRole('button', { name: 'Attach files', exact: true }).click();
  43  |   const chooser = page.waitForEvent('filechooser');
  44  |   await page.getByRole('menuitem', { name: 'Upload from laptop' }).click();
  45  |   await (
  46  |     await chooser
  47  |   ).setFiles({
  48  |     name: 'synthetic-sap.xlsx',
  49  |     mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  50  |     buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
  51  |   });
  52  |   await draft.press('Enter');
  53  |   const dialog = page.getByRole('dialog', { name: 'Choose spreadsheet data' });
  54  |   await expect(dialog).toBeVisible();
  55  |   await expect(dialog.getByLabel('Worksheet').locator('option')).toHaveText([
  56  |     'Choose a worksheet…',
  57  |     'Summary',
  58  |     'SAP EXPORT',
  59  |   ]);
  60  |   await dialog.getByRole('button', { name: 'Cancel import' }).click();
  61  |   await expect(draft).toHaveValue('Use this workbook');
  62  |   await expect(composer.getByText('synthetic-sap.xlsx', { exact: true })).toBeVisible();
  63  |   await draft.press('Enter');
  64  |   await dialog.getByLabel('Worksheet').selectOption('SAP EXPORT');
> 65  |   await dialog.getByLabel('Account column', { exact: true }).selectOption('G/L Account');
      |                                                              ^ Error: locator.selectOption: Test timeout of 60000ms exceeded.
  66  |   await dialog
  67  |     .getByLabel('Description column', { exact: true })
  68  |     .selectOption('Jrnl.Entry Item Text');
  69  |   await dialog.getByLabel('Amount column', { exact: true }).selectOption('Amount in CC Crcy');
  70  |   await dialog.getByLabel('Source currency').fill('EUR');
  71  |   await dialog.getByRole('button', { name: 'Use selected data' }).click();
  72  |   await expect
  73  |     .poll(async () =>
  74  |       page.evaluate(() => {
  75  |         const source = JSON.parse(
  76  |           localStorage.getItem('taxflow:uploaded-source-rows') ?? '{}',
  77  |         ).__unassigned__;
  78  |         return source ? { count: source.rows.length, last: source.rows.at(-1).amount } : null;
  79  |       }),
  80  |     )
  81  |     .toEqual({ count: 1100, last: 1100 });
  82  | });
  83  | 
  84  | const active = {
  85  |   id: '00000000-0000-4000-8000-000000000101',
  86  |   fileName: 'active-policy.pdf',
  87  |   mimeType: 'application/pdf',
  88  |   sizeBytes: 2048,
  89  |   status: 'ready',
  90  |   extractedChars: 1200,
  91  |   error: null,
  92  |   inLibrary: true,
  93  |   lifecycleStatus: 'active',
  94  |   createdAt: '2026-01-01T00:00:00.000Z',
  95  | };
  96  | 
  97  | const archived = {
  98  |   ...active,
  99  |   id: '00000000-0000-4000-8000-000000000102',
  100 |   fileName: 'archived-policy.pdf',
  101 |   inLibrary: false,
  102 |   lifecycleStatus: 'archived',
  103 | };
  104 | 
  105 | const deleted = {
  106 |   ...active,
  107 |   id: '00000000-0000-4000-8000-000000000103',
  108 |   fileName: 'deleted-policy.pdf',
  109 |   inLibrary: false,
  110 |   lifecycleStatus: 'deleted',
  111 | };
  112 | 
  113 | test('chat can select a saved document for retrieval without changing its library membership', async ({
  114 |   page,
  115 | }) => {
  116 |   const writes: string[] = [];
  117 |   await page.route('**/api/documents**', (route) => {
  118 |     if (route.request().method() !== 'GET') writes.push(route.request().method());
  119 |     return route.fulfill({
  120 |       json: { documents: [{ ...active, sourceRevision: 2 }, archived, deleted] },
  121 |     });
  122 |   });
  123 |   await page.goto('/');
  124 |   await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  125 |   await page.getByRole('menuitem', { name: 'Choose from Sources' }).click();
  126 |   const picker = page.getByRole('dialog', { name: 'Choose from Sources' });
  127 |   await expect(picker.getByRole('button', { name: archived.fileName })).toHaveCount(0);
  128 |   await picker.getByRole('button', { name: active.fileName, exact: true }).click();
  129 |   await expect(page.locator('.lc-console')).toContainText(
  130 |     'Source: active-policy.pdf · Saved in Sources',
  131 |   );
  132 |   await page.getByRole('button', { name: 'Remove document source' }).click();
  133 |   await expect(page.locator('.lc-console')).not.toContainText('active-policy.pdf');
  134 |   expect(writes).toEqual([]);
  135 | });
  136 | 
  137 | test('Owners can recover soft-deleted sources and see permanent purge as a distinct action', async ({
  138 |   page,
  139 | }) => {
  140 |   test.setTimeout(90_000);
  141 |   // Lifecycle mutations belong to this test; later tests reuse the base fixtures.
  142 |   const documents = [active, archived, deleted].map((document) => ({ ...document }));
  143 |   const actions: Array<{ id: string; action: string }> = [];
  144 |   await page.route('**/api/documents**', async (route) => {
  145 |     const request = route.request();
  146 |     if (request.method() === 'GET') {
  147 |       await route.fulfill({ json: { documents } });
  148 |       return;
  149 |     }
  150 |     const match = new URL(request.url()).pathname.match(/\/documents\/([^/]+)\/lifecycle$/);
  151 |     if (request.method() === 'POST' && match) {
  152 |       const body = request.postDataJSON() as { action: string };
  153 |       actions.push({ id: match[1], action: body.action });
  154 |       const document = documents.find((item) => item.id === match[1]);
  155 |       if (document) document.lifecycleStatus = body.action === 'restore' ? 'active' : 'deleted';
  156 |       await route.fulfill({ json: { document } });
  157 |       return;
  158 |     }
  159 |     await route.fulfill({ status: 404, json: { error: 'Unexpected synthetic request.' } });
  160 |   });
  161 | 
  162 |   await page.goto('/documents');
  163 |   await expect(page).toHaveURL(/\/$/);
  164 |   await expect(page.getByText('New chat', { exact: true })).toBeVisible();
  165 |   await expect(page.getByRole('button', { name: 'Library', exact: true })).toHaveCount(0);
```