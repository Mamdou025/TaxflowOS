import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import {
  inspectSourceFile,
  parseSourceFile,
} from '../../artifacts/api-server/src/lib/chatgpt-plugin/source-parser';

const requireApi = createRequire(path.resolve('artifacts/api-server/package.json'));
const XLSX = requireApi('xlsx') as typeof import('../../artifacts/api-server/node_modules/xlsx');

function workbook(sheets: { name: string; rows: unknown[][]; hidden?: boolean }[]) {
  const book = XLSX.utils.book_new();
  for (const sheet of sheets)
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(sheet.rows), sheet.name);
  book.Workbook = {
    Sheets: sheets.map((sheet) => ({ name: sheet.name, Hidden: sheet.hidden ? 1 : 0 })),
  };
  return Buffer.from(XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }));
}

function blankPdf() {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << >> /Contents 4 0 R >>',
    '<< /Length 0 >>\nstream\n\nendstream',
  ];
  let body = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 5\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    .join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(body);
}

test('workbook capture uses the selected visible sheet, explicit header and independent expected values', async () => {
  const bytes = workbook([
    {
      name: 'Wrong period',
      rows: [
        ['Label', 'Amount'],
        ['Wrong row', 999],
      ],
    },
    {
      name: 'Selected',
      rows: [
        ['Statement title'],
        ['Account', 'Label', 'Amount'],
        ['4100', 'Interest income', '1,250.50'],
        ['6100', 'Expense', '(40.25)'],
      ],
    },
    {
      name: 'Hidden',
      hidden: true,
      rows: [
        ['Label', 'Amount'],
        ['Secret row', 900],
      ],
    },
  ]);
  const inspection = await inspectSourceFile(bytes, 'trial.xlsx');
  assert.deepEqual(
    inspection.sheets.map((sheet) => sheet.sheetName),
    ['Wrong period', 'Selected'],
  );
  const result = await parseSourceFile(bytes, 'trial.xlsx', {
    sheetName: 'Selected',
    headerRowNumber: 2,
    mapping: { account: 'Account', label: 'Label', amount: 'Amount' },
    currency: 'cad',
  });
  assert.deepEqual(
    result.rows.map((row) => [row.account, row.label, row.amount, row.currency]),
    [
      ['4100', 'Interest income', 1250.5, 'CAD'],
      ['6100', 'Expense', -40.25, 'CAD'],
    ],
  );
  assert.deepEqual(
    result.rows.map((row) => row.sourceLocation),
    ['Worksheet Selected, row 3', 'Worksheet Selected, row 4'],
  );
  assert.equal(result.contentHash, `sha256:${createHash('sha256').update(bytes).digest('hex')}`);
  assert.equal(result.method, 'workbook');
  assert.deepEqual(JSON.parse(JSON.stringify(result.rows[0].sourceSelection)), {
    sheetName: 'Selected',
    headerRowNumber: 2,
    mapping: { account: 'Account', label: 'Label', amount: 'Amount' },
    currency: 'cad',
  });
});

test('capture never selects a different worksheet or missing mapped column', async () => {
  const bytes = workbook([
    {
      name: 'Visible',
      rows: [
        ['Label', 'Amount'],
        ['Interest', 12],
      ],
    },
    {
      name: 'Hidden',
      hidden: true,
      rows: [
        ['Label', 'Amount'],
        ['Other', 13],
      ],
    },
  ]);
  await assert.rejects(parseSourceFile(bytes, 'trial.xlsx'), /Select the worksheet/);
  for (const sheetName of ['Missing', 'Hidden'])
    await assert.rejects(
      parseSourceFile(bytes, 'trial.xlsx', {
        sheetName,
        headerRowNumber: 1,
        mapping: { label: 'Label', amount: 'Amount' },
      }),
      /unavailable|visible/,
    );
  await assert.rejects(
    parseSourceFile(bytes, 'trial.xlsx', {
      sheetName: 'Visible',
      headerRowNumber: 1,
      mapping: { label: 'Label', amount: 'Missing' },
    }),
    /Column.*unavailable/,
  );
  await assert.rejects(
    parseSourceFile(bytes, 'trial.xlsx', { sheetName: 'Visible', headerRowNumber: 2 }),
    /header row followed by data/,
  );
});

test('explicit mapping rejects unreadable amounts and ambiguous duplicate headers', async () => {
  const invalid = workbook([
    {
      name: 'Data',
      rows: [
        ['Label', 'Amount'],
        ['Interest', 'not a number'],
      ],
    },
  ]);
  await assert.rejects(
    parseSourceFile(invalid, 'trial.xlsx', {
      sheetName: 'Data',
      headerRowNumber: 1,
      mapping: { label: 'Label', amount: 'Amount' },
    }),
    /Row 2.*readable number/,
  );
  const duplicate = workbook([
    {
      name: 'Data',
      rows: [
        ['Label', 'Amount', 'Amount'],
        ['Interest', 10, 900],
      ],
    },
  ]);
  await assert.rejects(
    parseSourceFile(duplicate, 'trial.xlsx', {
      sheetName: 'Data',
      headerRowNumber: 1,
      mapping: { label: 'Label', amount: 'Amount' },
    }),
    /duplicate|ambiguous/i,
  );
});

test('columns left unmapped in the embedded form are not inferred from familiar headers', async () => {
  const bytes = workbook([
    {
      name: 'Data',
      rows: [
        ['Account', 'Amount', 'Currency'],
        ['Interest', 125, 'USD'],
      ],
    },
  ]);
  const result = await parseSourceFile(bytes, 'explicit.xlsx', {
    sheetName: 'Data',
    headerRowNumber: 1,
    mapping: { label: 'Account' },
  });
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].label, 'Interest');
  assert.equal(result.rows[0].amount, null);
  assert.equal(result.rows[0].currency, undefined);
  assert.equal(result.rows[0].account, undefined);
  assert.deepEqual((result.rows[0].sourceSelection as { mapping: unknown }).mapping, {
    label: 'Account',
  });
});

test('JSON preserves record provenance and does not replace unknown amounts with zero', async () => {
  const bytes = Buffer.from(
    JSON.stringify([
      { rowId: 'r1', label: 'Income', amount: 17 },
      { rowId: 'r2', label: 'Unknown', amount: null },
    ]),
  );
  const result = await parseSourceFile(bytes, 'source.json');
  assert.deepEqual(
    result.rows.map((row) => [row.rowId, row.amount, row.sourceLocation]),
    [
      ['r1', 17, 'JSON record 1'],
      ['r2', null, 'JSON record 2'],
    ],
  );
  assert.equal(result.contentHash, `sha256:${createHash('sha256').update(bytes).digest('hex')}`);
  for (const source of ['broken JSON', '{}', '[]', '[null]'])
    await assert.rejects(parseSourceFile(Buffer.from(source), 'source.json'));
});

test('a PDF containing no readable text requires OCR instead of accepting an empty extraction', async () => {
  await assert.rejects(parseSourceFile(blankPdf(), 'blank.pdf'), /no readable text.*OCR/i);
});

test('capture rejects source record sets beyond the documented limit without truncating', async () => {
  const bytes = Buffer.from(
    JSON.stringify(
      Array.from({ length: 50001 }, (_, index) => ({ label: `Record ${index}`, amount: index })),
    ),
  );
  await assert.rejects(
    parseSourceFile(bytes, 'too-many.json'),
    /at most 50,000 source rows.*no partial source/,
  );
});
