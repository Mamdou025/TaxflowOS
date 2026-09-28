import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { parseUploadToRows } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/parse-upload';

const XLSX = createRequire(
  new URL('../../artifacts/ai-workflow-builder/package.json', import.meta.url),
)('xlsx');

test('SAP column headings are recognized without manual column mapping', async () => {
  const parsed = await parseUploadToRows(multiSheetFile(), {
    selection: { sheetName: 'SAP EXPORT', headerRowNumber: 3, currency: 'EUR' },
  });
  assert.equal(parsed.rows.length, 2163);
  assert.equal(parsed.rows[0].account, '41000000');
  assert.equal(parsed.rows[0].description, 'Entry 1');
  assert.equal(parsed.rows[2162].amount, 2163);
});

function multiSheetFile() {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([]), 'SAP metadata');
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([['Read me'], ['Cover notes']]),
    'Summary',
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Company export'],
      [],
      ['G/L Account', 'Jrnl.Entry Item Text', 'Amount in CC Crcy'],
      ...Array.from({ length: 2163 }, (_, i) => [41000000 + i, `Entry ${i + 1}`, i + 1]),
    ]),
    'SAP EXPORT',
  );
  workbook.Workbook = {
    Sheets: [
      { name: 'SAP metadata', Hidden: 2 },
      { name: 'Summary', Hidden: 0 },
      { name: 'SAP EXPORT', Hidden: 0 },
    ],
  };
  return new File(
    [XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })],
    'synthetic-sap.xlsx',
  );
}

test('SAP-style workbook requires selection and imports all selected rows with explicit headings', async () => {
  const file = multiSheetFile();
  await assert.rejects(() => parseUploadToRows(file), /Choose a worksheet/);
  const parsed = await parseUploadToRows(file, {
    selectWorkbook: async (workbook) => {
      assert.deepEqual(
        workbook.sheets.map((sheet) => sheet.sheetName),
        ['Summary', 'SAP EXPORT'],
      );
      return {
        sheetName: 'SAP EXPORT',
        headerRowNumber: 3,
        mapping: {
          account: 'G/L Account',
          description: 'Jrnl.Entry Item Text',
          amount: 'Amount in CC Crcy',
        },
      };
    },
  });
  assert.equal(parsed.rows.length, 2163);
  assert.equal(parsed.rows[0].rowNumber, 4);
  assert.equal(parsed.rows[2162].rowNumber, 2166);
  assert.equal(parsed.rows[2162].amount, 2163);
  assert.equal(
    parsed.rows.reduce((sum, row) => sum + row.amount, 0),
    2340366,
  );
  assert.deepEqual(JSON.parse(JSON.stringify(parsed.rows[0].sourceSelection)), {
    sheetName: 'SAP EXPORT',
    headerRowNumber: 3,
    mapping: {
      account: 'G/L Account',
      description: 'Jrnl.Entry Item Text',
      amount: 'Amount in CC Crcy',
    },
  });
});

test('missing selected sheets and cancellation never fall back to another sheet', async () => {
  const file = multiSheetFile();
  await assert.rejects(
    () => parseUploadToRows(file, { selection: { sheetName: 'Missing' } }),
    /unavailable/,
  );
  await assert.rejects(
    () =>
      parseUploadToRows(file, {
        selectWorkbook: async () => {
          throw new Error('Cancelled');
        },
      }),
    /Cancelled/,
  );
});

test('oversized sheets are rejected rather than truncated', async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Label', 'Amount'],
      ...Array.from({ length: 50001 }, () => ['Entry', 1]),
    ]),
    'Data',
  );
  const file = new File([XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })], 'large.xlsx');
  await assert.rejects(
    () => parseUploadToRows(file, { selection: { sheetName: 'Data', headerRowNumber: 1 } }),
    /exceeds 50,000/,
  );
});

test('selected exports use the confirmed currency and do not assume USD', async () => {
  const selection = {
    sheetName: 'SAP EXPORT',
    headerRowNumber: 3,
    mapping: {
      account: 'G/L Account',
      amount: 'Amount in CC Crcy',
    },
  };
  const file = multiSheetFile();
  const unknown = await parseUploadToRows(file, { selection });
  assert.equal(unknown.rows[0].currency, undefined);
  const euro = await parseUploadToRows(file, { selection: { ...selection, currency: 'EUR' } });
  assert.equal(euro.rows[0].currency, 'EUR');
});

test('explicit mapping never extracts other adjacent numbers', async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Label', 'Chosen amount', 'Other number'],
      ['Entry', '', 900],
    ]),
    'Data',
  );
  const file = new File(
    [XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })],
    'mapping.xlsx',
  );
  await assert.rejects(
    () =>
      parseUploadToRows(file, {
        selection: {
          sheetName: 'Data',
          headerRowNumber: 1,
          mapping: { label: 'Label', amount: 'Chosen amount' },
        },
      }),
    /No source records/,
  );
});

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
