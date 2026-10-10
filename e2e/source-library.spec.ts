import { test, expect } from './workflow-audit-isolation';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Page } from '@playwright/test';

async function waitForChatUI(page: Page) {
  // Route load precedes the lazy authenticated workspace; wait for its usable shell.
  await page
    .getByRole('textbox', { name: 'Ask Scope, or describe a task…' })
    .waitFor({ state: 'visible' });
}

async function expandChatContext(page: Page) {
  const strip = page.locator('[data-chat-context]');
  if (!(await strip.isVisible()))
    await page.getByRole('button', { name: 'Open Scope', exact: true }).click();
  await expect(
    page.getByRole('region', { name: 'Scope for this chat', exact: true }),
  ).toBeVisible();
  return strip;
}
async function mockChatPersistence(page: Page) {
  const saved = new Map<string, { messages: { content: Record<string, unknown> }[] }>();
  await page.route('**/api/chat/threads**', (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const id = decodeURIComponent(pathname.split('/')[4] ?? '');
    if (route.request().method() === 'POST') {
      saved.set(id, route.request().postDataJSON());
      return route.fulfill({ json: { ok: true } });
    }
    return route.fulfill({ json: id ? (saved.get(id) ?? { messages: [] }) : { threads: [] } });
  });
  return saved;
}

test('chat home remains visible when animation frames are suspended', async ({ page }) => {
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
  });
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.goto('/');
  await waitForChatUI(page);
  const composer = page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
  await expect(composer).toBeVisible();
  await expect(page.getByText('What would you like to work on?', { exact: true })).toBeVisible();
  expect(
    await composer.evaluate((element) => {
      for (let node: Element | null = element; node; node = node.parentElement) {
        if (getComputedStyle(node).opacity === '0') return false;
      }
      return true;
    }),
  ).toBe(true);
  await page.reload();
  await waitForChatUI(page);
  await expect(composer).toBeVisible();
  await composer.fill('Ready to chat');
  await expect(composer).toHaveValue('Ready to chat');
});

test('chat spreadsheet selection preserves drafts on cancel and imports a complete mapped sheet', async ({
  page,
}) => {
  const XLSX = createRequire(path.resolve('artifacts/ai-workflow-builder/package.json'))('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([]), 'Hidden SAP metadata');
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([['Cover'], ['Instructions']]),
    'Summary',
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['G/L Account', 'Jrnl.Entry Item Text', 'Amount in CC Crcy'],
      ...Array.from({ length: 1100 }, (_, i) => [41000 + i, `Record ${i + 1}`, i + 1]),
    ]),
    'SAP EXPORT',
  );
  workbook.Workbook = { Sheets: [{ Hidden: 2 }, { Hidden: 0 }, { Hidden: 0 }] };
  await page.route('**/api/documents**', (route) =>
    route.fulfill({
      status: route.request().method() === 'POST' ? 503 : 200,
      json:
        route.request().method() === 'POST'
          ? { error: 'STORAGE_NOT_CONFIGURED' }
          : { documents: [] },
    }),
  );
  await page.route('**/api/copilotkit**', (route) =>
    route.fulfill({ status: 503, json: { error: 'No live model in this test.' } }),
  );
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.goto('/');
  await waitForChatUI(page);
  const composer = page.locator('.lc-console');
  const draft = composer.getByRole('textbox');
  await draft.fill('Use this workbook');
  await composer.getByRole('button', { name: 'Attach files', exact: true }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('menuitem', { name: 'Upload from laptop' }).click();
  await (
    await chooser
  ).setFiles({
    name: 'synthetic-sap.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
  });
  await draft.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Choose spreadsheet data' });
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Worksheet').locator('option')).toHaveText([
    'Choose a worksheet…',
    'Summary',
    'SAP EXPORT',
  ]);
  await dialog.getByRole('button', { name: 'Cancel import' }).click();
  await expect(draft).toHaveValue('Use this workbook');
  await expect(composer.getByText('synthetic-sap.xlsx', { exact: true })).toBeVisible();
  await draft.press('Enter');
  await dialog.getByLabel('Worksheet').selectOption('SAP EXPORT');
  await expect(dialog.getByRole('combobox', { name: 'Account column', exact: true })).toHaveValue(
    'G/L Account',
  );
  await expect(dialog.getByRole('combobox', { name: 'Amount column', exact: true })).toHaveValue(
    'Amount in CC Crcy',
  );
  await dialog
    .getByRole('combobox', { name: 'Account column', exact: true })
    .selectOption('G/L Account');
  await dialog
    .getByRole('combobox', { name: 'Description column', exact: true })
    .selectOption('Jrnl.Entry Item Text');
  await dialog
    .getByRole('combobox', { name: 'Amount column', exact: true })
    .selectOption('Amount in CC Crcy');
  await dialog.getByLabel('Source currency').fill('EUR');
  await dialog.getByRole('button', { name: 'Use selected data' }).click();
  await expandChatContext(page);
  await expect(page.getByRole('status').filter({ hasText: 'synthetic-sap.xlsx' })).toContainText(
    '1100 records',
  );
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const context = JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!);
        const key = `taxflow:scope:${encodeURIComponent(context.userId)}:${context.workspace.id}:taxflow:uploaded-source-rows`;
        const source = JSON.parse(localStorage.getItem(key) ?? '{}').__unassigned__;
        return source ? { count: source.rows.length, last: source.rows.at(-1).amount } : null;
      }),
    )
    .toEqual({ count: 1100, last: 1100 });
});

