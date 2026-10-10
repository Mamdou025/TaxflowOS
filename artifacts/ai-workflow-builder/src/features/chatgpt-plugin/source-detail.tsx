import { useEffect, useState } from 'react';
import { z } from 'zod';
import type { WorkflowView } from './view-contract';
import type { HostBridge } from './host-bridge';

const sourcePageSchema = z.object({
  sourceId: z.string(),
  name: z.string(),
  totalRows: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  rows: z.array(z.record(z.unknown())),
  nextOffset: z.number().int().nonnegative().nullable().optional(),
  segments: z
    .array(
      z.object({
        id: z.string(),
        location: z.string(),
        text: z.string(),
        segmentTruncated: z.boolean().optional(),
      }),
    )
    .default([]),
  totalSegments: z.number().int().nonnegative().default(0),
  nextSegmentOffset: z.number().int().nonnegative().nullable().optional(),
  segmentTruncated: z.boolean().optional(),
});
export function SourceDetail({
  view,
  bridge,
  sourceId,
}: {
  view: WorkflowView;
  bridge: HostBridge;
  sourceId: string;
}) {
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState<z.infer<typeof sourcePageSchema> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    setPage(null);
    setError('');
    if (view.pendingReceipt) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void bridge
      .request(view, 'read_workflow_source', {
        workflowId: view.workflowId,
        runId: view.runId,
        sourceId,
        offset,
        limit: 20,
      })
      .then((result) => {
        const next = sourcePageSchema.parse(result);
        if (next.sourceId !== sourceId || next.offset !== offset)
          throw new Error('Source evidence does not match the requested page.');
        if (active) setPage(next);
      })
      .catch((cause) => {
        if (active)
          setError(cause instanceof Error ? cause.message : 'Source evidence is unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [view, bridge, sourceId, offset]);
  const next = page
    ? [page.nextOffset, page.nextSegmentOffset]
        .filter((value): value is number => typeof value === 'number' && value > offset)
        .sort((a, b) => a - b)[0]
    : undefined;
  return (
    <section aria-label="Source evidence pages" className="viewer-card">
      {loading && <p role="status">Reading saved source evidence…</p>}
      {error && <p role="alert">{error}</p>}
      {page && (
        <>
          <h3>{page.name}</h3>
          <p>
            {page.rows.length
              ? `Rows ${offset + 1}–${offset + page.rows.length} of ${page.totalRows}`
              : `No rows on this page · ${page.totalRows} total`}
          </p>
          {!!page.rows.length && <pre>{JSON.stringify(page.rows, null, 2)}</pre>}
          {page.segments.map((segment) => (
            <section key={segment.id}>
              <h4>{segment.location}</h4>
              <p className="viewer-document-text">{segment.text}</p>
              {segment.segmentTruncated && (
                <p className="viewer-muted">This long text segment is an excerpt.</p>
              )}
            </section>
          ))}
          {page.segmentTruncated && (
            <p className="viewer-muted">Long text segments on this page are excerpted.</p>
          )}
          <p className="viewer-muted">{page.totalSegments} recorded text segments</p>
        </>
      )}
      <div className="viewer-actions">
        <button
          type="button"
          className="viewer-button"
          disabled={loading || offset === 0}
          onClick={() => setOffset(Math.max(0, offset - 20))}
        >
          Previous evidence
        </button>
        <button
          type="button"
          className="viewer-button"
          disabled={loading || next === undefined}
          onClick={() => next !== undefined && setOffset(next)}
        >
          More rows / evidence
        </button>
      </div>
    </section>
  );
}
