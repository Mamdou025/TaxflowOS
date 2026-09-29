import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { ToolExecutionContext, ToolRunResult } from './tools/types';
import { completeResult } from './tools/primitives';

/** Invalid captures fail closed; legacy sources without a capture retain their existing path. */
export function replayDocumentEvidence(context: ToolExecutionContext): ToolRunResult | null {
  const raw = context.config.documentExtractions;
  if (raw === undefined) return null;
  const parsed = DocumentExtractionSchema.array().nonempty().safeParse(raw);
  if (
    !parsed.success ||
    parsed.data.some(
      (item) =>
        !item.id ||
        item.revision < 1 ||
        !Number.isInteger(item.revision) ||
        !/^sha256:[a-f0-9]{64}$/.test(item.contentHash) ||
        item.segments.some((segment) => !segment.id || !segment.location) ||
        new Set(item.segments.map((segment) => segment.id)).size !== item.segments.length ||
        (!item.rows.length && !item.segments.some((segment) => segment.text.trim())),
    )
  ) {
    return completeResult({
      context,
      output: {},
      status: 'error',
      errors: ['The saved document extraction is invalid or empty. Upload the original again.'],
    });
  }
  const extractions = parsed.data;
  const evidenceRefs = extractions.flatMap((source) =>
    source.segments.map((segment) => ({
      evidenceId: `${source.id}:r${source.revision}:${segment.id}`,
      immutable: true as const,
      sourceBlockId: context.block.id,
      sourceLabel: source.fileName,
      label: segment.location,
      locator: `${source.contentHash}#${segment.id}`,
      valuePreview: segment.text.slice(0, 200),
    })),
  );
  const warnings = extractions.flatMap((source) =>
    source.issues.map((issue) => `${source.fileName}: ${issue.message}`),
  );
  return completeResult({
    context,
    status: warnings.length ? 'warning' : 'success',
    warnings,
    evidenceRefs,
    sourceTrace: evidenceRefs.map((ref) => ({
      sourceBlockId: ref.sourceBlockId,
      sourceLabel: ref.sourceLabel,
      evidenceRefId: ref.evidenceId,
      relationshipPath: [context.block.id],
      valuePreview: ref.valuePreview,
    })),
    output: {
      extractions,
      rows: extractions.flatMap((source) => source.rows),
      text: extractions
        .flatMap((source) => source.segments.map((segment) => segment.text))
        .join('\n\n'),
      immutable: true,
      live: false,
    },
  });
}
