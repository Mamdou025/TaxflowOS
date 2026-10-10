import type { WorkflowView } from './view-contract';
import type { ViewerTab } from './workbench-contract';
import { workflowProgress } from './step-read-model';

export function ViewerHeader({
  view,
  connected,
  error,
  contextLabel,
  refreshing,
  busy,
  tab,
  onTab,
  onRefresh,
  onExpand,
}: {
  view: WorkflowView | null;
  connected: boolean;
  error: string;
  contextLabel: string;
  refreshing: boolean;
  busy: boolean;
  tab: ViewerTab;
  onTab: (tab: ViewerTab) => void;
  onRefresh: () => void;
  onExpand: () => void;
}) {
  const progress = view ? workflowProgress(view) : null;
  return (
    <header className="viewer-header">
      <div className="viewer-heading-row">
        <div>
          <p className="viewer-eyebrow">INSCOPE · WORKFLOW</p>
          <h1>{view?.definition.name ?? 'InScope workflow viewer'}</h1>
          {view && (
            <p className="viewer-muted">
              {view.workspace.name} · Version {view.version} ·{' '}
              {view.capabilities.write ? 'Review before changes' : 'Read-only'}
              {view.pendingReceipt?.runId || view.runId
                ? ` · Run ${view.pendingReceipt?.runId ?? view.runId}`
                : ''}
            </p>
          )}
        </div>
        <div className="viewer-actions">
          <button
            type="button"
            className="viewer-button"
            disabled={!connected || !view || refreshing || busy}
            onClick={onRefresh}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button type="button" className="viewer-button" disabled={!connected} onClick={onExpand}>
            Expand
          </button>
        </div>
      </div>
      {view?.pendingReceipt && (
        <p role="status" className="viewer-attention">
          The operation was saved, but its refreshed snapshot is unavailable. Refresh to recover
          this exact run. Further changes are disabled.
        </p>
      )}
      {view && progress && !view.pendingReceipt && (
        <section aria-label="Recorded workflow progress" className="viewer-progress">
          {progress.successful === null ? (
            <div>
              <strong>No run selected</strong>
              <p className="viewer-muted">
                {progress.total} steps · Saved definition · No recorded execution
              </p>
            </div>
          ) : (
            <>
              <div className="viewer-summary-row">
                <strong>
                  {progress.successful} of {progress.total} successful results
                </strong>
                <span>{progress.attention} need attention</span>
              </div>
              {progress.total > 0 && (
                <progress
                  aria-label="Successful current recorded results"
                  value={progress.successful}
                  max={progress.total}
                />
              )}
              <p className="viewer-muted">
                {progress.ready === null
                  ? 'Readiness not recorded'
                  : `${progress.ready} dependencies ready · ${progress.needsInput} need input`}{' '}
                · {progress.reviewed} reviewed checkpoints
              </p>
              <p className="viewer-muted">
                {view.inspection?.kind === 'record' ? 'Saved run record' : 'Saved run snapshot'} ·{' '}
                {view.inspection?.approvedAt
                  ? `Approved ${view.inspection.approvedAt}`
                  : 'Approval not recorded'}
                {view.inspection?.endedAt
                  ? ' · Ended'
                  : view.inspection?.paused === undefined
                    ? ''
                    : view.inspection.paused
                      ? ' · Paused'
                      : ' · Resumed snapshot'}
              </p>
            </>
          )}
        </section>
      )}
      <div className="viewer-toolbar">
        <div className="viewer-modes" role="tablist" aria-label="Workflow panels">
          {(['workflow', 'inputs', 'sources', 'changes'] as const).map((name) => (
            <button
              key={name}
              id={`viewer-tab-${name}`}
              type="button"
              role="tab"
              aria-selected={tab === name}
              aria-controls={`viewer-panel-${name}`}
              disabled={!view || !!view.pendingReceipt}
              onClick={() => onTab(name)}
              onKeyDown={(event) => {
                const tabs: ViewerTab[] = ['workflow', 'inputs', 'sources', 'changes'];
                const index = tabs.indexOf(name);
                const next =
                  event.key === 'ArrowRight'
                    ? tabs[(index + 1) % tabs.length]
                    : event.key === 'ArrowLeft'
                      ? tabs[(index + tabs.length - 1) % tabs.length]
                      : event.key === 'Home'
                        ? tabs[0]
                        : event.key === 'End'
                          ? tabs[tabs.length - 1]
                          : undefined;
                if (next) {
                  event.preventDefault();
                  onTab(next);
                  document.getElementById(`viewer-tab-${next}`)?.focus();
                }
              }}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
        {view && (
          <span className="viewer-muted">
            Snapshot {new Date(view.capturedAt).toLocaleString()}
          </span>
        )}
      </div>
      <p role="status" className="viewer-muted viewer-context">
        {contextLabel}
      </p>
      {view?.credentialFieldsOmitted && (
        <p className="viewer-muted">Credential fields omitted from this snapshot.</p>
      )}
      {!!view?.disclosure?.omittedCollections.length && (
        <details className="viewer-muted">
          <summary>
            Some data is shown as bounded previews. Open Sources for additional evidence.
          </summary>
          <ul>
            {view.disclosure.omittedCollections.map((item) => (
              <li key={item.path}>
                {item.path}: {item.shown} of {item.total}
              </li>
            ))}
          </ul>
        </details>
      )}
      {error && (
        <p role="alert" className="viewer-error">
          {error}
        </p>
      )}
    </header>
  );
}
