import type { Page } from '@playwright/test';
import { test, expect } from './workflow-audit-isolation';

/** Real session commands and executors, with a captured synthetic API response. */
async function mountCalculationSession(
  page: Page,
  options: { inferred?: boolean; presentation?: 'chat' | 'run' } = {},
) {
  const initialLibrary = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/workflow-library') && response.request().method() === 'GET',
  );
  await page.goto('/');
  await initialLibrary;
  await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible({
    timeout: 60000,
  });
  return page.evaluate(
    async ({ helperPath, options }) => {
      const { installCalculationSession } = await import(helperPath);
      return installCalculationSession(options);
    },
    {
      helperPath:
        '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/calculation-session-fixture.ts',
      options,
    },
  );
}
test('Trigger form collects a source while manual variables are missing and preserves earlier calculations', async ({
  page,
}) => {
  const ids = await mountCalculationSession(page);
  const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
  const checklist = panel.getByRole('region', { name: 'Required workflow fields', exact: true });
  const form = panel.getByRole('region', { name: 'Inputs for Calculate amount', exact: true });
  const read = () => page.evaluate(() => window.readCalculationSession());
  const apply = () =>
    form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
  const savedConfig = (await read()).versions[0].definition.blocks.find(
    (block) => block.id === ids.calculation,
  ).config;
  await expect(checklist).toContainText('0 of 2 provided');
  await expect(form).toBeVisible();
  await expect(panel.getByLabel('Value for amount', { exact: true })).toHaveCount(1);
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.source]?.status)
    .toBe('success');
  await expect.poll(async () => (await read()).sessions[0].paused).toBe(true);
  expect((await read()).sessions[0].results[ids.calculation]).toBeUndefined();
  await expect(checklist).toContainText('1 of 2 provided');
  await form.getByLabel('Value for amount').fill('100');
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults)
    .toEqual({ converted: 150 });
  await expect(
    panel.getByRole('button', { name: 'Approve completed results', exact: true }),
  ).toBeEnabled();
  await panel.getByRole('button', { name: 'Approve completed results', exact: true }).click();
  await expect.poll(async () => !!(await read()).sessions[0].approvedAt).toBe(true);
  await form.getByLabel('Value provider for exchangeRate').selectOption('manual');
  await expect(form.getByLabel('Value for exchangeRate')).toHaveValue('');
  const beforeMissingRate = await read();
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].stale.includes(ids.calculation))
    .toBe(true);
  expect((await read()).sessions[0].attempts).toHaveLength(
    beforeMissingRate.sessions[0].attempts.length,
  );
  expect((await read()).sessions[0].approvedAt).toBeUndefined();
  await form.getByLabel('Value for exchangeRate').fill('2');
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults)
    .toEqual({ converted: 200 });
  await form.getByLabel('Value provider for exchangeRate').selectOption('workflow');
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults)
    .toEqual({ converted: 150 });
  await form.getByLabel('Value for amount').fill('0');
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults)
    .toEqual({ converted: 0 });
  const beforeClear = await read();
  expect(beforeClear.sessions[0].approvedAt).toBeUndefined();
  expect(JSON.stringify(beforeClear.sessions[0].attempts)).toContain('"converted":150');
  await form.getByLabel('Value for amount').fill('');
  await apply();
  await expect
    .poll(async () => (await read()).sessions[0].stale.includes(ids.calculation))
    .toBe(true);
  await expect.poll(async () => (await read()).sessions[0].paused).toBe(true);
  await expect(
    panel.getByRole('button', { name: 'Approve completed results', exact: true }),
  ).toBeDisabled();
  const final = await read();
  expect(final.sessions[0].attempts).toHaveLength(beforeClear.sessions[0].attempts.length);
  expect(final.sessions[0].inputOverrides[ids.calculation].inputChoices.amount).toEqual({
    kind: 'manual',
  });
  expect(
    final.versions[0].definition.blocks.find((block) => block.id === ids.calculation).config,
  ).toEqual(savedConfig);
  expect(final.draft.blocks.find((block) => block.id === ids.calculation).config).toEqual(
    savedConfig,
  );
  expect(final.sessions[0].results[ids.source]).toEqual(
    beforeClear.sessions[0].results[ids.source],
  );
  await expect(checklist).toContainText('1 of 2 provided');
  await panel.screenshot({ path: test.info().outputPath('trigger-variable-form.png') });
});