const active = {
  id: '00000000-0000-4000-8000-000000000101',
  fileName: 'active-policy.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 2048,
  status: 'ready',
  extractedChars: 1200,
  error: null,
  inLibrary: true,
  lifecycleStatus: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const archived = {
  ...active,
  id: '00000000-0000-4000-8000-000000000102',
  fileName: 'archived-policy.pdf',
  inLibrary: false,
  lifecycleStatus: 'archived',
};

const deleted = {
  ...active,
  id: '00000000-0000-4000-8000-000000000103',
  fileName: 'deleted-policy.pdf',
  inLibrary: false,
  lifecycleStatus: 'deleted',
};

test('chat can select a saved document for retrieval without changing its library membership', async ({
  page,
}) => {
  const writes: string[] = [];
  const selected = { ...active, sourceRevision: 2 };
  await mockChatPersistence(page);
  await page.route('**/api/documents**', (route) => {
    if (route.request().method() !== 'GET') writes.push(route.request().method());
    return route.fulfill({
      json: new URL(route.request().url()).pathname.endsWith(`/${active.id}`)
        ? { document: selected, downloadUrl: '/api/synthetic-policy-file' }
        : { documents: [selected, archived, deleted] },
    });
  });
  // Original bytes travel through the download+extraction boundary; extraction is
  // synthetic here so the test never calls a document service or live provider.
  await page.route('**/api/synthetic-policy-file', (route) =>
    route.fulfill({
      contentType: 'application/pdf',
      body: '%PDF-1.4\nSynthetic selected policy fixture\n%%EOF',
    }),
  );
  await page.route('**/api/assistant/extract', (route) =>
    route.fulfill({
      json: {
        kind: 'pdf',
        text: 'Synthetic policy evidence for this selected source.',
        pages: 1,
        truncated: false,
      },
    }),
  );
  await page.goto('/');
  await waitForChatUI(page);
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources' }).click();
  const picker = page.getByRole('dialog', { name: 'Choose from Sources' });
  await expect(picker.getByRole('button', { name: archived.fileName })).toHaveCount(0);
  await picker.getByRole('button', { name: active.fileName, exact: true }).click();
  const context = await expandChatContext(page);
  const selectedCard = context.locator(`[data-context-source="${active.id}"]`);
  await expect(selectedCard).toContainText(active.fileName);
  await expect(selectedCard).toContainText('Saved source · revision 2');
  await expect(selectedCard).toContainText('Ready');
  await context.getByRole('button', { name: `Remove ${active.fileName} from this chat` }).click();
  await expect(context).not.toContainText(active.fileName);
  expect(writes).toEqual([]);
});

test('Owners can recover soft-deleted sources and see permanent purge as a distinct action', async ({
  page,
}) => {
  test.setTimeout(90_000);
  // Lifecycle mutations belong to this test; later tests reuse the base fixtures.
  const documents = [active, archived, deleted].map((document) => ({ ...document }));
  const actions: Array<{ id: string; action: string }> = [];
  await page.route('**/api/documents**', async (route) => {
    const request = route.request();
    if (request.method() === 'GET') {
      await route.fulfill({ json: { documents } });
      return;
    }
    const match = new URL(request.url()).pathname.match(/\/documents\/([^/]+)\/lifecycle$/);
    if (request.method() === 'POST' && match) {
      const body = request.postDataJSON() as { action: string };
      actions.push({ id: match[1], action: body.action });
      const document = documents.find((item) => item.id === match[1]);
      if (document) document.lifecycleStatus = body.action === 'restore' ? 'active' : 'deleted';
      await route.fulfill({ json: { document } });
      return;
    }
    await route.fulfill({ status: 404, json: { error: 'Unexpected synthetic request.' } });
  });

  await page.goto('/documents');

  await waitForChatUI(page);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('New chat', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Library', exact: true })).toHaveCount(0);
  await expect(page.getByText('Sinaxe', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Sources' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByLabel('Permanently purge deleted-policy.pdf')).toBeVisible();

  await page.getByLabel('Move active-policy.pdf to recovery').click();
  await expect.poll(() => actions).toContainEqual({ id: active.id, action: 'delete' });
  await expect(page.getByLabel('Restore active-policy.pdf')).toBeVisible();

  await page.getByLabel('Restore archived-policy.pdf').click();
  await expect.poll(() => actions).toContainEqual({ id: archived.id, action: 'restore' });
  await expect(page.getByLabel('Archive archived-policy.pdf')).toBeVisible();
});

test('source repository failures are visible instead of looking like an empty library', async ({
  page,
}) => {
  await page.route('**/api/documents**', (route) =>
    route.fulfill({ status: 503, json: { error: 'Repository unavailable.' } }),
  );
  await page.goto('/documents');
  await waitForChatUI(page);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('The document repository is unavailable.')).toBeVisible({
    timeout: 30_000,
  });
});

test('chat chooses a saved source without uploading and freezes its records for workflow approval', async ({
  page,
}) => {
  const savedChats = await mockChatPersistence(page);
  const source = {
    ...active,
    id: 'saved-records',
    fileName: 'reusable-records.json',
    mimeType: 'application/json',
    sourceRevision: 3,
    contentHash: 'sha256:extracted-text-hash',
  };
  const records = [
    { label: 'Item one', amount: 120 },
    { label: 'Item two', amount: 80 },
  ];
  const writes: string[] = [];
  await page.route('**/api/documents**', async (route) => {
    if (route.request().method() !== 'GET') writes.push(route.request().method());
    const path = new URL(route.request().url()).pathname;
    await route.fulfill({
      json: path.endsWith('/saved-records')
        ? { document: source, downloadUrl: '/api/synthetic-source-file' }
        : {
            documents: [
              source,
              {
                ...source,
                id: 'archived-records',
                fileName: 'archived.json',
                lifecycleStatus: 'archived',
              },
            ],
          },
    });
  });
  await page.route('**/api/synthetic-source-file', (route) => route.fulfill({ json: records }));
  await page.route('**/api/agent-actions/operations/authorize', (route) =>
    route.fulfill({ json: { allowed: false, message: 'Review this run.' } }),
  );
  await page.goto('/');
  await waitForChatUI(page);
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  const picker = page.getByRole('dialog', { name: 'Choose from Sources' });
  await expect(picker.getByText('archived.json', { exact: true })).toHaveCount(0);
  await picker.getByRole('button', { name: source.fileName, exact: true }).click();
  let context = await expandChatContext(page);
  await expect(context.locator('[data-context-source="saved-records"]')).toContainText('Ready');
  await expect(context).toContainText('2 records');
  await expect
    .poll(() =>
      [...savedChats.values()].some((chat) =>
        chat.messages.some((message) =>
          (JSON.stringify(message.content.chatContext) ?? '').includes('saved-records'),
        ),
      ),
    )
    .toBe(true);
  await page.reload();
  await waitForChatUI(page);
  context = await expandChatContext(page);
  await expect(context.locator('[data-context-source="saved-records"]')).toContainText('Ready');
  await expect(context).toContainText('2 records');
  const review = await page.evaluate(async () => {
    const { createStore } = await import('/@id/jotai');
    const { workspaceStorage } = await import('/src/platform/auth/workspace-context.ts');
    const { uploadedRowsAtom } = await import('/src/shared/stores/workspace-store.ts');
    const { requestAgentWorkflowRun, isAgentRunReviewResult } =
      await import('/src/features/assistant/ui/agent-run-review.tsx');
    const store = createStore();
    const sources = JSON.parse(workspaceStorage.getItem('taxflow:uploaded-source-rows')!);
    store.set(uploadedRowsAtom, sources);
    const result = await requestAgentWorkflowRun(
      store,
      { workflowId: 'fapi', sourceMode: 'uploaded', recordsJson: '[]' },
      'FAPI',
    );
    if (!isAgentRunReviewResult(result)) throw new Error('Expected workflow approval.');
    sources.__unassigned__.rows[0].amount = 9999;
    store.set(uploadedRowsAtom, sources);
    return result;
  });
  expect(review.sourceName).toBe(source.fileName);
  const frozen = JSON.parse(review.args.recordsJson!);
  expect(frozen.map((row: { amount: number }) => row.amount)).toEqual([120, 80]);
  expect(frozen[0].sourceDocumentId).toBe(source.id);
  expect(frozen[0].sourceRevision).toBe(3);
  expect(frozen[0].sourceFileHash).toMatch(/^sha256:[a-f0-9]{64}$/);
  expect(writes).toEqual([]);
});

test('a failed saved-source download is visible and preserves the current selection', async ({
  page,
}) => {
  await mockChatPersistence(page);
  const source = {
    ...active,
    id: 'failed-download',
    fileName: 'unavailable.json',
    mimeType: 'application/json',
    sourceRevision: 1,
  };
  const kept = { ...source, id: 'kept-source', fileName: 'kept-records.json' };
  await page.route('**/api/documents**', (route) =>
    route.fulfill({
      json: new URL(route.request().url()).pathname.endsWith('/failed-download')
        ? { document: source, downloadUrl: '/api/unavailable-file' }
        : new URL(route.request().url()).pathname.endsWith('/kept-source')
          ? { document: kept, downloadUrl: '/api/kept-file' }
          : { documents: [source, kept] },
    }),
  );
  await page.route('**/api/unavailable-file', (route) => route.fulfill({ status: 503 }));
  await page.route('**/api/kept-file', (route) =>
    route.fulfill({ json: [{ label: 'Item', amount: 12 }] }),
  );
  await page.goto('/');
  await waitForChatUI(page);
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  await page.getByRole('button', { name: kept.fileName, exact: true }).click();
  const context = await expandChatContext(page);
  await expect(context.locator('[data-context-source="kept-source"]')).toContainText(
    'kept-records.json',
  );
  await context.getByRole('button', { name: 'Close Scope', exact: true }).click();
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  await page.getByRole('button', { name: source.fileName, exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Could not download the selected source' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expandChatContext(page);
  await expect(context.locator('[data-context-source="failed-download"]')).toHaveCount(0);
  await expect(context.locator('[data-context-source="kept-source"]')).toContainText(
    'kept-records.json',
  );
  await expect(context.locator('[data-context-source="kept-source"]')).toContainText('Ready');
});
