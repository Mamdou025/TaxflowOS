import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  changeSession,
  getSession,
  startSession,
} from '../../lib/workflow-core/src/application/sessions';
import { inspectWorkflowRun } from '../../lib/workflow-core/src/application/inspection';
import { browserGraphRuntime } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';
import { recordedRunProjection } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/recorded-run-projection';

const at = '2026-10-03T12:00:00.000Z';
const sourceId = 'pf-document-calculator--document';
const calculationId = 'pf-document-calculator--calculate';

function sessionWithReplacement() {
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const definition = LocalWorkflowSnapshotSchema.parse(
    backup.library['custom:synthetic-document-calculation'].draft,
  );
  let entry = startSession(
    saveVersion(createWorkflow('custom:projection', 'document-calculator', definition), at),
    1,
    'projection-session',
    at,
  );
  const apply = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'projection-session',
      getSession(entry, 'projection-session').revision,
      action,
      browserGraphRuntime,
      at,
    );
  };
  const calculate = (source: string, amount: number) => {
    apply({
      kind: 'source',
      blockId: sourceId,
      sourceId: source,
      name: `${source}.xlsx`,
      mode: 'replace',
      rows: [{ rowId: 'item-1', label: 'Item', amount }],
    });
    for (const block of definition.blocks) apply({ kind: 'block', blockId: block.id });
  };
  calculate('original', 200);
  const first = structuredClone(getSession(entry, 'projection-session'));
  calculate('replacement', 50);
  return {
    entry,
    first,
    savedDefinition: entry.versions[0].definition,
    evidence: inspectWorkflowRun(entry, 'projection-session'),
  };
}

test('recorded Build projects the selected historical settings and inputs after a real source replacement', () => {
  const { entry, first, evidence, savedDefinition } = sessionWithReplacement();
  assert.equal(
    (first.results[calculationId].output.calculatedResults as Record<string, unknown>).RESULT,
    400,
  );
  assert.equal(
    (evidence.results[calculationId].output.calculatedResults as Record<string, unknown>).RESULT,
    100,
  );
  const unchanged = JSON.stringify({ entry, evidence, savedDefinition });
  const sourceAttempt = first.attempts.findIndex((attempt) => attempt.blockId === sourceId);
  const historicalSource = recordedRunProjection(evidence, sourceAttempt, savedDefinition);
  const current = recordedRunProjection(evidence, null, savedDefinition);
  assert.deepEqual(
    historicalSource.definition.blocks.find((block) => block.id === sourceId)!.config.rows,
    [{ rowId: 'original:item-1', label: 'Item', amount: 200, sourceFileName: 'original.xlsx' }],
  );
  assert.deepEqual(current.definition.blocks.find((block) => block.id === sourceId)!.config.rows, [
    { rowId: 'replacement:item-1', label: 'Item', amount: 50, sourceFileName: 'replacement.xlsx' },
  ]);
  assert.equal(historicalSource.settingsUnavailable.includes(sourceId), false);

  const calculationAttempt = first.attempts.findIndex(
    (attempt) => attempt.blockId === calculationId,
  );
  const historicalCalculation = recordedRunProjection(
    evidence,
    calculationAttempt,
    savedDefinition,
  );
  const log = historicalCalculation.record!.logs.find((item) => item.nodeId === calculationId)!;
  assert.deepEqual(log.input, first.results[calculationId].input);
  assert.notDeepEqual(log.input, evidence.results[calculationId].input);
  assert.deepEqual(log.output, first.results[calculationId]);
  assert.equal(log.executionId, first.results[calculationId].runId);
  assert.equal(
    historicalCalculation.record!.execution.id,
    first.attempts[calculationAttempt].result.record.execution.id,
  );
  assert.equal(historicalCalculation.statuses[calculationId], 'success');
  assert.equal(JSON.stringify({ entry, evidence, savedDefinition }), unchanged);
});

test('legacy attempt settings are explicitly unavailable and use the pinned saved version instead of current source inputs', () => {
  for (const signature of [undefined, 'legacy-non-json-signature']) {
    const { entry, first, evidence, savedDefinition } = sessionWithReplacement();
    const sourceAttempt = first.attempts.findIndex((attempt) => attempt.blockId === sourceId);
    const oldResult = evidence.attempts[sourceAttempt].result.result.results.find(
      (result) => result.blockId === sourceId,
    )!;
    oldResult.configSignature = signature;
    const unchanged = JSON.stringify({ entry, evidence, savedDefinition });
    const legacy = recordedRunProjection(evidence, sourceAttempt, savedDefinition);
    assert.ok(legacy.settingsUnavailable.includes(sourceId));
    assert.deepEqual(
      legacy.definition.blocks.find((block) => block.id === sourceId)!.config.rows,
      [],
    );
    assert.notDeepEqual(
      legacy.definition.blocks.find((block) => block.id === sourceId)!.config,
      evidence.definition.blocks.find((block) => block.id === sourceId)!.config,
    );
    assert.deepEqual(legacy.record!.logs.find((log) => log.nodeId === sourceId)!.output, oldResult);
    assert.equal(JSON.stringify({ entry, evidence, savedDefinition }), unchanged);
  }
});

test('an unavailable recorded attempt is rejected without substituting the current or latest execution', () => {
  const { entry, evidence, savedDefinition } = sessionWithReplacement();
  const unchanged = JSON.stringify({ entry, evidence, savedDefinition });
  for (const index of [-1, evidence.attempts.length]) {
    assert.throws(
      () => recordedRunProjection(evidence, index, savedDefinition),
      /This recorded attempt is unavailable\. No other attempt was selected\./,
    );
  }
  assert.equal(JSON.stringify({ entry, evidence, savedDefinition }), unchanged);
});