for (const presentation of ['chat', 'run'] as const) {
  test(
    presentation +
      ' infers scoped forms and lets the user choose a source or replace a saved default',
    async ({ page }) => {
      const ids = await mountCalculationSession(page, { inferred: true, presentation });
      const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
      const checklist = panel.getByRole('region', {
        name: 'Required workflow fields',
        exact: true,
      });
      const form = panel.getByRole('region', { name: 'Inputs for Calculate amount', exact: true });
      const reserve = panel.getByRole('region', {
        name: 'Inputs for Calculate reserve',
        exact: true,
      });
      const read = () => page.evaluate(() => window.readCalculationSession());
      const apply = () =>
        form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
      const rateChoice = JSON.stringify({
        kind: 'source',
        blockId: ids.source,
        path: ['namedValues', 'rate'],
      });
      const saved = (await read()).versions[0].definition;
      await expect(checklist).toContainText('1 of 4 provided');
      await expect(form).toBeVisible();
      await expect(reserve).toBeVisible();
      await expect(form.getByLabel('Value provider for converted', { exact: true })).toHaveCount(0);
      await expect(form.getByLabel('Value provider for afterFee', { exact: true })).toHaveCount(0);
      await expect(
        form.getByLabel('Value provider for exchangeRate').getByRole('option', {
          name: /Rate API → namedValues.rate — run source to get value/,
        }),
      ).toHaveCount(1);
      await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
      await expect
        .poll(async () => (await read()).sessions[0].results[ids.source]?.status)
        .toBe('success');
      await expect.poll(async () => (await read()).sessions[0].paused).toBe(true);
      await form.getByLabel('Value provider for amount').selectOption('manual');
      await form.getByLabel('Value for amount', { exact: true }).fill('100');
      await form.getByLabel('Value provider for exchangeRate').selectOption(rateChoice);
      await reserve.getByLabel('Value provider for amount').selectOption('manual');
      await reserve.getByLabel('Value for amount', { exact: true }).fill('7');
      await reserve
        .getByRole('button', { name: 'Apply inputs & recalculate', exact: true })
        .click();
      await expect
        .poll(async () => (await read()).sessions[0].results[ids.other]?.output.calculatedResults)
        .toEqual({ reserve: 14 });
      await expect(form.getByLabel('Value for amount', { exact: true })).toHaveValue('100');
      await expect(
        form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }),
      ).toBeEnabled();
      await apply();
      await expect
        .poll(
          async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults,
        )
        .toEqual({ converted: 150, afterFee: 140 });
      await expect(checklist).toContainText('4 of 4 provided');
      await form.getByLabel('Value provider for fee').selectOption('manual');
      await expect(form.getByLabel('Value for fee', { exact: true })).toHaveValue('');
      const beforeBlank = await read();
      await apply();
      await expect
        .poll(async () => (await read()).sessions[0].stale.includes(ids.calculation))
        .toBe(true);
      const blank = await read();
      expect(blank.sessions[0].inputOverrides[ids.calculation].inputChoices.fee).toEqual({
        kind: 'manual',
      });
      expect(blank.sessions[0].attempts).toHaveLength(beforeBlank.sessions[0].attempts.length);
      expect(blank.sessions[0].results[ids.other].output.calculatedResults).toEqual({
        reserve: 14,
      });
      await form.getByLabel('Value for fee', { exact: true }).fill('0');
      await apply();
      await expect
        .poll(
          async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults,
        )
        .toEqual({ converted: 150, afterFee: 150 });
      await form.getByLabel('Value provider for fee').selectOption('workflow');
      await apply();
      await expect
        .poll(
          async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults,
        )
        .toEqual({ converted: 150, afterFee: 140 });
      const final = await read();
      expect(final.versions[0].definition).toEqual(saved);
      expect(final.draft.blocks).toEqual(saved.blocks);
      expect(final.sessions[0].inputOverrides[ids.other].inputChoices.amount).toEqual({
        kind: 'manual',
        value: 7,
      });
      expect(final.sessions[0].inputOverrides[ids.calculation].inputChoices.exchangeRate).toEqual(
        JSON.parse(rateChoice),
      );
      expect(final.sessions[0].inputOverrides[ids.calculation].inputChoices.fee).toBeUndefined();
    },
  );
}

test('a refreshed source with the same value requires review of an unapplied Trigger form', async ({
  page,
}) => {
  const ids = await mountCalculationSession(page);
  const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
  const form = panel.getByRole('region', { name: 'Inputs for Calculate amount', exact: true });
  const read = () => page.evaluate(() => window.readCalculationSession());
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.source]?.status)
    .toBe('success');
  await expect.poll(async () => (await read()).sessions[0].paused).toBe(true);
  await form.getByLabel('Value for amount').fill('12');
  await page.evaluate(() => window.refreshCalculationSource());
  await expect(form.getByRole('alert')).toContainText(
    'inputs or connected source evidence changed',
  );
  await expect(form.getByLabel('Value for amount')).toHaveValue('12');
  await expect(
    form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }),
  ).toBeDisabled();
  expect((await read()).sessions[0].results[ids.calculation]).toBeUndefined();
  await form.getByRole('button', { name: 'Review my edits on latest inputs', exact: true }).click();
  await form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
  await expect
    .poll(async () => (await read()).sessions[0].results[ids.calculation]?.output.calculatedResults)
    .toEqual({ converted: 18 });
  expect((await read()).sessions[0].inputOverrides[ids.source].fetchedAt).toBe(
    '2026-10-04T13:00:00Z',
  );
});
