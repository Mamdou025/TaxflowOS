# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-storage-recovery.spec.ts >> a workflow and its result recover in another browser; backups, offline retry, and conflict protection work
- Location: e2e/workflow-storage-recovery.spec.ts:4:5

# Error details

```
Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
Call log:
  - → DELETE http://localhost:5050/api/workflow-library
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.34 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - x-workflow-workspace: afab2399003f2ad366d6a74ac7dfae10380ab54c606dec0e7decb9035bbade46

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - button "Open chat" [ref=e8] [cursor=pointer]:
          - generic [ref=e9]: InScope
        - button "Collapse sidebar" [ref=e10] [cursor=pointer]
      - button "New chat" [ref=e14] [cursor=pointer]
      - button "Workspace" [ref=e16] [cursor=pointer]
      - button "Workflows" [ref=e20] [cursor=pointer]
      - button "Agent" [ref=e28] [cursor=pointer]
      - button "Documents" [ref=e35] [cursor=pointer]
      - button "Clients & Chats" [ref=e43] [cursor=pointer]
      - generic [ref=e47]:
        - generic [ref=e48]:
          - generic [ref=e49] [cursor=pointer]:
            - generic "Northstar Inc." [ref=e56]
            - generic [ref=e57]:
              - button "New subfolder" [ref=e58]
              - button "New chat" [ref=e61]
              - button "Delete folder" [ref=e64]
          - generic [ref=e69] [cursor=pointer]:
            - generic "FAPI · 2025" [ref=e76]
            - generic [ref=e77]:
              - button "New subfolder" [ref=e78]
              - button "New chat" [ref=e81]
              - button "Delete folder" [ref=e84]
          - generic [ref=e89] [cursor=pointer]:
            - generic "T1134 · 2025" [ref=e96]
            - generic [ref=e97]:
              - button "New subfolder" [ref=e98]
              - button "New chat" [ref=e101]
              - button "Delete folder" [ref=e104]
          - generic [ref=e109] [cursor=pointer]:
            - generic "GROSS approval — $538,100" [ref=e113]: GROSS approval — $538,1001w ago
            - button "Delete chat" [ref=e115]
        - generic [ref=e120] [cursor=pointer]:
          - generic "Meridian Energy Corp." [ref=e127]
          - generic [ref=e128]:
            - button "New subfolder" [ref=e129]
            - button "New chat" [ref=e132]
            - button "Delete folder" [ref=e135]
        - generic [ref=e140] [cursor=pointer]:
          - generic "Cascade Technologies Ltd." [ref=e147]
          - generic [ref=e148]:
            - button "New subfolder" [ref=e149]
            - button "New chat" [ref=e152]
            - button "Delete folder" [ref=e155]
        - button "New client folder" [ref=e159] [cursor=pointer]
      - button "Recent chats" [ref=e162] [cursor=pointer]
      - generic [ref=e166]:
        - generic [ref=e167] [cursor=pointer]:
          - generic "hello can you calculate the fapi" [ref=e171]: hello can you calculate the fapi5d
          - button "Delete chat" [ref=e173]
        - generic [ref=e177] [cursor=pointer]:
          - generic "can you run the t1134 workflow ?" [ref=e181]: can you run the t1134 workflow ?5d
          - button "Delete chat" [ref=e183]
      - button "Workflows" [ref=e187] [cursor=pointer]
      - generic [ref=e191]:
        - group [ref=e192]:
          - generic "Workflow storage status" [ref=e193]: Saved to server
          - generic [ref=e194]:
            - paragraph [ref=e195]: Workflows, saved versions, and run history are backed up to this server. Keep a recovery code to open this workspace in another browser.
            - button "Retry server save" [ref=e196] [cursor=pointer]
            - button "Export workflow backup" [active] [ref=e197] [cursor=pointer]
            - generic [ref=e198]:
              - text: Import backup as new workflows
              - button "Import workflow backup" [ref=e199]
            - button "Show recovery code" [ref=e200] [cursor=pointer]
            - generic [ref=e201]:
              - paragraph [ref=e202]: "Keep this private: anyone with this code can open and edit this workspace."
              - textbox "Workspace recovery code" [ref=e203]: afab2399003f2ad366d6a74ac7dfae10380ab54c606dec0e7decb9035bbade46
            - generic [ref=e204]:
              - text: Open another saved workspace
              - textbox "Open workspace recovery code" [ref=e205]
            - paragraph [ref=e206]: Opening a workspace replaces the current view. Export any unsaved local changes first.
            - button "Open saved workspace" [disabled] [ref=e207]
        - button "New workflow" [ref=e208] [cursor=pointer]
        - generic [ref=e210]:
          - generic [ref=e211]: MY WORKFLOWS
          - button "Recovery rehearsal" [ref=e212] [cursor=pointer]
        - generic [ref=e213]:
          - generic [ref=e214]: Runnable demos
          - button "Document Calculator" [ref=e215] [cursor=pointer]
          - button "Statutory Holiday Payroll Accrual" [ref=e220] [cursor=pointer]
        - generic [ref=e225]:
          - generic [ref=e226]: Platform services
          - button "Universal Execution Sequence" [ref=e227] [cursor=pointer]
          - button "Scope Service" [ref=e240] [cursor=pointer]
          - button "Tax Position Summary Service" [ref=e253] [cursor=pointer]
          - button "Data Readiness Service" [ref=e266] [cursor=pointer]
        - generic [ref=e279]:
          - generic [ref=e280]: Foundation
          - button "Foreign Affiliate Ownership & Entity Graph" [ref=e281] [cursor=pointer]
          - button "Tax Attribute & Continuity Ledgers" [ref=e288] [cursor=pointer]
          - button "Portfolio Tax Calendar, Client Requests & Review" [ref=e295] [cursor=pointer]
        - generic [ref=e302]:
          - generic [ref=e303]: Tier 1
          - button "T1134 Foreign Affiliate Reporting" [ref=e304] [cursor=pointer]
          - button "FAPI Calculation (portfolio)" [ref=e310] [cursor=pointer]
          - button "Foreign Affiliate Surplus" [ref=e316] [cursor=pointer]
          - button "T106 Related-Party Transaction Reporting" [ref=e322] [cursor=pointer]
          - button "EIFEL" [ref=e328] [cursor=pointer]
          - button "T2 Corporate Income Tax Compliance Suite" [ref=e334] [cursor=pointer]
          - button "Corporate Tax Provision" [ref=e340] [cursor=pointer]
          - button "Part XIII Withholding Tax" [ref=e346] [cursor=pointer]
      - group "Theme" [ref=e354]:
        - button "Light" [pressed] [ref=e355] [cursor=pointer]
        - button "Dark" [ref=e362] [cursor=pointer]
    - generic [ref=e365]:
      - generic [ref=e366]:
        - generic [ref=e367]:
          - button "Workflows" [ref=e369] [cursor=pointer]
          - generic [ref=e375]:
            - generic [ref=e376]: Recovery rehearsal
            - generic [ref=e377]: Version 1
            - button "Overview" [ref=e379] [cursor=pointer]
            - button "Build" [ref=e380] [cursor=pointer]
            - button "Run" [ref=e381] [cursor=pointer]
            - button "Results" [ref=e382] [cursor=pointer]
        - generic [ref=e388]:
          - generic [ref=e389]:
            - generic [ref=e390]:
              - text: Workflow name
              - textbox "Workflow name" [ref=e391]: Recovery rehearsal
            - paragraph [ref=e392]: Personal workflow · Saved version 1
          - group [ref=e393]:
            - generic "Test data — upload document or enter examples" [ref=e394] [cursor=pointer]
            - option "Document" [selected]
            - option "Add a document source"
          - region "Trigger readiness" [ref=e395]:
            - heading "Workflow start conditions" [level=3] [ref=e396]
            - paragraph [ref=e397]: Advisory only — you can always start a manual run. Field checks use recorded source outputs; test again after changing data.
            - generic [ref=e398]:
              - generic [ref=e399]:
                - generic [ref=e400]: Document uploaded
                - generic [ref=e401]: Met
              - paragraph [ref=e402]: "Document · Uploaded: items.csv"
          - generic [ref=e403]:
            - paragraph [ref=e404]: Build and Run share saved version 1
            - generic [ref=e405]:
              - text: Saved workflow version
              - combobox "Saved workflow version" [ref=e406]:
                - option "Recovery rehearsal - Version 1" [selected]
            - button "Run saved version 1" [ref=e407] [cursor=pointer]
          - button "Save changes and run" [ref=e408] [cursor=pointer]
          - paragraph [ref=e409]: Runs the graph and rules shown in Build using its configured source data. Blocks without an executable tool are reported in the results.
          - generic [ref=e410]:
            - heading "Version 1 · 9/15/2026, 10:07:52 PM · success" [level=3] [ref=e411]
            - region "Final workflow results" [ref=e412]:
              - heading "Final results" [level=3] [ref=e413]
              - generic [ref=e414]:
                - text: Display precision
                - combobox "Result display precision" [ref=e415]:
                  - option "Full precision" [selected]
                  - option "0 decimal places"
                  - option "2 decimal places"
                  - option "4 decimal places"
                  - option "6 decimal places"
              - paragraph [ref=e416]: Display formatting does not change values sent to other blocks or exported in JSON.
              - group [ref=e417]:
                - generic "Choose displayed results" [ref=e418]
              - table [ref=e419]:
                - rowgroup [ref=e420]:
                  - row [ref=e421]:
                    - columnheader "Result" [ref=e422]
                    - columnheader "Value" [ref=e423]
                    - columnheader "Unit" [ref=e424]
                - rowgroup [ref=e425]:
                  - row [ref=e426]:
                    - cell "Adjusted total Calculate" [ref=e427]:
                      - text: Adjusted total
                      - generic [ref=e428]: Calculate
                    - cell "60" [ref=e429]
                    - cell "units" [ref=e430]
            - group [ref=e431]:
              - generic "Start · success" [ref=e432] [cursor=pointer]
            - group [ref=e433]:
              - generic "Document · success" [ref=e434] [cursor=pointer]
            - group [ref=e435]:
              - generic "Keyword rules · success" [ref=e436] [cursor=pointer]
            - group [ref=e437]:
              - generic "Aggregation groups · success" [ref=e438] [cursor=pointer]
            - group [ref=e439]:
              - generic "Calculate · success" [ref=e440] [cursor=pointer]
            - group [ref=e441]:
              - generic "Final result · success" [ref=e442] [cursor=pointer]
      - separator "Drag to resize" [ref=e443]
      - generic [ref=e445]:
        - generic [ref=e446]:
          - button "Focus the page — hide the chat" [ref=e447] [cursor=pointer]
          - button "Focus the chat — hide the page" [ref=e451] [cursor=pointer]
        - generic [ref=e460]:
          - generic [ref=e461]:
            - generic [ref=e462]: InScope
            - button "Choose client — Scope reads their worksheets & documents" [ref=e463] [cursor=pointer]
          - generic [ref=e520]:
            - generic [ref=e521]:
              - generic [ref=e522]: Good evening, Sophia
              - generic [ref=e523]: How can I help you drive impact today?
            - generic [ref=e526]:
              - textbox "Ask Scope, or describe a task…" [ref=e527]
              - generic [ref=e528]:
                - button "Add — search, attach, workflows, worksheets" [ref=e529] [cursor=pointer]
                - button "Attach files" [ref=e531] [cursor=pointer]
                - button "Send" [disabled] [ref=e534]
            - generic [ref=e537]:
              - button "Calculate FAPI for Northstar" [ref=e538] [cursor=pointer]
              - button "Open the dashboard" [ref=e539] [cursor=pointer]
              - button "Run the art. 85 rollover" [ref=e540] [cursor=pointer]
              - button "Review FAPI exceptions" [ref=e541] [cursor=pointer]
            - generic [ref=e542]:
              - button "Build a workflow Design an automation on the canvas" [ref=e543] [cursor=pointer]:
                - generic [ref=e551]:
                  - generic [ref=e552]: Build a workflow
                  - generic [ref=e553]: Design an automation on the canvas
              - button "Statutory holiday payroll accrual Live holiday API → classify → day counts → accrual" [ref=e554] [cursor=pointer]:
                - generic [ref=e559]:
                  - generic [ref=e560]: Statutory holiday payroll accrual
                  - generic [ref=e561]: Live holiday API → classify → day counts → accrual
              - button "Calculate FAPI Foreign accrual property income" [ref=e562] [cursor=pointer]:
                - generic [ref=e567]:
                  - generic [ref=e568]: Calculate FAPI
                  - generic [ref=e569]: Foreign accrual property income
              - button "Roulement fiscal (art. 85) Rollover election → T2057" [ref=e570] [cursor=pointer]:
                - generic [ref=e575]:
                  - generic [ref=e576]: Roulement fiscal (art. 85)
                  - generic [ref=e577]: Rollover election → T2057
              - button "Expense reimbursement Receipts → policy caps → net payable" [ref=e578] [cursor=pointer]:
                - generic [ref=e583]:
                  - generic [ref=e584]: Expense reimbursement
                  - generic [ref=e585]: Receipts → policy caps → net payable
              - button "Campaign budget allocation Requests → elect budget → projection" [ref=e586] [cursor=pointer]:
                - generic [ref=e591]:
                  - generic [ref=e592]: Campaign budget allocation
                  - generic [ref=e593]: Requests → elect budget → projection
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { randomBytes } from 'node:crypto';
  3  | 
  4  | test('a workflow and its result recover in another browser; backups, offline retry, and conflict protection work', async ({ page, browser, request }, info) => {
  5  |   test.setTimeout(180000);
  6  |   let code = '';
  7  |   const secondContext = await browser.newContext({ baseURL: 'http://localhost:5173' });
  8  |   try {
  9  |     await page.goto('/w/pf-document-calculator');
  10 |     await page.getByRole('button', { name: 'Build', exact: true }).click();
  11 |     await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  12 |     await page.getByLabel('Upload test document').setInputFiles({ name: 'items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,10\nItem two,20') });
  13 |     await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  14 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  15 |     await page.getByLabel('Workflow name').fill('Recovery rehearsal');
  16 |     await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  17 |     await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  18 |     await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  19 |     await page.getByLabel('Workflow storage status').click();
  20 |     await page.getByRole('button', { name: 'Show recovery code', exact: true }).click();
  21 |     code = await page.getByLabel('Workspace recovery code', { exact: true }).inputValue();
  22 |     const downloadPromise = page.waitForEvent('download');
  23 |     await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
  24 |     const download = await downloadPromise;
  25 |     const backup = info.outputPath('workflow-backup.json'); await download.saveAs(backup);
  26 | 
  27 |     const second = await secondContext.newPage();
  28 |     await second.goto('/w/pf-document-calculator');
  29 |     await second.getByLabel('Workflow storage status').click();
  30 |     await second.getByLabel('Open workspace recovery code').fill(code);
  31 |     await second.getByRole('button', { name: 'Open saved workspace', exact: true }).click();
  32 |     await second.getByRole('button', { name: 'Recovery rehearsal', exact: true }).click();
  33 |     await second.getByRole('button', { name: 'Run', exact: true }).first().click();
  34 |     await expect(second.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  35 |     await expect(second.getByRole('button', { name: 'Run saved version 1', exact: true })).toBeVisible();
  36 |     await second.getByLabel('Import workflow backup').setInputFiles(backup);
  37 |     await expect(second.getByRole('button', { name: 'Recovery rehearsal — Imported', exact: true })).toBeVisible();
  38 |     await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  39 | 
  40 |     await second.route('**/api/workflow-library', async route => {
  41 |       if (route.request().method() === 'PUT') await route.fulfill({ status: 503, json: { error: 'Simulated offline save: local work retained.' } }); else await route.continue();
  42 |     });
  43 |     await second.getByLabel('Workflow name').fill('Offline edit'); await second.getByLabel('Workflow name').blur();
  44 |     await expect(second.getByLabel('Workflow storage status')).toContainText('Simulated offline save', { timeout: 15000 });
  45 |     await expect(second.getByRole('button', { name: 'Offline edit', exact: true })).toBeVisible();
  46 |     await second.unroute('**/api/workflow-library');
  47 |     await second.getByRole('button', { name: 'Retry server save', exact: true }).click();
  48 |     await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  49 | 
  50 |     const url = 'http://localhost:5050/api/workflow-library'; const headers = { 'x-workflow-workspace': code };
  51 |     const remote = await (await request.get(url, { headers })).json();
  52 |     await request.put(url, { headers, data: { revision: remote.revision, payload: remote.payload } });
  53 |     await second.getByLabel('Workflow name').fill('Conflicting local edit'); await second.getByLabel('Workflow name').blur();
  54 |     await expect(second.getByLabel('Workflow storage status')).toContainText('changed in another browser', { timeout: 15000 });
  55 |     const unchanged = await (await request.get(url, { headers })).json();
  56 |     expect(unchanged.payload).toBe(remote.payload);
  57 |   } finally {
> 58 |     if (code) await request.delete('http://localhost:5050/api/workflow-library', { headers: { 'x-workflow-workspace': code } });
     |                                   ^ Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
  59 |     await secondContext.close();
  60 |   }
  61 | });
  62 | 
  63 | test('server persistence roundtrips a one-megabyte payload above the default JSON body limit', async ({ request }) => {
  64 |   const headers = { 'x-workflow-workspace': randomBytes(32).toString('hex') };
  65 |   const url = 'http://localhost:5050/api/workflow-library';
  66 |   const payload = JSON.stringify({ records: 'x'.repeat(1024 * 1024) });
  67 |   try {
  68 |     const saved = await request.put(url, { headers, data: { revision: 0, payload } });
  69 |     expect(saved.status()).toBe(200);
  70 |     const loaded = await request.get(url, { headers });
  71 |     expect((await loaded.json()).payload).toBe(payload);
  72 |   } finally { await request.delete(url, { headers }); }
  73 | });
  74 | 
```