import { FieldWorksheetView } from '@/features/workflow-builder/ui/logic-viewers/field-worksheet-view';
import { SessionInputForms } from './session-input-forms';
import type { WorkflowSessionReadModel } from './workflow-session-read-model';

/** Worksheet lines are available independently of the Field's position in execution. */
export function WorkflowSessionWorksheet({ readModel }: { readModel: WorkflowSessionReadModel }) {
  if (!readModel.worksheets.length) return null;
  const editableCalculationIds = readModel.groups
    .filter((group) => group.requirements.length || group.retiredChoices.length)
    .map((group) => group.blockId);
  return (
    <div className="space-y-4" aria-label="Workflow worksheets">
      {readModel.worksheets.map(({ block, projection }) => (
        <FieldWorksheetView
          key={block.id}
          label={block.label}
          editableCalculationIds={editableCalculationIds}
          projection={projection}
          renderInputs={(blockId) => <SessionInputForms readModel={readModel} blockId={blockId} />}
        />
      ))}
    </div>
  );
}
