import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from '../../e2e/workflow-audit-isolation';
import { preloadFapiObserver, readFapiSession, waitForFapiPause } from './browser-session-observer';

// Uses the supplied document captured in this backup. Tax inputs intentionally remain empty.
const backupPath = path.resolve('outputs/new-fapi-calc/new-fapi-calc.backup.json');
const artifact = JSON.parse(readFileSync(backupPath, 'utf8'));
const original = artifact.library['custom:new-fapi-calc-2024'];

test('New FAPI Calc worksheet shows configured tax lines, reconciles the real workbook and keeps missing tax inputs explicit in Chat', async ({
  page,
}, info) => {
  const timings: Record<string, number> = {};
  const warnings: Array<{ blockId: string; warnings: string[] }> = [];
  const measure = async (name: string, action: () => Promise<void>) => {
    const started = Date.now();
    await action();
    timings[name] = Date.now() - started;
  };
  const readLibrary = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return readWorkflowLibrary();
    });

  await measure('warm_app_navigation_ms', async () => {
    await page.goto('/w/pf-fapi');
    await expect(page.getByLabel('Workflow storage status')).toBeVisible();
  });
  const sentinel = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const sentinelEntry = Object.values(sentinel.library)[0] as { draft: { name: string } };
  sentinelEntry.draft.name = 'Existing workflow preservation fixture';
  await page.getByLabel('Workflow storage status').click();
  await page.getByLabel('Import workflow backup').setInputFiles({
    name: 'sentinel.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(sentinel)),
  });
  await expect(
    page.getByRole('button', {
      name: 'Existing workflow preservation fixture — Imported',
      exact: true,
    }),
  ).toBeVisible();
  const before = await readLibrary();
  expect(Object.keys(before)).toHaveLength(1);
  await measure('new_backup_import_ms', async () => {
    await page.getByLabel('Import workflow backup').setInputFiles(backupPath);
    await expect(
      page.getByRole('button', { name: 'New FAPI Calc — Imported', exact: true }),
    ).toBeVisible();
  });
  const after = await readLibrary();
  expect(Object.keys(after)).toHaveLength(2);
  for (const [id, saved] of Object.entries(before)) expect(after[id]).toEqual(saved);
  const entryId = Object.keys(after).find((id) => !Object.hasOwn(before, id))!;
  expect(after[entryId].draft.name).toBe('New FAPI Calc — Imported');
  expect(after[entryId].draft.blocks).toEqual(original.draft.blocks);
  await page.getByLabel('Workflow storage status').click();
  await page.getByRole('button', { name: 'New FAPI Calc — Imported', exact: true }).click();
  await measure('guided_run_mount_ms', async () => {
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Workflow execution' }).first()).toBeVisible();
  });
  await measure('continue_in_chat_ms', async () => {
    await page
      .getByRole('region', { name: 'Workflow execution' })
      .first()
      .getByRole('button', { name: 'Continue in Chat', exact: true })
      .click();
    await expect(
      page
        .getByRole('region', { name: 'Workflow execution' })
        .last()
        .locator('[data-step-id="new-fapi-trigger"]'),
    ).toBeVisible();
  });
  const panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await preloadFapiObserver(page);
  const readSession = (progressOnly = false) => readFapiSession(page, entryId, progressOnly);
  const openStep = async (id: string) => {
    const toggle = panel.locator(`[data-step-id="${id}"]`);
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
  };
  await openStep('new-fapi-pnl-results');
  const worksheet = panel.getByRole('region', { name: 'Worksheet: FAPI worksheet', exact: true });
  await expect(worksheet).toBeVisible();
  await expect(worksheet.locator('[data-worksheet-presentation="primary"]')).toHaveCount(2);
  await expect(worksheet.locator('[data-worksheet-presentation="summary"]')).toHaveCount(9);
  await expect(worksheet.locator('[data-worksheet-presentation="detail"]')).toHaveCount(0);
  await worksheet.getByText('FAPI lines', { exact: true }).click();
  await worksheet.getByText('Accounting support', { exact: true }).click();
  await expect(worksheet.locator('[data-worksheet-line]')).toHaveCount(36);
  await expect(worksheet.locator('[data-worksheet-line][data-value-status="missing"]')).toHaveCount(
    36,
  );
  await expect(
    worksheet.locator('[data-worksheet-line="NET_FAPI"] [data-worksheet-value]'),
  ).toHaveText('— EUR');
  expect(await panel.locator('select option').count()).toBeLessThan(500);
  const sourceStarted = Date.now();
  for (let attempt = 0; attempt < 8; attempt++) {
    const prior = await readSession(true);
    await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
    await waitForFapiPause(page, info, entryId, prior.revision, String(attempt));
    const session = await readSession();
    const errors = Object.entries(session.results)
      .filter(([, result]) => result.status === 'error')
      .map(([id, result]) => ({ id, errors: result.errors }));
    expect(errors).toEqual([]);
    const pendingReview = Object.entries(session.results).find(
      ([id, result]) =>
        ['warning', 'needs_review'].includes(result.status) && !session.reviewed.includes(id),
    );
    if (!pendingReview) break;
    const [id, result] = pendingReview;
    expect([
      'new-fapi-workbook',
      'new-fapi-mapper',
      'new-fapi-mapping-review',
      'new-fapi-pnl-calculation',
      'new-fapi-reconciliation-review',
      'new-fapi-fx-api',
    ]).toContain(id);
    warnings.push({ blockId: id, warnings: result.warnings });
    if (session.results['new-fapi-mapper'])
      expect(session.results['new-fapi-mapper'].output.unmatchedRows).toEqual([]);
    await openStep(id);
    await panel.getByRole('button', { name: 'Acknowledge checkpoint', exact: true }).click();
  }
  timings.source_and_pnl_preview_ms = Date.now() - sourceStarted;
  expect(await panel.locator('select option').count()).toBeLessThan(500);
  const session = await readSession();
  const pnl = session.results['new-fapi-pnl-calculation'];
  expect(session.results['new-fapi-mapper'].output.unmatchedRows).toEqual([]);
  expect(session.results['new-fapi-mapper'].output.mappedRows).toHaveLength(72);
  expect(
    session.results['new-fapi-mapper'].output.mappedRows.find((row) => row.account === '68010'),
  ).toMatchObject({ categoryId: 'officeRentExpense', amount: 223519.91 });
  expect(session.results['new-fapi-rollup'].output.excludedRowCount).toBe(3);
  expect(pnl.status).toBe('success');
  expect(pnl.output.calculatedResults).toMatchObject({
    PNL_SALES: 3866031.62,
    PNL_COST_OF_SALES: 2564053.61,
    PNL_OVERHEADS: 813452.21,
    PNL_OTHER_SIGNED: -180446.38,
    PNL_GROSS: 1301978.01,
    PNL_OPERATING: 488525.8,
    PNL_NET: 308079.42,
    PNL_DIFF_GROSS: 0,
    PNL_DIFF_OPERATING: 0,
    PNL_DIFF_NET: 0,
  });
  expect(session.results['new-fapi-tax-calculation']).toBeUndefined();
  expect(session.approvedAt).toBeUndefined();
  await expect(
    panel.getByRole('button', { name: 'Approve completed results', exact: true }),
  ).toBeDisabled();
  const tax = original.draft.blocks.find((block) => block.id === 'new-fapi-tax-calculation');
  const manualNames = tax.config.inputDefinitions
    .filter((input) => input.binding?.kind === 'manual')
    .map((input) => input.name);
  expect(manualNames).toHaveLength(17);
  await openStep('new-fapi-trigger');
  const checklist = panel.getByRole('region', { name: 'Required workflow fields', exact: true });
  await expect(checklist).toBeVisible();
  for (const name of manualNames) await expect(checklist).toContainText(name);
  await expect(checklist.getByText('Missing', { exact: true })).toHaveCount(17);
  await expect(
    checklist.getByRole('button', { name: 'Browse connected fields for fxRate', exact: true }),
  ).toBeVisible();
  await checklist.screenshot({ path: info.outputPath('new-fapi-required-fields.png') });
  await openStep('new-fapi-pnl-results');
  await expect(worksheet).toBeVisible();
  await expect(worksheet.locator('[data-worksheet-line][data-value-status="current"]')).toHaveCount(
    10,
  );
  await expect(worksheet.locator('[data-worksheet-line][data-value-status="missing"]')).toHaveCount(
    26,
  );
  await expect(
    worksheet.locator('[data-worksheet-line="PNL_NET"] [data-worksheet-value]'),
  ).toHaveText('308,079.42 EUR');
  await expect(
    worksheet.locator('[data-worksheet-line="PNL_OTHER_SIGNED"] [data-worksheet-value]'),
  ).toHaveText('-180,446.38 EUR');
  await expect(
    worksheet.locator('[data-worksheet-line="NET_FAPI"] [data-worksheet-value]'),
  ).toHaveText('— EUR');
  await worksheet.locator('[data-worksheet-line="PNL_NET"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('new-fapi-accounting-visible.png') });
  const lineA = worksheet.locator('[data-worksheet-line="A"]');
  await lineA.locator('summary').first().click();
  await expect(lineA).toContainText(
    'pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4',
  );
  await expect(lineA.locator('[data-worksheet-dependency="income_bucket"]')).toContainText(
    'Missing',
  );
  await worksheet.getByText(`Edit inputs for ${tax.label}`, { exact: true }).click();
  const form = worksheet.getByRole('region', { name: `Inputs for ${tax.label}`, exact: true });
  for (const name of manualNames)
    await expect(form.getByLabel(`Value for ${name}`, { exact: true })).toHaveValue('');
  await expect(form.getByLabel('Value provider for fxRate', { exact: true })).toHaveValue(
    'workflow',
  );
  await expect(form.getByRole('region', { name: 'Field fxRate', exact: true })).toContainText(
    'From: Bank of Canada EUR / CAD — 2024 → namedValues.fxRate',
  );
  await worksheet.screenshot({ path: info.outputPath('new-fapi-worksheet.png') });
  await expect(panel.locator('[data-step-id="new-fapi-tax-calculation"]')).toContainText(
    'Needs your input',
  );
  await openStep('new-fapi-pnl-calculation');
  const pnlRegionId = await panel
    .locator('[data-step-id="new-fapi-pnl-calculation"]')
    .getAttribute('aria-controls');
  await expect(
    panel.locator(`[id="${pnlRegionId}"]`).getByRole('heading', { name: 'Result', exact: true }),
  ).toBeVisible();
  await panel.screenshot({ path: info.outputPath('new-fapi-pnl-preview.png') });
  const final = await page.evaluate((entryId) => {
    const library = window.fapiVerification.readLibrary();
    return {
      existing: Object.fromEntries(Object.entries(library).filter(([id]) => id !== entryId)),
      blocks: library[entryId].draft.blocks,
    };
  }, entryId);
  expect(final.existing).toEqual(before);
  expect(final.blocks).toEqual(original.draft.blocks);
  writeFileSync(
    info.outputPath('verification.json'),
    JSON.stringify(
      {
        timings,
        acknowledgedSourceWarnings: warnings,
        pnl: pnl.output.calculatedResults,
        missingTaxInputs: manualNames,
        worksheet: {
          declaredLines: 36,
          currentAccountingLines: 10,
          missingTaxLines: 26,
          fakeZeroSubstitutions: false,
        },
        finalTaxResult: null,
        existingWorkflowsPreserved: true,
        finalApproval: false,
      },
      null,
      2,
    ),
  );
});

