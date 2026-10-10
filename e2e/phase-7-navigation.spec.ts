import { test, expect } from './workflow-audit-isolation';
import type { Browser, Page } from '@playwright/test';
import { createRequire } from 'node:module';
import path from 'node:path';
import { syntheticContext, syntheticSession } from '../scripts/testing/browser-fixtures.mjs';

async function mockWorkspaceReads(page: Page) {
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
}

function accessResponseGate() {
  let release!: (response: { status: number; json: unknown }) => void;
  const response = new Promise<{ status: number; json: unknown }>((resolve) => {
    release = resolve;
  });
  return { response, release };
}

async function startupAccessFixture(browser: Browser, cachedWorkspace = true) {
  const context = await browser.newContext();
  if (cachedWorkspace) {
    await context.addInitScript(
      (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
      syntheticContext,
    );
  }
  const page = await context.newPage();
  const session = accessResponseGate();
  const memberships = accessResponseGate();
  const requests: string[] = [];
  await page.route('**/api/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    requests.push(pathname);
    if (pathname === '/api/session') return route.fulfill(await session.response);
    if (pathname === '/api/workspaces') return route.fulfill(await memberships.response);
    if (pathname === '/api/workflow-library') {
      return route.fulfill({
        json:
          route.request().method() === 'GET'
            ? { revision: 0, payload: null }
            : { revision: (route.request().postDataJSON()?.revision ?? 0) + 1 },
      });
    }
    if (pathname === '/api/chat/threads') return route.fulfill({ json: { threads: [] } });
    if (pathname.startsWith('/api/copilotkit')) {
      return route.fulfill({
        json: {
          version: '1.63.2',
          mode: 'sse',
          agents: {
            default: {
              name: 'default',
              description: 'Synthetic startup',
              className: 'FixtureAgent',
            },
          },
          audioFileTranscriptionEnabled: false,
          suggestions: false,
          telemetryDisabled: true,
          threadEndpoints: {
            list: false,
            inspect: false,
            mutations: false,
            realtimeMetadata: false,
          },
        },
      });
    }
    if (pathname === '/api/documents') return route.fulfill({ json: { documents: [] } });
    if (pathname === '/api/integrations') return route.fulfill({ json: [] });
    return route.fulfill({ status: 503, json: { error: 'Synthetic startup test: unavailable' } });
  });
  return {
    context,
    page,
    session,
    memberships,
    requests,
    protectedRequests: () =>
      requests.filter((pathname) => !['/api/session', '/api/workspaces'].includes(pathname)),
  };
}

