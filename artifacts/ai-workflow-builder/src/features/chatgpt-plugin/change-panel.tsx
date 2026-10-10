import { useEffect, useState } from 'react';
import type { WorkflowView } from './view-contract';
import type { WorkflowActions } from './use-workflow-actions';

const display = (value: unknown) =>
  value === undefined ? 'Not set' : JSON.stringify(value, null, 2);
export function ChangePanel({
  view,
  actions,
  hasDrafts,
}: {
  view: WorkflowView;
  actions: WorkflowActions;
  hasDrafts: boolean;
}) {
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const review = actions.review;
  const expired = review ? Date.parse(review.expiresAt) <= clock : false;
  const history = view.inspection?.changeHistory;
  const attempts = view.inspection?.attemptSummaries;
  const names = (ids: string[]) =>
    ids
      .map((id) => view.definition.blocks.find((block) => block.id === id)?.label ?? id)
      .join(', ');
  return (
    <section aria-label="Workflow changes" className="viewer-panel">
      <h2>Review changes and recalculate</h2>
      {review ? (
        <section className="viewer-card" aria-label="Review before applying">
          <h3>Review before applying</h3>
          <p>
            Run revision {review.revision} · This review expires{' '}
            {new Date(review.expiresAt).toLocaleTimeString()}
          </p>
          <div className="viewer-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {review.changes.map((change, index) => (
                  <tr key={`${change.field}:${index}`}>
                    <th>{change.field}</th>
                    <td>
                      <pre>{display(change.before)}</pre>
                    </td>
                    <td>
                      <pre>{display(change.after)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>Affected steps:</strong> {names(review.affectedBlockIds) || 'None reported'}
          </p>
          <p>
            {review.approvalInvalidated
              ? 'Existing approval will be cleared. Review affected results after recalculation.'
              : 'The server reports no current approval to invalidate.'}
          </p>
          <p>
            Apply saves this change and marks affected results outdated. It does not recalculate.
          </p>
          {expired && (
            <p role="alert">
              This review expired. Return to the input or source draft and review again.
            </p>
          )}
          <div className="viewer-actions">
            <button
              type="button"
              className="viewer-button"
              disabled={!!actions.busy || expired || !view.capabilities.write}
              onClick={() => void actions.apply()}
            >
              Apply reviewed change
            </button>
            <button
              type="button"
              className="viewer-button"
              disabled={!!actions.busy}
              onClick={actions.clearReview}
            >
              Dismiss review
            </button>
          </div>
        </section>
      ) : (
        <p>No unapplied review is open. Make a draft in Inputs or Sources to preview its impact.</p>
      )}
      {view.runId && (
        <section className="viewer-card" aria-label="Recalculate saved inputs">
          <h3>Recalculate saved inputs</h3>
          <p>
            Recalculate uses the values already saved to this exact run. Draft fields are not
            included.
          </p>
          {view.capabilities.execute ? (
            <button
              className="viewer-button"
              type="button"
              disabled={!actions.eligible || !!actions.busy || !!review || hasDrafts}
              onClick={() => void actions.recalculate()}
            >
              Recalculate saved inputs
            </button>
          ) : (
            <p>
              This connection has no execute access. Reconnect with execute access before
              recalculating.
            </p>
          )}
          {hasDrafts && (
            <p className="viewer-muted">Apply or discard input drafts before recalculating.</p>
          )}
        </section>
      )}
      <h3>Applied change history</h3>
      {history === undefined ? (
        <p>
          No change ledger was supplied. Earlier input edits cannot be reconstructed from current
          values alone.
        </p>
      ) : history.length === 0 ? (
        <p>No applied changes are recorded in this ledger.</p>
      ) : (
        <>
          {view.inspection?.changeHistoryTotal !== undefined &&
            view.inspection.changeHistoryTotal > history.length && (
              <p>
                Showing {history.length} of {view.inspection.changeHistoryTotal} recorded changes.
              </p>
            )}
          {history.map((change) => (
            <details className="viewer-card" key={change.id}>
              <summary>
                {change.kind} · revision {change.revisionBefore ?? 'new'} → {change.revisionAfter} ·{' '}
                {change.at}
              </summary>
              <p className="viewer-muted">
                Actor {change.actorId} · Affected: {names(change.affectedBlockIds)}
              </p>
              <pre>{JSON.stringify(change.changes, null, 2)}</pre>
            </details>
          ))}
        </>
      )}
      <h3>Recorded execution attempts</h3>
      {attempts === undefined ? (
        <p>Execution-attempt summaries are unavailable.</p>
      ) : attempts.length === 0 ? (
        <p>No recorded execution attempts.</p>
      ) : (
        <>
          {view.inspection?.attemptsTotal !== undefined &&
            view.inspection.attemptsTotal > attempts.length && (
              <p>
                Showing {attempts.length} of {view.inspection.attemptsTotal} attempts.
              </p>
            )}
          <ol>
            {attempts.map((attempt, index) => (
              <li key={`${attempt.at}:${index}`}>
                {names([attempt.blockId])} · {attempt.status.replaceAll('_', ' ')} · revision{' '}
                {attempt.revision} · {attempt.at}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
