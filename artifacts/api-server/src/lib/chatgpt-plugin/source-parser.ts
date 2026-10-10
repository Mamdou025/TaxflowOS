import { createHash, randomUUID } from 'node:crypto';
import * as XLSX from 'xlsx';
import {
  getExcelTableSelection,
  parseExcelWorkbookFile,
  type WorkbookFile,
} from '@workspace/source-connectors/workbook';
import {
  parseUploadToRows,
  type WorkbookSelection,
} from '@workspace/source-connectors/workbook-upload';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { extractWorkflowDocument } from '../workflow-document-extraction';
import { assertSourceArchiveBudget } from './source-archive-budget';

export const parseWorkbook = (
  file: WorkbookFile,
  options: { sheetName?: string; rowLimit?: number } = {},
) =>
  parseExcelWorkbookFile(
    file,
    async (bytes) => {
      const workbook = XLSX.read(bytes, {
        cellDates: true,
        type: 'array',
        sheetRows: 50002,
        ...(options.sheetName ? { sheets: [options.sheetName] } : {}),
      });
      return workbook.SheetNames.filter((name) => Object.hasOwn(workbook.Sheets, name)).map(
        (name) => {
          const sheet = workbook.Sheets[name];
          const range = XLSX.utils.decode_range(sheet['!fullref'] ?? sheet['!ref'] ?? 'A1');
          if (range.e.r >= 50001 || range.e.c >= 500)
            throw new Error(
              'Use a worksheet with at most 50,000 data rows and 500 columns; no partial source was captured.',
            );
          return {
            name,
            hidden: Boolean(
              workbook.Workbook?.Sheets?.find((sheet) => sheet.name === name)?.Hidden,
            ),
            cells: XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], {
              blankrows: true,
              defval: '',
              header: 1,
              raw: false,
              range: 0,
            }),
          };
        },
      );
    },
    options,
  );

export function capturedFile(bytes: Buffer, name: string): WorkbookFile {
  return {
    name,
    size: bytes.length,
    arrayBuffer: async () => Uint8Array.from(bytes).buffer,
    text: async () => bytes.toString('utf8'),
  };
}

export async function inspectSourceFile(
  bytes: Buffer,
  name: string,
  selection: { sheetName?: string; headerRowNumber?: number } = {},
) {
  assertSourceArchiveBudget(bytes);
  if (!/\.(xlsx|xls)$/i.test(name))
    return { kind: /\.json$/i.test(name) ? 'json' : 'document', fileName: name, sheets: [] };
  const workbook = await parseWorkbook(
    capturedFile(bytes, name),
    selection.sheetName ? { sheetName: selection.sheetName, rowLimit: 50000 } : {},
  );
  return {
    kind: 'workbook',
    fileName: name,
    sheets: workbook.sheets
      .filter((sheet) => !sheet.hidden)
      .map((sheet) => {
        const headerRowNumber = selection.headerRowNumber ?? sheet.detectedHeaderRowNumber;
        if (headerRowNumber < 1 || headerRowNumber >= sheet.cells.length)
          throw new Error('Choose a header followed by data rows.');
        return {
          sheetName: sheet.sheetName,
          headers: getExcelTableSelection(sheet, { headerRowNumber }).headers,
          detectedHeaderRowNumber: headerRowNumber,
          previewRows: sheet.cells
            .slice(headerRowNumber - 1, headerRowNumber + 14)
            .map((row) => row.slice(0, 80)),
        };
      }),
  };
}

export async function parseSourceFile(
  bytes: Buffer,
  name: string,
  selection?: WorkbookSelection,
): Promise<DocumentExtraction> {
  assertSourceArchiveBudget(bytes);
  if (/\.(pdf|docx)$/i.test(name)) {
    const result = await extractWorkflowDocument(Uint8Array.from(bytes), name);
    if (!result.segments.some((segment) => segment.text.trim()))
      throw new Error(
        'This document has no readable text. OCR is required; the previous source was retained.',
      );
    return result;
  }
  if (/\.(xlsx|xls)$/i.test(name) && !selection)
    throw new Error('Select the worksheet, header and columns before capturing the trial balance.');
  // The embedded form labels omitted columns "Not mapped". Explicit blanks
  // suppress the shared parser's browser-oriented header inference for this adapter.
  const exactSelection = selection
    ? {
        ...selection,
        mapping: {
          account: '',
          label: '',
          description: '',
          amount: '',
          debit: '',
          credit: '',
          currency: '',
          accountType: '',
          ...selection.mapping,
        },
      }
    : undefined;
  const parsed = await parseUploadToRows(capturedFile(bytes, name), parseWorkbook, {
    selection: exactSelection,
  });
  const rows = parsed.rows.map((row, index) => ({
    ...row,
    ...(exactSelection &&
    row.sourceSelection &&
    typeof row.sourceSelection === 'object' &&
    !Array.isArray(row.sourceSelection)
      ? {
          sourceSelection: {
            ...row.sourceSelection,
            mapping: Object.fromEntries(
              Object.entries(exactSelection.mapping).filter(([, value]) => value),
            ),
          },
        }
      : {}),
    amount: Number.isFinite(row.amount) ? row.amount : null,
    sourceLocation: /\.json$/i.test(name)
      ? `JSON record ${index + 1}`
      : `Worksheet ${selection?.sheetName}, row ${row.rowNumber ?? 'unavailable'}`,
  }));
  if (rows.length > 50000)
    throw new Error('Use at most 50,000 source rows; no partial source was attached.');
  return {
    id: randomUUID(),
    revision: 1,
    fileName: name,
    contentHash: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
    extractedAt: new Date().toISOString(),
    method: /\.json$/i.test(name) ? 'json' : 'workbook',
    rows,
    segments: [],
    issues: [],
  };
}
