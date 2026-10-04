import { useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import { getSession, runInputKeys, sessionDefinition } from '@workspace/workflow-core/sessions';
import { SourceSetupPanel } from '@/features/workflow-builder/ui/inspector/source-setup-panel';
import { workflowLibraryAtom } from './workflow-library';
import { submitSessionInput, type SessionRef } from './workflow-session-store';

function BlockInputForm({
  refValue,
  block,
  revision,
  disabled,
}: {
  refValue: SessionRef;
  block: WorkflowBlock;
  revision: number;
  disabled: boolean;
}) {
  const store = useStore();
  const [patch, setPatch] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const keys = runInputKeys(block);
  const config = { ...block.config, ...patch };
  return (
    <section aria-label={`Inputs for ${block.label}`} className="space-y-3">
      <h4 className="font-medium">{block.label} · input form</h4>
      <p className="text-xs text-muted-foreground">
        Changes apply to this work only. Apply to recalculate affected steps.
      </p>
      <SourceSetupPanel
        currentWork
        block={block}
        config={config}
        disabled={disabled || busy}
        sourceLocked={false}
        sourceUsedInRun={false}
        sourceVersion={Number(config.sourceVersion) || 1}
        onCreateSourceVersion={() => setError('Use Build to change the saved source definition.')}
        onConfigPatch={(values) =>
          setPatch((previous) => ({
            ...previous,
            ...Object.fromEntries(
              Object.entries(values)
                .filter(([key]) => keys.includes(key))
                .map(([key, value]) => [key, value === undefined ? null : value]),
            ),
          }))
        }
      />
      <button
        type="button"
        className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setError('');
          try {
            const values = Object.keys(patch).length
              ? patch
              : Object.fromEntries(
                  keys.filter((key) => config[key] !== undefined).map((key) => [key, config[key]]),
                );
            await submitSessionInput(store, refValue, revision, {
              kind: 'inputs',
              blockId: block.id,
              patch: values,
            });
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Input changes failed.');
          } finally {
            setBusy(false);
          }
        }}
      >
        Apply inputs &amp; recalculate
      </button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

/** Builder's actual block forms, with the session command as their Apply target. */
export function SessionInputForms({
  workflowId,
  runId,
  blockId,
}: SessionRef & { blockId?: string }) {
  const library = useAtomValue(workflowLibraryAtom);
  const entry = library[workflowId];
  if (!entry?.sessions?.some((session) => session.id === runId)) return null;
  const session = getSession(entry, runId);
  const blocks = sessionDefinition(entry, session).blocks.filter(
    (block) =>
      block.config.sourceKind !== 'pdf_document' &&
      runInputKeys(block).length &&
      (!blockId || block.id === blockId),
  );
  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockInputForm
          key={`${runId}:${block.id}:${session.revision}`}
          refValue={{ workflowId, runId }}
          block={block}
          revision={session.revision}
          disabled={!session.paused || !!session.endedAt}
        />
      ))}
    </div>
  );
}