test('startup shell remains public until session and current workspace membership both resolve', async ({
  browser,
}) => {
  const fixture = await startupAccessFixture(browser);
  const { context, page, session, memberships, requests, protectedRequests } = fixture;
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const shell = page.getByRole('region', { name: 'Workspace startup', exact: true });
    await expect(
      shell.getByRole('heading', { name: 'What would you like to work on?', exact: true }),
    ).toBeVisible();
    await expect(shell.getByRole('textbox', { name: 'Message', exact: true })).toBeDisabled();
    await expect(shell.getByRole('status')).toHaveText('Connecting to your workspace…');
    const nav = shell.getByRole('navigation', { name: 'Workspace', exact: true });
    for (const name of ['Chat', 'Workflows', 'Sources', 'Connections']) {
      await expect(nav.getByRole('button', { name, exact: true })).toBeDisabled();
    }
    await expect(page.locator('.lc-console')).toHaveCount(0);
    await expect(page.getByText('Synthetic workspace', { exact: false })).toHaveCount(0);
    await expect.poll(() => requests.includes('/api/session')).toBe(true);
    expect(requests).not.toContain('/api/workspaces');
    expect(protectedRequests()).toEqual([]);

    session.release({ status: 200, json: syntheticSession });
    await expect.poll(() => requests.includes('/api/workspaces')).toBe(true);
    await expect(shell).toBeVisible();
    await expect(shell.getByRole('textbox', { name: 'Message', exact: true })).toBeDisabled();
    await expect(page.locator('.lc-console')).toHaveCount(0);
    expect(protectedRequests()).toEqual([]);
    const originalViewport = page.viewportSize();
    await page.screenshot({ path: test.info().outputPath('workspace-startup-desktop.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      shell.getByRole('heading', { name: 'What would you like to work on?', exact: true }),
    ).toBeVisible();
    await page.screenshot({ path: test.info().outputPath('workspace-startup-mobile.png') });
    if (originalViewport) await page.setViewportSize(originalViewport);
    expect(protectedRequests()).toEqual([]);

    memberships.release({ status: 200, json: { workspaces: [syntheticContext.workspace] } });
    // The public shell also covers the deferred workspace module after access succeeds.
    await expect(page.locator('.lc-console').getByRole('textbox')).toBeEditable({ timeout: 60000 });
    await expect(shell).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Chat', exact: true })).toBeEnabled();
    await expect.poll(() => protectedRequests().includes('/api/workflow-library')).toBe(true);
    expect(requests).not.toContain('/api/auth/sign-in/anonymous');
    expect(requests).not.toContain('/api/workspaces/demo');
  } finally {
    session.release({ status: 401, json: {} });
    memberships.release({ status: 403, json: {} });
    await context.close();
  }
});

test('signed-out startup reaches Try demo without provisioning a guest automatically', async ({
  browser,
}) => {
  const { context, page, session, memberships, requests, protectedRequests } =
    await startupAccessFixture(browser, false);
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const shell = page.getByRole('region', { name: 'Workspace startup', exact: true });
    await expect(shell).toBeVisible();
    expect(protectedRequests()).toEqual([]);
    session.release({ status: 401, json: {} });
    await expect(
      page.getByRole('heading', { name: 'Sign in to TaxflowOS', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeEnabled();
    await expect(shell).toHaveCount(0);
    await expect(page.locator('.lc-console')).toHaveCount(0);
    expect(requests).not.toContain('/api/workspaces');
    expect(protectedRequests()).toEqual([]);
    expect(
      await page.evaluate(() => sessionStorage.getItem('taxflow:authenticated-workspace')),
    ).toBeNull();
  } finally {
    session.release({ status: 401, json: {} });
    memberships.release({ status: 403, json: {} });
    await context.close();
  }
});

for (const scenario of ['session unavailable', 'workspace denied', 'membership removed'] as const) {
  test(`${scenario} during startup never mounts the cached protected workspace`, async ({
    browser,
  }) => {
    const { context, page, session, memberships, protectedRequests } =
      await startupAccessFixture(browser);
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const shell = page.getByRole('region', { name: 'Workspace startup', exact: true });
      await expect(shell).toBeVisible();
      expect(protectedRequests()).toEqual([]);
      session.release({
        status: scenario === 'session unavailable' ? 503 : 200,
        json: syntheticSession,
      });
      memberships.release({
        status: scenario === 'workspace denied' ? 403 : 200,
        json: { workspaces: [] },
      });
      if (scenario === 'membership removed') {
        await expect(page.getByText('Choose a workspace', { exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toHaveCount(0);
      } else {
        await expect(page.getByRole('alert')).toContainText(
          scenario === 'session unavailable'
            ? 'temporarily unavailable'
            : 'Workspace access could not be verified',
        );
        await expect(
          page.getByRole('button', { name: 'Retry access check', exact: true }),
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeEnabled();
      }
      await expect(shell).toHaveCount(0);
      await expect(page.locator('.lc-console')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'New chat', exact: true })).toHaveCount(0);
      expect(protectedRequests()).toEqual([]);
    } finally {
      session.release({ status: 401, json: {} });
      memberships.release({ status: 403, json: {} });
      await context.close();
    }
  });
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
    // Revocation intentionally reloads the page to clear workspace-scoped stores.
    // Wait for that navigation before checking the resulting signed-out screen.
    await Promise.all([
      page.waitForEvent('load'),
      page.evaluate(() => window.dispatchEvent(new Event('focus'))),
    ]);
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
}, testInfo) => {
  await mockWorkspaceReads(page);
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/');

  const sidebar = page.locator('#workspace-sidebar');
  const draft = page.locator('.lc-console').getByRole('textbox');
  await draft.fill('Keep this conversation while I browse workflows');
  for (const label of ['Chat', 'Workflows', 'Sources', 'Connections']) {
    await expect(sidebar.getByRole('button', { name: label, exact: true })).toBeVisible();
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

  await sidebar.getByRole('button', { name: 'Workflows', exact: true }).click();
  const workflows = page.getByRole('region', { name: 'Workflows page', exact: true });
  const navigation = workflows.getByRole('navigation', {
    name: 'Workflow navigation',
    exact: true,
  });
  await expect(navigation).toBeVisible();
  for (const label of ['Library', 'Run history', 'New workflow', 'FAPI Calculation']) {
    await expect(navigation.getByRole('button', { name: label, exact: true })).toHaveCount(1);
    await expect(sidebar.getByRole('button', { name: label, exact: true })).toHaveCount(0);
  }
  await expect(navigation.getByRole('region', { name: 'Templates', exact: true })).toBeVisible();
  await expect(
    navigation.getByRole('region', { name: 'Saved workflows', exact: true }),
  ).toBeVisible();
  await expect(navigation.getByLabel('Workflow storage status')).toBeVisible();
  await expect(sidebar.getByLabel('Workflow storage status')).toHaveCount(0);
  await expect(sidebar.getByLabel('Import workflow backup')).toHaveCount(0);
  await expect(
    sidebar.getByRole('button', { name: 'Export workflow backup', exact: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('workflows-page-desktop.png') });
  const readLibrary = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return readWorkflowLibrary();
    });
  const before = await readLibrary();
  await navigation.getByRole('button', { name: 'FAPI Calculation', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toBeVisible();
  await navigation.getByRole('button', { name: 'Library', exact: true }).click();
  await expect(workflows.getByText('Workflow library', { exact: true })).toBeVisible();
  await navigation.getByRole('button', { name: 'Run history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByLabel('Workflow execution lifetime')).toContainText(
    'continue on the server if this tab closes.',
  );
  await expect(page.getByText('No workflow runs yet.', { exact: false })).toBeVisible();
  expect(await readLibrary()).toEqual(before);
  await expect(draft).toHaveValue('Keep this conversation while I browse workflows');

  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole('button', { name: 'Open Scope', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Context:/ })).toHaveCount(0);

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
  await sidebar.getByRole('button', { name: 'Chat', exact: true }).click();
  await expect(draft).toHaveValue('Keep this conversation while I browse workflows');
  expect(await readLibrary()).toEqual(before);
});

test('Workflows page navigation stays usable on narrow screens and preserves the mounted editor', async ({
  page,
}, testInfo) => {
  await mockWorkspaceReads(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const draft = page.locator('.lc-console').getByRole('textbox');
  await draft.fill('Keep my draft while I arrange the workflow view');
  const sidebar = page.locator('#workspace-sidebar');
  await sidebar.getByRole('button', { name: 'Workflows', exact: true }).click();
  const workflows = page.getByRole('region', { name: 'Workflows page', exact: true });
  const navigation = workflows.getByRole('navigation', {
    name: 'Workflow navigation',
    exact: true,
  });
  const template = navigation.getByRole('button', { name: 'FAPI Calculation', exact: true });
  await template.click();
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  const canvas = workflows.locator('.react-flow');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const mountedCanvas = await canvas.elementHandle();
  if (!mountedCanvas) throw new Error('The selected workflow editor did not mount.');
  const readLibrary = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return readWorkflowLibrary();
    });
  const before = await readLibrary();
  const entries = Object.values(before);
  expect(entries).toHaveLength(1);
  const savedName = entries[0].draft.name;
  await expect(
    navigation.getByRole('region', { name: 'Saved workflows', exact: true }),
  ).toBeVisible();
  await expect(navigation.getByRole('button', { name: savedName, exact: true })).toHaveCount(1);
  await expect(sidebar.getByRole('button', { name: savedName, exact: true })).toHaveCount(0);

  const hideList = navigation.getByRole('button', { name: 'Hide workflow list', exact: true });
  await expect(hideList).toHaveAttribute('aria-expanded', 'true');
  await hideList.click();
  const showList = navigation.getByRole('button', { name: 'Show workflow list', exact: true });
  await expect(showList).toHaveAttribute('aria-expanded', 'false');
  await expect(template).toBeHidden();
  await expect(canvas).toBeVisible();
  expect(await mountedCanvas.evaluate((node) => node.isConnected)).toBe(true);
  const toggleBounds = await showList.boundingBox();
  if (!toggleBounds) throw new Error('The workflow list restore control is not visible.');
  expect(toggleBounds.x).toBeGreaterThanOrEqual(0);
  expect(toggleBounds.x + toggleBounds.width).toBeLessThanOrEqual(390);
  expect(toggleBounds.y).toBeGreaterThanOrEqual(0);
  expect(toggleBounds.y + toggleBounds.height).toBeLessThanOrEqual(844);
  await page.screenshot({ path: testInfo.outputPath('workflows-page-mobile-list-hidden.png') });

  await showList.click();
  await expect(hideList).toHaveAttribute('aria-expanded', 'true');
  await expect(template).toBeVisible();
  expect(await mountedCanvas.evaluate((node) => node.isConnected)).toBe(true);
  const listBounds = await navigation.boundingBox();
  const canvasBounds = await canvas.boundingBox();
  if (!listBounds || !canvasBounds)
    throw new Error('The workflow list and editor must both be visible.');
  expect(listBounds.y + listBounds.height).toBeLessThanOrEqual(canvasBounds.y + 1);
  expect(canvasBounds.height).toBeGreaterThan(100);
  expect(await workflows.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  expect(await readLibrary()).toEqual(before);
  await page.screenshot({ path: testInfo.outputPath('workflows-page-mobile.png') });

  await page.getByTitle('Open chat', { exact: true }).click();
  await expect(draft).toHaveValue('Keep my draft while I arrange the workflow view');
  await expect(canvas).toBeHidden();
  expect(await mountedCanvas.evaluate((node) => node.isConnected)).toBe(true);
  await page.getByRole('button', { name: 'Return to page', exact: true }).click();
  await expect(canvas).toBeVisible();
  expect(await mountedCanvas.evaluate((node) => node.isConnected)).toBe(true);
  expect(await readLibrary()).toEqual(before);

  await template.click();
  await expect(template).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toBeVisible();
  expect(await readLibrary()).toEqual(before);
  await sidebar.getByRole('button', { name: 'Chat', exact: true }).click();
  await expect(draft).toHaveValue('Keep my draft while I arrange the workflow view');
});

test('attaching workflow scope preserves the draft and does not execute it', async ({ page }) => {
  await mockWorkspaceReads(page);
  await page.goto('/');
  const payload = await page.evaluate(async () => {
    const { DOCUMENT_CALCULATOR_CONFIG } =
      await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
    const draft = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
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
  await page.getByRole('button', { name: 'Open Scope', exact: true }).click();
  const scope = page.getByRole('region', { name: 'Scope for this chat', exact: true });
  await expect(scope).toContainText('My calculation');
  await expect(scope).toContainText('Draft');
  await expect(composer.getByRole('textbox')).toHaveValue('Explain this workflow');
  expect(executions).toEqual([]);
  await scope.getByRole('button', { name: 'Remove workflow scope' }).click();
  await expect(scope.getByRole('button', { name: 'Remove workflow scope' })).toHaveCount(0);
  await expect(
    scope.getByRole('region', { name: 'Workflow scope', exact: true }),
  ).not.toContainText('My calculation');
  await scope.getByRole('textbox', { name: 'Company name' }).focus();
  await page.keyboard.press('Escape');
  await expect(scope).toBeHidden();
  await expect(composer.getByRole('textbox')).toHaveValue('Explain this workflow');
});

test('direct Sources, Connections and workflow-history links use the Chat workspace shell', async ({
  page,
}) => {
  await mockWorkspaceReads(page);

  await page.goto('/sources');
  // These redirects are owned by the deferred workspace, not the public shell.
  await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Sinaxe', { exact: true })).toHaveCount(0);

  await page.goto('/connections');
  await expect(page.getByRole('heading', { name: 'Connections', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/workflows/runs');
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page).toHaveURL(/\/$/);
});

test('FAPI discovery has one workflow choice and retains historical page links', async ({
  page,
}) => {
  await mockWorkspaceReads(page);
  await page.goto('/');
  const catalogue = await page.evaluate(async () => {
    const { searchWorkspace } =
      await import('/src/features/assistant/ui/workflow-composer-search.ts');
    const { buildAgentCatalog, getPage } = await import('/src/shared/stores/resource-registry.tsx');
    const { WORKSHEETS } = await import('/src/components/worksheet-shell.tsx');
    return {
      hits: searchWorkspace('fapi').map(({ kind, id }) => ({ kind, id })),
      pageKeys: buildAgentCatalog().pages.map(({ key }) => key),
      legacyPage: getPage('fapi')?.key,
      worksheetLinks: WORKSHEETS.map(({ href }) => href),
    };
  });
  expect(catalogue.hits).toEqual([{ kind: 'workflow', id: 'fapi' }]);
  expect(catalogue.pageKeys).not.toContain('fapi');
  expect(catalogue.legacyPage).toBe('fapi');
  expect(catalogue.worksheetLinks).toEqual(['/t1134', '/surplus']);

  await page.getByRole('button', { name: 'Add — search, workflows, worksheets' }).click();
  await page.getByRole('button', { name: 'Workflows Start a workflow run', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Calculate FAPI', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Worksheets Open a worksheet', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open FAPI worksheet', exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Open T1134 worksheet', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open Surplus worksheet', exact: true }),
  ).toBeVisible();
  // A real outside click dismisses the menu before the composer can receive input.
  const composer = page.locator('.lc-console').getByRole('textbox');
  const inputBounds = await composer.boundingBox();
  if (!inputBounds) throw new Error('The composer is not visible.');
  await page.mouse.click(inputBounds.x + 8, inputBounds.y + 8);
  await expect(
    page.getByRole('button', { name: 'Worksheets Open a worksheet', exact: true }),
  ).toHaveCount(0);
  await composer.fill('@FAPI');
  await expect(
    page.getByRole('button', { name: /Calculate FAPI Foreign accrual property income workflow/ }),
  ).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: /Show FAPI|Run the FAPI workflow|Open FAPI worksheet/ }),
  ).toHaveCount(0);
});

test('worksheet compatibility links open canonical workflow controls without running examples', async ({
  page,
}) => {
  await mockWorkspaceReads(page);
  // Old chat Work items must still resolve the retired FAPI page entry point.
  await page.addInitScript((context) => {
    const key = `taxflow:scope:${encodeURIComponent(context.userId)}:${context.workspace.id}:taxflow:work-items`;
    localStorage.setItem(
      key,
      JSON.stringify({
        'worksheet:fapi': {
          id: 'worksheet:fapi',
          type: 'worksheet',
          title: 'Historical FAPI worksheet',
          status: 'open',
          createdAt: 1,
          updatedAt: 1,
          open: { kind: 'page', pageKey: 'fapi' },
        },
      }),
    );
  }, syntheticContext);
  const executions: string[] = [];
  const modelCalls: string[] = [];
  const loadedModules: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && /workflow-runs|\/execute/.test(request.url()))
      executions.push(request.url());
    if (request.resourceType() === 'script') loadedModules.push(new URL(request.url()).pathname);
  });
  // Runtime discovery may occur on mount, but navigating a worksheet must never
  // generate a model response. Intercept every request so no provider is called.
  await page.route('**/api/copilotkit**', (route) => {
    const request = route.request();
    let metadataRequest = false;
    try {
      // CopilotKit also uses POST /api/copilotkit { method: 'info' } for discovery.
      metadataRequest = request.postDataJSON()?.method === 'info';
    } catch {
      // A body outside that explicit discovery shape is still counted below.
    }
    if (
      request.method() !== 'GET' &&
      !new URL(request.url()).pathname.endsWith('/info') &&
      !metadataRequest
    )
      modelCalls.push(request.url());
    // Use the isolated tests' unavailable runtime response for discovery too;
    // an empty successful agent list would unregister CopilotKit's default agent.
    return route.fulfill({ status: 503, json: { error: 'Models are disabled in this test.' } });
  });
  await page.goto('/');
  const draft = page.locator('.lc-console').getByRole('textbox');
  await draft.fill('Keep this draft while opening workpapers');

  for (const [command, template] of [
    ['Historical FAPI worksheet', 'FAPI Calculation'],
    ['Open T1134 worksheet', 'T1134 Affiliate Reporting Workpaper'],
    ['Open Surplus worksheet', 'Foreign Affiliate Surplus Continuity Workpaper'],
  ]) {
    if (command === 'Historical FAPI worksheet') {
      // With no sent messages, home exposes saved work through its Continue card.
      await page.getByRole('button', { name: /Continue Historical FAPI worksheet/ }).click();
    } else {
      await page.getByRole('button', { name: 'Add — search, workflows, worksheets' }).click();
      await page.getByRole('button', { name: 'Worksheets Open a worksheet', exact: true }).click();
      await expect(
        page.getByRole('button', { name: 'Open FAPI worksheet', exact: true }),
      ).toHaveCount(0);
      await page.getByRole('button', { name: command, exact: true }).click();
    }

    await expect(page.locator('.lc-tab[data-active="true"]')).toContainText('Workflows');
    await expect(
      page.locator('.cwp-page-in').getByText(template, { exact: true }).first(),
    ).toBeVisible();
    for (const label of ['Overview', 'Build', 'Run', 'Results'])
      await expect(page.getByRole('button', { name: label, exact: true }).first()).toBeVisible();
    await expect(page.getByRole('region', { name: 'Workflow execution' })).toHaveCount(0);
    await expect(page.getByText('sample trial balance', { exact: false })).toHaveCount(0);
    await expect(draft).toHaveValue('Keep this draft while opening workpapers');

    await page.getByRole('button', { name: 'Results', exact: true }).first().click();
    await expect(
      page.getByText(
        'No results yet. Run the workflow to see what each block receives and produces.',
      ),
    ).toBeVisible();
    // Check browser-owned execution too: absence of an HTTP execute request alone
    // would not prove that a guided session or local calculation did not start.
    expect(
      await page.evaluate(async () => {
        const { readWorkflowLibrary } =
          await import('/src/features/workflows-hub/workflow-library.ts');
        return Object.keys(readWorkflowLibrary());
      }),
    ).toEqual([]);
  }
  expect(executions).toEqual([]);
  expect(modelCalls).toEqual([]);
  expect(
    loadedModules.some((url) => /fapi-worksheet|T1134Worksheet|SurplusWorksheet/.test(url)),
  ).toBe(false);
});
