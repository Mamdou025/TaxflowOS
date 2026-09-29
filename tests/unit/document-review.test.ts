import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { DocumentReviewDraft } from '../../lib/workflow-contracts/src/domain/document-review';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  startSession,
  changeSession,
  getSession,
} from '../../lib/workflow-core/src/application/sessions';
import {
  prepareDocumentReview,
  documentReviewSummaries,
} from '../../lib/workflow-core/src/application/document-review';
import { inspectWorkflowRun } from '../../lib/workflow-core/src/application/inspection';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import { browserGraphRuntime } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';

const at = '2026-09-29T12:00:00.000Z';
function setup() {
  const base = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  ).library['custom:synthetic-document-calculation'].draft as WorkflowDefinition;
  const definition = {
    ...base,
    blocks: [
      {
        ...base.blocks[1],
        id: 'source',
        subtype: 'PDF / Document' as const,
        config: { toolId: 'source.pdf_document', sourceKind: 'pdf_document' },
      },
    ],
    edges: [],
  };
  let entry = startSession(
    saveVersion(createWorkflow('custom:review', 'blank', definition)),
    1,
    'run',
    at,
  );
  const apply = (action: Parameters<typeof changeSession>[3]) =>
    (entry = changeSession(
      entry,
      'run',
      getSession(entry, 'run').revision,
      action,
      browserGraphRuntime,
      at,
    ));
  const attach = (id: string) =>
    apply({
      kind: 'source',
      sourceId: id,
      blockId: 'source',
      name: 'company.pdf',
      mode: 'replace',
      rows: [],
      extraction: {
        id,
        revision: 1,
        extractedAt: at,
        fileName: 'company.pdf',
        contentHash: `sha256:${'a'.repeat(64)}`,
        method: 'pdf_text',
        rows: [],
        issues: [],
        segments: [
          {
            id: 'page-1',
            location: 'Page 1',
            page: 1,
            text: 'Northwind Synthetic Ltd. Financial statements. Year ended 2025-12-31. Currency CAD. Revenue 120.',
          },
        ],
      },
    });
  attach('first');
  return {
    get entry() {
      return entry;
    },
    get run() {
      return getSession(entry, 'run');
    },
    apply,
    attach,
  };
}
const draft = (): DocumentReviewDraft => ({
  observations: [
    {
      field: 'document_type',
      value: 'Financial statements',
      citations: [{ segmentId: 'page-1', quote: 'Financial statements.' }],
    },
    {
      field: 'company',
      value: 'Northwind Synthetic Ltd.',
      citations: [{ segmentId: 'page-1', quote: 'Northwind Synthetic Ltd.' }],
    },
    {
      field: 'reporting_period',
      value: 'Year ended 2025-12-31',
      citations: [{ segmentId: 'page-1', quote: 'Year ended 2025-12-31.' }],
    },
    {
      field: 'currency',
      value: 'CAD',
      citations: [{ segmentId: 'page-1', quote: 'Currency CAD.' }],
    },
  ],
  questions: [
    { field: 'fact', kind: 'missing', question: 'Are these audited statements?', citations: [] },
  ],
});
test('document review requires real quotations and explicitly addresses missing profile fields', () => {
  const { run } = setup();
  assert.deepEqual(prepareDocumentReview(run, 'first', draft()), draft());
  const badQuote = draft();
  badQuote.observations[0].citations[0].quote = 'Audited financial statements';
  assert.throws(() => prepareDocumentReview(run, 'first', badQuote), /does not match/);
  const badLocation = draft();
  badLocation.observations[0].citations[0].segmentId = 'page-2';
  assert.throws(() => prepareDocumentReview(run, 'first', badLocation), /does not match/);
  const missing = draft();
  missing.observations.pop();
  assert.throws(() => prepareDocumentReview(run, 'first', missing), /currency/);
  missing.questions.push({
    field: 'currency',
    kind: 'missing',
    question: 'Which currency applies?',
    citations: [],
  });
  assert.doesNotThrow(() => prepareDocumentReview(run, 'first', missing));
  const ambiguity = draft();
  ambiguity.questions[0].kind = 'ambiguous';
  assert.throws(() => prepareDocumentReview(run, 'first', ambiguity), /quotations/);
  assert.throws(() => prepareDocumentReview(run, 'first', undefined), /schema/);
});
test('saving notes preserves calculations, rejects stale writes and keeps replaced-source history', () => {
  const state = setup();
  state.apply({ kind: 'block', blockId: 'source' });
  const before = state.run;
  const input = draft();
  state.apply({ kind: 'document_review', sourceId: 'first', reviewId: 'review-1', draft: input });
  input.observations[0].value = 'mutated';
  assert.equal(state.run.documentReviews?.[0].draft.observations[0].value, 'Financial statements');
  assert.deepEqual(state.run.results, before.results);
  assert.deepEqual(state.run.attempts, before.attempts);
  assert.throws(
    () =>
      changeSession(
        state.entry,
        'run',
        before.revision,
        { kind: 'document_review', sourceId: 'first', reviewId: 'stale', draft: draft() },
        browserGraphRuntime,
        at,
      ),
    /changed/,
  );
  state.apply({ kind: 'document_review', sourceId: 'first', reviewId: 'review-2', draft: draft() });
  assert.deepEqual(
    documentReviewSummaries(state.run).map((item) => item.status),
    ['earlier_review', 'current'],
  );
  state.attach('replacement');
  assert.equal(documentReviewSummaries(state.run)[1].status, 'source_replaced');
  assert.throws(
    () =>
      state.apply({
        kind: 'document_review',
        sourceId: 'first',
        reviewId: 'obsolete',
        draft: draft(),
      }),
    /Replaced sources/,
  );
  const restored = validateWorkflowLibrary(
    JSON.parse(JSON.stringify({ [state.entry.id]: state.entry })),
  );
  assert.deepEqual(
    restored[state.entry.id].sessions?.[0].documentReviews,
    state.run.documentReviews,
  );
  const broken = structuredClone(restored);
  broken[state.entry.id].sessions![0].documentReviews![0].sourceHash = 'another-source';
  assert.throws(() => validateWorkflowLibrary(broken), /does not match/);
});
test('approved run snapshots retain their interpretation notes when later notes are saved', () => {
  const state = setup();
  state.apply({ kind: 'block', blockId: 'source' });
  state.apply({ kind: 'document_review', sourceId: 'first', reviewId: 'review-1', draft: draft() });
  state.apply({ kind: 'approve' });
  const record = structuredClone(state.entry.runs[0]);
  state.apply({ kind: 'document_review', sourceId: 'first', reviewId: 'review-2', draft: draft() });
  assert.deepEqual(state.entry.runs[0], record);
  const inspection = inspectWorkflowRun(state.entry, record.result.record.execution.id);
  assert.equal(inspection.documentReviews.length, 1);
  assert.equal(inspection.documentReviews[0].id, 'review-1');
});

test('approved snapshots include only the latest notes for sources used in that run', () => {
  const state = setup();
  state.apply({
    kind: 'document_review',
    sourceId: 'first',
    reviewId: 'old-source',
    draft: draft(),
  });
  state.attach('second');
  state.apply({ kind: 'block', blockId: 'source' });
  state.apply({
    kind: 'document_review',
    sourceId: 'second',
    reviewId: 'earlier-notes',
    draft: draft(),
  });
  state.apply({
    kind: 'document_review',
    sourceId: 'second',
    reviewId: 'current-notes',
    draft: draft(),
  });
  state.apply({ kind: 'approve' });
  assert.deepEqual(
    state.entry.runs[0].documentReviews?.map((review) => review.id),
    ['current-notes'],
  );
  assert.equal(state.run.documentReviews?.length, 3);
});
