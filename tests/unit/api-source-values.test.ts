import { upgradeFapiApiSourceDraft } from '../../lib/workflow-core/src/application/api-source-upgrade';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  mapResponseValues,
  resolveResponseValues,
} from '../../lib/source-connectors/src/http-json';
import {
  buildApiRequest,
  apiRequestToBlockConfig,
} from '../../lib/source-connectors/src/connectors';
import { apiRequestSignature } from '../../lib/workflow-executors/src/api-snapshot';
import { runHttpJsonSource } from '../../lib/workflow-executors/src/execution/blocks/source/http-json/run';
import { createWorkflowBlockFromCatalog } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/block-factory';
import { createFapiTemplateWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/fapi';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';
import { validateRunInputPatch } from '../../lib/workflow-core/src/application/session-inputs';

const mappings = [{ name: 'companyName', path: 'company.name', type: 'text' }];
function run(config: Record<string, unknown>) {
  const block = createWorkflowBlockFromCatalog('source:api-http-request', { config });
  return runHttpJsonSource({
    block,
    config,
    inputsByRole: {},
    runId: 'test',
    startedAt: '2026-10-04T00:00:00Z',
  });
}
function saved(payload: unknown, outputMappings: unknown = mappings) {
  const config = {
    url: 'https://example.com/data',
    outputMode: 'values',
    outputMappings,
    fetchedPayload: payload,
  };
  return { ...config, fetchedRequestSignature: apiRequestSignature(config) };
}

test('API selections preserve text, zero, false and JSON without monetary rows', () => {
  assert.deepEqual(
    mapResponseValues({ company: { name: 'Example' }, count: 0, active: false, list: ['a'] }, [
      ...mappings,
      { name: 'count', path: 'count', type: 'number' },
      { name: 'active', path: 'active', type: 'boolean' },
      { name: 'list', path: 'list', type: 'json' },
    ]),
    { companyName: 'Example', count: 0, active: false, list: ['a'] },
  );
  assert.deepEqual(mapResponseValues('hello', [{ name: 'message', path: '', type: 'text' }]), {
    message: 'hello',
  });
  const result = run(saved({ company: { name: 'Example' } }));
  assert.equal(result.status, 'success');
  assert.deepEqual(result.outputs.named_values.namedValues, { companyName: 'Example' });
  assert.equal(result.evidenceRefs[0].field, 'companyName');
  assert.equal(result.outputs.rows, undefined);
});

test('invalid or missing response values fail instead of becoming zero or sample data', () => {
  for (const value of ['', null, true, 'not-a-number', 'Infinity']) {
    assert.throws(() =>
      mapResponseValues({ value }, [{ name: 'value', path: 'value', type: 'number' }]),
    );
  }
  assert.throws(() => mapResponseValues({}, mappings), /missing/);
  assert.throws(() => mapResponseValues({}, [...mappings, ...mappings]), /Duplicate/);
  assert.throws(
    () => mapResponseValues({}, [{ name: 'x', path: '__proto__.x', type: 'text' }]),
    /Invalid/,
  );
  assert.equal(run({ outputMode: 'values', outputMappings: mappings }).status, 'error');
  assert.equal(run(saved({ company: {} })).status, 'error');
});

test('changing a request or mapping rejects saved API evidence', () => {
  const config = saved({ company: { name: 'Example' } });
  assert.equal(run({ ...config, url: 'https://example.com/other' }).status, 'error');
  assert.equal(
    run({ ...config, outputMappings: [{ ...mappings[0], path: 'other' }] }).status,
    'error',
  );
});

test('BoC is a preset using the generic mean operation, with explicit override precedence', () => {
  const request = buildApiRequest('boc.fx_average', { currency: 'USD', year: 2025 });
  assert.ok(request.ok);
  const config = apiRequestToBlockConfig('boc.fx_average', request.params, request.spec);
  const payload = { observations: [{ FXUSDCAD: { v: '1.2' } }, { FXUSDCAD: { v: '1.4' } }, {}] };
  const result = mapResponseValues(payload, config.outputMappings);
  assert.ok(Math.abs(Number(result.fxRate) - 1.3) < 1e-12);
  assert.deepEqual(resolveResponseValues(payload, config.outputMappings, { overrideRate: 1.5 }), {
    namedValues: { fxRate: 1.5 },
    overrides: ['fxRate'],
  });
  assert.throws(
    () => resolveResponseValues(payload, config.outputMappings, { overrideRate: 0 }),
    /positive/,
  );
  assert.throws(
    () => mapResponseValues({ observations: [] }, config.outputMappings),
    /no observations/,
  );
  const block = createWorkflowBlockFromCatalog('source:api-http-request', { config });
  assert.deepEqual(validateRunInputPatch(block, { fetchedPayload: payload, overrideRate: null }), {
    fetchedPayload: payload,
    overrideRate: null,
  });
});

test('FAPI has one generic API source and consumes its selected number downstream', async () => {
  const workflow = createFapiTemplateWorkflow();
  assert.equal(
    workflow.blocks.some((block) => block.id === 'fapi-api-boc-fx'),
    false,
  );
  const document = workflow.blocks.find((block) => block.config.toolId === 'source.manual_table')!;
  document.config.rows = [
    { rowId: 'interest', label: 'Interest income', amount: 1000, currency: 'USD' },
  ];
  const source = workflow.blocks.find((block) => block.id === 'fapi-source-fx-rate')!;
  assert.equal(source.config.toolId, 'source.http_json');
  source.config.overrideRate = null;
  source.config.fetchedPayload = { observations: [{ FXUSDCAD: { v: '1.4' } }] };
  source.config.fetchedRequestSignature = apiRequestSignature(source.config);
  const result = await executeWorkflowDefinition(workflow);
  const fx = result.result.results.find((entry) => entry.blockId === source.id)!;
  assert.equal(fx.status, 'success');
  assert.deepEqual(fx.output.namedValues, { fxRate: 1.4 });
  const summary = result.result.results.find(
    (entry) => entry.blockId === 'fapi-logic-summary-engine',
  )!;
  assert.equal(summary.status, 'success', JSON.stringify(summary.errors));
  assert.equal((summary.output.namedValues as Record<string, unknown>).FX_RATE, 1.4);
});

test('explicit FAPI draft upgrade preserves overrides and historical versions', () => {
  const definition = createFapiTemplateWorkflow();
  const replacement = definition.blocks.find((block) => block.id === 'fapi-source-fx-rate')!;
  const legacy = structuredClone(definition);
  const old = legacy.blocks.find((block) => block.id === replacement.id)!;
  old.config = { sourceKind: 'currency_rate', overrideRate: 1.7 };
  for (const edge of legacy.edges)
    if (edge.sourceBlockId === old.id) edge.sourceOutputRole = 'exchange_rate';
  legacy.blocks.push({ ...structuredClone(replacement), id: 'fapi-api-boc-fx' });
  legacy.structure.entryBlockId = 'fapi-api-boc-fx';
  const before = structuredClone(legacy);
  const upgraded = upgradeFapiApiSourceDraft(legacy, replacement);
  assert.equal(upgraded.blocks.find((block) => block.id === old.id)!.config.overrideRate, 1.7);
  assert.deepEqual(upgraded.versionSnapshots, before.versionSnapshots);
  assert.equal(
    upgraded.blocks.some((block) => block.id === 'fapi-api-boc-fx'),
    false,
  );
  assert.equal(upgraded.structure.entryBlockId, old.id);
  assert.deepEqual(legacy, before);
  legacy.edges.find((edge) => edge.sourceBlockId === old.id)!.targetInputRole = 'custom';
  assert.throws(() => upgradeFapiApiSourceDraft(legacy, replacement), /custom downstream/);
});
