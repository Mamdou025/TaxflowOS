import { useEffect, useState } from 'react';
import type { WorkflowView } from './view-contract';
import type { WorkflowActions } from './use-workflow-actions';

type Draft = { revision: number; libraryRevision: number; patch: Record<string, unknown> };
const numericKeys = new Set([
  'value',
  'manualValue',
  'scalarValue',
  'valuePreview',
  'overrideRate',
  'liveRate',
  'fapiYear',
  'inclusionRate',
  'rtf',
  'fatPaid',
  'maxRows',
  'defaultAmount',
]);
const captureKeys = new Set([
  'rows',
  'columnMapping',
  'columns',
  'excelWorkbook',
  'workbookFile',
  'selectedRange',
  'sheets',
  'headers',
  'body',
  'fieldMap',
  'connectorParams',
  'fetchedRows',
  'fetchedPayload',
  'outputMappings',
  'responseMeta',
  'samplePayload',
]);
const label = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase());
const isNumeric = (key: string, value: unknown) =>
  typeof value === 'number' || numericKeys.has(key) || /^override[A-Z_][A-Za-z0-9_]*$/.test(key);
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export function InputPanel({
  view,
  actions,
  onSelect,
  onDirty,
}: {
  view: WorkflowView;
  actions: WorkflowActions;
  onSelect: (id: string) => void;
  onDirty: (dirty: boolean) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [error, setError] = useState('');
  const editable = view.capabilities.write && actions.eligible && !actions.busy;
  useEffect(() => {
    onDirty(Object.keys(drafts).length > 0);
  }, [drafts, onDirty]);
  useEffect(() => {
    if (actions.applied)
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[actions.applied!.blockId];
        return next;
      });
  }, [actions.applied]);
  const stage = (blockId: string, patch: Record<string, unknown>) => {
    actions.clearReview();
    setError('');
    onSelect(blockId);
    setDrafts((previous) => ({
      ...previous,
      [blockId]: {
        revision: previous[blockId]?.revision ?? view.inspection!.revision!,
        libraryRevision: previous[blockId]?.libraryRevision ?? view.libraryRevision!,
        patch: { ...previous[blockId]?.patch, ...patch },
      },
    }));
  };
  const blocks = view.definition.blocks.filter((block) => {
    const step = view.inspection?.steps?.find((item) => item.id === block.id);
    return (
      !!step?.inputKeys?.length || !!step?.inputRequirements?.length || block.family === 'Source'
    );
  });
  return (
    <section aria-label="Workflow inputs" className="viewer-panel">
      <h2>Inputs for this work</h2>
      <p className="viewer-muted">
        Values and their sources stay attached to this exact workflow. Review a change, apply it,
        then recalculate separately.
      </p>
      {!view.runId && (
        <p>No run selected. These are saved settings. Start work to change run inputs.</p>
      )}
      {view.runId && !view.capabilities.write && (
        <p>This connection has read access. Reconnect with write access to review changes.</p>
      )}
      {view.inspection?.endedAt && (
        <p>
          This work has ended. Its history is preserved; start new work from the saved version to
          make changes.
        </p>
      )}
      {view.inspection?.paused === false && (
        <p>Input changes require paused work. Refresh to read its current state.</p>
      )}
      {blocks.map((block) => {
        const step = view.inspection?.steps?.find((item) => item.id === block.id);
        const draft = drafts[block.id];
        const config = { ...block.config, ...draft?.patch };
        const stale =
          !!draft &&
          (draft.revision !== view.inspection?.revision ||
            draft.libraryRevision !== view.libraryRevision);
        const keys = (step?.inputKeys ?? []).filter(
          (key) =>
            key !== 'inputChoices' &&
            key !== 'inputValues' &&
            !captureKeys.has(key) &&
            (config[key] === undefined ||
              config[key] === null ||
              ['string', 'number', 'boolean'].includes(typeof config[key])),
        );
        return (
          <section key={block.id} className="viewer-card" aria-label={`Inputs for ${block.label}`}>
            <button type="button" className="viewer-link" onClick={() => onSelect(block.id)}>
              {block.label}
            </button>
            {step?.inputRequirements?.map((input) => {
              const choices = object(config.inputChoices);
              const choice = object(choices[input.name]);
              const displayed = choice.kind === 'manual' ? choice.value : input.value;
              const binding = input.binding?.kind === 'source' ? input.binding : undefined;
              return (
                <label className="viewer-field" key={input.name}>
                  <span>
                    {input.label}
                    {input.unit ? ` (${input.unit})` : ''} <small>{input.status}</small>
                  </span>
                  <input
                    type="number"
                    step="any"
                    aria-label={`${block.label}: ${input.label}`}
                    disabled={!editable}
                    value={typeof displayed === 'number' ? displayed : ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value !== '' && !Number.isFinite(Number(value))) {
                        setError('Enter a finite number.');
                        return;
                      }
                      stage(block.id, {
                        inputChoices: {
                          ...choices,
                          [input.name]:
                            value === ''
                              ? { kind: 'manual' }
                              : { kind: 'manual', value: Number(value) },
                        },
                      });
                    }}
                  />
                  <span className="viewer-muted">
                    {draft?.patch.inputChoices && choice.kind === 'manual'
                      ? 'Unapplied manual choice'
                      : `Current value: ${input.origin ?? 'not provided'}`}
                    {binding
                      ? ` · ${view.definition.blocks.find((source) => source.id === binding.blockId)?.label ?? binding.blockId} → ${binding.path.join('.')}`
                      : ''}
                    {input.message ? ` · ${input.message}` : ''}
                  </span>
                </label>
              );
            })}
            {keys.map((key) => (
              <label className="viewer-field" key={key}>
                <span>{label(key)}</span>
                {typeof config[key] === 'boolean' ? (
                  <input
                    type="checkbox"
                    aria-label={`${block.label}: ${label(key)}`}
                    checked={config[key] as boolean}
                    disabled={!editable}
                    onChange={(event) => stage(block.id, { [key]: event.target.checked })}
                  />
                ) : (
                  <input
                    aria-label={`${block.label}: ${label(key)}`}
                    type={isNumeric(key, config[key]) ? 'number' : 'text'}
                    step="any"
                    disabled={!editable}
                    value={config[key] == null ? '' : String(config[key])}
                    onChange={(event) => {
                      const value = event.target.value;
                      const numeric = isNumeric(key, config[key]);
                      if (numeric && value !== '' && !Number.isFinite(Number(value))) {
                        setError('Enter a finite number.');
                        return;
                      }
                      stage(block.id, {
                        [key]: numeric ? (value === '' ? null : Number(value)) : value,
                      });
                    }}
                  />
                )}
                <span className="viewer-muted">
                  {Object.hasOwn(view.inspection?.inputOverrides?.[block.id] ?? {}, key)
                    ? 'Applied run override'
                    : 'Saved setting'}
                </span>
              </label>
            ))}
            {!keys.length && !step?.inputRequirements?.length && (
              <details>
                <summary>Saved input settings</summary>
                <pre>{JSON.stringify(block.config, null, 2)}</pre>
              </details>
            )}
            {stale && (
              <div role="alert">
                <p>
                  This work changed. Your draft is preserved. Compare it with the latest saved
                  inputs before reviewing again.
                </p>
                <button
                  className="viewer-button"
                  type="button"
                  disabled={!editable}
                  onClick={() => {
                    actions.clearReview();
                    setDrafts((previous) => ({
                      ...previous,
                      [block.id]: {
                        ...draft,
                        revision: view.inspection!.revision!,
                        libraryRevision: view.libraryRevision!,
                      },
                    }));
                  }}
                >
                  Use latest revision for review
                </button>
              </div>
            )}
            {draft && (
              <div className="viewer-actions">
                <button
                  type="button"
                  className="viewer-button"
                  disabled={!editable || stale}
                  onClick={() => {
                    onSelect(block.id);
                    void actions.preview({ kind: 'inputs', blockId: block.id, patch: draft.patch });
                  }}
                >
                  Review input changes
                </button>
                <button
                  type="button"
                  className="viewer-button"
                  disabled={!!actions.busy}
                  onClick={() => {
                    actions.clearReview();
                    setDrafts((previous) => {
                      const next = { ...previous };
                      delete next[block.id];
                      return next;
                    });
                  }}
                >
                  Discard draft
                </button>
              </div>
            )}
          </section>
        );
      })}
      {!blocks.length && <p>No input fields are declared in this workflow.</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
