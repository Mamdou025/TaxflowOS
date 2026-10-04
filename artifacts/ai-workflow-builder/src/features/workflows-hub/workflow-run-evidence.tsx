import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';
import { DocumentExtractionEvidence } from '@/features/documents/document-extraction-evidence';
import { DocumentReviewView } from '@/features/documents/document-review-view';
import { documentReviewSummaries } from '@workspace/workflow-core/inspection';
import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import type { InspectedWorkflowRun } from './recorded-run-projection';

export function WorkflowRunEvidence({
  evidence,
  block,
  attemptIndex,
  setAttemptIndex,
  select,
}: {
  evidence: InspectedWorkflowRun;
  block: WorkflowBlock;
  attemptIndex: number | null;
  setAttemptIndex: (index: number | null) => void;
  select: (id: string) => void;
}) {
  const attempt = attemptIndex === null ? undefined : evidence.attempts[attemptIndex];
  const result = attempt
    ? attempt.result.result.results.find((item) => item.blockId === block.id)
    : evidence.results[block.id];
  const step = evidence.steps.find((item) => item.id === block.id);
  return (
    <article aria-label="Block verification" className="space-y-3 rounded border p-4">
      <h3 className="font-semibold">
        {block.label} · {attempt ? (result?.status ?? 'pending') : step?.status}
      </h3>
      <p className="text-xs">
        Block {block.id} · saved workflow version {evidence.version}
      </p>
      {step?.status === 'outdated' && (
        <p role="status">
          Previous result — source or upstream evidence changed. Rerun in Chat or Run before using
          it.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <span>Received from:</span>
        {step?.dependencies.length ? (
          step.dependencies.map((id) => (
            <button key={id} className="underline" onClick={() => select(id)}>
              {evidence.definition.blocks.find((b) => b.id === id)?.label ?? id}
            </button>
          ))
        ) : (
          <span>No preceding blocks</span>
        )}
      </div>
      <label>
        Evidence attempt{' '}
        <select
          aria-label="Evidence attempt"
          className="rounded border bg-background p-1"
          value={attemptIndex ?? 'current'}
          onChange={(event) =>
            setAttemptIndex(event.target.value === 'current' ? null : Number(event.target.value))
          }
        >
          <option value="current">Current result</option>
          {evidence.attempts.map(
            (item, index) =>
              item.result.result.results.some((r) => r.blockId === block.id) && (
                <option value={index} key={index}>
                  {item.at} · revision {item.revision}
                </option>
              ),
          )}
        </select>
      </label>
      {attempt && (
        <p>
          Historical attempt · revision {attempt.revision}. Later source changes do not change these
          recorded inputs and outputs.
        </p>
      )}
      {result ? (
        <>
          <p>
            Status: {result.status} · execution {result.runId}
          </p>
          {[...result.errors, ...result.warnings].map((message, i) => (
            <p key={i} role="status">
              {message}
            </p>
          ))}
          <h4 className="font-medium">Recorded inputs</h4>
          <ReadableData value={result.input ?? {}} />
          <h4 className="font-medium">Recorded outputs</h4>
          <DocumentExtractionEvidence value={result.output.extractions} />
          <ReadableData value={result.output} />
          <h4 className="font-medium">Source provenance</h4>
          <ReadableData value={result.sourceTrace} />
        </>
      ) : (
        <p>This block has not run. No result has been substituted.</p>
      )}
      <LazyDetails summary="Saved rules and configuration">
        <ReadableData value={block.config} />
      </LazyDetails>
      <DocumentReviewView
        reviews={(evidence.kind === 'session'
          ? documentReviewSummaries({
              sources: evidence.sources,
              documentReviews: evidence.documentReviews,
            })
          : evidence.documentReviews
        ).filter(
          (review) =>
            review.blockId === block.id && (!attempt || review.sessionRevision <= attempt.revision),
        )}
      />
      <LazyDetails summary="Source revision history">
        <p className="text-sm">
          All attachments for this session. Historical attempts above retain the inputs actually
          used.
        </p>
        {evidence.sources.length ? (
          evidence.sources.map((source) => (
            <LazyDetails key={source.id} summary={`${source.name} · ${source.mode} · ${source.at}`}>
              <p>
                Source {source.id} · block {source.blockId}
              </p>
              <ReadableData value={source.rows} />
              <DocumentExtractionEvidence
                value={source.extraction ? [source.extraction] : undefined}
              />
            </LazyDetails>
          ))
        ) : (
          <p>
            No session attachments recorded. Inspect the recorded inputs and source provenance
            above.
          </p>
        )}
      </LazyDetails>
    </article>
  );
}
