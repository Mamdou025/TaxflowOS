# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-access.spec.ts >> Try demo can recover directly from a failed startup check without credential entry
- Location: e2e/demo-access.spec.ts:22:5

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
  - button "Retry access check"
  - text: Email
  - textbox "Email"
  - text: Password
  - textbox "Password"
  - button "Sign in"
  - button "Create an account"
```

# Test source

```ts
  1   | import { test, expect as baseExpect } from '@playwright/test';
  2   | const expect = baseExpect.configure({ timeout: 20000 });
  3   | 
  4   | test('an unavailable startup access check keeps demo visible and recovers without a reload', async ({
  5   |   page,
  6   | }) => {
  7   |   await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  8   |   await page.goto('/');
  9   |   await expect(page.getByRole('alert')).toContainText('app service is not ready');
  10  |   await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeVisible();
  11  |   await expect(page.getByRole('region', { name: 'Demo session' })).toHaveCount(0);
  12  |   await page.unroute('**/api/session');
  13  |   // The normal focus refresh must clear the old error when the API returns 401.
  14  |   // Previously state became signed-out but the error screen stayed mounted.
  15  |   await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  16  |   await expect(page.getByRole('alert')).toHaveCount(0);
  17  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  18  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  19  |   await expect(page).toHaveURL(/\/$/);
  20  | });
  21  | 
  22  | test('Try demo can recover directly from a failed startup check without credential entry', async ({
  23  |   page,
  24  | }) => {
  25  |   await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  26  |   await page.goto('/');
  27  |   await expect(page.getByRole('button', { name: 'Retry access check', exact: true })).toBeVisible();
  28  |   await page.unroute('**/api/session');
  29  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
> 30  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  31  |   const session = await (await page.request.get('/api/session')).json();
  32  |   expect(session.user.isDemo).toBe(true);
  33  | });
  34  | 
  35  | test('Try demo opens Chat without credentials, saves a real run and exits cleanly', async ({
  36  |   page,
  37  | }, info) => {
  38  |   test.setTimeout(300000);
  39  |   await page.goto('/');
  40  |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  41  |   await page.screenshot({ path: info.outputPath('demo-entry.png'), fullPage: true });
  42  |   await page.route('**/api/auth/sign-in/anonymous', (route) =>
  43  |     route.fulfill({ status: 503, json: {} }),
  44  |   );
  45  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  46  |   await expect(page.getByRole('alert')).toContainText('The demo could not start');
  47  |   await page.unroute('**/api/auth/sign-in/anonymous');
  48  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  49  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  50  |   await expect(page).toHaveURL(/\/$/);
  51  |   const first = await page.evaluate(() =>
  52  |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  53  |   );
  54  |   expect(first.isDemo).toBe(true);
  55  |   await page.goto('/w/pf-document-calculator');
  56  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  57  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  58  |   await page.getByLabel('Upload test document').setInputFiles({
  59  |     name: 'demo.csv',
  60  |     mimeType: 'text/csv',
  61  |     buffer: Buffer.from('label,amount\nItem one,10\nItem two,20'),
  62  |   });
  63  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  64  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  65  |   await page.getByLabel('Workflow name').fill('My password-free run');
  66  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  67  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  68  |   await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
  69  |     timeout: 30000,
  70  |   });
  71  |   // Reopening a tab has no selected-workspace cache; the guest cookie must still
  72  |   // recover the same workspace automatically, without another demo signup.
  73  |   await page.evaluate(() => sessionStorage.removeItem('taxflow:authenticated-workspace'));
  74  |   await page.reload();
  75  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  76  |   expect(
  77  |     await page.evaluate(
  78  |       () => JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!).workspace.id,
  79  |     ),
  80  |   ).toBe(first.workspace.id);
  81  |   await page.goto('/w/pf-document-calculator');
  82  |   await page.getByRole('button', { name: 'My password-free run', exact: true }).click();
  83  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  84  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  85  |   await page.getByLabel('Workflow storage status').click();
  86  |   await expect(page.getByRole('button', { name: 'Claim legacy library' })).toHaveCount(0);
  87  |   const download = page.waitForEvent('download');
  88  |   await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
  89  |   await (await download).saveAs(info.outputPath('demo-backup.json'));
  90  |   await page.goto('/');
  91  |   await expect(page.getByRole('region', { name: 'Demo session' })).toContainText(
  92  |     'Private to this browser',
  93  |   );
  94  |   await page.screenshot({ path: info.outputPath('demo-workspace.png'), fullPage: true });
  95  |   await page.getByRole('button', { name: 'Exit demo', exact: true }).click();
  96  |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  97  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  98  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  99  |   const next = await page.evaluate(() =>
  100 |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  101 |   );
  102 |   expect(next.userId).not.toBe(first.userId);
  103 |   expect(next.workspace.id).not.toBe(first.workspace.id);
  104 |   await page.goto('/w/pf-document-calculator');
  105 |   await expect(page.getByRole('button', { name: 'My password-free run', exact: true })).toHaveCount(
  106 |     0,
  107 |   );
  108 |   expect(
  109 |     (
  110 |       await page.request.get('/api/workflow-library', {
  111 |         headers: { 'x-taxflow-workspace': first.workspace.id },
  112 |       })
  113 |     ).status(),
  114 |   ).toBe(403);
  115 | });
  116 | 
```