'use client';

import {
  buildExcelSourceConfigPatch,
  parseExcelWorkbookFile,
} from '@/components/workflow/source-viewers/excel-utils';
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
  const workbook = await parseExcelWorkbookFile(file);
  const patch = buildExcelSourceConfigPatch({ workbook });
  const raw = Array.isArray(patch.rows) ? (patch.rows as Array<Record<string, unknown>>) : [];
  const rows: SourceRow[] = raw.map((r, i) => ({
    rowId: String(r.rowId ?? `upload-row-${i + 1}`),
    account: r.account ? String(r.account) : undefined,
    label: String(r.label ?? r.description ?? `Row ${i + 1}`),
    description: r.description ? String(r.description) : undefined,
    amount: Number(r.amount) || 0,
    currency: r.currency ? String(r.currency) : undefined,
  }));
  return { fileName: workbook.fileName, rows };
}
