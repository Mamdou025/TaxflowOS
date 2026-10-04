import { useId, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import type { sessionContext } from '@workspace/workflow-core/sessions';
import { blockProgressColor } from '@/features/workflow-builder/ui/nodes/family-node-shape';

type Step = ReturnType<typeof sessionContext>['steps'][number];

/** One inline navigator. Keep visited forms mounted so folding never discards edits. */
export function ChatWorkflowSteps({
  steps,
  blocks,
  initialBlockId,
  renderStep,
}: {
  steps: Step[];
  blocks: WorkflowBlock[];
  initialBlockId?: string;
  renderStep: (step: Step) => ReactNode;
}) {
  const first =
    steps.find((step) => step.id === initialBlockId)?.id ??
    steps.find((step) => step.inputRequired)?.id ??
    null;
  const [expanded, setExpanded] = useState<string | null>(first);
  const [visited, setVisited] = useState(() => new Set(first ? [first] : []));
  const instanceId = useId();
  const open = (id: string) => {
    setVisited((previous) => new Set([...previous, id]));
    setExpanded(id);
  };
  const required = steps.find((step) => step.inputRequired);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h4 className="font-medium">Steps</h4>
        <button
          className="text-xs underline disabled:opacity-50"
          disabled={expanded === null}
          onClick={() => setExpanded(null)}
        >
          Collapse all steps
        </button>
      </div>
      {required && expanded !== required.id && (
        <button className="text-xs underline" onClick={() => open(required.id)}>
          Provide input for {required.label}
        </button>
      )}
      <ol aria-label="Execution steps" className="space-y-2">
        {steps.map((step, index) => {
          const isOpen = expanded === step.id;
          const panelId = `${instanceId}-${step.id}`;
          const block = blocks.find((item) => item.id === step.id)!;
          return (
            <li key={step.id} className="overflow-hidden rounded-lg border">
              <button
                type="button"
                data-step-toggle
                data-step-id={step.id}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-2 bg-muted/20 px-3 py-2 text-left text-sm hover:bg-muted/40"
                onClick={() => (isOpen ? setExpanded(null) : open(step.id))}
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full bg-current ${blockProgressColor(block)}`}
                />
                <span className="min-w-0 flex-1">
                  {index + 1}. {step.label}{' '}
                  <span className="text-muted-foreground">
                    · {step.inputRequired ? 'Needs your input' : step.status.replaceAll('_', ' ')}
                  </span>
                </span>
                {isOpen ? (
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                ) : (
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
                )}
              </button>
              <section
                id={panelId}
                aria-label={`Step ${index + 1}: ${step.label}`}
                hidden={!isOpen}
                aria-hidden={!isOpen}
                className="space-y-3 border-t p-3"
              >
                {visited.has(step.id) && renderStep(step)}
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
