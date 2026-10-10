import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, Provider } from 'jotai';
import { createWorkflow, saveVersion } from '../lib/workflow-core/src/application/commands';
import { startSession } from '../lib/workflow-core/src/application/sessions';
import { apiRequestSignature } from '../lib/workflow-executors/src/api-snapshot';
import { httpJsonDefinition } from '../lib/workflow-executors/src/execution/blocks/source/http-json/definition';
import { workflowLibraryAtom } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-library';
import {
  syncWorkflowLibrary,
  workflowSyncStatus,
} from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-sync';
import { applySessionAction } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store';
import { WorkflowSessionPanel } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel';
import { DOCUMENT_CALCULATOR_CONFIG } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/document-calculator';
import { createWorkflowBlockFromCatalog } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/block-factory';

/** Static imports let Vite use one current atom identity, including after HMR. */
export async function installCalculationSession({
  inferred = false,
  presentation = 'chat',
  worksheet = false,
  worksheetPresentation = false,
}: {
  inferred?: boolean;
  presentation?: 'chat' | 'run';
  worksheet?: boolean;
  worksheetPresentation?: boolean;
}) {
  const definition = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  definition.name = 'Generic conversion';
  const trigger = definition.blocks.find((block) => block.family === 'Trigger');
  trigger.label = 'Required fields';
  trigger.config = {};
  const source = definition.blocks.find((block) => block.family === 'Source');
  source.label = 'Rate API';
  source.subtype = 'API / HTTP Request';
  source.catalogId = 'source:api-http-request';
  source.config = {
    ...httpJsonDefinition.defaultConfig,
    sourceKind: 'http_json',
    toolId: 'source.http_json',
    url: 'https://example.test/rate',
    method: 'GET',
    outputMode: 'values',
    outputMappings: [{ name: 'rate', path: 'rate', type: 'number' }],
    fetchedPayload: { rate: 1.5 },
    fetchedAt: '2026-10-04T12:00:00Z',
    responseMeta: { status: 200, url: 'https://example.test/rate' },
  };
  source.config.fetchedRequestSignature = apiRequestSignature(source.config);
  const calculation = definition.blocks.find(
    (block) => block.config.toolId === 'logic.calculation_engine',
  );
  calculation.label = 'Calculate amount';
  const formula = (resultKey, formulaExpression) => ({
    calculationId: resultKey,
    resultKey,
    label: resultKey,
    formulaExpression,
    operation: 'multiply',
    operands: [],
  });
  calculation.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [formula('converted', 'amount * exchangeRate')],
    ...(inferred
      ? { inputDefaults: { fee: 10 } }
      : {
          inputDefinitions: [
            { name: 'amount', label: 'Amount', type: 'number', binding: { kind: 'manual' } },
            {
              name: 'exchangeRate',
              label: 'Exchange rate',
              type: 'number',
              binding: { kind: 'source', blockId: source.id, path: ['namedValues', 'rate'] },
            },
          ],
        }),
  };
  if (inferred) calculation.config.formulas.push(formula('afterFee', 'converted - fee'));
  const other = {
    ...structuredClone(calculation),
    id: 'other-calculation',
    label: 'Calculate reserve',
    config: {
      toolId: 'logic.calculation_engine',
      mode: 'inline',
      formulas: [formula('reserve', 'amount * 2')],
    },
  };
  const sourceEdge = {
    ...definition.edges[1],
    sourceBlockId: source.id,
    targetBlockId: calculation.id,
    sourceOutputRole: 'named_values',
    targetInputRole: 'named_values',
  };
  definition.blocks = [trigger, source, calculation, ...(inferred ? [other] : [])];
  definition.edges = [
    { ...definition.edges[0], sourceBlockId: trigger.id, targetBlockId: source.id },
    sourceEdge,
    ...(inferred ? [{ ...sourceEdge, id: 'source-to-reserve', targetBlockId: other.id }] : []),
  ];
  definition.structure = {
    ...definition.structure,
    entryBlockId: trigger.id,
    blockOrder: definition.blocks.map((block) => block.id),
  };
  if (worksheet) {
    calculation.config.formulas.push(formula('afterFee', 'converted - fee'));
    calculation.config.inputDefaults = { fee: 10 };
    other.label = 'Calculate reserve';
    other.config.formulas = [formula('reserve', 'converted * 2')];
    const field = createWorkflowBlockFromCatalog('field:field-block', {
      id: 'worksheet',
      label: 'Calculation worksheet',
      position: { x: 900, y: 100 },
      config: {
        worksheetLines: [
          {
            id: 'converted-line',
            label: 'Converted amount',
            calculationBlockId: calculation.id,
            resultKey: 'converted',
            unit: 'CAD',
          },
          {
            id: 'after-fee-line',
            label: 'After fee',
            calculationBlockId: calculation.id,
            resultKey: 'afterFee',
            unit: 'CAD',
          },
          {
            id: 'reserve-line',
            label: 'Reserve',
            calculationBlockId: other.id,
            resultKey: 'reserve',
            unit: 'CAD',
          },
        ],
      },
    });
    if (worksheetPresentation) {
      field.config.worksheetLines = field.config.worksheetLines.map((line) => ({
        ...line,
        ...(line.id === 'converted-line'
          ? {
              presentation: 'primary',
              description: 'Amount using the captured exchange rate.',
              decimalPlaces: 2,
            }
          : line.id === 'after-fee-line'
            ? { presentation: 'summary', decimalPlaces: 2 }
            : { presentation: 'detail', group: 'Supporting calculations', decimalPlaces: 2 }),
      }));
    }
    definition.blocks.push(other, field);
    definition.edges.push(
      {
        ...sourceEdge,
        id: 'calculate-reserve',
        sourceBlockId: calculation.id,
        targetBlockId: other.id,
        sourceOutputRole: 'calculated_results',
      },
      ...[calculation, other].map((block) => ({
        ...sourceEdge,
        id: `${block.id}-to-worksheet`,
        sourceBlockId: block.id,
        targetBlockId: field.id,
        sourceOutputRole: 'calculated_results',
        targetInputRole: 'computed_values',
        relationshipType: 'provides_data_to' as const,
      })),
    );
    definition.structure.blockOrder = definition.blocks.map((block) => block.id);
  }
  const entry = startSession(
    saveVersion(createWorkflow('custom:calculation-session', 'blank', definition)),
    1,
    'calculation-session',
    '2026-10-04T12:00:00Z',
  );
  const store = createStore();
  const ref = { workflowId: entry.id, runId: 'calculation-session' };
  // Mount this store's repository subscription before seeding. A response
  // observed by the original app is not this store's hydration boundary.
  store.sub(workflowLibraryAtom, () => {});
  await syncWorkflowLibrary();
  if (!['Saved to server', 'Ready to save to server'].includes(workflowSyncStatus()))
    throw new Error('Fixture library did not finish initialization: ' + workflowSyncStatus());
  store.set(workflowLibraryAtom, { [entry.id]: entry });
  window.readCalculationSession = () => structuredClone(store.get(workflowLibraryAtom)[entry.id]);
  // Another consumer replaces a capture using the same session command.
  // Even an unchanged number invalidates a draft based on the old capture.
  window.refreshCalculationSource = () => {
    const act = (action) =>
      applySessionAction(store, ref, window.readCalculationSession().sessions[0].revision, action);
    act({
      kind: 'inputs',
      blockId: source.id,
      patch: {
        fetchedPayload: { rate: 1.5 },
        fetchedAt: '2026-10-04T13:00:00Z',
        responseMeta: { status: 200, url: 'https://example.test/rate' },
      },
    });
    act({ kind: 'block', blockId: source.id });
  };
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  createRoot(root).render(
    React.createElement(
      Provider,
      { store },
      React.createElement(WorkflowSessionPanel, {
        ...ref,
        presentation,
        focusBlockId: inferred ? undefined : trigger.id,
      }),
    ),
  );
  return {
    trigger: trigger.id,
    source: source.id,
    calculation: calculation.id,
    other: other.id,
  };
}
