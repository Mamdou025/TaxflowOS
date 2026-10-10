import { test, expect } from './workflow-audit-isolation';

test.beforeEach(async ({ page }) => {
  await page.route('**/__calculation-variables', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }),
  );
  await page.goto('/__calculation-variables');
  await page.evaluate(async () => {
    const refresh = (await import('/@react-refresh')).default;
    refresh.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
  });
});

test('large connected sources keep forms bounded while every field remains selectable', async ({
  page,
}) => {
  await page.evaluate(
    async (path) => {
      const { installLargeSourceForm } = await import(/* @vite-ignore */ path);
      installLargeSourceForm();
    },
    '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/calculation-large-source-fixture.ts',
  );
  const rate = page.getByRole('region', { name: 'Field rate', exact: true });
  const provider = page.getByLabel('Value provider for rate');
  await expect(provider).toHaveValue(
    JSON.stringify({
      kind: 'source',
      blockId: 'signal-source',
      path: ['namedValues', 'metric_0001'],
    }),
  );
  await expect(rate).toContainText('Value: 2');
  await expect(page.locator('select option')).toHaveCount(8);
  await expect(
    page.getByLabel('Value provider for historicalValue').locator('option:checked'),
  ).toContainText('unavailable');
  const before = await page.evaluate(() => window.largeSourceConfig);
  await page.getByRole('button', { name: 'Browse connected fields for rate', exact: true }).click();
  const picker = page.getByRole('region', { name: 'Connected fields for rate', exact: true });
  await expect(picker.locator('[data-connected-field]')).toHaveCount(50);
  await expect(picker).toContainText('Fields 1–50 of 2500');
  await picker.getByRole('button', { name: 'Next fields', exact: true }).click();
  await expect(picker).toContainText('Fields 51–100 of 2500');
  await picker.getByRole('button', { name: 'Previous fields', exact: true }).click();
  await expect(picker).toContainText('Fields 1–50 of 2500');
  expect(await page.evaluate(() => window.largeSourceConfig)).toEqual(before);
  await page.getByLabel('Find a connected field for rate').fill('metric_2499');
  await expect(picker.locator('[data-connected-field]')).toHaveCount(1);
  await picker
    .getByRole('button', {
      name: 'Signal source → namedValues.metric_2499 — available',
      exact: true,
    })
    .click();
  await expect(picker).toHaveCount(0);
  await expect(rate).toContainText('Value: 2500');
  expect((await page.evaluate(() => window.largeSourceConfig)).inputChoices.rate).toEqual({
    kind: 'source',
    blockId: 'signal-source',
    path: ['namedValues', 'metric_2499'],
  });
  await expect(page.locator('select option')).toHaveCount(8);
  await page.getByLabel('Value for amount').fill('0');
  await expect(page.getByRole('region', { name: 'Field amount', exact: true })).toContainText(
    'Value: 0',
  );
  await page.getByLabel('Value for amount').fill('');
  await expect(page.getByRole('region', { name: 'Field amount', exact: true })).toContainText(
    'Missing',
  );
  await provider.selectOption('manual');
  await page.getByLabel('Value for rate').fill('3');
  await expect(rate).toContainText('Value: 3');
  await provider.selectOption('workflow');
  await expect(rate).toContainText('Value: 1');
  expect((await page.evaluate(() => window.largeSourceConfig)).inputChoices.rate).toBeUndefined();
});

