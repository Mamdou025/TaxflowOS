import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { ToolRunResult } from '../../lib/workflow-contracts/src/tool-types';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import {
  calculationFormSources,
  calculationInputChoices,
  sessionInputSourceIdentity,
  workflowRequiredInputs,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs-model';

const at = '2026-10-04T12:00:00Z';
const formula = (formulaExpression: string) => ({
  calculationId: 'total',
  resultKey: 'total',
  formulaExpression,
  label: 'Total',
  operation: 'pass_through',
  operands: [],
});
function block(id: string, config: Record<string, unknown>): WorkflowBlock {
  return {
    id,
    label: id,
    family: 'Logic',
    subtype: 'Calculation Engine',
    config,
    description: '',
    status: 'configured',
    position: { x: 0, y: 0 },
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdAt: at,
    updatedAt: at,
    createdBy: 'test',
    updatedBy: 'test',
  };
}
function result(
  blockId: string,
  output: Record<string, unknown>,
  status: ToolRunResult['status'] = 'success',
): ToolRunResult {
  return {
    blockId,
    output,
    status,
    runId: 'run',
    toolId: 'source.http_json',
    errors: [],
    warnings: [],
    logs: [],
    evidenceRefs: [],
    sourceTrace: [],
    startedAt: at,
    completedAt: at,
  };
}
const edge = (sourceBlockId: string, targetBlockId: string) =>
  createWorkflowEdgeRecord({ sourceBlockId, targetBlockId, createdAt: at, reason: 'input' });
const manual = (name: string) => ({ name, type: 'number', binding: { kind: 'manual' } });
const rateDefinition = {
  name: 'rate',
  label: 'Exchange rate',
  type: 'number',
  unit: 'CAD/EUR',
  binding: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
};
function fixture() {
  const calculate = block('calculate', {
    mode: 'inline',
    formulas: [formula('amount * rate')],
    inputDefinitions: [manual('amount'), rateDefinition],
    inputValues: { amount: 0 },
  });
  const api = {
    ...block('api', {}),
    family: 'Source' as const,
    subtype: 'API / HTTP Request' as const,
  };
  return { blocks: [calculate, api], edges: [edge('api', 'calculate')] };
}

test('Trigger checklist derives numeric fields with manual zero and the exact source binding', () => {
  const groups = workflowRequiredInputs(fixture(), {
    results: { api: result('api', { namedValues: { rate: 1.5 }, unrelated: 999 }) },
    stale: [],
  });
  assert.equal(groups.length, 1);
  assert.deepEqual(
    groups[0].requirements.map(({ name, status, value }) => ({ name, status, value })),
    [
      { name: 'amount', status: 'provided', value: 0 },
      { name: 'rate', status: 'provided', value: 1.5 },
    ],
  );
  assert.equal(groups[0].requirements[1].label, 'Exchange rate');
  assert.equal(groups[0].requirements[1].unit, 'CAD/EUR');
  assert.deepEqual(groups[0].requirements[1].binding, rateDefinition.binding);
});

test('Trigger checklist never uses stale, failed, review-pending or disconnected source results', () => {
  for (const status of ['error', 'skipped', 'needs_review'] as const) {
    const groups = workflowRequiredInputs(fixture(), {
      results: { api: result('api', { namedValues: { rate: 1.5 } }, status) },
      stale: [],
    });
    assert.equal(groups[0].requirements[1].status, 'missing', status);
  }
  const current = { api: result('api', { namedValues: { rate: 1.5 } }) };
  assert.equal(
    workflowRequiredInputs(fixture(), { results: current, stale: ['api'] })[0].requirements[1]
      .status,
    'missing',
  );
  const disconnected = fixture();
  disconnected.edges[0].status = 'disabled';
  assert.equal(
    workflowRequiredInputs(disconnected, { results: current, stale: [] })[0].requirements[1].status,
    'missing',
  );
});

test('Trigger checklist distinguishes a missing manual value from an invalid source number', () => {
  const definition = fixture();
  definition.blocks[0].config.inputValues = {};
  const inputs = workflowRequiredInputs(definition, {
    results: { api: result('api', { namedValues: { rate: 'unknown' } }) },
    stale: [],
  })[0].requirements;
  assert.equal(inputs[0].status, 'missing');
  assert.equal(inputs[1].status, 'invalid');
});

test('field names remain scoped to their calculation, including form-only workflows', () => {
  const config = {
    mode: 'inline',
    formulas: [formula('quantity')],
    inputDefinitions: [manual('quantity')],
  };
  const groups = workflowRequiredInputs(
    {
      blocks: [
        block('first', { ...config, inputValues: { quantity: 2 } }),
        block('second', config),
      ],
      edges: [],
    },
    { results: {}, stale: [] },
  );
  assert.deepEqual(
    groups.map(({ blockId, requirements }) => [blockId, requirements[0].status]),
    [
      ['first', 'provided'],
      ['second', 'missing'],
    ],
  );
});

test('external rule sources determine the checklist before acquisition runs', () => {
  const calculate = block('calculate', { mode: 'auto', formulas: [formula('unused')] });
  const rules = {
    ...block('rules', { sourceKind: 'calculation_rules', rules: [formula('quantity')] }),
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
  };
  const groups = workflowRequiredInputs(
    { blocks: [calculate, rules], edges: [edge('rules', 'calculate')] },
    { results: {}, stale: [] },
  );
  assert.deepEqual(
    groups[0].requirements.map(({ name }) => name),
    ['quantity'],
  );
});

test('inferred fields accept run choices without copying definitions or losing saved providers', () => {
  const definition = fixture();
  const calculate = definition.blocks[0];
  calculate.config.inputDefinitions = [rateDefinition];
  calculate.config.inputValues = {};
  const saved = structuredClone(calculate.config);
  const session = { results: { api: result('api', { namedValues: { rate: 1.5 } }) }, stale: [] };
  assert.deepEqual(
    workflowRequiredInputs(definition, session)[0].requirements.map((input) => [
      input.name,
      input.status,
    ]),
    [
      ['amount', 'missing'],
      ['rate', 'provided'],
    ],
  );
  calculate.config.inputChoices = { amount: { kind: 'manual', value: 0 } };
  let requirements = workflowRequiredInputs(definition, session)[0].requirements;
  assert.equal(requirements[0].value, 0);
  assert.equal(requirements[0].origin, 'manual');
  assert.deepEqual(requirements[1].binding, rateDefinition.binding);
  calculate.config.inputChoices = {
    amount: { kind: 'manual' },
    rate: { kind: 'manual', value: 2 },
  };
  requirements = workflowRequiredInputs(definition, session)[0].requirements;
  assert.equal(requirements[0].status, 'missing');
  assert.equal(requirements[1].value, 2);
  calculate.config.inputChoices = {};
  assert.equal(workflowRequiredInputs(definition, session)[0].requirements[1].value, 1.5);
  assert.deepEqual(calculate.config.inputDefinitions, saved.inputDefinitions);
});

test('source alternatives include declared numeric fields but never invent a captured value', () => {
  const definition = fixture();
  definition.blocks[1].config = {
    outputMode: 'values',
    outputMappings: [
      { name: 'rate', path: 'exchange', type: 'number' },
      { name: 'description', path: 'description', type: 'string' },
    ],
  };
  const uncaptured = calculationFormSources(definition, { results: {}, stale: [] }, 'calculate');
  assert.deepEqual(uncaptured[0].fields, [['namedValues', 'rate']]);
  assert.equal(uncaptured[0].output, undefined);
  const current = { api: result('api', { namedValues: { rate: 1.5 }, second: 3 }) };
  const fresh = calculationFormSources(definition, { results: current, stale: [] }, 'calculate');
  assert.deepEqual(fresh[0].fields, [['namedValues', 'rate'], ['second']]);
  assert.equal(fresh[0].capturedAt, at);
  const stale = calculationFormSources(
    definition,
    { results: current, stale: ['api'] },
    'calculate',
  );
  assert.deepEqual(stale[0].fields, [['namedValues', 'rate']]);
  assert.equal(stale[0].output, undefined);
  assert.equal(stale[0].capturedAt, undefined);
  definition.edges[0].status = 'disabled';
  assert.deepEqual(
    calculationFormSources(definition, { results: current, stale: [] }, 'calculate'),
    [],
  );
});

test('source identity protects drafts against same-value refreshes and config edits, not unrelated steps', () => {
  const session = {
    sources: [],
    results: { api: result('api', { namedValues: { rate: 1.5 } }) },
    stale: [] as string[],
    attempts: [],
    inputOverrides: {} as Record<string, Record<string, unknown>>,
  };
  const identity = () => sessionInputSourceIdentity('calculate', ['api'], session);
  const original = identity();
  session.inputOverrides.unrelated = { value: 9 };
  assert.equal(identity(), original);
  session.results.api = { ...session.results.api, completedAt: '2026-10-04T12:01:00Z' };
  assert.notEqual(identity(), original);
  const refreshed = identity();
  session.inputOverrides.api = { connectorParams: { year: 2025 } };
  assert.notEqual(identity(), refreshed);
  const edited = identity();
  session.stale.push('api');
  assert.notEqual(identity(), edited);
});

test('legacy connected values retain incoming-edge precedence when block order differs', () => {
  const calculate = block('calculate', { mode: 'inline', formulas: [formula('rate')] });
  const first = { ...block('first', {}), family: 'Source' as const };
  const second = { ...block('second', {}), family: 'Source' as const };
  const definition = {
    blocks: [calculate, second, first],
    edges: [edge('first', 'calculate'), edge('second', 'calculate')],
  };
  const requirements = workflowRequiredInputs(definition, {
    results: {
      first: result('first', { namedValues: { rate: 2 } }),
      second: result('second', { namedValues: { rate: 3 } }),
    },
    stale: [],
  })[0].requirements;
  assert.equal(requirements[0].value, 3);
  assert.equal(requirements[0].origin, 'connected');
});

test('changed rulebook fields retire only obsolete choices in the deliberate form projection', () => {
  const calculate = block('calculate', {
    mode: 'external_rules',
    inputChoices: {
      oldAmount: { kind: 'manual', value: 9 },
      rate: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
    },
  });
  const rules = {
    ...block('rules', {
      sourceKind: 'calculation_rules',
      rules: [formula('configuredAmount * rate')],
    }),
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
  };
  const api = { ...block('api', {}), family: 'Source' as const };
  const definition = {
    blocks: [calculate, rules, api],
    edges: [edge('rules', 'calculate'), edge('api', 'calculate')],
  };
  const before = structuredClone(calculate.config);
  const session = {
    results: {
      rules: result('rules', { calculationRules: [formula('oldAmount * rate')] }),
      api: result('api', { namedValues: { rate: 1.5 } }),
    },
    stale: ['rules', 'api'],
  };
  let group = workflowRequiredInputs(definition, session)[0];
  assert.deepEqual(
    group.requirements.map((input) => [input.name, input.status]),
    [
      ['oldAmount', 'provided'],
      ['rate', 'missing'],
    ],
  );
  assert.deepEqual(group.retiredChoices, []);
  session.results.rules = result('rules', { calculationRules: [formula('newAmount * rate')] });
  session.stale = [];
  group = workflowRequiredInputs(definition, session)[0];
  assert.deepEqual(group.retiredChoices, ['oldAmount']);
  const current = calculationInputChoices(
    calculate.config,
    group.requirements.map((input) => input.name),
  );
  assert.deepEqual(current, {
    rate: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
  });
  assert.deepEqual(calculate.config, before);
  assert.deepEqual(calculationInputChoices(calculate.config, []), {});
});
