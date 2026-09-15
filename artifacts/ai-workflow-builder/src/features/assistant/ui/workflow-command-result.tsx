import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';

export function WorkflowCommandResult({ result }: { result: unknown }) {
  let data = result;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return <p>{String(data)}</p>;
    }
  }
  if (!data || typeof data !== 'object') return <p>No execution result was returned.</p>;
  const value = data as Record<string, unknown>;
  const errors = Array.isArray(value.errors) ? value.errors : [];
  const findings = Array.isArray(value.findings) ? value.findings : [];
  const runHref =
    typeof value.savedWorkflowId === 'string'
      ? `/w/${encodeURIComponent(value.savedWorkflowId)}${
          typeof value.runId === 'string' ? `?run=${encodeURIComponent(value.runId)}` : ''
        }`
      : null;
  return (
    <section aria-label="Chat workflow result" className="space-y-3 rounded border p-3">
      <h3 className="font-semibold">{String(value.name ?? 'Workflow')}</h3>
      <p role={value.status === 'error' ? 'alert' : 'status'}>
        {value.status === 'error'
          ? 'Execution failed'
          : value.status === 'needs_input'
            ? 'Source records required'
            : value.status === 'warning'
              ? 'Calculated — review findings remain'
              : 'Calculated — ready for review'}
      </p>
      {typeof value.runId === 'string' && (
        <div className="grid gap-1 rounded bg-muted/40 p-2 text-xs sm:grid-cols-2">
          <span>Run ID: {value.runId}</span>
          {typeof value.version === 'number' && <span>Workflow version: {value.version}</span>}
          <span>
            Execution:{' '}
            {value.status === 'error'
              ? 'Failed'
              : value.status === 'needs_input'
                ? 'Needs input'
                : 'Completed'}
          </span>
          <span>Review: Required</span>
          <span>
            Persistence: {typeof value.persistence === 'string' ? value.persistence : 'Unknown'}
          </span>
        </div>
      )}
      {value.sampleData === true && (
        <p className="font-semibold">Sample data — not client results</p>
      )}
      {typeof value.purpose === 'string' && <p>{value.purpose}</p>}
      {typeof value.sourceFileName === 'string' && <p>Source: {value.sourceFileName}</p>}
      {Array.isArray(value.requiredColumns) && (
        <p>Required columns: {value.requiredColumns.join(', ')}</p>
      )}
      {errors.length > 0 && (
        <ul>
          {errors.map((message, i) => (
            <li key={i}>{String(message)}</li>
          ))}
        </ul>
      )}
      {value.status !== 'error' && Array.isArray(value.results) && (
        <ReadableData value={value.results} />
      )}
      {value.status !== 'error' && Array.isArray(value.rows) && <ReadableData value={value.rows} />}
      {findings.length > 0 && (
        <div>
          <strong>Review findings</strong>
          <ul>
            {findings.map((message, i) => (
              <li key={i}>{String(message)}</li>
            ))}
          </ul>
        </div>
      )}
      {runHref && <a href={runHref}>Open run</a>}
    </section>
  );
}
