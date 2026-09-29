import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { apiFetch } from '@/platform/auth/api-fetch';
import {
  parseUploadToRows,
  type UploadOptions,
} from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { uploadDocument } from './upload-client';

export async function captureWorkflowDocument(
  file: File,
  options: UploadOptions = {},
): Promise<DocumentExtraction> {
  if (file.size > 20 * 1024 * 1024) throw new Error('Use a source file smaller than 20 MB.');
  const bytes = await file.arrayBuffer();
  const hash = `sha256:${Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  let extraction: DocumentExtraction;
  if (/\.(pdf|docx)$/i.test(file.name)) {
    const body = new FormData();
    body.append('file', file);
    const response = await apiFetch('/api/workflow-extract', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(120000),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(
        typeof result.error === 'string' ? result.error : 'Document extraction failed.',
      );
    if (result.needsOcr)
      throw new Error(
        'This document has no readable text. OCR is required; no evidence was attached. Use a text-based document or the explicit OCR acquisition flow.',
      );
    const parsed = DocumentExtractionSchema.safeParse(result.extraction);
    if (!parsed.success || parsed.data.contentHash !== hash || parsed.data.fileName !== file.name)
      throw new Error('The extraction could not be verified against the uploaded document.');
    extraction = parsed.data;
  } else {
    if (!/\.(xlsx|xls|json)$/i.test(file.name))
      throw new Error('Use a PDF, Word, Excel or JSON document.');
    const parsed = await parseUploadToRows(file, options);
    // NaN represents a missing numeric field in the legacy upload parser; persist it as null.
    const rows = parsed.rows.map((row, index) => ({
      ...row,
      amount: Number.isFinite(row.amount) ? row.amount : null,
      sourceLocation: /\.json$/i.test(file.name)
        ? `JSON record ${index + 1}`
        : `Worksheet ${String(row.sheetName ?? (row.sourceSelection as { sheetName?: string } | undefined)?.sheetName ?? 'selected sheet')}, row ${String(row.rowNumber ?? 'unavailable')}`,
    }));
    extraction = {
      id: crypto.randomUUID(),
      revision: 1,
      fileName: file.name,
      contentHash: hash,
      extractedAt: new Date().toISOString(),
      method: /\.json$/i.test(file.name) ? 'json' : 'workbook',
      rows,
      segments: [],
      issues: [],
    };
  }
  const uploaded = await uploadDocument(file);
  if (uploaded.documentId) extraction.originalDocumentId = uploaded.documentId;
  else
    extraction.issues.push({
      code: 'ORIGINAL_NOT_STORED',
      message: `Extracted evidence is retained in the run; the original file was not confirmed saved in Sources: ${uploaded.error}`,
    });
  return extraction;
}
