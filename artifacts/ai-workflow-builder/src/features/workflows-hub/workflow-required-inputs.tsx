import type { CalculationInputRequirement } from '@workspace/workflow-contracts/domain/calculation-inputs';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type { ReactNode } from 'react';
import {
  workflowRequiredInputs,
  type WorkflowCalculationGroup,
} from './workflow-required-inputs-model';

function providerLabel(
  input: CalculationInputRequirement,
  definition: WorkflowDefinition,
  calculationLabel: string,
) {
  if (input.binding?.kind === 'source') {
    const binding = input.binding;
    const source = definition.blocks.find((block) => block.id === binding.blockId);
    return `${source?.label ?? binding.blockId} → ${binding.path.join('.') || 'value'}`;
  }
  if (input.binding?.kind === 'manual') return `${calculationLabel} input form`;
  if (input.origin === 'default') return 'Configured default';
  return input.origin === 'connected'
    ? 'Connected value'
    : 'Choose a source or manual entry in Build';
}

export function WorkflowRequiredInputs({
  definition,
  session,
  renderInputs,
  groups: preparedGroups,
}: {
  definition: WorkflowDefinition;
  session: WorkflowSession;
  renderInputs?: (blockId: string) => ReactNode;
  groups?: WorkflowCalculationGroup[];
}) {
  const groups = (preparedGroups ?? workflowRequiredInputs(definition, session)).filter(
    (group) => group.requirements.length || (renderInputs && group.retiredChoices.length),
  );
  const requirements = groups.flatMap((group) => group.requirements);
  const provided = requirements.filter((input) => input.status === 'provided').length;
  return (
    <section aria-label="Required workflow fields" className="space-y-3 rounded border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">Required workflow fields</h4>
        {!!requirements.length && (
          <span className="text-xs text-muted-foreground">
            {provided} of {requirements.length} provided
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        These fields come from the workflow’s formulas. Sources can collect data while fields are
        missing; each calculation requires its own numeric values before it can complete.
      </p>
      {groups.map((group) => (
        <section
          key={group.blockId}
          aria-label={`Required fields for ${group.label}`}
          className="space-y-2"
        >
          {renderInputs ? (
            renderInputs(group.blockId)
          ) : (
            <>
              <h5 className="text-sm font-medium">{group.label}</h5>
              <ul className="space-y-2">
                {group.requirements.map((input) => (
                  <li key={input.name} className="space-y-1 rounded border p-2 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{input.label}</span>
                      <span
                        className={
                          input.status === 'provided'
                            ? 'rounded bg-green-100 px-2 py-0.5 text-xs text-green-800'
                            : 'rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900'
                        }
                      >
                        {input.status === 'provided'
                          ? 'Provided'
                          : input.status === 'invalid'
                            ? 'Invalid'
                            : 'Missing'}
                      </span>
                    </div>
                    <p className="break-all text-xs text-muted-foreground">
                      {input.name} · Number · required · finite
                      {input.unit ? ` · Unit: ${input.unit}` : ''}
                    </p>
                    <p className="break-all text-xs">
                      From: {providerLabel(input, definition, group.label)}
                    </p>
                    {input.status === 'provided' ? (
                      <p>Value: {input.value}</p>
                    ) : (
                      <p className="text-xs text-amber-700">{input.message}</p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      ))}
      {!requirements.length && (
        <p className="text-sm">No calculation fields are defined in this workflow.</p>
      )}
      {requirements.some((input) => input.unit) && (
        <p className="text-xs text-muted-foreground">
          Unit labels describe values; they do not check currency or unit compatibility.
        </p>
      )}
    </section>
  );
}
