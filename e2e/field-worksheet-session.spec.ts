import { test, expect } from './workflow-audit-isolation';

test('worksheet display settings save and clear without changing the calculation', async ({
  page,
}) => {
  await page.route('**/__worksheet-editor', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body></body></html>',
    }),
  );
  await page.goto('/__worksheet-editor');
  await page.evaluate(
    async (path) => {
      const refresh = (await import('/@react-refresh')).default;
      refresh.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
      const { installWorksheetEditor } = await import(path);
      installWorksheetEditor();
    },
    '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/field-worksheet-editor-fixture.ts',
  );
  await page.getByLabel('Display role for worksheet line 1').selectOption('primary');
  await page.getByLabel('Group for worksheet line 1').fill('Outcomes');
  await page.getByLabel('Description for worksheet line 1').fill('The configured result.');
  await page.getByLabel('Decimal places for worksheet line 1').selectOption('2');
  await page.getByRole('button', { name: 'Save preview version', exact: true }).click();
  const preview = page.getByRole('region', { name: 'Worksheet: Result preview', exact: true });
  await expect(preview.getByRole('heading', { name: 'Outcomes', exact: true })).toBeVisible();
  await expect(preview.locator('[data-worksheet-line="amount-line"]')).toHaveAttribute(
    'data-worksheet-presentation',
    'primary',
  );
  await expect(preview).toContainText('The configured result.');
  const read = () => page.evaluate(() => window.readWorksheetEditor());
  const saved = (await read()).saved;
  const line = saved.versions[0].definition.blocks.find((block) => block.id === 'result-field')
    .config.worksheetLines[0];
  expect(line).toMatchObject({
    presentation: 'primary',
    group: 'Outcomes',
    description: 'The configured result.',
    decimalPlaces: 2,
  });
  await page.getByLabel('Display role for worksheet line 1').selectOption('');
  await page.getByLabel('Group for worksheet line 1').fill('');
  await page.getByLabel('Description for worksheet line 1').fill('');
  await page.getByLabel('Decimal places for worksheet line 1').selectOption('');
  const clearedConfig = (await read()).config.worksheetLines[0];
  for (const key of ['presentation', 'group', 'description', 'decimalPlaces'])
    expect(Object.hasOwn(clearedConfig, key)).toBe(false);
  await page.getByRole('button', { name: 'Save preview version', exact: true }).click();
  await expect(preview.locator('[data-worksheet-line="amount-line"]')).toHaveAttribute(
    'data-worksheet-presentation',
    'summary',
  );
  await expect(preview.getByRole('heading', { name: 'Outcomes', exact: true })).toHaveCount(0);
  await expect(preview).not.toContainText('The configured result.');
  expect((await read()).saved.versions[0].definition.blocks[0].config).toEqual(
    saved.versions[0].definition.blocks[0].config,
  );
});

