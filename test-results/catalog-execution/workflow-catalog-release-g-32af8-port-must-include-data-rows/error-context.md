# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-catalog-release-gates.spec.ts >> the expense payroll export must include data rows
- Location: e2e\workflow-catalog-release-gates.spec.ts:18:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { readFileSync, readdirSync } from 'node:fs';
  3  | const evidence = 'docs/workflow-catalog-evidence';
  4  | const read = (name: string) => JSON.parse(readFileSync(`${evidence}/${name}`, 'utf8'));
  5  | 
  6  | // These gates validate the collected real execution outcomes. They intentionally
  7  | // remain red while the audited application defects are present.
  8  | test('every catalog workflow must execute without an error after its document is supplied', () => {
  9  |   const records = readdirSync(evidence).filter(name => /^ui-pf-.*\.json$/.test(name)).map(read);
  10 |   expect(records).toHaveLength(17);
  11 |   expect(records.filter(record => record.first.status === 'error').map(record => ({ id: record.id, firstError: record.first.errors[0] }))).toEqual([]);
  12 | });
  13 | 
  14 | test('a runtime with execution errors must not claim completion', () => {
  15 |   expect(read('completion-claims.json').filter(record => record.coreStatus === 'error' && record.done).map(record => ({ id: record.id, claimed: record.summaryText }))).toEqual([]);
  16 | });
  17 | 
  18 | test('the expense payroll export must include data rows', () => {
  19 |   const output = read('arithmetic-and-expense-export.json').expenseOutputs.find(result => result.toolId === 'output.excel_export').output;
> 20 |   expect(output.rowCount).toBeGreaterThan(0);
     |                           ^ Error: expect(received).toBeGreaterThan(expected)
  21 | });
  22 | 
```