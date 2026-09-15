import { test, expect as baseExpect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test as signedInTest } from './authenticated-fixture';
// This journey crosses full-page session/workspace reloads on the development server.
const expect = baseExpect.configure({ timeout: 20000 });

signedInTest(
  'membership controls grant Viewer access and revocation removes the workspace',
  async ({ page, browser, request, baseURL, workspaceSession }, info) => {
    const viewerContext = await browser.newContext({ baseURL });
    try {
      const signup = await viewerContext.request.post('/api/auth/sign-up/email', {
        headers: { Origin: baseURL! },
        data: {
          name: 'Browser viewer',
          email: `${randomUUID()}@example.invalid`,
          password: 'Synthetic-password-2026!',
        },
      });
      expect(signup.status()).toBe(200);
      const { user } = await signup.json();
      await page.goto('/');
      await page.getByText('Workspace: Browser test workspace (owner)', { exact: true }).click();
      await page.getByLabel('Member account ID', { exact: true }).fill(user.id);
      await page.getByLabel('Member role', { exact: true }).selectOption('viewer');
      await page.getByRole('button', { name: 'Set member role', exact: true }).click();
      await expect(page.getByText('Browser viewer — viewer', { exact: true })).toBeVisible();
      await viewerContext.addInitScript(
        (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
        { userId: user.id, workspace: { ...workspaceSession.workspace, role: 'viewer' } },
      );
      const viewer = await viewerContext.newPage();
      await viewer.goto('/w/pf-document-calculator');
      await expect(
        viewer.getByText('Workspace: Browser test workspace (viewer)', { exact: true }),
      ).toBeVisible();
      await expect(viewer.getByRole('status').filter({ hasText: 'Viewer access' })).toBeVisible();
      await viewer.getByLabel('Workflow storage status').click();
      await expect(viewer.getByLabel('Import workflow backup')).toBeDisabled();
      await expect(
        viewer.getByRole('button', { name: 'Retry server save', exact: true }),
      ).toBeDisabled();
      await viewer.screenshot({ path: info.outputPath('viewer-access.png'), fullPage: true });
      const removed = await request.delete(
        `/api/workspaces/${workspaceSession.workspace.id}/members/${user.id}`,
      );
      expect(removed.status()).toBe(200);
      await viewer.reload();
      await expect(viewer.getByText('Choose a workspace', { exact: true })).toBeVisible();
      await expect(viewer.getByLabel('Workflow storage status')).toHaveCount(0);
    } finally {
      await viewerContext.close();
    }
  },
);

test('account creation, workspace switching, sign-out and sign-in keep local libraries isolated', async ({
  page,
  baseURL,
}, info) => {
  test.setTimeout(300000);
  const email = `${randomUUID()}@example.invalid`,
    password = 'Synthetic-password-2026!';
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await page.getByRole('button', { name: 'Create an account', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Workspace browser owner');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible({
    timeout: 60000,
  });
  await page.getByLabel('New workspace name').fill('First private workspace');
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await expect(
    page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  ).toBeVisible();
  const first = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  );
  const backup = readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8');
  const saved = await page.request.put('/api/workflow-library', {
    headers: { Origin: baseURL!, 'x-taxflow-workspace': first.workspace.id },
    data: { payload: backup, revision: 0 },
  });
  expect(saved.status(), await saved.text()).toBe(200);
  await page.goto('/w/pf-document-calculator');
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toBeVisible();
  await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  await page.getByLabel('New workspace name').fill('Second private workspace');
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await expect(
    page.getByText('Workspace: Second private workspace (owner)', { exact: true }),
  ).toBeVisible();
  await page.goto('/w/pf-document-calculator');
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toHaveCount(0);
  await page.getByText('Workspace: Second private workspace (owner)', { exact: true }).click();
  await page.getByLabel('Open workspace', { exact: true }).selectOption(first.workspace.id);
  await expect(
    page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  ).toBeVisible();
  await page.goto('/w/pf-document-calculator');
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('workspace-menu.png'), fullPage: true });
  await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toHaveCount(0);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('Wrong-password-2026!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible({
    timeout: 60000,
  });
  await page.getByLabel('Open workspace', { exact: true }).selectOption(first.workspace.id);
  await expect(
    page.getByText('Workspace: First private workspace (owner)', { exact: true }),
  ).toBeVisible();
  await page.goto('/w/pf-document-calculator');
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toBeVisible();
  // A different account in the same browser retains old caches on disk but cannot mount them.
  await page.getByText('Workspace: First private workspace (owner)', { exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByRole('button', { name: 'Create an account', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Second browser account');
  await page.getByLabel('Email', { exact: true }).fill(`${randomUUID()}@example.invalid`);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByLabel('New workspace name').fill('Other account workspace');
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await expect(
    page.getByText('Workspace: Other account workspace (owner)', { exact: true }),
  ).toBeVisible();
  await page.goto('/w/pf-document-calculator');
  await expect(
    page.getByRole('button', { name: 'Synthetic archived draft', exact: true }),
  ).toHaveCount(0);
  expect(
    (
      await page.request.get('/api/workflow-library', {
        headers: { 'x-taxflow-workspace': first.workspace.id },
      })
    ).status(),
  ).toBe(403);
});
