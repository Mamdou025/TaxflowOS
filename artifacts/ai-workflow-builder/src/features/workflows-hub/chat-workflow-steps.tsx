import type { ReactNode } from 'react';
import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import { WorkflowStepTimeline } from './workflow-step-timeline';
import { workflowStepStatus, workflowStepTone, type WorkflowStep } from './workflow-step-model';
import { WorkflowBlockDetails } from './workflow-block-details';

export function WorkflowDefinitionPreview({ definition }: { definition: WorkflowDefinition }) {
  return (
    <WorkflowStepTimeline
      listLabel="Workflow preview"
      items={definition.blocks.map((block, index) => ({
        id: block.id,
        label: block.label,
        description: block.description,
        type: block.family,
        tone: workflowStepTone(block.family),
        status: 'Not started',
        panelLabel: `Step ${index + 1}: ${block.label}`,
      }))}
      renderItem={(item) => <WorkflowBlockDetails definition={definition} blockId={item.id} />}
    />
  );
}

/** Shared inline navigator in Chat and Run; folding never discards edits. */
export function ChatWorkflowSteps({
  steps,
  blocks,
  initialBlockId,
  requiredInputBlockId,
  running = false,
  renderStep,
}: {
  steps: WorkflowStep[];
  blocks: WorkflowBlock[];
  initialBlockId?: string;
  requiredInputBlockId?: string;
  running?: boolean;
  renderStep: (step: WorkflowStep) => ReactNode;
}) {
  const required =
    steps.find((step) => step.id === requiredInputBlockId) ??
    steps.find((step) => step.inputRequired);
  const first = steps.find((step) => step.id === initialBlockId)?.id ?? required?.id;
  return (
    <WorkflowStepTimeline
      initialId={first}
      focusId={initialBlockId}
      requiredId={required?.id}
      items={steps.map((step, index) => {
        const block = blocks.find((item) => item.id === step.id);
        return {
          id: step.id,
          label: step.label,
          description: block?.description,
          type: step.family,
          tone: workflowStepTone(step.family),
          status: workflowStepStatus([step], running),
          panelLabel: `Step ${index + 1}: ${step.label}`,
        };
      })}
      renderItem={(item) => {
        const step = steps.find((step) => step.id === item.id);
        return step ? (
          <div className="space-y-3 py-4" data-workflow-block={step.id}>
            {renderStep(step)}
          </div>
        ) : null;
      }}
    />
  );
}
