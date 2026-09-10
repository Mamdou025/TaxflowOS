import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
const evidence = 'docs/workflow-catalog-evidence';
const read = (name: string) => JSON.parse(readFileSync(`${evidence}/${name}`, 'utf8'));

// These gates validate the collected real execution outcomes. They intentionally
// remain red while the audited application defects are present.
test('every catalog workflow must execute without an error after its document is supplied', () => {
  const records = readdirSync(evidence).filter(name => /^ui-pf-.*\.json$/.test(name)).map(read);
  expect(records).toHaveLength(17);
  expect(records.filter(record => record.first.status === 'error').map(record => ({ id: record.id, firstError: record.first.errors[0] }))).toEqual([]);
});

test('a runtime with execution errors must not claim completion', () => {
  expect(read('completion-claims.json').filter(record => record.coreStatus === 'error' && record.done).map(record => ({ id: record.id, claimed: record.summaryText }))).toEqual([]);
});

test('the expense payroll export must include data rows', () => {
  const output = read('arithmetic-and-expense-export.json').expenseOutputs.find(result => result.toolId === 'output.excel_export').output;
  expect(output.rowCount).toBeGreaterThan(0);
});
