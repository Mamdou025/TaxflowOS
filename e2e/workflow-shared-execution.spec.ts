import { test, expect } from './workflow-audit-isolation';

test('Build runs in place; Run and Build retain one execution and the original blocks', async ({ page }) => {
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  // Build is a lazy-loaded module; cold development compilation is not execution time.
  await expect(page.locator('.react-flow')).toBeVisible({ timeout: 30000 });
  const original = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/workflow-execution.ts');
    return templateDefinition('pf-document-calculator')!;
  });
  // The first Run is the view tab; the last is the Build action.
  await page.getByRole('button', { name: 'Run', exact: true }).last().click();
  await expect(page.locator('.react-flow')).toBeVisible();
  const read = () => page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return Object.values(readWorkflowLibrary())[0];
  });
  await expect.poll(async () => (await read())?.runs.length).toBe(1);
  const first = await read();
  const blocks = (definition: typeof original) => definition.blocks.map(({ id, label, family, subtype, config, position }) => ({ id, label, family, subtype, config, position }));
  const edges = (definition: typeof original) => definition.edges.map(({ id, sourceBlockId, targetBlockId, sourceOutputRole, targetInputRole, relationshipType, status }) => ({ id, sourceBlockId, targetBlockId, sourceOutputRole, targetInputRole, relationshipType, status }));
  expect(blocks(first.draft)).toEqual(blocks(original));
  expect(edges(first.draft)).toEqual(edges(original));
  const edgeStyles = () => page.locator('.react-flow__edge-path').evaluateAll(paths => paths.map(path => path.getAttribute('style')).sort());
  await expect.poll(async () => (await edgeStyles()).some(style => style?.includes('239, 68, 68'))).toBe(true);
  const colors = await edgeStyles();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Save changes and preview', exact: true })).toBeVisible();
  expect((await read()).runs).toEqual(first.runs);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect(page.locator('.react-flow')).toBeVisible();
  await expect.poll(edgeStyles).toEqual(colors);
  expect((await read()).runs).toEqual(first.runs);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  const second = await read();
  expect(second.runs).toHaveLength(2);
  expect(second.versions).toHaveLength(1);
  expect(second.runs[1].result.edgeStatuses).toEqual(first.runs[0].result.edgeStatuses);
  const outputs = (run: typeof first.runs[number]) => JSON.parse(JSON.stringify(
    run.result.result.results.map(result => [result.blockId, result.status, result.output]),
    (key, value) => ['runId', 'firedAt', 'updatedAt'].includes(key) ? undefined : value,
  ));
  expect(outputs(second.runs[1])).toEqual(outputs(first.runs[0]));
  expect(second.draft).toEqual(first.draft);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect.poll(edgeStyles).toEqual(colors);
  expect((await read()).runs).toHaveLength(2);
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles({
    name: 'items.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([{ label: 'Item one', amount: 200 }])),
  });
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  const uploaded = await read();
  await page.getByRole('button', { name: 'Run', exact: true }).last().click();
  await expect(page.locator('.react-flow')).toBeVisible();
  const successful = await read();
  expect(successful.runs).toHaveLength(3);
  expect(blocks(successful.draft)).toEqual(blocks(uploaded.draft));
  expect(edges(successful.draft)).toEqual(edges(uploaded.draft));
  expect(successful.runs[2].result.result.results.find(result => result.output.calculatedResults)?.output.calculatedResults).toEqual({ RESULT: 400 });
  await expect.poll(async () => (await edgeStyles()).some(style => style?.includes('16, 185, 129'))).toBe(true);
  const successfulColors = await edgeStyles();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByText('400', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect.poll(edgeStyles).toEqual(successfulColors);
  expect((await read()).runs).toHaveLength(3);
});
