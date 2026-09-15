

import {
  buildExcelSourceConfigPatch,
  detectExcelColumnMapping,
  parseExcelNumber,
  parseExcelWorkbookFile,
} from '@/shared/workflow-engine/parsing/excel-utils';
import type { SourceRow } from './engine';

export type ParsedUpload = { fileName: string; rows: SourceRow[] };

/**
 * Parse an uploaded workbook into the engine's SourceRow[] using the SAME
 * parser the builder's Excel panel uses (`parseExcelWorkbookFile` +
 * `buildExcelSourceConfigPatch`). This is what makes the chat run and the
 * builder run agree on the exact same rows for the exact same file.
 *
 * Throws (with a human message) if the file isn't a readable .xlsx/.xls.
 */
export async function parseUploadToRows(file: File): Promise<ParsedUpload> {
  if (file.size > 20 * 1024 * 1024) throw new Error('Use a source file smaller than 20 MB.');
  if (/\.json$/i.test(file.name)) {
    const records: unknown = JSON.parse(await file.text());
    if (!Array.isArray(records) || !records.length || records.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Use a non-empty JSON array of source records.');
    return { fileName: file.name, rows: records.map((r, i) => ({ ...r, rowId: String(r.rowId ?? `upload-${i + 1}`), label: String(r.label ?? r.entity ?? r.owner ?? `Record ${i + 1}`), amount: typeof r.amount === 'boolean' || r.amount == null || String(r.amount).trim() === '' ? NaN : Number(r.amount) })) };
  }
  const workbook = await parseExcelWorkbookFile(file);
  const sheet = workbook.sheets[0];
  if (sheet.truncated) throw new Error('This sheet exceeds the parser row limit. Select a smaller source so no records are silently omitted.');
  const mapping = detectExcelColumnMapping(sheet.headers);
  const hasAmounts = Boolean(mapping.amount || mapping.debit || mapping.credit);
  const patch = buildExcelSourceConfigPatch({ workbook, includeRowsWithoutAmount: !hasAmounts });
  const raw = Array.isArray(patch.rows) ? (patch.rows as Array<Record<string, unknown>>) : [];
  for (const row of raw) {
    const values = row.raw as Record<string, unknown> | undefined;
    for (const column of [mapping.amount, mapping.debit, mapping.credit]) {
      const value = column && values?.[column];
      if (column && value !== undefined && String(value).trim() && parseExcelNumber(value) === null)
        throw new Error(`Row ${row.rowNumber}: ${column} must contain a readable number.`);
    }
  }
  const rows: SourceRow[] = raw.map((r, i) => ({
    ...(r.raw && typeof r.raw === 'object' ? r.raw : {}),
    ...r,
    rowId: String(r.rowId ?? `upload-row-${i + 1}`),
    account: r.account ? String(r.account) : undefined,
    label: String(r.label ?? r.description ?? `Row ${i + 1}`),
    description: r.description ? String(r.description) : undefined,
    amount: !hasAmounts || typeof r.amount === 'boolean' || r.amount == null || String(r.amount).trim() === '' ? NaN : Number(r.amount),
    currency: r.currency ? String(r.currency) : undefined,
  }));
  if (!rows.length) throw new Error('No source records were found. Check the sheet and its column headings.');
  return { fileName: workbook.fileName, rows };
}
