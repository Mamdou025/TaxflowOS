# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-resume.spec.ts >> an existing demo resumes with one click after startup verification fails
- Location: e2e/demo-resume.spec.ts:4:5

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
  1  | import { test, expect as baseExpect } from '@playwright/test';
  2  | const expect = baseExpect.configure({ timeout: 20000 });
  3  | 
  4  | test('an existing demo resumes with one click after startup verification fails', async ({
  5  |   page,
  6  | }) => {
  7  |   await page.goto('/');
  8  |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
> 9  |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  10 |   const first = await page.evaluate(() =>
  11 |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  12 |   );
  13 |   await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  14 |   await page.reload();
  15 |   await expect(page.getByRole('alert')).toContainText('app service is not ready');
  16 |   await page.unroute('**/api/session');
  17 |   await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  18 |   await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  19 |   const resumed = await page.evaluate(() =>
  20 |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  21 |   );
  22 |   expect(resumed.isDemo).toBe(true);
  23 |   expect(resumed.userId).toBe(first.userId);
  24 |   expect(resumed.workspace.id).toBe(first.workspace.id);
  25 | });
  26 | 
```