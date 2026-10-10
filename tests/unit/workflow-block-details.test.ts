import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { WorkflowSession } from '../../lib/workflow-contracts/src/library-types';
import type { ToolRunResult } from '../../lib/workflow-contracts/src/tool-types';
import { createFapiTemplateWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/fapi';
import { projectWorkflowBlockDetail } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-block-detail-model';
import { supportsFapiWorksheet } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-session-result';
import {
  supportsFapiStages,
  workflowStepStatus,
  type WorkflowStep,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-step-model';

const at = '2026-10-09T12:00:00.000Z';
const lines = 'fapi-logic-lines-engine';
const summary = 'fapi-logic-summary-engine';
function session(): WorkflowSession {
  return {
    id: 'saved-run',
    version: 2,
    revision: 4,
    createdAt: at,
    paused: true,
    results: {},
    stale: [],
    reviewed: [],
    sources: [],
    attempts: [],
  };
}
function result(blockId: string): ToolRunResult {
  return {
    blockId,
    runId: 'saved-attempt',
    toolId: 'logic.calculation_engine',
    status: 'success',
    input: { amount: 9 },
    output: {
      calculatedResults: { NET: 0 },
      formulaTrace: { NET: { expression: 'amount - adjustment', result: 0 } },
    },
    errors: [],
    warnings: [],
    logs: [],
    startedAt: at,
    completedAt: at,
    evidenceRefs: [
      {
        evidenceId: 'saved-source',
        sourceBlockId: 'source-1',
        sourceLabel: 'Uploaded ledger',
        immutable: true,
        rowId: 'row-17',
      },
    ],
    sourceTrace: [
      {
        sourceBlockId: 'source-1',
        sourceLabel: 'Uploaded ledger',
        relationshipPath: ['source-1', blockId],
        rowId: 'row-17',
      },
    ],
    inputTransfers: [
      {
        edgeId: 'transfer-1',
        sourceBlockId: 'source-1',
        sourceLabel: 'Uploaded ledger',
        delivered: true,
        output: { amount: 9 },
      },
    ],
  };
}

test('saved formulas and rule rows are readable before execution without defaults or numerical results', () => {
  const definition = createFapiTemplateWorkflow();
  const block = definition.blocks.find((item) => item.id === lines)!;
  block.config.formulas = [
    {
      calculationId: 'custom',
      label: 'Custom formula',
      resultKey: 'NET',
      formulaExpression: 'amount - adjustment',
      unit: 'USD',
    },
    { resultKey: 'RATE', operation: 'multiply', operands: ['input', 0.5] },
    { calculationId: 'incomplete' },
  ];
  const current = session();
  const before = JSON.stringify({ definition, current });
  const detail = projectWorkflowBlockDetail(definition, lines, current)!;
  assert.equal(detail.state, 'missing');
  assert.equal(detail.result, undefined);
  assert.deepEqual(
    detail.formulas.map((formula) => formula.expression),
    ['amount - adjustment', undefined, undefined],
  );
  assert.deepEqual(detail.formulas[1].operands, ['input', 0.5]);
  assert.equal(
    detail.formulas[2].operation,
    undefined,
    'no executor default operation supplied by the UI',
  );
  assert.equal(detail.formulas[2].resultKey, undefined, 'no invented output key');
  const mapper = projectWorkflowBlockDetail(definition, 'fapi-logic-keyword-mapper', current)!;
  assert.ok(mapper.sections.some((section) => section.label === 'Saved keyword rules'));
  assert.equal(
    JSON.stringify({ definition, current }),
    before,
    'projection never mutates or executes the saved graph',
  );
});

test('recorded zero, inputs, traces and source evidence are retained exactly without recalculation', () => {
  const definition = createFapiTemplateWorkflow();
  const current = session();
  current.results[summary] = result(summary);
  const detail = projectWorkflowBlockDetail(definition, summary, current)!;
  assert.equal(detail.state, 'recorded');
  assert.equal((detail.result?.output.calculatedResults as Record<string, unknown>).NET, 0);
  assert.deepEqual(detail.result?.input, { amount: 9 });
  assert.deepEqual(detail.trace, { NET: { expression: 'amount - adjustment', result: 0 } });
  assert.deepEqual(detail.result?.inputTransfers?.[0].output, { amount: 9 });
  assert.equal(detail.result?.evidenceRefs[0].rowId, 'row-17');
  assert.equal(detail.result?.sourceTrace[0].sourceLabel, 'Uploaded ledger');
  assert.equal(current.approvedAt, undefined, 'a recorded value does not approve the workflow');
});

test('stale dependencies and failed attempts never appear as current recorded results', () => {
  const definition = createFapiTemplateWorkflow();
  const current = session();
  current.results[summary] = result(summary);
  current.stale = [lines];
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'previous');
  current.stale = [summary];
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'previous');
  assert.equal(
    (
      projectWorkflowBlockDetail(definition, summary, current)?.result?.output
        .calculatedResults as Record<string, unknown>
    ).NET,
    0,
    'historical evidence stays inspectable but marked previous',
  );
  current.stale = [];
  current.results[summary].errors = ['The stored attempt has an execution error.'];
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'failed');
  current.results[summary].errors = [];
  current.results[summary].status = 'error';
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'failed');
  current.results[summary].status = 'skipped';
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'failed');
  current.results[summary].blockId = 'different-block';
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.state, 'unavailable');
  assert.equal(projectWorkflowBlockDetail(definition, summary, current)?.result, undefined);
});

