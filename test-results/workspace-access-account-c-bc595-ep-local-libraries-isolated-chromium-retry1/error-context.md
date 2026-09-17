# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace-access.spec.ts >> account creation, workspace switching, sign-out and sign-in keep local libraries isolated
- Location: e2e/workspace-access.spec.ts:58:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Choose a workspace', { exact: true })
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for getByText('Choose a workspace', { exact: true })

```

```yaml
- main:
  - heading "Create your account" [level=1]
  - paragraph: Try the app without credentials, or sign in to your workspace.
  - button "Try demo"
  - paragraph: No email or password needed. Explore in your own demo workspace. Export workflows before exiting; access depends on this browser session.
  - alert: Invalid origin
  - text: Name
  - textbox "Name": Workspace browser owner
  - text: Email
  - textbox "Email": a77e4825-ede8-4446-9377-95b34fcdc73f@example.invalid
  - text: Password
  - textbox "Password": Synthetic-password-2026!
  - paragraph: Use at least 12 characters. Workspace membership is granted separately by an Owner.
  - button "Create account"
  - button "Use an existing account"
```

# Test source

```ts
  1   | import { test, expect as baseExpect } from '@playwright/test';
  2   | import { randomUUID } from 'node:crypto';
  3   | import { readFileSync } from 'node:fs';
  4   | import { test as signedInTest } from './authenticated-fixture';
  5   | // This journey crosses full-page session/workspace reloads on the development server.
  6   | const expect = baseExpect.configure({ timeout: 20000 });
  7   | 
  8   | signedInTest(
  9   |   'membership controls grant Viewer access and revocation removes the workspace',
  10  |   async ({ page, browser, request, baseURL, workspaceSession }, info) => {
  11  |     const viewerContext = await browser.newContext({ baseURL });
  12  |     try {
  13  |       const signup = await viewerContext.request.post('/api/auth/sign-up/email', {
  14  |         headers: { Origin: baseURL! },
  15  |         data: {
  16  |           name: 'Browser viewer',
  17  |           email: `${randomUUID()}@example.invalid`,
  18  |           password: 'Synthetic-password-2026!',
  19  |         },
  20  |       });
  21  |       expect(signup.status()).toBe(200);
  22  |       const { user } = await signup.json();
  23  |       await page.goto('/');
  24  |       await page.getByText('Workspace: Browser test workspace (owner)', { exact: true }).click();
  25  |       await page.getByLabel('Member account ID', { exact: true }).fill(user.id);
  26  |       await page.getByLabel('Member role', { exact: true }).selectOption('viewer');
  27  |       await page.getByRole('button', { name: 'Set member role', exact: true }).click();
  28  |       await expect(page.getByText('Browser viewer — viewer', { exact: true })).toBeVisible();
  29  |       await viewerContext.addInitScript(
  30  |         (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
  31  |         { userId: user.id, workspace: { ...workspaceSession.workspace, role: 'viewer' } },
  32  |       );
  33  |       const viewer = await viewerContext.newPage();
  34  |       await viewer.goto('/w/pf-document-calculator');
  35  |       await expect(
  36  |         viewer.getByText('Workspace: Browser test workspace (viewer)', { exact: true }),
  37  |       ).toBeVisible();
  38  |       await expect(viewer.getByRole('status').filter({ hasText: 'Viewer access' })).toBeVisible();
  39  |       await viewer.getByLabel('Workflow storage status').click();
  40  |       await expect(viewer.getByLabel('Import workflow backup')).toBeDisabled();
  41  |       await expect(
  42  |         viewer.getByRole('button', { name: 'Retry server save', exact: true }),
  43  |       ).toBeDisabled();
  44  |       await viewer.screenshot({ path: info.outputPath('viewer-access.png'), fullPage: true });
  45  |       const removed = await request.delete(
  46  |         `/api/workspaces/${workspaceSession.workspace.id}/members/${user.id}`,
  47  |       );
  48  |       expect(removed.status()).toBe(200);
  49  |       await viewer.reload();
  50  |       await expect(viewer.getByText('Choose a workspace', { exact: true })).toBeVisible();
  51  |       await expect(viewer.getByLabel('Workflow storage status')).toHaveCount(0);
  52  |     } finally {
  53  |       await viewerContext.close();
  54  |     }
  55  |   },
  56  | );
  57  | 
  58  | test('account creation, workspace switching, sign-out and sign-in keep local libraries isolated', async ({
  59  |   page,
  60  |   baseURL,
  61  | }, info) => {
  62  |   test.setTimeout(300000);
  63  |   const email = `${randomUUID()}@example.invalid`,
  64  |     password = 'Synthetic-password-2026!';
  65  |   await page.goto('/');
  66  |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  67  |   await page.getByRole('button', { name: 'Create an account', exact: true }).click();
  68  |   await page.getByLabel('Name', { exact: true }).fill('Workspace browser owner');
  69  |   await page.getByLabel('Email', { exact: true }).fill(email);
  70  |   await page.getByLabel('Password', { exact: true }).fill(password);
  71  |   await page.getByRole('button', { name: 'Create account', exact: true }).click();
> 72  |   await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible({
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  73  |     timeout: 60000,
  74  |   });
  75  |   await page.getByLabel('New workspace name').fill('First private workspace');
  76  |   await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  77  |   await expect(
  78  |     page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  79  |   ).toBeVisible();
  80  |   const first = await page.evaluate(() =>
  81  |     JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  82  |   );
  83  |   const backup = readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8');
  84  |   const saved = await page.request.put('/api/workflow-library', {
  85  |     headers: { Origin: baseURL!, 'x-taxflow-workspace': first.workspace.id },
  86  |     data: { payload: backup, revision: 0 },
  87  |   });
  88  |   expect(saved.status(), await saved.text()).toBe(200);
  89  |   await page.goto('/w/pf-document-calculator');
  90  |   await expect(
  91  |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  92  |   ).toBeVisible();
  93  |   await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  94  |   await page.getByLabel('New workspace name').fill('Second private workspace');
  95  |   await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  96  |   await expect(
  97  |     page.getByText('Workspace: Second private workspace (owner)', { exact: true }),
  98  |   ).toBeVisible();
  99  |   await page.goto('/w/pf-document-calculator');
  100 |   await expect(
  101 |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  102 |   ).toHaveCount(0);
  103 |   await page.getByText('Workspace: Second private workspace (owner)', { exact: true }).click();
  104 |   await page.getByLabel('Open workspace', { exact: true }).selectOption(first.workspace.id);
  105 |   await expect(
  106 |     page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  107 |   ).toBeVisible();
  108 |   await page.goto('/w/pf-document-calculator');
  109 |   await expect(
  110 |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  111 |   ).toBeVisible();
  112 |   await page.screenshot({ path: info.outputPath('workspace-menu.png'), fullPage: true });
  113 |   await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  114 |   await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  115 |   await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  116 |   await expect(
  117 |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  118 |   ).toHaveCount(0);
  119 |   await page.getByLabel('Email', { exact: true }).fill(email);
  120 |   await page.getByLabel('Password', { exact: true }).fill('Wrong-password-2026!');
  121 |   await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  122 |   await expect(page.getByRole('alert')).toBeVisible();
  123 |   await page.getByLabel('Password', { exact: true }).fill(password);
  124 |   await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  125 |   await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible({
  126 |     timeout: 60000,
  127 |   });
  128 |   await page.getByLabel('Open workspace', { exact: true }).selectOption(first.workspace.id);
  129 |   await expect(
  130 |     page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  131 |   ).toBeVisible();
  132 |   await page.goto('/w/pf-document-calculator');
  133 |   await expect(
  134 |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  135 |   ).toBeVisible();
  136 |   // A different account in the same browser retains old caches on disk but cannot mount them.
  137 |   await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  138 |   await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  139 |   await page.getByRole('button', { name: 'Create an account', exact: true }).click();
  140 |   await page.getByLabel('Name', { exact: true }).fill('Second browser account');
  141 |   await page.getByLabel('Email', { exact: true }).fill(`${randomUUID()}@example.invalid`);
  142 |   await page.getByLabel('Password', { exact: true }).fill(password);
  143 |   await page.getByRole('button', { name: 'Create account', exact: true }).click();
  144 |   await page.getByLabel('New workspace name').fill('Other account workspace');
  145 |   await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  146 |   await expect(
  147 |     page.getByText('Workspace: Other account workspace (owner)', { exact: true }),
  148 |   ).toBeVisible();
  149 |   await page.goto('/w/pf-document-calculator');
  150 |   await expect(
  151 |     page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  152 |   ).toHaveCount(0);
  153 |   expect(
  154 |     (
  155 |       await page.request.get('/api/workflow-library', {
  156 |         headers: { 'x-taxflow-workspace': first.workspace.id },
  157 |       })
  158 |     ).status(),
  159 |   ).toBe(403);
  160 | });
  161 | 
```