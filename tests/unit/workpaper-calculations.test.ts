import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WORKPAPER_SPECS,
  executeWorkpaper,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/portfolio-workpapers';
import { executeWorkflowCommand } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-command';

function sample(id: string) {
  return structuredClone(WORKPAPER_SPECS.find((spec) => spec.id === id)!.sample);
}

test('all workpapers reject each missing required field', () => {
  for (const spec of WORKPAPER_SPECS) {
    for (const field of spec.fields) {
      const rows = sample(spec.id);
      delete rows[0][field];
      assert.throws(() => executeWorkpaper(spec.id, rows), `${spec.id} must require ${field}`);
    }
  }
});

test('independent expected arithmetic for ledger and tax workpaper samples', () => {
  const cases = [
    ['attribute-ledgers', 'closing', 900],
    ['surplus', 'closing', 1100],
    ['eifel', 'deniedInterest', 130],
    ['t2-suite', 'taxableIncome', 800],
    ['tax-provision', 'totalTaxExpense', 261.5],
    ['part-xiii', 'balance', 50],
  ] as const;
  for (const [id, field, expected] of cases) {
    assert.equal(executeWorkpaper(id, sample(id)).rows[0][field], expected, `${id}.${field}`);
  }
});

test('ownership composes economic interests and rejects cycles', () => {
  const rows = executeWorkpaper('ownership-graph', sample('ownership-graph')).rows;
  assert.equal(
    rows.find((row) => row.owner === 'Parent' && row.entity === 'Opco')!.ownershipPercent,
    40,
  );
  assert.throws(() =>
    executeWorkpaper('ownership-graph', [
      { owner: 'A', entity: 'B', ownershipPercent: 50, evidence: 'x' },
      { owner: 'B', entity: 'A', ownershipPercent: 50, evidence: 'y' },
    ]),
  );
});

test('T106 keeps currencies and payment directions in separate groups', () => {
  const row = sample('t106')[0];
  const result = executeWorkpaper('t106', [
    row,
    { ...row, currency: 'CAD' },
    { ...row, direction: 'receipt' },
  ]);
  assert.equal(result.rows.length, 3);
});

test('document calculation uses supplied rows; empty records never select sample data', () => {
  const result = executeWorkflowCommand({
    workflowId: 'document-calculator',
    recordsJson: JSON.stringify([
      { label: 'Item first', amount: 10 },
      { label: 'Item second', amount: 20 },
    ]),
  });
  assert.ok(result.core);
  assert.notEqual(result.core.status, 'error');
  assert.equal(result.sample, false);
  assert.throws(() =>
    executeWorkflowCommand({
      workflowId: 'document-calculator',
      recordsJson: '[]',
      useSample: true,
    }),
  );
  assert.throws(() =>
    executeWorkflowCommand({
      workflowId: 'document-calculator',
      recordsJson: '[{"rowId":"x","label":"A","amount":1},{"rowId":"x","label":"B","amount":2}]',
    }),
  );
});