test('Synthetic UI inputs complete the generic FAPI worksheet without becoming saved tax defaults', async ({
  page,
}, info) => {
  // Invented arithmetic inputs belong only to this isolated run, never the backup.
  const syntheticBackup = structuredClone(artifact);
  const syntheticName = 'Synthetic FAPI arithmetic — UI verification';
  syntheticBackup.library['custom:new-fapi-calc-2024'].draft.name = syntheticName;
  await page.goto('/w/pf-fapi');
  await page.getByLabel('Workflow storage status').click();
  await page.getByLabel('Import workflow backup').setInputFiles({
    name: 'synthetic-ui-workflow.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(syntheticBackup)),
  });
  await expect(
    page.getByRole('button', { name: `${syntheticName} — Imported`, exact: true }),
  ).toBeVisible();
  await page.getByLabel('Workflow storage status').click();
  await page.getByRole('button', { name: `${syntheticName} — Imported`, exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  await page
    .getByRole('region', { name: 'Workflow execution' })
    .first()
    .getByRole('button', { name: 'Continue in Chat', exact: true })
    .click();
  const panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel.locator('[data-step-id="new-fapi-trigger"]')).toBeVisible();
  await preloadFapiObserver(page);
  const entryId = await page.evaluate(
    (name) =>
      Object.values(window.fapiVerification.readLibrary()).find(
        (entry) => entry.draft.name === name,
      )!.id,
    `${syntheticName} — Imported`,
  );
  const tax = original.draft.blocks.find((block) => block.id === 'new-fapi-tax-calculation');
  const manualNames: string[] = tax.config.inputDefinitions
    .filter((input) => input.binding?.kind === 'manual')
    .map((input) => input.name);
  const values: Record<string, number> = Object.fromEntries(manualNames.map((name) => [name, 0]));
  Object.assign(values, {
    pCoefficient: 1,
    income_bucket: 1000,
    expense_bucket: 100,
    inclusionRate: 0.5,
    fatPaid: 25,
    rtf: 4,
  });
  expect(manualNames).toHaveLength(17);
  const trigger = panel.locator('[data-step-id="new-fapi-trigger"]');
  if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  const checklist = panel.getByRole('region', { name: 'Required workflow fields', exact: true });
  const form = checklist.getByRole('region', { name: `Inputs for ${tax.label}`, exact: true });
  const worksheet = panel.getByRole('region', { name: 'Worksheet: FAPI worksheet', exact: true });
  await expect(
    worksheet.locator('[data-worksheet-line="NET_FAPI"] [data-worksheet-value]'),
  ).toHaveText('— EUR');
  for (const name of manualNames) {
    await expect(form.getByLabel(`Value for ${name}`, { exact: true })).toHaveValue('');
    await form.getByLabel(`Value for ${name}`, { exact: true }).fill(String(values[name]));
  }
  const prior = await readFapiSession(page, entryId, true);
  const started = Date.now();
  await form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
  await waitForFapiPause(page, info, entryId, prior.revision, 'synthetic-completion');
  const completionMs = Date.now() - started;
  const session = await readFapiSession(page, entryId);
  expect(Object.values(session.results).filter((result) => result.status === 'error')).toEqual([]);
  const calculated = session.results['new-fapi-tax-calculation'];
  expect(calculated.status).toBe('success');
  expect(calculated.output.calculatedResults).toMatchObject({
    GROSS: 900,
    DEDUCTIONS: 0,
    FAPI_BRUT: 900,
    FAT_DEDUCTION: 100,
    NET_FAPI: 800,
  });
  // The independent stored evidence supplies the expected captured rate, not UI rounding.
  const capturedRate = JSON.parse(
    readFileSync('outputs/new-fapi-calc/verification-evidence.json', 'utf8'),
  ).api.fxRate;
  expect(calculated.output.calculatedResults!.NET_FAPI_CAD).toBeCloseTo(800 * capturedRate, 6);
  expect(session.results['new-fapi-pnl-results'].status).toBe('success');
  expect(Object.keys(session.results['new-fapi-pnl-results'].output.computedValues!)).toHaveLength(
    36,
  );
  expect(['success', 'warning']).toContain(session.results['new-fapi-evidence'].status);
  await expect(
    worksheet.locator(
      '[data-worksheet-line="NET_FAPI"][data-worksheet-presentation="primary"] [data-worksheet-value]',
    ),
  ).toHaveText('800.00 EUR');
  await expect(
    worksheet.locator(
      '[data-worksheet-line="NET_FAPI_CAD"][data-worksheet-presentation="primary"] [data-worksheet-value]',
    ),
  ).toHaveText('1,185.41 CAD');
  await expect(
    worksheet.locator('[data-worksheet-line="FX_RATE"] [data-worksheet-value]'),
  ).toHaveText('1.481768 CAD/EUR');
  expect(await panel.locator('select option').count()).toBeLessThan(500);
  const saved = await page.evaluate((entryId) => {
    const entry = window.fapiVerification.readLibrary()[entryId];
    return {
      draft: entry.draft.blocks,
      configs: entry.versions.map(
        (version) =>
          version.definition.blocks.find((block) => block.id === 'new-fapi-tax-calculation')!
            .config,
      ),
      choices: entry.sessions.at(-1)!.inputOverrides?.['new-fapi-tax-calculation']?.inputChoices,
    };
  }, entryId);
  expect(saved.draft).toEqual(original.draft.blocks);
  for (const config of saved.configs) {
    expect(config.inputValues).toEqual({});
    expect(config.inputDefaults ?? {}).toEqual({});
    expect(config.inputChoices ?? {}).toEqual({});
  }
  expect(saved.choices).toEqual(
    Object.fromEntries(
      Object.entries(values).map(([name, value]) => [name, { kind: 'manual', value }]),
    ),
  );
  await worksheet.locator('[data-worksheet-line="NET_FAPI"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('synthetic-fapi-primary-results.png') });
  await info.attach('synthetic-completion', {
    contentType: 'application/json',
    body: JSON.stringify({
      purpose: 'Invented run-only inputs; not user tax facts or saved defaults.',
      completionMs,
      inputs: values,
      results: calculated.output.calculatedResults,
    }),
  });
});
