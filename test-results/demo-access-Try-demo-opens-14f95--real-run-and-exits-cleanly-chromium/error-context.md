# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-access.spec.ts >> Try demo opens Chat without credentials, saves a real run and exits cleanly
- Location: e2e/demo-access.spec.ts:36:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Demo session' })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('region', { name: 'Demo session' })

```

```yaml
- main:
  - heading "Sign in to TaxflowOS" [level=1]
  - paragraph: Try the app without credentials, or sign in to your workspace.
  - button "Try demo"
  - paragraph: No email or password needed. Explore in your own demo workspace. Export workflows before exiting; access depends on this browser session.
  - alert: The demo workspace could not be opened.
  - text: Email
  - textbox "Email"
  - text: Password
  - textbox "Password"
  - button "Sign in"
  - button "Create an account"
```

# Test source

```ts
  1   | import { openDocumentCalculationFixture } from './retired-workflow-fixtures';
  2   | import { test, expect as baseExpect } from '@playwright/test';
  3   | const expect = baseExpect.configure({ timeout: 20000 });
  4   | 
  5   | test('an unavailable startup access check keeps demo visible and recovers without a reload', async ({
  6   |   page,
  7   | }) => {
  8   |   await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  9   |   await page.goto('/');
  10  |   await expect(page.getByRole('alert')).toContainText('app service is not ready');
  11  |   await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeVisible();
  12  |   await expect(page.getByRole('region', { name: 'Demo session' })).toHaveCount(0);
  13  |   await page.unroute('**/api/session');
  14  |   // The normal focus refresh must clear the old error when the API returns 401.
  15  |   // Previously state became signed-out but the error screen stayed mounted.
  16  |   await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  17  |   await expect(page.getByRole('alert')).toHaveCount(0);
  18  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  19  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  20  |   await expect(page).toHaveURL(/\/$/);
  21  | });
  22  | 
  23  | test('Try demo can recover directly from a failed startup check without credential entry', async ({
  24  |   page,
  25  | }) => {
  26  |   await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  27  |   await page.goto('/');
  28  |   await expect(page.getByRole('button', { name: 'Retry access check', exact: true })).toBeVisible();
  29  |   await page.unroute('**/api/session');
  30  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  31  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  32  |   const session = await (await page.request.get('/api/session')).json();
  33  |   expect(session.user.isDemo).toBe(true);
  34  | });
  35  | 
  36  | test('Try demo opens Chat without credentials, saves a real run and exits cleanly', async ({
  37  |   page,
  38  | }, info) => {
  39  |   test.setTimeout(300000);
  40  |   await page.goto('/');
  41  |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  42  |   await page.screenshot({ path: info.outputPath('demo-entry.png'), fullPage: true });
  43  |   await page.route('**/api/auth/sign-in/anonymous', (route) =>
  44  |     route.fulfill({ status: 503, json: {} }),
  45  |   );
  46  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  47  |   await expect(page.getByRole('alert')).toContainText('The demo could not start');
  48  |   await page.unroute('**/api/auth/sign-in/anonymous');
  49  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
> 50  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  51  |   await expect(page).toHaveURL(/\/$/);
  52  |   const first = await page.evaluate(() =>
  53  |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  54  |   );
  55  |   expect(first.isDemo).toBe(true);
  56  |   await openDocumentCalculationFixture(page);
  57  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  58  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  59  |   await page.getByLabel('Upload test document').setInputFiles({
  60  |     name: 'demo.csv',
  61  |     mimeType: 'text/csv',
  62  |     buffer: Buffer.from('label,amount\nItem one,10\nItem two,20'),
  63  |   });
  64  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  65  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  66  |   await page.getByLabel('Workflow name').fill('My password-free run');
  67  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  68  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  69  |   await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
  70  |     timeout: 30000,
  71  |   });
  72  |   // Reopening a tab has no selected-workspace cache; the guest cookie must still
  73  |   // recover the same workspace automatically, without another demo signup.
  74  |   await page.evaluate(() => sessionStorage.removeItem('taxflow:authenticated-workspace'));
  75  |   await page.reload();
  76  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  77  |   expect(
  78  |     await page.evaluate(
  79  |       () => JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!).workspace.id,
  80  |     ),
  81  |   ).toBe(first.workspace.id);
  82  |   await page.goto('/w/pf-fapi');
  83  |   await page.getByRole('button', { name: 'My password-free run', exact: true }).click();
  84  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  85  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  86  |   await page.getByLabel('Workflow storage status').click();
  87  |   await expect(page.getByRole('button', { name: 'Claim legacy library' })).toHaveCount(0);
  88  |   const download = page.waitForEvent('download');
  89  |   await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
  90  |   await (await download).saveAs(info.outputPath('demo-backup.json'));
  91  |   await page.goto('/');
  92  |   await expect(page.getByRole('region', { name: 'Demo session' })).toContainText(
  93  |     'Private to this browser',
  94  |   );
  95  |   await page.screenshot({ path: info.outputPath('demo-workspace.png'), fullPage: true });
  96  |   await page.getByRole('button', { name: 'Exit demo', exact: true }).click();
  97  |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  98  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  99  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  100 |   const next = await page.evaluate(() =>
  101 |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  102 |   );
  103 |   expect(next.userId).not.toBe(first.userId);
  104 |   expect(next.workspace.id).not.toBe(first.workspace.id);
  105 |   await page.goto('/w/pf-fapi');
  106 |   await expect(page.getByRole('button', { name: 'My password-free run', exact: true })).toHaveCount(
  107 |     0,
  108 |   );
  109 |   expect(
  110 |     (
  111 |       await page.request.get('/api/workflow-library', {
  112 |         headers: { 'x-taxflow-workspace': first.workspace.id },
  113 |       })
  114 |     ).status(),
  115 |   ).toBe(403);
  116 | });
  117 | 
```