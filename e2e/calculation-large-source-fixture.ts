import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionCalculationInputs } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/session-calculation-inputs';
import { createWorkflowBlockFromCatalog } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/block-factory';

/** Generic large capture, isolated from saved workflow data and provider requests. */
export function installLargeSourceForm() {
  const source = createWorkflowBlockFromCatalog('source:api-http-request', {
    id: 'signal-source',
    label: 'Signal source',
    position: { x: 0, y: 0 },
  });
  const namedValues = Object.fromEntries(
    Array.from({ length: 2500 }, (_, index) => [
      `metric_${String(index).padStart(4, '0')}`,
      index + 1,
    ]),
  );
  const fields = Object.keys(namedValues).map((name) => ['namedValues', name]);
  const rules = [{ resultKey: 'total', formulaExpression: 'amount * rate + historicalValue' }];
  function Harness() {
    const [config, setConfig] = React.useState<Record<string, unknown>>({
      inputDefinitions: [
        { name: 'amount', type: 'number', binding: { kind: 'manual' } },
        {
          name: 'rate',
          type: 'number',
          binding: { kind: 'source', blockId: source.id, path: ['namedValues', 'metric_0000'] },
        },
      ],
      inputValues: { amount: 7 },
      inputChoices: {
        rate: { kind: 'source', blockId: source.id, path: ['namedValues', 'metric_0001'] },
        historicalValue: {
          kind: 'source',
          blockId: source.id,
          path: ['namedValues', 'retired_value'],
        },
      },
    });
    window.largeSourceConfig = config;
    return React.createElement(SessionCalculationInputs, {
      config,
      rules,
      sources: [{ block: source, output: { namedValues }, fields }],
      disabled: false,
      onConfigPatch: (patch) => setConfig((previous) => ({ ...previous, ...patch })),
    });
  }
  createRoot(document.body).render(React.createElement(Harness));
}
