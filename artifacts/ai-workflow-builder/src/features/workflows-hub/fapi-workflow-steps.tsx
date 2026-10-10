import { type CSSProperties, type ReactNode } from 'react';
import { WorkflowStepTimeline } from './workflow-step-timeline';
import { workflowStepStatus } from './workflow-step-model';
import type { WorkflowSessionReadModel } from './workflow-session-read-model';
import './workflow-timeline.css';

type Step = WorkflowSessionReadModel['context']['steps'][number];
const stages = [
  {
    id: 'collect',
    label: 'Collect source documents',
    description: 'Foreign-affiliate trial balance and calculation inputs',
    type: 'Source',
    tone: '#7fb2d9',
  },
  {
    id: 'classify',
    label: 'Classify & categorize income',
    description: 'Keyword mapper → FAPI categories',
    type: 'Rule match',
    tone: '#a892d6',
  },
  {
    id: 'compute',
    label: 'Compute FAPI',
    description: 'Rollup + two-stage calculation engine',
    type: 'Engine',
    tone: '#7cc3a6',
  },
  {
    id: 'review',
    label: 'Review & approve',
    description: 'Worksheet, evidence and human sign-off on the figures',
    type: 'Checkpoint',
    tone: '#dab06c',
  },
] as const;
type StageId = (typeof stages)[number]['id'];

export function FapiWorkflowPreview() {
  return (
    <ol aria-label="FAPI workflow preview" className="workflow-timeline my-4">
      {stages.map((stage, index) => (
        <li
          key={stage.id}
          className="workflow-timeline-stage flex items-start gap-3 py-3"
          style={
            { '--stage-tone': stage.tone, '--stage-delay': `${index * 70}ms` } as CSSProperties
          }
        >
          <span aria-hidden="true" className="workflow-timeline-dot mt-1 shrink-0" />
          <span className="space-y-1 text-sm">
            <span className="font-semibold">{stage.label}</span>{' '}
            <span className="workflow-timeline-kind">{stage.type}</span>
            <span className="block text-xs text-muted-foreground">{stage.description}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function stageFor(step: Step): StageId {
  if (step.family === 'Source' || step.family === 'Trigger') return 'collect';
  if (step.id === 'fapi-logic-keyword-mapper') return 'classify';
  if (step.family === 'Logic' || step.family === 'AI / Agent') return 'compute';
  return 'review';
}

/** DevReplit's four visual stages project the saved graph; they never execute it. */
export function FapiWorkflowSteps({
  readModel,
  focusBlockId,
  renderStep,
}: {
  readModel: WorkflowSessionReadModel;
  focusBlockId?: string;
  renderStep: (step: Step) => ReactNode;
}) {
  const { context, session } = readModel;
  const focused = context.steps.find((step) => step.id === focusBlockId);
  const initial = focused ? stageFor(focused) : session.attempts.length ? null : 'collect';
  const required = context.steps.find((step) => step.inputRequired);
  return (
    <WorkflowStepTimeline
      kind="stage"
      initialId={initial}
      focusId={focused ? stageFor(focused) : undefined}
      requiredId={required ? stageFor(required) : undefined}
      items={stages.map((stage) => ({
        ...stage,
        panelLabel: stage.label,
        status: workflowStepStatus(
          context.steps.filter((step) => stageFor(step) === stage.id),
          !session.paused && !session.endedAt,
          stage.id === 'review' && !session.approvedAt,
        ),
      }))}
      renderItem={(stage) =>
        context.steps
          .filter((step) => stageFor(step) === stage.id)
          .map((step) => (
            <div
              key={step.id}
              className="space-y-3 border-b py-4 last:border-0"
              data-workflow-block={step.id}
            >
              <h5 className="text-sm font-semibold">
                {step.label}{' '}
                <span className="font-normal text-muted-foreground">
                  · {step.status.replaceAll('_', ' ')}
                </span>
              </h5>
              {renderStep(step)}
            </div>
          ))
      }
    />
  );
}
