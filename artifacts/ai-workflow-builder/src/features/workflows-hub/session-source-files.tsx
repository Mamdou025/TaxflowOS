import { useState } from 'react';
import { useAtomValue } from 'jotai';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import type { SessionAction } from '@workspace/workflow-core/sessions';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { captureWorkflowDocument } from '@/features/documents/capture-workflow-document';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';

export function SessionSourceFiles({
  sources,
  session,
  blockId,
  templateId,
  act,
}: {
  sources: WorkflowBlock[];
  session: WorkflowSession;
  blockId?: string;
  templateId?: string;
  act: (action: SessionAction) => Promise<void>;
}) {
  const [target, setTarget] = useState('');
  const sourceId = blockId || target || (sources.length === 1 ? sources[0].id : '');
  const [mode, setMode] = useState<'replace' | 'add'>('replace');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { selectWorkbook, importDialog } = useWorkbookImport();
  const attached = useAtomValue(uploadedRowsAtom);
  const cached = attached.__unassigned__ ?? attached[(templateId ?? '').replace(/^pf-/, '')];
  const attach = async (name: string, rows: Record<string, unknown>[]) => {
    try {
      await act({
        kind: 'source',
        blockId: sourceId,
        sourceId: crypto.randomUUID(),
        name,
        rows,
        mode,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Import failed.');
    }
  };
  return (
    <>
      {sources.length > 0 && (
        <fieldset
          className="space-y-2 rounded border p-3"
          disabled={busy || !session.paused || !!session.endedAt}
        >
          <legend>Sources</legend>
          <label className="block text-sm">
            Source block{' '}
            <select
              aria-label="Run source block"
              className="rounded border bg-background p-1"
              value={sourceId}
              disabled={!!blockId}
              onChange={(event) => setTarget(event.target.value)}
            >
              <option value="">Choose a source block</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Source action{' '}
            <select
              aria-label="Source action"
              className="rounded border bg-background p-1"
              value={mode}
              onChange={(event) => setMode(event.target.value as 'replace' | 'add')}
            >
              <option value="replace">Replace source records</option>
              <option value="add">Add another source</option>
            </select>
          </label>
          <input
            aria-label="Upload run source"
            type="file"
            accept=".xlsx,.xls,.json,.pdf,.docx"
            disabled={!sourceId}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              setBusy(true);
              setError('');
              try {
                const extraction = await captureWorkflowDocument(file, { selectWorkbook });
                await act({
                  kind: 'source',
                  blockId: sourceId,
                  sourceId: extraction.id,
                  name: extraction.fileName,
                  rows: extraction.rows,
                  extraction,
                  mode,
                });
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Import failed.');
              } finally {
                setBusy(false);
              }
            }}
          />
          {cached && (
            <button
              className="rounded border px-3 py-1"
              disabled={!sourceId}
              onClick={() => void attach(cached.fileName, cached.rows)}
            >
              Use attached file: {cached.fileName}
            </button>
          )}
          <p className="text-xs text-muted-foreground">
            Source changes preserve previous evidence and mark affected results as outdated. Pause
            before changing sources.
          </p>
          {session.sources
            .filter((source) => !blockId || source.blockId === blockId)
            .map((source) => (
              <p key={source.id} className="text-xs">
                {source.name} · {source.rows.length} records · {source.mode} ·{' '}
                {new Date(source.at).toLocaleString()}
              </p>
            ))}
        </fieldset>
      )}
      {error && <p role="alert">{error}</p>}
      {importDialog}
    </>
  );
}
