import { test, expect } from './workflow-audit-isolation';

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
  await page.route('**/api/documents**', (route) => {
    if (route.request().method() !== 'GET') writes.push(route.request().method());
    return route.fulfill({
      json: { documents: [{ ...active, sourceRevision: 2 }, archived, deleted] },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources' }).click();
  const picker = page.getByRole('dialog', { name: 'Choose from Sources' });
  await expect(picker.getByRole('button', { name: archived.fileName })).toHaveCount(0);
  await picker.getByRole('button', { name: active.fileName, exact: true }).click();
  await expect(page.locator('.lc-console')).toContainText(
    'Source: active-policy.pdf · Saved in Sources',
  );
  await page.getByRole('button', { name: 'Remove document source' }).click();
  await expect(page.locator('.lc-console')).not.toContainText('active-policy.pdf');
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
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('The document repository is unavailable.')).toBeVisible({
    timeout: 30_000,
  });
});

test('chat chooses a saved source without uploading and freezes its records for workflow approval', async ({
  page,
}) => {
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
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  const picker = page.getByRole('dialog', { name: 'Choose from Sources' });
  await expect(picker.getByText('archived.json', { exact: true })).toHaveCount(0);
  await picker.getByRole('button', { name: source.fileName, exact: true }).click();
  await expect(page.getByText(/Source: reusable-records.json · 2 records/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Source: reusable-records.json · 2 records/)).toBeVisible();
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
      { workflowId: 'document-calculator', sourceMode: 'uploaded', recordsJson: '[]' },
      'Document Calculator',
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
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  await page.getByRole('button', { name: kept.fileName, exact: true }).click();
  await expect(page.getByText(/Source: kept-records.json/)).toBeVisible();
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  await page.getByRole('button', { name: source.fileName, exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Could not download the selected source' }),
  ).toBeVisible();
  await expect(page.getByText(/Source: unavailable.json/)).toHaveCount(0);
  await expect(page.getByText(/Source: kept-records.json/)).toBeVisible();
});
