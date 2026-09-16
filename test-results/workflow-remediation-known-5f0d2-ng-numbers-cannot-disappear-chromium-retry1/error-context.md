# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-remediation.spec.ts >> known empty categories total zero but matched rows with missing numbers cannot disappear
- Location: e2e/workflow-remediation.spec.ts:156:5

# Error details

```
Error: {"message":"Too many requests. Please try again later."}

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 429
```

# Test source

```ts
  1  | import { test as base, expect } from '@playwright/test';
  2  | import { randomUUID } from 'node:crypto';
  3  | 
  4  | type WorkspaceSession = {
  5  |   userId: string;
  6  |   workspace: { id: string; name: string; role: 'owner' };
  7  |   email: string;
  8  |   password: string;
  9  | };
  10 | export const test = base.extend<{ workspaceSession: WorkspaceSession }>({
  11 |   workspaceSession: async ({ context, baseURL }, use) => {
  12 |     const email = `${randomUUID()}@example.invalid`,
  13 |       password = 'Synthetic-password-2026!';
  14 |     const signup = await context.request.post('/api/auth/sign-up/email', {
  15 |       headers: { Origin: baseURL! },
  16 |       data: { email, password, name: 'Browser test owner' },
  17 |     });
> 18 |     expect(signup.status(), await signup.text()).toBe(200);
     |                                                  ^ Error: {"message":"Too many requests. Please try again later."}
  19 |     const { user } = await signup.json();
  20 |     const created = await context.request.post('/api/workspaces', {
  21 |       headers: { Origin: baseURL! },
  22 |       data: { name: 'Browser test workspace' },
  23 |     });
  24 |     expect(created.status(), await created.text()).toBe(201);
  25 |     await use({ userId: user.id, workspace: await created.json(), email, password });
  26 |   },
  27 |   page: async ({ page, workspaceSession }, use) => {
  28 |     await page.addInitScript(
  29 |       (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
  30 |       { userId: workspaceSession.userId, workspace: workspaceSession.workspace },
  31 |     );
  32 |     await use(page);
  33 |   },
  34 |   request: async ({ playwright, context, workspaceSession, baseURL }, use) => {
  35 |     const request = await playwright.request.newContext({
  36 |       baseURL,
  37 |       storageState: await context.storageState(),
  38 |       extraHTTPHeaders: { Origin: baseURL!, 'x-taxflow-workspace': workspaceSession.workspace.id },
  39 |     });
  40 |     await use(request);
  41 |     await request.dispose();
  42 |   },
  43 | });
  44 | export { expect };
  45 | 
```