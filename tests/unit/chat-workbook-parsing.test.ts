import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { parseUploadToRows } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/parse-upload';

const XLSX = createRequire(
  new URL('../../artifacts/ai-workflow-builder/package.json', import.meta.url),
)('xlsx');

test('chat workbook import skips financial headings and totals while preserving physical Excel rows and currency', async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      [],
      [],
      ['Profit and Loss'],
      ['From Jan 2024 to Dec 2024'],
      ['en Euro'],
      [],
      ['Financial Row', 'Amount'],
      ['Sales'],
      ['42100 - Ventes', 120],
      [],
      ['50000 - Expense', -20],
      ['Total Expenses', -20],
    ]),
    'ProfitandLoss',
  );
  const file = new File(
    [XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })],
    'synthetic-pnl.xlsx',
  );
  const parsed = await parseUploadToRows(file);
  assert.deepEqual(
    parsed.rows.map((row) => ({
      label: row.label,
      amount: row.amount,
      row: row.rowNumber,
      currency: row.currency,
    })),
    [
      { label: '42100 - Ventes', amount: 120, row: 9, currency: 'EUR' },
      { label: '50000 - Expense', amount: -20, row: 11, currency: 'EUR' },
    ],
  );
});

test('structured workbooks without an amount column retain their records', async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['entity', 'owner', 'percentage'],
      ['Affiliate A', 'Parent', 75],
    ]),
    'Ownership',
  );
  const parsed = await parseUploadToRows(
    new File([XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })], 'ownership.xlsx'),
  );
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].entity, 'Affiliate A');
  assert.equal(parsed.rows[0].percentage, '75');
  assert.equal(Number.isNaN(parsed.rows[0].amount), true);
});

test('invalid financial amounts cannot turn into zero during chat import', async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['label', 'amount'],
      ['Interest', 'unavailable'],
    ]),
    'Records',
  );
  const file = new File(
    [XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })],
    'invalid.xlsx',
  );
  await assert.rejects(() => parseUploadToRows(file), /amount must contain a readable number/);
});
