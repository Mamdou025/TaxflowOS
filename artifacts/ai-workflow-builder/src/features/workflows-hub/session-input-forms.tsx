import { useSessionInputDraft } from './session-input-drafts';
import { useMemo } from 'react';
import { useStore } from 'jotai';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import { runInputKeys } from '@workspace/workflow-core/sessions';
import { SourceSetupPanel } from '@/features/workflow-builder/ui/inspector/source-setup-panel';
import {
  inferCalculationInputs,
  type CalculationInputRule,
} from '@workspace/workflow-core/calculation-inputs';
import { SessionCalculationInputs } from './session-calculation-inputs';
import {
  calculationInputChoices,
  type CalculationFormSource,
  type WorkflowCalculationGroup,
} from './workflow-required-inputs-model';
import type { WorkflowSessionReadModel } from './workflow-session-read-model';
import { submitSessionInput, type SessionRef } from './workflow-session-store';

function BlockInputForm({
  refValue,
  block,
  revision,
  sourceIdentity,
  disabled,
  rules,
  sources,
  inputOptions,
  sourceOptions,
}: {
  refValue: SessionRef;
  block: WorkflowBlock;
  revision: number;
  sourceIdentity: string;
  disabled: boolean;
  rules: readonly CalculationInputRule[];
  sources: CalculationFormSource[];
  inputOptions?: WorkflowCalculationGroup['inputOptions'];
  sourceOptions?: WorkflowCalculationGroup['sourceOptions'];
}) {
  const store = useStore();
  const keys = runInputKeys(block);
  const { draft, setDraft, busy, setBusy, error, setError } = useSessionInputDraft(
    `${refValue.workflowId}:${refValue.runId}:${block.id}`,
    keys.includes('inputChoices'),
  );
  const patch = draft?.patch ?? {};
  const stale =
    !!draft &&
    (draft.sourceIdentity !== sourceIdentity ||
      keys.some((key) => JSON.stringify(draft.config[key]) !== JSON.stringify(block.config[key])));
  const config = useMemo(
    () => (draft ? { ...draft.config, ...draft.patch } : block.config),
    [draft, block.config],
  );
  const stagePatch = (values: Record<string, unknown>) =>
    setDraft((previous) => ({
      config: previous?.config ?? block.config,
      sourceIdentity: previous?.sourceIdentity ?? sourceIdentity,
      patch: {
        ...previous?.patch,
        ...Object.fromEntries(
          Object.entries(values)
            .filter(([key]) => keys.includes(key))
            .map(([key, value]) => [key, value === undefined ? null : value]),
        ),
      },
    }));
  return (
    <section aria-label={`Inputs for ${block.label}`} className="space-y-3">
      <h4 className="font-medium">{block.label} · input form</h4>
      <p className="text-xs text-muted-foreground">
        Changes apply to this work only. Apply to recalculate affected steps.
      </p>
      {block.family === 'Logic' && keys.includes('inputChoices') ? (
        <SessionCalculationInputs
          config={config}
          rules={rules}
          sources={sources}
          inputOptions={inputOptions}
          sourceOptions={sourceOptions}
          disabled={disabled || busy}
          onConfigPatch={stagePatch}
        />
      ) : (
        <SourceSetupPanel
          currentWork
          block={block}
          config={config}
          disabled={disabled || busy}
          sourceLocked={false}
          sourceUsedInRun={false}
          sourceVersion={Number(config.sourceVersion) || 1}
          onCreateSourceVersion={() => setError('Use Build to change the saved source definition.')}
          onConfigPatch={stagePatch}
        />
      )}
      {stale && (
        <div className="space-y-2 rounded border border-amber-500/40 p-3 text-sm" role="alert">
          <p>
            {sources.length
              ? 'This bloc’s inputs or connected source evidence changed.'
              : 'This bloc’s inputs changed.'}{' '}
            Your unapplied edits are preserved. Review them against the latest inputs before
            applying.
          </p>
          <button
            type="button"
            className="mr-3 underline disabled:opacity-50"
            disabled={disabled || busy}
            onClick={() => {
              setDraft({ config: block.config, patch, sourceIdentity });
              setError('');
            }}
          >
            Review my edits on latest inputs
          </button>
          <button
            type="button"
            className="underline"
            onClick={() => {
              setDraft(null);
              setError('');
            }}
          >
            Discard my edits
          </button>
        </div>
      )}
      <button
        type="button"
        className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
        disabled={disabled || busy || stale}
        onClick={async () => {
          setBusy(true);
          setError('');
          try {
            const values = keys.includes('inputChoices')
              ? { inputChoices: calculationInputChoices(config, inferCalculationInputs(rules)) }
              : Object.keys(patch).length
                ? patch
                : Object.fromEntries(
                    keys
                      .filter((key) => config[key] !== undefined)
                      .map((key) => [key, config[key]]),
                  );
            await submitSessionInput(store, refValue, revision, {
              kind: 'inputs',
              blockId: block.id,
              patch: values,
            });
            setDraft(null);
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
  readModel,
  blockId,
  includeCalculations = true,
}: {
  readModel: WorkflowSessionReadModel;
  blockId?: string;
  includeCalculations?: boolean;
}) {
  const { workflowId, session, definition, groups } = readModel;
  const runId = session.id;
  const blocks = definition.blocks.filter(
    (block) =>
      block.config.sourceKind !== 'pdf_document' &&
      runInputKeys(block).length &&
      (includeCalculations || !runInputKeys(block).includes('inputChoices')) &&
      (!runInputKeys(block).includes('inputChoices') ||
        groups.some(
          (group) =>
            group.blockId === block.id &&
            (group.requirements.length || group.retiredChoices.length),
        )) &&
      (!blockId || block.id === blockId),
  );
  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        const group = groups.find((item) => item.blockId === block.id);
        return (
          <BlockInputForm
            key={`${workflowId}:${runId}:${block.id}`}
            refValue={{ workflowId, runId }}
            block={block}
            revision={session.revision}
            rules={group?.rules ?? []}
            sources={group?.sources ?? []}
            inputOptions={group?.inputOptions}
            sourceOptions={group?.sourceOptions}
            sourceIdentity={readModel.sourceIdentities.get(block.id) ?? ''}
            disabled={!session.paused || !!session.endedAt}
          />
        );
      })}
    </div>
  );
}
