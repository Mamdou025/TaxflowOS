import { useEffect, useRef, useState } from 'react';
import type { WorkflowView } from './view-contract';
import type { HostBridge } from './host-bridge';
import type { WorkflowActions } from './use-workflow-actions';
import {
  stageSourceFile,
  sourceInspectionSchema,
  capturedSourceSchema,
  type SourceInspection,
  type CapturedSource,
  type WorkbookSelection,
} from './source-upload';
import { WorkbookSelectionForm } from './workbook-selection';

export function SourceImportForm({
  view,
  bridge,
  actions,
  blocks,
  onSelect,
}: {
  view: WorkflowView;
  bridge: HostBridge;
  actions: WorkflowActions;
  blocks: WorkflowView['definition']['blocks'];
  onSelect: (id: string) => void;
}) {
  const [blockId, setBlockId] = useState('');
  const [mode, setMode] = useState<'replace' | 'add'>('replace');
  const [inspection, setInspection] = useState<SourceInspection | null>(null);
  const [selection, setSelection] = useState<WorkbookSelection | null>(null);
  const [capture, setCapture] = useState<CapturedSource | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [percent, setPercent] = useState(0);
  const job = useRef(0);
  const current = useRef(view);
  current.current = view;
  useEffect(() => {
    job.current++;
    setInspection(null);
    setCapture(null);
    setSelection(null);
    setBusy('');
    return () => {
      job.current++;
    };
  }, [view]);
  useEffect(() => {
    setCapture(null);
    actions.clearReview();
  }, [selection]);
  const cancel = () => {
    job.current++;
    setBusy('');
    setInspection(null);
    setCapture(null);
    setSelection(null);
    setError('Import cancelled. The existing source was preserved.');
    actions.clearReview();
  };
  const perform = async (label: string, work: (active: () => boolean) => Promise<void>) => {
    const ticket = ++job.current;
    const snapshot = view;
    const active = () => job.current === ticket && current.current === snapshot;
    setBusy(label);
    setError('');
    try {
      await work(active);
    } catch (cause) {
      if (active())
        setError(
          cause instanceof Error
            ? cause.message
            : 'Source preparation failed. The existing source was preserved.',
        );
    } finally {
      if (active()) setBusy('');
    }
  };
  const enabled = view.capabilities.write && actions.eligible && !actions.busy;
  return (
    <section className="viewer-card" aria-label="Replace or add source">
      <h3>Replace or add a source</h3>
      <p className="viewer-muted">
        Prepare the real file, review its impact, then apply it. Preparing a file changes no
        workflow inputs.
      </p>
      <label className="viewer-field">
        Source block
        <select
          aria-label="Source block to amend"
          disabled={!enabled || !!busy}
          value={blockId}
          onChange={(event) => {
            job.current++;
            setBlockId(event.target.value);
            onSelect(event.target.value);
            setInspection(null);
            setCapture(null);
            actions.clearReview();
          }}
        >
          <option value="">Choose a source block</option>
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.label}
            </option>
          ))}
        </select>
      </label>
      <label className="viewer-field">
        Action
        <select
          aria-label="Source replacement mode"
          disabled={!enabled || !!busy}
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as 'replace' | 'add');
            actions.clearReview();
          }}
        >
          <option value="replace">Replace current source</option>
          <option value="add">Add another source</option>
        </select>
      </label>
      <label className="viewer-field">
        File
        <input
          aria-label="Upload workflow source"
          type="file"
          accept=".xlsx,.xls,.json,.pdf,.docx"
          disabled={!enabled || !blockId || !!busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            setInspection(null);
            setCapture(null);
            setSelection(null);
            setPercent(0);
            actions.clearReview();
            void perform('Uploading source…', async (active) => {
              const next = await stageSourceFile(view, bridge, blockId, file, active, setPercent);
              if (active()) setInspection(next);
            });
          }}
        />
      </label>
      {busy && (
        <p role="status">
          {busy}
          {busy === 'Uploading source…' ? ` ${percent}%` : ''}
        </p>
      )}
      {inspection && (
        <>
          <p>{inspection.fileName}</p>
          {inspection.kind === 'workbook' && (
            <WorkbookSelectionForm
              inspection={inspection}
              disabled={!!busy || !enabled || !!capture}
              onSelect={setSelection}
              onHeader={(sheetName, headerRowNumber) =>
                perform('Reading worksheet…', async (active) => {
                  const next = sourceInspectionSchema.parse(
                    await bridge.request(view, 'inspect_workflow_source', {
                      uploadId: inspection.uploadId,
                      sheetName,
                      headerRowNumber,
                    }),
                  );
                  if (
                    next.uploadId !== inspection.uploadId ||
                    next.fileName !== inspection.fileName
                  )
                    throw new Error('Source identity changed. Choose the file again.');
                  if (active()) {
                    setInspection({
                      ...next,
                      sheets: inspection.sheets.map(
                        (sheet) =>
                          next.sheets.find((updated) => updated.sheetName === sheet.sheetName) ??
                          sheet,
                      ),
                    });
                    setCapture(null);
                  }
                })
              }
            />
          )}
          <button
            className="viewer-button"
            type="button"
            disabled={
              !!busy || !enabled || !!capture || (inspection.kind === 'workbook' && !selection)
            }
            onClick={() =>
              void perform('Preparing source preview…', async (active) => {
                const next = capturedSourceSchema.parse(
                  await bridge.request(view, 'capture_workflow_source', {
                    uploadId: inspection.uploadId,
                    ...(selection
                      ? {
                          selection: {
                            ...selection,
                            mapping: Object.fromEntries(
                              Object.entries(selection.mapping).filter(([, value]) => value),
                            ),
                          },
                        }
                      : {}),
                  }),
                );
                if (next.fileName !== inspection.fileName)
                  throw new Error('The captured file identity could not be verified.');
                if (active()) setCapture(next);
              })
            }
          >
            Prepare source preview
          </button>
        </>
      )}
      {capture && (
        <section aria-label="Prepared source preview">
          <p>
            {capture.fileName} · {capture.rowCount} records prepared
          </p>
          {inspection?.kind === 'workbook' && (
            <p className="viewer-muted">
              The prepared worksheet mapping is fixed. Choose the file again to prepare a different
              mapping.
            </p>
          )}
          {capture.issues.map((issue, index) => (
            <p className="viewer-attention" key={`${issue.code}:${index}`}>
              {issue.message}
            </p>
          ))}
          <details>
            <summary>Prepared records preview</summary>
            <pre>{JSON.stringify(capture.previewRows, null, 2)}</pre>
          </details>
          <button
            className="viewer-button"
            type="button"
            disabled={!enabled || !!busy}
            onClick={() =>
              void actions.preview({ kind: 'source', blockId, captureId: capture.captureId, mode })
            }
          >
            Review source change
          </button>
        </section>
      )}
      {(busy || inspection || capture) && (
        <button className="viewer-button" type="button" disabled={!!actions.busy} onClick={cancel}>
          Cancel import
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