test('saved inline definitions are kept distinct from connected rule sources and recorded execution', () => {
  const definition = createFapiTemplateWorkflow();
  const block = definition.blocks.find((item) => item.id === lines)!;
  block.config.mode = 'external_rules';
  const detail = projectWorkflowBlockDetail(definition, lines)!;
  assert.equal(detail.mode, 'external_rules');
  assert.ok(detail.formulas.length > 0, 'saved inline configuration remains inspectable');
  assert.ok(detail.dependencies.length > 0, 'actual saved connections are visible separately');
  assert.equal(detail.result, undefined, 'saved rules do not claim to be an executed trace');
  const source = definition.blocks.find((item) => item.id === 'fapi-source-trial-balance')!;
  source.config.rows = [{ amount: 9999, token: 'private-source-field' }];
  source.config.headers = { Authorization: 'do-not-display-configuration' };
  const sourceDetail = projectWorkflowBlockDetail(definition, source.id)!;
  assert.deepEqual(
    sourceDetail.sections,
    [],
    'ordinary document rows and HTTP config are not formula definitions',
  );
});

test('FAPI stage presentation is independent of worksheet compatibility and not selected by workflow name', () => {
  const definition = createFapiTemplateWorkflow();
  assert.equal(supportsFapiStages(definition), true);
  assert.equal(supportsFapiWorksheet(definition), true);
  definition.blocks.find((block) => block.id === 'fapi-source-inputs')!.config.reportingCurrency =
    'EUR';
  assert.equal(supportsFapiWorksheet(definition), false);
  assert.equal(
    supportsFapiStages(definition),
    true,
    'custom reporting units retain the same interaction',
  );
  definition.blocks = definition.blocks.filter((block) => block.id !== lines);
  assert.equal(
    supportsFapiStages(definition),
    false,
    'same FAPI name does not invent missing stages',
  );
});

test('saved scalar rule settings preserve zero and false without exposing unrelated connection configuration', () => {
  const definition = createFapiTemplateWorkflow();
  const block = definition.blocks.find((item) => item.id === lines)!;
  block.family = 'Review / Validation';
  block.config = {
    threshold: 0,
    tolerance: 0.01,
    blocking: false,
    requiredKeys: ['amount'],
    headers: { Authorization: 'private' },
  };
  const detail = projectWorkflowBlockDetail(definition, lines)!;
  assert.deepEqual(detail.sections, [
    {
      key: 'settings',
      label: 'Saved block settings',
      value: { threshold: 0, tolerance: 0.01, requiredKeys: ['amount'], blocking: false },
    },
  ]);
  assert.equal(detail.result, undefined);
});

test('shared timeline status distinguishes warnings, review, stale and completion', () => {
  const step: WorkflowStep = {
    id: 'a',
    label: 'Example',
    family: 'Logic',
    status: 'success',
    dependencies: [],
    ready: true,
    inputKeys: [],
    inputRequired: false,
    errors: [],
    warnings: [],
  };
  assert.equal(workflowStepStatus([step]), 'Complete');
  assert.equal(workflowStepStatus([step], false, true), 'Awaiting approval');
  assert.equal(workflowStepStatus([{ ...step, status: 'warning' }]), 'Completed with warnings');
  assert.equal(workflowStepStatus([{ ...step, status: 'needs_review' }]), 'Needs review');
  assert.equal(workflowStepStatus([{ ...step, status: 'outdated' }], true), 'Outdated');
  assert.equal(
    workflowStepStatus([{ ...step, status: 'pending', inputRequired: true }], true),
    'Needs your input',
  );
});
