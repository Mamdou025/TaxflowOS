import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const stored = (page: Page) => page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary())[0] as any; });
async function uploadPanel(page: Page) {
  page.setDefaultTimeout(20000);
  await page.goto('/w/pf-fapi');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
}

for (const format of ['xlsx', 'pdf', 'docx', 'tsv', 'json', 'txt']) {
  test(`demo upload ${format} preserves extracted records`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await uploadPanel(page);
    const start = Date.now();
    const input = page.getByLabel('Upload test document');
    if (['xlsx', 'pdf', 'docx'].includes(format)) {
      await input.setInputFiles(path.resolve(`e2e/fixtures/demo/sales-check.${format}`));
    } else {
      const content = format === 'tsv' ? 'label\tamount\tquantity\nWidget order one\t120\t3\nWidget order two\t80\t2\nConsulting service\t50\t1'
        : format === 'json' ? JSON.stringify([{label: 'Widget order one', amount: 120, quantity: 3}, {label: 'Widget order two', amount: 80, quantity: 2}, {label: 'Consulting service', amount: 50, quantity: 1}])
        : 'Widget order one 120\nWidget order two 80\nConsulting service 50';
      await input.setInputFiles({ name: `sales-check.${format}`, mimeType: 'application/octet-stream', buffer: Buffer.from(content) });
    }
    await expect(page.getByRole('button', { name: 'Use this test data', exact: true })).toBeVisible({ timeout: 30000 });
    const previewMs = Date.now() - start;
    await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
    const entry = await stored(page);
    const source = entry.draft.blocks.find((block: any) => block.id === 'fapi-source-trial-balance');
    expect(source.config.rows).toHaveLength(3);
    expect(JSON.stringify(source.config.rows)).toContain('Widget order one');
    expect(source.config.uploadTimestamp).toBeTruthy();
    const structured = ['xlsx', 'tsv', 'json'].includes(format);
    if (structured) expect(source.config.rows.map((row: any) => Number(row.amount))).toEqual([120, 80, 50]);
    else expect(source.config.rows.every((row: any) => row.amount === undefined)).toBe(true);
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await expect(page.getByRole('region', { name: 'Trigger readiness' })).toContainText('Met');
    expect(errors).toEqual([]);
    console.log(JSON.stringify({ format, previewMs, rows: source.config.rows.length, structuredNumbers: structured, errors }));
    await info.attach('upload-result', { contentType: 'application/json', body: JSON.stringify({ format, previewMs, rows: source.config.rows, structuredNumbers: structured, errors }, null, 2) });
  });
}

test('a failed replacement upload cannot apply a stale preview', async ({ page }) => {
  await uploadPanel(page);
  const input = page.getByLabel('Upload test document');
  await input.setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from('[{"label":"Old preview","amount":999}]') });
  await expect(page.getByRole('button', { name: 'Use this test data' })).toBeVisible();
  await input.setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.getByLabel('Upload test document')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Use this test data' })).toHaveCount(0);
});

test('custom columns can be mapped to classification and calculation fields', async ({ page }) => {
  await uploadPanel(page);
  await page.getByLabel('Upload test document').setInputFiles({ name: 'inventory.csv', mimeType: 'text/csv', buffer: Buffer.from('Product,Units,Rate\nWidget,12,2.5\nService,0,3') });
  await page.getByLabel('Text to classify').selectOption('Product');
  await page.getByLabel('Number to calculate').selectOption('Units');
  await page.getByRole('button', { name: 'Use this test data' }).click();
  const entry = await stored(page);
  const source = entry.draft.blocks.find((block: any) => block.id === 'fapi-source-trial-balance');
  expect(source.config.rows.map((row: any) => row.label)).toEqual(['Widget', 'Service']);
  expect(source.config.rows.map((row: any) => Number(row.amount))).toEqual([12, 0]);
  expect(source.config.rows.map((row: any) => Number(row.Rate))).toEqual([2.5, 3]);
});

test('empty and malformed documents show an error without replacing saved data', async ({ page }) => {
  await uploadPanel(page);
  const input = page.getByLabel('Upload test document');
  await input.setInputFiles({ name: 'good.json', mimeType: 'application/json', buffer: Buffer.from('[{"label":"Keep me","amount":12}]') });
  await page.getByRole('button', { name: 'Use this test data' }).click();
  const before = await stored(page);
  for (const [name, contents] of [['empty.csv', ''], ['empty.json', '[]'], ['scalar.json', '42'], ['broken.pdf', 'not a PDF']]) {
    await input.setInputFiles({ name, mimeType: 'application/octet-stream', buffer: Buffer.from(contents) });
    await expect(input).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Use this test data' })).toHaveCount(0);
    expect((await stored(page)).draft).toEqual(before.draft);
  }
});

