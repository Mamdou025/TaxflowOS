import {
  buildExcelSourceConfigPatch,
  detectExcelColumnMapping,
  parseExcelNumber,
  parseExcelWorkbookFile,
  getExcelTableSelection,
  type ExcelColumnMapping,
  type ExcelWorkbookSourceData,
} from '@/shared/workflow-engine/parsing/excel-utils';
import type { SourceRow } from './engine';

export type ParsedUpload = { fileName: string; rows: SourceRow[] };
export type WorkbookSelection = {
  sheetName: string;
  currency?: string;
  headerRowNumber?: number;
  mapping?: ExcelColumnMapping;
};
export type SelectWorkbook = (workbook: ExcelWorkbookSourceData) => Promise<WorkbookSelection>;
export type UploadOptions = { selectWorkbook?: SelectWorkbook; selection?: WorkbookSelection };

/**
 * Parse an uploaded workbook into the engine's SourceRow[] using the SAME
 * parser the builder's Excel panel uses (`parseExcelWorkbookFile` +
 * `buildExcelSourceConfigPatch`). This is what makes the chat run and the
 * builder run agree on the exact same rows for the exact same file.
 *
 * Throws (with a human message) if the file isn't a readable .xlsx/.xls.
 */
export async function parseUploadToRows(
  file: File,
  options: UploadOptions = {},
): Promise<ParsedUpload> {
  if (file.size > 20 * 1024 * 1024) throw new Error('Use a source file smaller than 20 MB.');
  if (/\.json$/i.test(file.name)) {
    const records: unknown = JSON.parse(await file.text());
    if (
      !Array.isArray(records) ||
      !records.length ||
      records.some((row) => !row || typeof row !== 'object' || Array.isArray(row))
    )
      throw new Error('Use a non-empty JSON array of source records.');
    return {
      fileName: file.name,
      rows: records.map((r, i) => ({
        ...r,
        rowId: String(r.rowId ?? `upload-${i + 1}`),
        label: String(r.label ?? r.entity ?? r.owner ?? `Record ${i + 1}`),
        amount:
          typeof r.amount === 'boolean' || r.amount == null || String(r.amount).trim() === ''
            ? NaN
            : Number(r.amount),
      })),
    };
  }
  let workbook = await parseExcelWorkbookFile(file);
  const candidates = workbook.sheets.filter((sheet) => !sheet.hidden);
  if (!candidates.length) throw new Error('This workbook has no visible data sheets.');
  const selection =
    options.selection ??
    (options.selectWorkbook
      ? await options.selectWorkbook({ ...workbook, sheets: candidates })
      : undefined);
  if (!selection && candidates.length !== 1)
    throw new Error(
      'Choose a worksheet and its columns using the chat attachment or workflow upload dialog.',
    );
  let sheet =
    candidates.find((item) => item.sheetName === selection?.sheetName) ??
    (!selection ? candidates[0] : undefined);
  if (!sheet)
    throw new Error('The selected worksheet is unavailable. Select a visible data sheet.');
  if (sheet.truncated) {
    workbook = await parseExcelWorkbookFile(file, { sheetName: sheet.sheetName, rowLimit: 50000 });
    sheet = workbook.sheets[0];
  }
  if (sheet.truncated)
    throw new Error(
      'This sheet exceeds 50,000 rows. Import a smaller source; no partial data was attached.',
    );
  const headerRowNumber = selection?.headerRowNumber ?? sheet.detectedHeaderRowNumber;
  if (
    !Number.isInteger(headerRowNumber) ||
    headerRowNumber < 1 ||
    headerRowNumber >= sheet.cells.length
  )
    throw new Error('Choose a header row followed by data rows.');
  const table = getExcelTableSelection(sheet, {
    headerRowNumber,
    firstDataRowNumber: headerRowNumber + 1,
  });
  const mapping = { ...detectExcelColumnMapping(table.headers), ...selection?.mapping };
  for (const column of Object.values(mapping)) {
    if (column && !table.headers.includes(column))
      throw new Error(`Column "${column}" is unavailable. Review the column mapping.`);
  }
  const hasAmounts = Boolean(mapping.amount || mapping.debit || mapping.credit);
  // Check original cells before normalization can discard unreadable amounts.
  for (const [index, cells] of sheet.cells.slice(headerRowNumber).entries()) {
    for (const column of [mapping.amount, mapping.debit, mapping.credit]) {
      const value = column ? cells[table.headers.indexOf(column)] : undefined;
      if (value?.trim() && parseExcelNumber(value) === null)
        throw new Error(
          `Row ${headerRowNumber + index + 1}: ${column} must contain a readable number.`,
        );
    }
  }
  const patch = buildExcelSourceConfigPatch({
    workbook,
    selectedSheetName: sheet.sheetName,
    headerRowNumber,
    firstDataRowNumber: headerRowNumber + 1,
    mapping,
    includeRowsWithoutAmount: !hasAmounts,
    allowLooseExtraction: !selection,
    defaultCurrency: selection ? (selection.currency?.trim().toUpperCase() ?? '') : undefined,
  });
  const raw = Array.isArray(patch.rows) ? (patch.rows as Array<Record<string, unknown>>) : [];
  const rows: SourceRow[] = raw.map((r, i) => ({
    ...(r.raw && typeof r.raw === 'object' ? r.raw : {}),
    ...r,
    sourceSelection: {
      sheetName: sheet.sheetName,
      headerRowNumber,
      mapping,
      currency: selection?.currency,
    },
    rowId: String(r.rowId ?? `upload-row-${i + 1}`),
    account: r.account ? String(r.account) : undefined,
    label: String(r.label ?? r.description ?? `Row ${i + 1}`),
    description: r.description ? String(r.description) : undefined,
    amount:
      !hasAmounts ||
      typeof r.amount === 'boolean' ||
      r.amount == null ||
      String(r.amount).trim() === ''
        ? NaN
        : Number(r.amount),
    currency: r.currency ? String(r.currency) : undefined,
  }));
  if (!rows.length)
    throw new Error('No source records were found. Check the sheet and its column headings.');
  return { fileName: workbook.fileName, rows };
}