test('formula variables accept manual values and a declared API field without a conversion block', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const React = (await import('/@id/react')).default;
    const { createRoot } = (await import('/@id/react-dom/client')).default;
    const { CalculationVariablePanel } =
      await import('/src/features/workflow-builder/ui/logic-viewers/calculation-variable-panel.tsx');
    const { SessionCalculationInputs } =
      await import('/src/features/workflows-hub/session-calculation-inputs.tsx');
    const { runCalculationEngine } =
      await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
    const api = {
      id: 'rate-api',
      label: 'Rate API',
      family: 'Source',
      config: {
        outputMode: 'values',
        outputMappings: [{ name: 'rate', type: 'number', path: 'rate' }],
      },
    };
    const rules = [
      {
        calculationId: 'converted',
        resultKey: 'converted',
        label: 'Converted',
        formulaExpression: 'amount * exchangeRate',
        operation: 'multiply',
        operands: [],
      },
    ];
    function Harness() {
      const [config, setConfig] = React.useState({
        toolId: 'logic.calculation_engine',
        mode: 'inline',
        formulas: rules,
        inputValues: { exchangeRate: 9 },
      });
      const [runtime, setRuntime] = React.useState(false);
      const [result, setResult] = React.useState(null);
      const block = { id: 'compute', family: 'Logic', config };
      const patch = (next) => setConfig((previous) => ({ ...previous, ...next }));
      window.calculationVariableConfig = config;
      return React.createElement(
        'main',
        null,
        React.createElement(
          'button',
          { onClick: () => setRuntime(!runtime) },
          runtime ? 'Edit definition' : 'Use run form',
        ),
        runtime
          ? React.createElement(SessionCalculationInputs, {
              config,
              rules,
              sources: [
                {
                  block: api,
                  output: { namedValues: { rate: 1.5 } },
                  fields: [['namedValues', 'rate']],
                },
              ],
              disabled: false,
              onConfigPatch: patch,
            })
          : React.createElement(CalculationVariablePanel, {
              block,
              edges: [{ source: api.id, target: block.id }],
              nodes: [{ id: api.id, data: { block: api } }],
              outputs: {},
              disabled: false,
              onChange: (key, value) => patch({ [key]: value }),
            }),
        React.createElement(
          'button',
          {
            onClick: () =>
              setResult(
                runCalculationEngine({
                  block,
                  config,
                  inputsByRole: {
                    calculation_sources: [
                      { blockId: api.id, output: { namedValues: { rate: 1.5 } } },
                    ],
                  },
                  runId: 'generic-conversion',
                  startedAt: new Date().toISOString(),
                }),
              ),
          },
          'Calculate',
        ),
        React.createElement(
          'output',
          { 'data-testid': 'calculation-result' },
          JSON.stringify(result),
        ),
      );
    }
    createRoot(document.body).render(React.createElement(Harness));
  });
  await page.getByLabel('Value provider for amount').selectOption('manual');
  await page.getByLabel('Value for amount').fill('100');
  await page.getByLabel('Value provider for exchangeRate').selectOption('source');
  await page.getByRole('button', { name: 'namedValues › rate', exact: true }).click();
  await expect(page.getByLabel('Source field for exchangeRate')).toHaveValue('namedValues.rate');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.getByTestId('calculation-result')).toContainText('"converted":150');
  const savedValues = (await page.evaluate(() => window.calculationVariableConfig)).inputValues;
  await page.getByRole('button', { name: 'Use run form', exact: true }).click();
  await expect(page.getByLabel('Value provider for amount')).toHaveValue('workflow');
  await expect(page.getByLabel('Value for exchangeRate')).toHaveCount(0);
  await page.getByLabel('Value for amount').fill('0');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.getByTestId('calculation-result')).toContainText('"converted":0');
  expect((await page.evaluate(() => window.calculationVariableConfig)).inputChoices).toEqual({
    amount: { kind: 'manual', value: 0 },
  });
  expect((await page.evaluate(() => window.calculationVariableConfig)).inputValues).toEqual(
    savedValues,
  );
  await page.getByLabel('Value for amount').fill('');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.getByTestId('calculation-result')).toContainText('"status":"error"');
  expect((await page.evaluate(() => window.calculationVariableConfig)).inputChoices).toEqual({
    amount: { kind: 'manual' },
  });
  expect((await page.evaluate(() => window.calculationVariableConfig)).inputValues).toEqual(
    savedValues,
  );
});

test('entering a formula variable creates its required input before any source exists', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const React = (await import('/@id/react')).default;
    const { createRoot } = (await import('/@id/react-dom/client')).default;
    const { CalculationEngineEditor } =
      await import('/src/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx');
    function Harness() {
      const [config, setConfig] = React.useState({
        mode: 'inline',
        formulas: [
          {
            calculationId: 'total',
            resultKey: 'total',
            label: 'Total',
            formulaExpression: '',
            operation: 'pass_through',
            operands: [],
          },
        ],
      });
      window.calculationVariableConfig = config;
      return React.createElement(CalculationEngineEditor, {
        block: { id: 'form-calculation', family: 'Logic', config },
        selectedTermId: 'total',
        disabled: false,
        edges: [],
        nodes: [],
        lastRunOutput: {},
        onUpdateConfig: (key, value) => setConfig((previous) => ({ ...previous, [key]: value })),
      });
    }
    createRoot(document.body).render(React.createElement(Harness));
  });
  await page.getByLabel('Variable name').fill('quantity');
  await page.getByRole('button', { name: 'Add variable to formula', exact: true }).click();
  await expect(page.getByLabel('Value provider for quantity')).toBeVisible();
  await page.getByLabel('Value provider for quantity').selectOption('manual');
  await page.getByLabel('Value for quantity').fill('4');
  const config = await page.evaluate(() => window.calculationVariableConfig);
  expect(config.formulas[0].formulaExpression).toBe('quantity');
  expect(config.inputDefinitions).toContainEqual({
    name: 'quantity',
    type: 'number',
    binding: { kind: 'manual' },
  });
  expect(config.inputValues).toEqual({ quantity: 4 });
});

