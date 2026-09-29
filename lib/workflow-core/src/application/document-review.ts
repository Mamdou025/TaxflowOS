import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type {
  DocumentReviewDraft,
  DocumentReview,
} from '@workspace/workflow-contracts/domain/document-review';
import { DocumentReviewDraftSchema } from '@workspace/workflow-contracts/generated-schemas';
import { WorkflowCommandError } from './commands';

export function currentDocumentSourceIds(session: Pick<WorkflowSession, 'sources'>) {
  const active = new Map<string, string[]>();
  for (const source of session.sources) {
    if (source.mode === 'replace') active.set(source.blockId, []);
    active.set(source.blockId, [...(active.get(source.blockId) ?? []), source.id]);
  }
  return new Set([...active.values()].flat());
}

/** Validate citations against captured content, not a model's claim about its source. */
export function prepareDocumentReview(
  session: WorkflowSession,
  sourceId: string,
  input: unknown,
): DocumentReviewDraft {
  const fail = (message: string): never => {
    throw new WorkflowCommandError('INVALID_REQUEST', message);
  };
  const source = session.sources.find((item) => item.id === sourceId);
  if (!source?.extraction || !currentDocumentSourceIds(session).has(sourceId))
    return fail(
      'Choose a current captured document from this run. Replaced sources cannot receive new interpretations.',
    );
  if ((JSON.stringify(input) ?? '').length > 60000)
    return fail('Keep one document review below 60,000 characters.');
  const parsed = DocumentReviewDraftSchema.safeParse(input);
  if (!parsed.success)
    return fail('Supply observations and questions using the document review schema.');
  const draft = parsed.data;
  if (draft.observations.length + draft.questions.length > 60)
    return fail('Use at most 60 observations and questions per review.');
  const required = ['document_type', 'company', 'reporting_period', 'currency'];
  if (
    required.some(
      (field) => ![...draft.observations, ...draft.questions].some((item) => item.field === field),
    )
  )
    return fail(
      'Address document type, company, reporting period and currency, or record a question for each missing field.',
    );
  const extraction = source.extraction;
  for (const item of [...draft.observations, ...draft.questions]) {
    const value = 'value' in item ? item.value : item.question;
    if (!value.trim() || value.length > 4000)
      return fail('Each observation or question must contain 1–4,000 characters.');
    if (
      item.citations.length > 8 ||
      (('value' in item || item.kind !== 'missing') && !item.citations.length)
    )
      return fail(
        'Observations, ambiguities and conflicts require source quotations; use at most eight per item.',
      );
    for (const citation of item.citations) {
      const segment = extraction.segments.find((part) => part.id === citation.segmentId);
      const match = /^record-([1-9]\d*)$/.exec(citation.segmentId);
      const row =
        !extraction.segments.length && match ? extraction.rows[Number(match[1]) - 1] : undefined;
      const text = segment?.text ?? (row ? JSON.stringify(row) : undefined);
      if (!citation.quote.trim() || citation.quote.length > 2000 || !text?.includes(citation.quote))
        return fail(
          `The quotation for ${citation.segmentId} does not match this captured document. Read the evidence again.`,
        );
    }
  }
  return structuredClone(draft);
}

export function documentReviewSummaries(
  session: Pick<WorkflowSession, 'sources' | 'documentReviews'>,
) {
  const active = currentDocumentSourceIds(session);
  const reviews = session.documentReviews ?? [];
  return reviews.map((review, index) => ({
    ...review,
    status: !active.has(review.sourceId)
      ? ('source_replaced' as const)
      : reviews.slice(index + 1).some((item) => item.sourceId === review.sourceId)
        ? ('earlier_review' as const)
        : ('current' as const),
  }));
}

export function makeDocumentReview(
  session: WorkflowSession,
  sourceId: string,
  input: unknown,
  id: string,
  at: string,
): DocumentReview {
  if (!id || (session.documentReviews ?? []).some((review) => review.id === id))
    throw new WorkflowCommandError('INVALID_REQUEST', 'Use a unique review operation ID.');
  const draft = prepareDocumentReview(session, sourceId, input);
  const source = session.sources.find((item) => item.id === sourceId)!;
  return {
    id,
    at,
    sessionRevision: session.revision + 1,
    sourceId,
    sourceRevision: source.extraction!.revision,
    sourceHash: source.extraction!.contentHash,
    fileName: source.name,
    blockId: source.blockId,
    draft,
  };
}
