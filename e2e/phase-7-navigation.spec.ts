import { test, expect } from './workflow-audit-isolation';
import type { Page } from '@playwright/test';

async function mockWorkspaceReads(page: Page) {
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
}

test('page summaries defer editors and preserve drafts while switching pages', async ({ page }) => {
  await mockWorkspaceReads(page);
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(new URL(request.url()).pathname);
  });
  await page.goto('/');
  const draft = page.locator('.lc-console').getByRole('textbox');
  await draft.fill('Keep my draft while opening editors');
  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await expect(page.getByText('Workflow library', { exact: true }).last()).toBeVisible();
  expect(scripts.some((url) => url.endsWith('/inline-builder.tsx'))).toBe(false);
  expect(scripts.some((url) => url.endsWith('/saved-workflow-run.tsx'))).toBe(false);
  expect(scripts.some((url) => url.endsWith('/workflow-run-history.tsx'))).toBe(false);

  await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await page.getByRole('menuitem', { name: 'Customize agent' }).click();
  await expect(page.getByText('Operator instructions', { exact: true })).toBeVisible();
  expect(scripts.some((url) => url.endsWith('/agent-lab-page.tsx'))).toBe(false);

  // Hold the actual module response to check the loading boundary, not a timer.
  let releaseLab!: () => void;
  const labReady = new Promise<void>((resolve) => {
    releaseLab = resolve;
  });
  await page.route('**/src/features/agent-lab/agent-lab-page.tsx*', async (route) => {
    await labReady;
    await route.continue();
  });
  try {
    await page.getByRole('button', { name: 'Lab', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Loading Agent Lab' })).toBeVisible();
    await expect(draft).toHaveValue('Keep my draft while opening editors');
    await expect(
      page.getByRole('button', { name: 'Workflows', exact: true }).first(),
    ).toBeEnabled();
  } finally {
    releaseLab();
  }
  const notes = page.getByPlaceholder('Jot what you notice about the agent as you test…');
  await notes.fill('Retain these Lab notes');
  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await expect(page.getByText('Workflow library', { exact: true }).last()).toBeVisible();
  await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await page.getByRole('menuitem', { name: 'Customize agent' }).click();
  await page.getByRole('button', { name: 'Lab', exact: true }).click();
  await expect(notes).toHaveValue('Retain these Lab notes');
  await expect(draft).toHaveValue('Keep my draft while opening editors');
});

test('composer groups attachments and exposes the current agent beside the draft', async ({
  page,
}) => {
  await mockWorkspaceReads(page);
  await page.goto('/');
  const composer = page.locator('.lc-console');
  const draft = composer.getByRole('textbox');
  await draft.fill('Keep this draft while customizing');
  await expect(page.getByRole('button', { name: 'Choose source', exact: true })).toHaveCount(0);
  await composer.getByRole('button', { name: 'Attach files', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: 'Choose from Sources' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Attach workflow scope' }).hover();
  await expect(
    page.getByRole('menuitem', { name: 'No workflows in your library yet' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await composer.getByRole('button', { name: 'Attach files', exact: true }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('menuitem', { name: 'Upload from laptop' }).click();
  await (
    await chooser
  ).setFiles({
    name: 'chat-notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Synthetic notes'),
  });
  await expect(composer.getByText('chat-notes.txt', { exact: true })).toBeVisible();
  await composer.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Sina · Tax specialist' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.getByRole('menuitem', { name: 'Customize agent' }).click();
  await expect(page.getByText('Operator instructions', { exact: true })).toBeVisible();
  await expect(draft).toHaveValue('Keep this draft while customizing');
  await expect(composer.getByText('chat-notes.txt', { exact: true })).toBeVisible();
  await expect(composer.getByRole('button', { name: 'Chat agent: Sina' })).toBeVisible();
});

test('Chat-first navigation exposes the four product areas and nests run history', async ({
  page,
}) => {
  await mockWorkspaceReads(page);
  await page.goto('/');

  for (const label of ['Chat', 'Workflows', 'Sources', 'Connections']) {
    await expect(page.getByRole('button', { name: label, exact: true }).first()).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Chat', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('button', { name: 'Agent', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Documents', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Runs', exact: true })).toHaveCount(0);

  await expect(page.getByRole('button', { name: 'Ask about sources', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Build a workflow', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run a workflow', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Chat agent: Sina' })).toBeVisible();

  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await page.getByRole('button', { name: 'Run history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByLabel('Workflow execution lifetime')).toContainText(
    'continue on the server if this tab closes.',
  );
  await expect(page.getByText('No workflow runs yet.', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole('button', { name: /^Context:/ })).toBeVisible();

  await page.getByRole('button', { name: 'Connections', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Connections', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText('No connections configured yet', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Help', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Help', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Run after closing the browser' })).toBeVisible();
  await expect(
    page.getByText('The T2 bridge reconciles taxable income;', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeVisible();
});

test('attaching workflow scope preserves the draft and does not execute it', async ({ page }) => {
  await mockWorkspaceReads(page);
  await page.goto('/');
  const payload = await page.evaluate(async () => {
    const { templateDefinition } =
      await import('/src/features/workflows-hub/workflow-execution.ts');
    const draft = templateDefinition('pf-document-calculator')!;
    return JSON.stringify({
      'custom:scope-workflow': {
        id: 'custom:scope-workflow',
        templateId: draft.id,
        draft: { ...draft, id: 'custom:scope-workflow', name: 'My calculation' },
        versions: [],
        runs: [],
      },
    });
  });
  await page.route('**/api/workflow-library', (route) =>
    route.fulfill({ json: { revision: 1, payload } }),
  );
  const executions: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && /workflow-runs|\/execute/.test(request.url()))
      executions.push(request.url());
  });
  await page.reload();
  const composer = page.locator('.lc-console');
  await composer.getByRole('textbox').fill('Explain this workflow');
  await composer.getByRole('button', { name: 'Attach files' }).click();
  await page.getByRole('menuitem', { name: 'Attach workflow scope' }).hover();
  await page.getByRole('menuitem', { name: 'My calculation', exact: true }).click();
  await expect(composer.getByText('Workflow: My calculation · Draft')).toBeVisible();
  await expect(composer.getByRole('textbox')).toHaveValue('Explain this workflow');
  expect(executions).toEqual([]);
  await composer.getByRole('button', { name: 'Remove workflow scope' }).click();
  await expect(composer.getByText('Workflow: My calculation · Draft')).toHaveCount(0);
});

test('direct Sources, Connections and workflow-history links use the Chat workspace shell', async ({
  page,
}) => {
  await mockWorkspaceReads(page);

  await page.goto('/sources');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText('Sinaxe', { exact: true })).toHaveCount(0);

  await page.goto('/connections');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Connections', exact: true })).toBeVisible({
    timeout: 30_000,
  });

  await page.goto('/workflows/runs');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
});
