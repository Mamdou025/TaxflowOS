import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';

/** Bounded, pageable evidence access; it never executes or substitutes another attempt. */
export function inspectDocumentEvidence(
  result: ToolRunResult | undefined,
  request: {
    extractionId?: string;
    segmentId?: string;
    evidenceOffset?: number;
  } = {},
) {
  return inspectCapturedDocuments(result?.output.extractions, request);
}

export function inspectCapturedDocuments(
  value: unknown,
  request: { extractionId?: string; segmentId?: string; evidenceOffset?: number } = {},
) {
  const parsed = DocumentExtractionSchema.array().safeParse(value ?? []);
  if (!parsed.success) return { error: 'Recorded document evidence is invalid.' };
  const offset = request.evidenceOffset ?? 0;
  if (!Number.isInteger(offset) || offset < 0)
    return { error: 'Evidence offset must be a non-negative integer.' };
  if (!request.extractionId)
    return {
      documents: parsed.data.slice(offset, offset + 20).map((item) => ({
        extractionId: item.id,
        revision: item.revision,
        fileName: item.fileName,
        method: item.method,
        contentHash: item.contentHash,
        segments: item.segments.length,
        records: item.rows.length,
        issues: item.issues,
      })),
      nextOffset: offset + 20 < parsed.data.length ? offset + 20 : null,
    };
  const document = parsed.data.find((item) => item.id === request.extractionId);
  if (!document) return { error: 'That document is not part of this recorded block result.' };
  const identity = {
    extractionId: document.id,
    revision: document.revision,
    fileName: document.fileName,
    contentHash: document.contentHash,
    method: document.method,
  };
  const segments = document.segments.length
    ? document.segments
    : document.rows.map((row, index) => ({
        id: `record-${index + 1}`,
        location: String(row.sourceLocation ?? `Captured record ${index + 1}`),
        text: JSON.stringify(row),
      }));
  if (!request.segmentId)
    return {
      ...identity,
      issues: document.issues,
      segments: segments.slice(offset, offset + 20).map(({ id, location, text }) => ({
        segmentId: id,
        location,
        characters: text.length,
        citationId: `${document.id}:r${document.revision}:${id}`,
      })),
      nextOffset: offset + 20 < segments.length ? offset + 20 : null,
    };
  const segment = segments.find((item) => item.id === request.segmentId);
  if (!segment) return { error: 'That segment is not part of this recorded document.' };
  return {
    ...identity,
    location: segment.location,
    citationId: `${document.id}:r${document.revision}:${segment.id}`,
    text: segment.text.slice(offset, offset + 8000),
    nextOffset: offset + 8000 < segment.text.length ? offset + 8000 : null,
  };
}
