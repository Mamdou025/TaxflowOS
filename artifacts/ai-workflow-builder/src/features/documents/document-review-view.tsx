import type { DocumentReview } from '@workspace/workflow-contracts/domain/document-review';

const labels = {
  document_type: 'Document type',
  company: 'Company',
  reporting_period: 'Reporting period',
  currency: 'Currency',
  fact: 'Fact',
  workflow_relevance: 'Relevance to this workflow',
};
export function DocumentReviewView({
  reviews,
}: {
  reviews: (DocumentReview & { status?: 'current' | 'source_replaced' | 'earlier_review' })[];
}) {
  return (
    <section aria-label="Document interpretation" className="space-y-3 rounded border p-3">
      <h4 className="font-medium">Document interpretation</h4>
      <p className="text-sm">
        Proposed interpretations with source quotations. Saving notes does not approve their meaning
        or apply values to calculations.
      </p>
      {!reviews.length && (
        <p className="text-sm">
          No interpretation recorded. Ask Sina to review the attached documents and identify their
          company, period, currency, relevant facts and open questions.
        </p>
      )}
      {reviews.map((review) => (
        <details key={review.id} open={review.status === 'current'}>
          <summary>
            {review.fileName} · source revision {review.sourceRevision} ·{' '}
            {review.status === 'source_replaced'
              ? 'Source replaced — historical notes'
              : review.status === 'earlier_review'
                ? 'Earlier interpretation'
                : 'Proposed interpretation'}
          </summary>
          <p className="text-xs break-all">
            Run revision {review.sessionRevision} · {review.sourceHash}
          </p>
          {review.draft.observations.map((item, index) => (
            <div key={`observation-${index}`} className="my-2">
              <p>
                <strong>{labels[item.field]}:</strong> {item.value}
              </p>
              {item.citations.map((citation, i) => (
                <blockquote key={i} className="ml-3 border-l pl-2 text-sm">
                  <p>{citation.quote}</p>
                  <p className="text-xs">
                    Evidence {review.sourceId}:r{review.sourceRevision}:{citation.segmentId}
                  </p>
                </blockquote>
              ))}
            </div>
          ))}
          <h5 className="font-medium">Open questions</h5>
          {!review.draft.questions.length && (
            <p className="text-sm">
              No questions recorded. Document completeness has not been established.
            </p>
          )}
          {review.draft.questions.map((item, index) => (
            <div key={`question-${index}`} className="my-2">
              <p>
                <strong>
                  {labels[item.field]} · {item.kind}:
                </strong>{' '}
                {item.question}
              </p>
              {item.citations.map((citation, i) => (
                <blockquote key={i} className="ml-3 border-l pl-2 text-sm">
                  <p>{citation.quote}</p>
                  <p className="text-xs">
                    Evidence {review.sourceId}:r{review.sourceRevision}:{citation.segmentId}
                  </p>
                </blockquote>
              ))}
            </div>
          ))}
        </details>
      ))}
    </section>
  );
}
