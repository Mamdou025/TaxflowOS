export type DocumentReviewField =
  'document_type' | 'company' | 'reporting_period' | 'currency' | 'fact' | 'workflow_relevance';
export type DocumentReviewCitation = { segmentId: string; quote: string };
/** Interpretations proposed from one exact document; never calculation inputs. */
export type DocumentReviewDraft = {
  observations: {
    field: DocumentReviewField;
    value: string;
    citations: DocumentReviewCitation[];
  }[];
  questions: {
    field: DocumentReviewField;
    kind: 'missing' | 'ambiguous' | 'conflict';
    question: string;
    citations: DocumentReviewCitation[];
  }[];
};
export type DocumentReview = {
  id: string;
  at: string;
  sessionRevision: number;
  sourceId: string;
  sourceRevision: number;
  sourceHash: string;
  fileName: string;
  blockId: string;
  draft: DocumentReviewDraft;
};
