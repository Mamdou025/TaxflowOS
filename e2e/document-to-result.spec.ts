import { test, expect } from '@playwright/test';

test('uploaded CSV to new keyword rule, rollup, calculation and saved final output', async ({ page }, testInfo) => {
  test.setTimeout(180000);
  page.setDefaultTimeout(20000);
  const timings: Record<string, number> = {};
  const browserErrors: string[] = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  let started = Date.now();
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/w/pf-fapi');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  timings.initialBuildMs = Date.now() - started;
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles({
    name: 'sales-check.csv', mimeType: 'text/csv',
    buffer: Buffer.from('label,amount,quantity\nWidget order one,120,3\nWidget order two,80,2\nConsulting service,50,1\n'),
  });
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  const library = () => page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary())[0] as any; });
  await expect.poll(async () => (await library())?.draft.blocks.some((b: any) => b.config.fileName === 'sales-check.csv')).toBeTruthy();
  const id = (await library()).id;
  async function openBlock(label: string) {
    console.log(`Opening ${label}`);
    await page.goto(`/w/${id}`);
    await page.getByRole('button', { name: 'Build', exact: true }).click();
    started = Date.now();
    await page.getByRole('button', { name: label, exact: true }).click();
    timings[`${label}OpenMs`] = Date.now() - started;
  }
  await openBlock('Keyword Mapper');
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category ID$/ }) }).locator('input').fill('widget_sales');
  await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category label$/ }) }).locator('input').fill('Widget sales');
  await page.getByPlaceholder('Add contains keyword').fill('Widget');
  await page.getByPlaceholder('Add contains keyword').press('Enter');
  await page.getByRole('button', { name: 'Test block', exact: true }).click();
  await expect(page.getByTestId('block-io-panel')).toContainText('widget_sales');

  await openBlock('Category Rollup');
  await page.getByRole('button', { name: 'New Group', exact: true }).click();
  await page.getByPlaceholder('e.g. income_base').fill('widget_total');
  await page.getByPlaceholder('e.g. Income Base').fill('Widget total');
  await page.getByRole('button', { name: 'Widget sales', exact: true }).click();
  await page.getByRole('button', { name: 'Test block', exact: true }).click();
  await expect(page.getByTestId('block-io-panel')).toContainText('widget_total');

  await openBlock('FAPI Lines Engine');
  await page.getByRole('button', { name: 'New term', exact: true }).click();
  await page.getByPlaceholder('KEY', { exact: true }).fill('WIDGET_RESULT');
  await page.getByPlaceholder('Label', { exact: true }).fill('Adjusted widget sales');
  await page.getByRole('button', { name: /^widget_total(?: = 200)?$/ }).click();
  await page.getByRole('button', { name: '×', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Number to add' }).fill('500');
  await page.getByRole('button', { name: 'Add number', exact: true }).click();
  await page.getByRole('button', { name: '÷', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Number to add' }).fill('2');
  await page.getByRole('button', { name: 'Add number', exact: true }).click();
  await page.getByRole('button', { name: 'Test block', exact: true }).click();
  await expect(page.getByTestId('block-io-panel')).toContainText('50,000');

  await openBlock('FAPI Summary Engine');
  await page.getByRole('button', { name: 'New term', exact: true }).click();
  await page.getByPlaceholder('KEY', { exact: true }).fill('FINAL_WIDGET_RESULT');
  await page.getByPlaceholder('Label', { exact: true }).fill('Final widget result');
  await page.getByRole('button', { name: /^WIDGET_RESULT(?: = 50000)?$/ }).click();
  await page.goto(`/w/${id}`);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  started = Date.now();
  await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  const entry = await library();
  timings.fullRunMs = Date.now() - started;
  const run = entry.runs.at(-1).result.result;
  expect(run.errors).toEqual([]);
  expect(run.results.filter((result: any) => result.status === 'error')).toEqual([]);
  const output = (blockId: string) => run.results.find((result: any) => result.blockId === blockId).output;
  expect(output('fapi-source-trial-balance').rows).toHaveLength(3);
  expect(output('fapi-logic-keyword-mapper').mappedRows).toHaveLength(2);
  expect(output('fapi-logic-keyword-mapper').unmatchedRows).toHaveLength(1);
  expect(output('fapi-logic-category-rollup').rollupTotals.widget_total).toBe(200);
  expect(output('fapi-logic-lines-engine').calculatedResults.WIDGET_RESULT).toBe(50000);
  expect(output('fapi-logic-summary-engine').calculatedResults.FINAL_WIDGET_RESULT).toBe(50000);
  expect(output('fapi-output-json').canonicalJson.calculated_results.FINAL_WIDGET_RESULT).toBe(50000);
  await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  await expect(page.locator('details').filter({ has: page.locator('summary', { hasText: /^Canonical JSON/ }) }).first()).toContainText('50,000');
  await testInfo.attach('verified-results', { contentType: 'application/json', body: JSON.stringify({
    document: 'sales-check.csv', rows: 3, matched: 2, unmatched: 1,
    groupTotal: 200, formula: 'widget_total * 500 / 2', finalResult: 50000,
    workflow: entry.draft.name, version: entry.runs.at(-1).version, warnings: run.warnings,
  }, null, 2) });
  await page.screenshot({ path: testInfo.outputPath('final-result.png'), fullPage: true });
  await page.goto(`/w/${id}`);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  const version = entry.runs.at(-1).version;
  for (let repeat = 1; repeat <= 3; repeat++) {
    started = Date.now();
    await page.getByRole('button', { name: `Run saved version ${version}`, exact: true }).click();
    const persisted = await library();
    const rerun = persisted.runs.at(-1);
    timings[`rerun${repeat}Ms`] = Date.now() - started;
    const storedCharacters = await page.evaluate(() => localStorage.getItem('taxflow:workflow-library:v1')!.length);
    console.log(JSON.stringify({ repeat, runsPersisted: persisted.runs.length, storedCharacters, expandedCharacters: JSON.stringify(persisted).length, timings, browserErrors }));
    expect(persisted.runs).toHaveLength(entry.runs.length + repeat);
    expect(rerun.version).toBe(version);
    expect(rerun.result.result.runId).not.toBe(entry.runs.at(-1).result.result.runId);
    expect(rerun.result.result.results.find((result: any) => result.blockId === 'fapi-output-json').output.canonicalJson.calculated_results.FINAL_WIDGET_RESULT).toBe(50000);
  }
  expect(browserErrors).toEqual([]);
  await testInfo.attach('timings', { contentType: 'application/json', body: JSON.stringify(timings, null, 2) });
});
