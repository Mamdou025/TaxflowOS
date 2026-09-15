import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

type WorkspaceSession = {
  userId: string;
  workspace: { id: string; name: string; role: 'owner' };
  email: string;
  password: string;
};
export const test = base.extend<{ workspaceSession: WorkspaceSession }>({
  workspaceSession: async ({ context, baseURL }, use) => {
    const email = `${randomUUID()}@example.invalid`,
      password = 'Synthetic-password-2026!';
    const signup = await context.request.post('/api/auth/sign-up/email', {
      headers: { Origin: baseURL! },
      data: { email, password, name: 'Browser test owner' },
    });
    expect(signup.status(), await signup.text()).toBe(200);
    const { user } = await signup.json();
    const created = await context.request.post('/api/workspaces', {
      headers: { Origin: baseURL! },
      data: { name: 'Browser test workspace' },
    });
    expect(created.status(), await created.text()).toBe(201);
    await use({ userId: user.id, workspace: await created.json(), email, password });
  },
  page: async ({ page, workspaceSession }, use) => {
    await page.addInitScript(
      (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
      { userId: workspaceSession.userId, workspace: workspaceSession.workspace },
    );
    await use(page);
  },
  request: async ({ playwright, context, workspaceSession, baseURL }, use) => {
    const request = await playwright.request.newContext({
      baseURL,
      storageState: await context.storageState(),
      extraHTTPHeaders: { Origin: baseURL!, 'x-taxflow-workspace': workspaceSession.workspace.id },
    });
    await use(request);
    await request.dispose();
  },
});
export { expect };