test('Trigger checklist tracks required fields and rejects outdated API values without duplicating inputs', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const React = (await import('/@id/react')).default;
    const { createRoot } = (await import('/@id/react-dom/client')).default;
    const { WorkflowRequiredInputs } =
      await import('/src/features/workflows-hub/workflow-required-inputs.tsx');
    const { SessionCalculationInputs } =
      await import('/src/features/workflows-hub/session-calculation-inputs.tsx');
    const formulas = [
      {
        calculationId: 'total',
        resultKey: 'total',
        label: 'Total',
        formulaExpression: 'amount * rate',
        operation: 'multiply',
        operands: [],
      },
    ];
    function Harness() {
      const [inputChoices, setInputChoices] = React.useState({});
      const [stale, setStale] = React.useState([]);
      const calculation = {
        id: 'calculate',
        label: 'Conversion',
        family: 'Logic',
        subtype: 'Calculation Engine',
        config: {
          mode: 'inline',
          formulas,
          inputChoices,
          inputDefinitions: [
            {
              name: 'amount',
              label: 'Amount',
              type: 'number',
              unit: 'EUR',
              binding: { kind: 'manual' },
            },
            {
              name: 'rate',
              label: 'Exchange rate',
              type: 'number',
              binding: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
            },
          ],
        },
      };
      const definition = {
        blocks: [calculation, { id: 'api', label: 'Rate API', family: 'Source', config: {} }],
        edges: [{ sourceBlockId: 'api', targetBlockId: 'calculate', status: 'active' }],
      };
      const session = {
        stale,
        results: {
          api: {
            status: 'success',
            output: { namedValues: { rate: 1.5 }, unrelated: 'not a required field' },
          },
        },
      };
      return React.createElement(
        'main',
        null,
        React.createElement(WorkflowRequiredInputs, { definition, session }),
        React.createElement(SessionCalculationInputs, {
          config: calculation.config,
          rules: formulas,
          sources: [
            {
              block: definition.blocks[1],
              output: stale.includes('api') ? undefined : session.results.api.output,
              fields: [['namedValues', 'rate']],
            },
          ],
          disabled: false,
          onConfigPatch: (patch) => setInputChoices(patch.inputChoices),
        }),
        React.createElement('button', { onClick: () => setStale(['api']) }, 'Replace API capture'),
      );
    }
    createRoot(document.body).render(React.createElement(Harness));
  });
  const checklist = page.getByRole('region', { name: 'Required workflow fields', exact: true });
  await expect(checklist.getByText('1 of 2 provided', { exact: true })).toBeVisible();
  await expect(checklist.getByText('Rate API → namedValues.rate', { exact: false })).toBeVisible();
  await expect(
    checklist.getByText('amount · Number · required · finite · Unit: EUR', { exact: true }),
  ).toBeVisible();
  await expect(checklist.getByText('Value: 1.5', { exact: true })).toBeVisible();
  await expect(checklist.getByText('not a required field', { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Value for amount', { exact: true })).toHaveCount(1);
  await page.getByLabel('Value for amount', { exact: true }).fill('0');
  await expect(checklist.getByText('2 of 2 provided', { exact: true })).toBeVisible();
  await expect(checklist.getByText('Value: 0', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Replace API capture', exact: true }).click();
  await expect(checklist.getByText('1 of 2 provided', { exact: true })).toBeVisible();
  await expect(checklist.getByText('Value: 1.5', { exact: true })).toHaveCount(0);
  await expect(
    checklist.getByText('Run the connected source for Exchange rate.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Value for amount', { exact: true }).fill('');
  await expect(checklist.getByText('0 of 2 provided', { exact: true })).toBeVisible();
});
