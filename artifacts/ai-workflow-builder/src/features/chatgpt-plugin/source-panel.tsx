import { isDocumentSource } from '@workspace/workflow-core/sessions';
import type { WorkflowView } from './view-contract';
import type { HostBridge } from './host-bridge';
import type { WorkflowActions } from './use-workflow-actions';
import { SourceImportForm } from './source-import-form';
import { SourceDetail } from './source-detail';

export function SourcePanel({
  view,
  bridge,
  actions,
  sourceId,
  onSource,
  onSelect,
}: {
  view: WorkflowView;
  bridge: HostBridge | null;
  actions: WorkflowActions;
  sourceId: string | undefined;
  onSource: (id: string, blockId: string) => void;
  onSelect: (id: string) => void;
}) {
  const sources = view.inspection?.sourceSummaries;
  const sourceBlocks = view.definition.blocks.filter(isDocumentSource);
  return (
    <section aria-label="Workflow sources" className="viewer-panel">
      <h2>Sources and recorded context</h2>
      <p className="viewer-muted">
        Attachments keep their source identity and extraction history. Replaced sources remain
        available as historical evidence.
      </p>
      {!view.runId && (
        <p>
          No run selected. Source blocks are configured in this saved definition; no run attachments
          are selected.
        </p>
      )}
      {view.runId && !sources && (
        <p>
          Source summaries were not supplied by this server response. Refresh to check availability.
        </p>
      )}
      {sources?.length === 0 && <p>No source files are attached to this run.</p>}
      {sources?.map((source) => (
        <article key={source.id} className="viewer-card" data-selected={sourceId === source.id}>
          <button
            className="viewer-link"
            type="button"
            onClick={() => onSource(source.id, source.blockId)}
          >
            {source.name}
          </button>
          <p>
            {source.active ? 'Current source' : 'Replaced source'} · {source.rowCount} records ·{' '}
            {source.mode}
          </p>
          <p className="viewer-muted">
            {view.definition.blocks.find((block) => block.id === source.blockId)?.label ??
              source.blockId}{' '}
            · {source.at}
          </p>
          {source.extraction && (
            <>
              <p className="viewer-muted">
                Extraction v{source.extraction.revision} · {source.extraction.method} ·{' '}
                {source.extraction.contentHash}
              </p>
              {source.extraction.issues.map((issue, index) => (
                <p className="viewer-attention" key={`${issue.code}:${index}`}>
                  {issue.message}
                </p>
              ))}
            </>
          )}
          <details>
            <summary>
              Records preview ({source.previewRows.length} of {source.rowCount})
            </summary>
            <pre>{JSON.stringify(source.previewRows, null, 2)}</pre>
          </details>
        </article>
      ))}
      {sourceId && view.runId && bridge && (
        <SourceDetail
          key={`${view.runId}:${sourceId}`}
          view={view}
          bridge={bridge}
          sourceId={sourceId}
        />
      )}
      {!!view.inspection?.documentReviews?.length && (
        <details>
          <summary>Recorded document interpretations</summary>
          {view.inspection.documentReviews.map((review) => (
            <article className="viewer-card" key={review.id}>
              <h3>{review.fileName}</h3>
              <p className="viewer-muted">
                Source revision {review.sourceRevision} · {review.at} · Interpretation, separate
                from calculation inputs
              </p>
              <pre>{JSON.stringify(review.draft, null, 2)}</pre>
            </article>
          ))}
        </details>
      )}
      {view.capabilities.write && actions.eligible && bridge && sourceBlocks.length > 0 ? (
        <SourceImportForm
          view={view}
          bridge={bridge}
          actions={actions}
          blocks={sourceBlocks}
          onSelect={onSelect}
        />
      ) : (
        <p className="viewer-muted">
          {!view.capabilities.write
            ? 'This connection has read access. Reconnect with write access to replace or add source files.'
            : !view.runId
              ? 'Start work from this version to attach a source.'
              : 'Source changes require a paused, active run with a document source block.'}
        </p>
      )}
      <p className="viewer-muted">
        Free-form run notes are not supported in this version. Saved document interpretations remain
        visible above.
      </p>
    </section>
  );
}