for (const presentation of ['chat', 'run'] as const) {
  test(`${presentation} worksheet highlights configured results with missing, current zero and outdated states`, async ({
    page,
  }) => {
    const ready = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/workflow-library') && response.request().method() === 'GET',
    );
    await page.goto('/');
    await ready;
    await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible({
      timeout: 60000,
    });
    const ids = await page.evaluate(
      async ({ path, presentation }) => {
        const { installCalculationSession } = await import(path);
        return installCalculationSession({
          worksheet: true,
          worksheetPresentation: true,
          presentation,
        });
      },
      {
        path: '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/calculation-session-fixture.ts',
        presentation,
      },
    );
    const worksheet = page.getByRole('region', {
      name: 'Worksheet: Calculation worksheet',
      exact: true,
    });
    const primary = worksheet.locator('[data-worksheet-line="converted-line"]');
    const read = () => page.evaluate(() => window.readCalculationSession());
    await expect(primary).toHaveAttribute('data-worksheet-presentation', 'primary');
    await expect(primary).toHaveAttribute('data-value-status', 'missing');
    await expect(primary.locator('[data-worksheet-value]')).toHaveText('— CAD');
    await expect(primary).toContainText('Amount using the captured exchange rate.');
    await expect(worksheet.locator('[data-worksheet-missing-inputs]')).toContainText('Amount');
    await expect(worksheet.locator('[data-worksheet-line="reserve-line"]')).toHaveCount(0);
    await expect(worksheet.locator('[data-worksheet-line="after-fee-line"]')).toBeVisible();
    await worksheet.getByRole('button', { name: 'Review required inputs', exact: true }).click();
    const inputs = worksheet.getByRole('region', {
      name: 'Inputs for Calculate amount',
      exact: true,
    });
    await expect(inputs).toBeVisible();
    await inputs.getByLabel('Value for amount', { exact: true }).fill('0');
    await inputs.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
    await expect(primary).toHaveAttribute('data-value-status', 'current');
    await expect(primary.locator('[data-worksheet-value]')).toHaveText('0.00 CAD');
    await expect(worksheet.locator('[data-worksheet-missing-inputs]')).toHaveCount(0);
    await expect(
      worksheet.locator('[data-worksheet-line="after-fee-line"] [data-worksheet-value]'),
    ).toHaveText('-10.00 CAD');
    await worksheet.getByText('Supporting calculations', { exact: true }).click();
    const reserve = worksheet.locator('[data-worksheet-line="reserve-line"]');
    await expect(reserve).toHaveAttribute('data-value-status', 'current');
    await expect(reserve.locator('[data-worksheet-value]')).toHaveText('0.00 CAD');
    await primary.locator('summary').first().click();
    await expect(primary).toContainText('converted = amount * exchangeRate');
    await expect(primary).toContainText('Entered value');
    await expect(primary).toContainText('namedValues.rate');
    const completed = await read();
    expect(completed.sessions[0].results[ids.calculation].output.calculatedResults).toEqual({
      converted: 0,
      afterFee: -10,
    });
    await worksheet.screenshot({
      path: test.info().outputPath(`configured-results-${presentation}.png`),
    });
    await inputs.getByLabel('Value for amount', { exact: true }).fill('');
    await inputs.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
    await expect(primary).toHaveAttribute('data-value-status', 'stale');
    await expect(primary.locator('[data-worksheet-value]')).toHaveText('— CAD');
    await expect(primary).toContainText('Outdated');
    await expect(worksheet.locator('[data-worksheet-missing-inputs]')).toContainText('Amount');
    const cleared = await read();
    expect(cleared.sessions[0].attempts).toHaveLength(completed.sessions[0].attempts.length);
    expect(cleared.versions).toEqual(completed.versions);
    expect(JSON.stringify(cleared.sessions[0].attempts)).toContain('"converted":0');
  });

  test(`${presentation} worksheet resolves main lines, shares drafts and preserves missing versus zero`, async ({
    page,
  }) => {
    const ready = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/workflow-library') && response.request().method() === 'GET',
    );
    await page.goto('/');
    await ready;
    await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible({
      timeout: 60000,
    });
    const ids = await page.evaluate(
      async ({ path, presentation }) => {
        const { installCalculationSession } = await import(path);
        return installCalculationSession({ worksheet: true, presentation });
      },
      {
        path: '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/calculation-session-fixture.ts',
        presentation,
      },
    );
    const worksheet = page.getByRole('region', {
      name: 'Worksheet: Calculation worksheet',
      exact: true,
    });
    const trigger = page.getByRole('region', { name: 'Required workflow fields', exact: true });
    const read = () => page.evaluate(() => window.readCalculationSession());
    await expect(worksheet).toBeVisible();
    await expect(worksheet.locator('[data-worksheet-line="converted-line"]')).toHaveAttribute(
      'data-value-status',
      'missing',
    );
    await worksheet.getByText('Edit inputs for Calculate amount', { exact: true }).click();
    const inputs = worksheet.getByRole('region', {
      name: 'Inputs for Calculate amount',
      exact: true,
    });
    await trigger.getByLabel('Value for amount', { exact: true }).fill('123');
    await expect(inputs.getByLabel('Value for amount', { exact: true })).toHaveValue('123');
    await inputs.getByLabel('Value for amount', { exact: true }).fill('100');
    await expect(trigger.getByLabel('Value for amount', { exact: true })).toHaveValue('100');
    await inputs.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
    await expect
      .poll(
        async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults,
      )
      .toEqual({ converted: 150, afterFee: 140 });
    await expect
      .poll(async () => (await read()).sessions[0].results[ids.other]?.output.calculatedResults)
      .toEqual({ reserve: 300 });
    await expect(
      worksheet.locator('[data-worksheet-line="after-fee-line"] [data-worksheet-value]'),
    ).toContainText('140');
    await worksheet.locator('[data-worksheet-line="reserve-line"] summary').first().click();
    await expect(worksheet.locator('[data-worksheet-line="reserve-line"]')).toContainText(
      'converted',
    );
    await worksheet
      .locator('[data-worksheet-line="reserve-line"]')
      .getByText('Supporting values for converted', { exact: true })
      .click();
    await expect(worksheet.locator('[data-worksheet-line="reserve-line"]')).toContainText('amount');
    await inputs.getByLabel('Value for amount', { exact: true }).fill('0');
    await inputs.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
    await expect(
      worksheet.locator('[data-worksheet-line="after-fee-line"] [data-worksheet-value]'),
    ).toContainText('-10');
    const before = await read();
    await inputs.getByLabel('Value for amount', { exact: true }).fill('');
    await inputs.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
    await expect(worksheet.locator('[data-worksheet-line="converted-line"]')).toHaveAttribute(
      'data-value-status',
      'stale',
    );
    expect((await read()).sessions[0].attempts).toHaveLength(before.sessions[0].attempts.length);
    expect(JSON.stringify((await read()).sessions[0].attempts)).toContain('"converted":150');
    expect(
      (await read()).versions[0].definition.blocks.find((block) => block.id === ids.calculation)
        .config.inputValues,
    ).toBeUndefined();
  });
}
