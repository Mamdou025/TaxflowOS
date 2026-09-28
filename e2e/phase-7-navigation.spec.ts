import { test, expect } from './workflow-audit-isolation';
import type { Page } from '@playwright/test';
import { createRequire } from 'node:module';
import path from 'node:path';
import { syntheticContext, syntheticSession } from '../scripts/testing/browser-fixtures.mjs';

async function mockWorkspaceReads(page: Page) {
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
}

test('background access failures preserve Lab drafts and still enforce revoked access', async ({
  browser,
}) => {
  const context = await browser.newContext();
  // Unlike the shared fixture, seed only once so a real logout can remove the
  // workspace context without the next navigation putting it back.
  await context.addInitScript((value) => {
    if (!sessionStorage.getItem('access-recovery-seeded')) {
      sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value));
      sessionStorage.setItem('access-recovery-seeded', '1');
    }
  }, syntheticContext);
  const page = await context.newPage();
  try {
    await page.clock.install();
    await mockWorkspaceReads(page);
    let sessionStatus = 200;
    let workspaceStatus = 200;
    let workspaces = [syntheticContext.workspace];
    await page.route('**/api/session', (route) =>
      route.fulfill({
        status: sessionStatus,
        json: sessionStatus === 200 ? syntheticSession : { error: 'Synthetic access failure' },
      }),
    );
    await page.route('**/api/workspaces', (route) =>
      route.fulfill({
        status: workspaceStatus,
        json: { workspaces },
      }),
    );
    await page.goto('/agent-lab');
    const draft = page.getByPlaceholder('Message Sina…');
    await draft.fill('Preserve this draft across a temporary outage');
    for (const failingEndpoint of ['session', 'workspace']) {
      if (failingEndpoint === 'session') sessionStatus = 503;
      else workspaceStatus = 503;
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await expect(page.getByRole('heading', { name: 'Connection interrupted' })).toBeVisible();
      await expect(draft).toBeHidden();
      await expect(draft).toHaveValue('Preserve this draft across a temporary outage');
      await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toHaveCount(0);
      sessionStatus = 200;
      workspaceStatus = 200;
      await page.getByRole('button', { name: 'Retry access check', exact: true }).click();
      await expect(draft).toBeVisible();
      await expect(draft).toHaveValue('Preserve this draft across a temporary outage');
    }
    // The same failure also occurs without an upload, on the minute-long timer.
    sessionStatus = 503;
    await page.clock.fastForward(60000);
    await expect(page.getByRole('heading', { name: 'Connection interrupted' })).toBeVisible();
    sessionStatus = 200;
    await page.clock.fastForward(60000);
    await expect(draft).toBeVisible();
    await expect(draft).toHaveValue('Preserve this draft across a temporary outage');
    workspaces = [];
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible();
    await expect(draft).toHaveCount(0);
    sessionStatus = 401;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('agent lab Excel uploads preserve the workspace and unsent drafts', async ({ page }) => {
  await mockWorkspaceReads(page);
  const XLSX = createRequire(path.resolve('artifacts/ai-workflow-builder/package.json'))('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Account', 'Amount'],
      ['Synthetic revenue', 12345],
    ]),
    'Trial balance',
  );
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await page.goto('/');
  const chatDraft = page.locator('.lc-console').getByRole('textbox');
  await chatDraft.fill('Keep my main chat draft');
  await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await page.getByRole('menuitem', { name: 'Customize agent' }).click();
  await page.getByRole('button', { name: 'Lab', exact: true }).click();
  const labDraft = page.getByPlaceholder('Message Sina…');
  await labDraft.fill('Keep my lab draft');
  const origin = await page.evaluate(() => performance.timeOrigin);
  for (const name of ['first.xlsx', 'second.xlsx']) {
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: '+ Add files', exact: true }).click();
    await (
      await chooser
    ).setFiles({
      name,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer,
    });
    // Native file pickers return focus to the window; setInputFiles alone does not.
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    await expect(chatDraft).toHaveValue('Keep my main chat draft');
    await expect(labDraft).toHaveValue('Keep my lab draft');
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
  }
});

test('agent builder sends long instructions intact and preserves oversized drafts', async ({
  page,
}) => {
  await mockWorkspaceReads(page);
  const sent: { system: string; messages: { content: string }[] }[] = [];
  await page.route('**/api/agent-lab', async (route) => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({ json: { text: 'Instructions received intact.' } });
  });
  await page.goto('/agent-lab');
  const instructions = page.getByPlaceholder('Instructions for this section…').first();
  const longInstructions = 'Follow this detailed instruction. '.repeat(5000) + 'END_REQUIRED_RULES';
  await instructions.fill(longInstructions);
  const draft = page.getByPlaceholder('Message Sina…');
  await draft.fill('Use my detailed instructions');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Instructions received intact.', { exact: true })).toBeVisible();
  expect(sent).toHaveLength(1);
  expect(sent[0].system).toContain(longInstructions);
  expect(sent[0].messages.at(-1)?.content).toBe('Use my detailed instructions');

  const oversizedInstructions = '界'.repeat(1400000);
  await instructions.fill(oversizedInstructions);
  await draft.fill('Keep this unsent draft');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('exceeds 4 MiB');
  await expect(draft).toHaveValue('Keep this unsent draft');
  await expect(instructions).toHaveValue(oversizedInstructions);
  expect(sent).toHaveLength(1);
});

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
