import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WORKFLOW_CONFIGS,
  getWorkflowConfig,
  buildRunnableWorkflowSnapshot,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs';
import {
  PORTFOLIO_WORKFLOWS,
  getPortfolioWorkflowDef,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { AGENTS, WORKFLOWS } from '../../artifacts/ai-workflow-builder/src/lib/agents';
import {
  WORKFLOW_TARGETS,
  resolveWorkflowTarget,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/routing/workflow-targets';
import { executeWorkflowCommand } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-command';
import { workflowSessionRequest } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-session-request';
import { createTemplateIntel } from '../../artifacts/ai-workflow-builder/src/features/worksheets/intel/template-adapter';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';
import {
  createWorkflow,
  saveVersion,
  executeSavedWorkflow,
} from '../../lib/workflow-core/src/application/commands';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import { executeLegacyTemplateCommand } from '../fixtures/legacy-template-runtime';

const retained = [
  'attribute-ledgers',
  'data-readiness',
  'eifel',
  'fapi',
  'ownership-graph',
  'part-xiii',
  'platform-sequence',
  'portfolio-ops',
  'scope-service',
  'surplus',
  't106',
  't1134',
  't2-suite',
  'tax-position-summary',
  'tax-provision',
].sort();
const retired = ['document-calculator', 'expense', 'campaign', 'roulement', 'holiday-payroll'];

test('public catalogue, runtime, assistant suggestions and live routing advertise the same 15 workflows', () => {
  assert.deepEqual(Object.keys(WORKFLOW_CONFIGS).sort(), retained);
  assert.deepEqual(
    PORTFOLIO_WORKFLOWS.map((entry) => entry.id.replace(/^pf-/, '')).sort(),
    retained,
  );
  assert.deepEqual(WORKFLOWS.map((entry) => entry.id).sort(), retained);
  assert.deepEqual(AGENTS.map((entry) => entry.workflow).sort(), retained);
  assert.deepEqual(WORKFLOW_TARGETS.map((entry) => entry.id).sort(), retained);
  for (const id of retained) {
    assert.ok(getPortfolioWorkflowDef(`pf-${id}`));
    const definition = buildRunnableWorkflowSnapshot(`pf-${id}`)!;
    const runtime = getWorkflowConfig(id)!.buildSnapshot();
    assert.deepEqual(
      definition.blocks.map(({ id, config }) => ({ id, config })),
      runtime.blocks.map(({ id, config }) => ({ id, config })),
      id,
    );
    const connections = (edges: typeof runtime.edges) =>
      edges.map(
        ({
          sourceBlockId,
          targetBlockId,
          relationshipType,
          sourceOutputRole,
          targetInputRole,
        }) => ({
          sourceBlockId,
          targetBlockId,
          relationshipType,
          sourceOutputRole,
          targetInputRole,
        }),
      );
    assert.deepEqual(connections(definition.edges), connections(runtime.edges), id);
    assert.equal(resolveWorkflowTarget(`Run ${getWorkflowConfig(id)!.name}`).id, id);
  }
  assert.deepEqual(
    getPortfolioWorkflowDef('pf-fapi')!
      .blocks.map((block) => block.id)
      .sort(),
    getWorkflowConfig('fapi')!
      .buildSnapshot()
      .blocks.map((block) => block.id)
      .sort(),
  );
});

test('retired public IDs reject new execution and preview without substituting another workflow', () => {
  for (const id of retired) {
    assert.equal(getWorkflowConfig(id), null, id);
    assert.equal(getPortfolioWorkflowDef(`pf-${id}`), null, id);
    for (const alias of [id, `pf-${id}`]) {
      assert.equal(buildRunnableWorkflowSnapshot(alias), null, alias);
      assert.throws(
        () => executeWorkflowCommand({ workflowId: alias, useSample: true }),
        /unavailable/,
      );
      assert.ok(
        'error' in
          workflowSessionRequest({}, (value) => !!buildRunnableWorkflowSnapshot(value), alias),
      );
    }
  }
  for (const name of [
    'document calculator',
    'expense reimbursement',
    'rollover',
    'campaign',
    'holiday payroll',
  ]) {
    const mixed = resolveWorkflowTarget(`Run FAPI and ${name}`);
    assert.equal(mixed.ambiguous, true, name);
    assert.equal(mixed.id, null, name);
  }
  assert.equal(
    resolveWorkflowTarget('Run FAPI with records: [{"label":"expense","amount":5}]').id,
    'fapi',
  );
});

test('saved versions from retired templates retain their definitions and independently expected results', () => {
  for (const [id, headline, expected] of [
    ['document-calculator', 'RESULT', 400],
    ['expense', 'NET_PAYABLE', 2325],
  ] as const) {
    const fixture = executeLegacyTemplateCommand({ workflowId: id, useSample: true });
    assert.ok(fixture.core);
    assert.equal(fixture.core.summaryValues[headline], expected);
    const saved = saveVersion(
      createWorkflow(`custom:retired-${id}`, `pf-${id}`, fixture.core.definition),
    );
    const library = validateWorkflowLibrary(JSON.parse(JSON.stringify({ [saved.id]: saved })));
    const before = structuredClone(library[saved.id]);
    assert.deepEqual(
      workflowSessionRequest(library, () => false, saved.id, 1),
      { workflowId: saved.id, version: 1 },
    );
    const replay = executeSavedWorkflow(
      library[saved.id],
      { saveDraft: false, version: 1 },
      executeWorkflowDefinition,
    );
    assert.notEqual(replay.result.result.status, 'error', id);
    assert.deepEqual(replay.entry.versions, before.versions);
    assert.deepEqual(replay.entry.draft, before.draft);
    assert.equal(replay.entry.runs[0].version, 1);
    const output = (blockId: string) =>
      replay.result.result.results.find((block) => block.blockId === blockId)!.output;
    const calculated = output(fixture.config.summaryBlockId).calculatedResults;
    assert.ok(calculated && typeof calculated === 'object');
    assert.equal(Reflect.get(calculated, headline), expected);
    assert.deepEqual(
      output(fixture.config.sourceBlockId).rows,
      fixture.core.execution.result.results.find(
        (block) => block.blockId === fixture.config.sourceBlockId,
      )!.output.rows,
    );
    assert.equal(replay.result.result.workflowId, saved.id);
    assert.notEqual(replay.result.result.runId, fixture.core.execution.result.runId);
    assert.equal(getWorkflowConfig(id), null);
  }
  const adjustedExpense = executeLegacyTemplateCommand({
    workflowId: 'expense',
    useSample: true,
    inputsJson: '{"mealCap":100}',
  });
  assert.equal(adjustedExpense.core!.summaryValues.NET_PAYABLE, 2175);
});

test('worksheet intelligence never presents sample values when no source records were supplied', () => {
  for (const config of Object.values(WORKFLOW_CONFIGS)) {
    for (const state of [{}, { rows: [] }]) {
      const intel = createTemplateIntel(config, state);
      assert.equal(intel.describe().status, 'error', config.id);
      assert.equal(intel.explainLine(config.headlineKey).found, false, config.id);
      assert.equal(intel.why(config.headlineKey).found, false, config.id);
    }
  }
  const config = WORKFLOW_CONFIGS.fapi;
  const supplied = createTemplateIntel(config, { rows: structuredClone(config.sampleRows) });
  const snapshot = supplied.describe();
  assert.notEqual(snapshot.status, 'error');
  if (snapshot.status === 'error') throw new Error(snapshot.message);
  assert.equal(snapshot.source.usingSample, false);
  const explanation = supplied.explainLine('NET_FAPI');
  assert.equal(explanation.found, true);
  if (explanation.found) assert.equal(explanation.value, 24600);
});