for (const count of [100, 1000]) {
  test(`demo load ${count} rows saves a real run and stays responsive`, async ({ page }, info) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await uploadPanel(page);
    const csv = 'label,amount\n' + Array.from({ length: count }, (_, i) => `Interest income ${i + 1},1`).join('\n');
    let start = Date.now();
    await page.getByLabel('Upload test document').setInputFiles({ name: `load-${count}.csv`, mimeType: 'text/csv', buffer: Buffer.from(csv) });
    await page.getByRole('button', { name: 'Use this test data' }).click();
    const uploadMs = Date.now() - start;
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    start = Date.now();
    await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
    const persisted = await page.evaluate(async () => {
      const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary())[0];
      const run = entry.runs.at(-1)?.result.result;
      return { id: entry.id, runId: run?.runId, errors: run?.errors, total: run?.results.find(r => r.blockId === 'fapi-logic-category-rollup')?.output.categoryTotals, storedCharacters: localStorage.getItem('taxflow:workflow-library:v1')!.length };
    });
    const runMs = Date.now() - start;
    console.log(JSON.stringify({ count, uploadMs, runMs, ...persisted, browserErrors: errors }));
    await info.attach('load-measurements', { contentType: 'application/json', body: JSON.stringify({ count, uploadMs, runMs, ...persisted, browserErrors: errors }, null, 2) });
    expect(persisted.runId).toBeTruthy();
    expect(persisted.total.interestIncome).toBe(count);
    expect(persisted.errors).toEqual([]);
    expect(errors).toEqual([]);
    await page.goto(`/w/${persisted.id}`);
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await expect(page.getByRole('button', { name: 'Run saved version 1' })).toBeVisible();
    await page.getByRole('button', { name: 'Run saved version 1' }).click();
    const repeat = await page.evaluate(async () => {
      const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary())[0];
      return { runs: entry.runs.length, id: entry.runs.at(-1)?.result.result.runId, storedCharacters: localStorage.getItem('taxflow:workflow-library:v1')!.length };
    });
    console.log(JSON.stringify({ count, repeat }));
    expect(repeat.runs).toBe(2);
    expect(repeat.id).not.toBe(persisted.runId);
  });
}

test('live FX fetch pins a value, reports override precedence, and preserves it on failure', async ({ page }, info) => {
  test.setTimeout(120000);
  page.setDefaultTimeout(40000);
  await page.goto('/w/pf-fapi');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('button', { name: 'Fit view', exact: true }).click();
  await page.getByRole('button', { name: 'Bank of Canada FX Rate', exact: true }).click();
  const start = Date.now();
  const responsePromise = page.waitForResponse(response => response.url().includes('/api/fx-rate?'));
  await page.getByRole('button', { name: 'Fetch USD/CAD 2025', exact: true }).click();
  const response = await responsePromise;
  const data = await response.json();
  expect(data.ok, JSON.stringify(data)).toBe(true);
  expect(data.rate).toBeGreaterThan(0);
  await expect.poll(async () => (await stored(page))?.draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate')?.config.liveRate).toBe(data.rate);
  await expect(page.getByText(/takes precedence/)).toBeVisible();
  const fetchMs = Date.now() - start;
  await page.getByPlaceholder('none', { exact: true }).fill('');
  expect((await stored(page)).draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate').config.overrideRate).toBeNull();
  await page.getByRole('button', { name: 'Test block', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText('1.398');
  await page.getByRole('button', { name: 'Properties', exact: true }).click();
  await page.getByRole('button', { name: 'Create new source version from v1', exact: true }).click();
  await page.route('**/api/fx-rate?**', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, reason: 'Simulated API outage' }) }));
  await page.getByRole('button', { name: 'Fetch USD/CAD 2025', exact: true }).click();
  await expect(page.getByText('Simulated API outage', { exact: true })).toBeVisible();
  expect((await stored(page)).draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate').config.liveRate).toBe(data.rate);
  console.log(JSON.stringify({ liveFx: data.rate, observations: data.observationCount, fetchMs, failurePreservedPinnedValue: true }));
  await info.attach('live-api-result', { contentType: 'application/json', body: JSON.stringify({ ...data, fetchMs }, null, 2) });
});
