import type { WorkflowView } from './view-contract';
import { workflowSteps, type WorkflowStep } from './step-read-model';

export function SelectedEvidence({ view, blockId }: { view: WorkflowView; blockId: string }) {
  const result = view.inspection?.results[blockId];
  if (!result)
    return (
      <p className="viewer-muted">
        {view.runId
          ? 'No recorded result is supplied for this block.'
          : 'Saved workflow definition. No run was requested.'}
      </p>
    );
  return (
    <section aria-label="Selected block evidence" className="viewer-evidence">
      <h3>Recorded evidence · {result.status.replaceAll('_', ' ')}</h3>
      <p className="viewer-muted">Recorded at {result.completedAt}</p>
      {(['input', 'output', 'evidenceRefs', 'sourceTrace', 'warnings', 'errors'] as const).map(
        (key) => (
          <details key={key}>
            <summary>
              {key === 'sourceTrace'
                ? 'Source provenance'
                : key === 'evidenceRefs'
                  ? 'Evidence references'
                  : key}
            </summary>
            <pre>{JSON.stringify(result[key], null, 2) ?? 'Not recorded'}</pre>
          </details>
        ),
      )}
    </section>
  );
}

function StepDetails({
  view,
  step,
  explaining,
  connected,
  onExplain,
}: {
  view: WorkflowView;
  step: WorkflowStep;
  explaining: boolean;
  connected: boolean;
  onExplain: () => void;
}) {
  return (
    <div className="viewer-step-details">
      <p>{step.block.description || 'No step description was saved.'}</p>
      <p className="viewer-muted">
        {step.block.family} · {step.block.subtype} · {step.block.id}
      </p>
      {step.status === 'outdated' && (
        <p className="viewer-attention">
          Previous result is outdated. It is excluded from successful current results.
        </p>
      )}
      {step.dependencies.length > 0 && (
        <p className="viewer-muted">
          Depends on:{' '}
          {step.dependencies
            .map((id) => view.definition.blocks.find((block) => block.id === id)?.label ?? id)
            .join(', ')}
        </p>
      )}
      {step.inputRequired && (
        <p className="viewer-attention">
          This saved run needs input for this step.{' '}
          {view.capabilities.write
            ? 'Review changes in Inputs or Sources, apply them, then recalculate separately.'
            : 'This connection has read access.'}
        </p>
      )}
      <button
        type="button"
        className="viewer-button"
        disabled={!connected || explaining}
        onClick={onExplain}
      >
        {explaining ? 'Sending…' : 'Explain this block'}
      </button>
      <details>
        <summary>Saved configuration</summary>
        <pre aria-label="Saved configuration">{JSON.stringify(step.block.config, null, 2)}</pre>
      </details>
      {step.block.formula && (
        <details>
          <summary>Saved formula</summary>
          <pre>{JSON.stringify(step.block.formula, null, 2)}</pre>
        </details>
      )}
      {step.block.code && (
        <details>
          <summary>Saved code</summary>
          <pre>{JSON.stringify(step.block.code, null, 2)}</pre>
        </details>
      )}
      <SelectedEvidence view={view} blockId={step.block.id} />
    </div>
  );
}

export function StepNavigator({
  view,
  selected,
  inspected,
  connected,
  explaining,
  onSelect,
  onExplain,
}: {
  view: WorkflowView;
  selected: string;
  inspected: string | null;
  connected: boolean;
  explaining: boolean;
  onSelect: (id: string) => void;
  onExplain: () => void;
}) {
  const steps = workflowSteps(view);
  return (
    <ol aria-label="Workflow steps" className="viewer-steps">
      {steps.map((step, index) => {
        const open = inspected === step.block.id;
        const detailsId = `step-details-${index}`;
        return (
          <li
            key={step.block.id}
            className="viewer-step"
            data-family={step.block.family}
            data-selected={selected === step.block.id}
          >
            <button
              type="button"
              className="viewer-step-button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => onSelect(step.block.id)}
            >
              <span className="viewer-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="viewer-step-name">
                <strong>{step.block.label}</strong>
                <span className="viewer-muted">{step.block.family}</span>
              </span>
              <span
                className="viewer-step-status"
                data-status={view.runId ? step.status : 'definition'}
              >
                {step.label}
              </span>
              <span aria-hidden="true">{open ? '−' : '+'}</span>
            </button>
            <section id={detailsId} hidden={!open} aria-label={`Step details: ${step.block.label}`}>
              {open && (
                <StepDetails
                  view={view}
                  step={step}
                  connected={connected}
                  explaining={explaining}
                  onExplain={onExplain}
                />
              )}
            </section>
          </li>
        );
      })}
    </ol>
  );
}
