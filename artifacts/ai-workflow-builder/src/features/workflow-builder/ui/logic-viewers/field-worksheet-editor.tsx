import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import { readWorksheetLines, type WorksheetLine } from '@workspace/workflow-core/field-worksheet';
import { effectiveCalculationInputRules } from '@workspace/workflow-core/calculation-inputs';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';

export function FieldWorksheetEditor({
  block,
  definition,
  disabled,
  onConfigPatch,
}: {
  block: WorkflowBlock;
  definition: Pick<WorkflowDefinition, 'blocks' | 'edges'>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
}) {
  const parsed = readWorksheetLines(block.config);
  const legacyFields: { key: string; label?: string }[] = Array.isArray(block.config.fields)
    ? block.config.fields.filter((field) => field && typeof field.key === 'string')
    : [];
  // Keep incomplete edits visible while shared validation reports their missing fields.
  const lines: WorksheetLine[] = Array.isArray(block.config.worksheetLines)
    ? block.config.worksheetLines.filter(
        (line): line is WorksheetLine =>
          !!line &&
          typeof line === 'object' &&
          ['id', 'label', 'calculationBlockId', 'resultKey'].every(
            (key) => typeof line[key] === 'string',
          ),
      )
    : [];
  const incoming = new Set(
    definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
      .map((edge) => edge.sourceBlockId),
  );
  const calculators = definition.blocks.filter(
    (item) => incoming.has(item.id) && getToolIdForBlock(item) === 'logic.calculation_engine',
  );
  const outputs = (id: string) => {
    const calculator = calculators.find((item) => item.id === id);
    return calculator ? effectiveCalculationInputRules(calculator, definition) : [];
  };
  const update = (id: string, patch: Partial<WorksheetLine>) =>
    onConfigPatch({
      worksheetLines: lines.map((line) => {
        if (line.id !== id) return line;
        const next = { ...line, ...patch };
        for (const key of ['presentation', 'group', 'description', 'decimalPlaces'] as const) {
          if (key in patch && patch[key] === undefined) delete next[key];
        }
        return next;
      }),
    });
  return (
    <section aria-label="Worksheet line settings" className="space-y-3 rounded border p-3">
      <h4 className="text-sm font-medium">Worksheet lines</h4>
      <p className="text-xs text-muted-foreground">
        Choose results from connected calculators. Labels and units change the display; formulas
        stay in their calculator or rules source.
      </p>
      {!parsed.declared && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Currently showing all recorded upstream values. Add a line to define a worksheet that is
            visible before running.
          </p>
          {legacyFields.map((field) => (
            <div key={field.key} className="flex justify-between gap-2 text-xs">
              <span>{field.label || field.key}</span>
              <code>{field.key}</code>
            </div>
          ))}
        </div>
      )}
      {parsed.errors.map((error, index) => (
        <p role="alert" className="text-xs text-amber-700" key={index}>
          {error}
        </p>
      ))}
      {lines.map((line, index) => (
        <fieldset
          key={line.id}
          disabled={disabled}
          className="grid gap-2 rounded border p-3 sm:grid-cols-2"
        >
          <legend className="px-1 text-xs">Line {index + 1}</legend>
          <label className="text-xs">
            Label
            <input
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Label for worksheet line ${index + 1}`}
              value={line.label}
              onChange={(event) => update(line.id, { label: event.target.value })}
            />
          </label>
          <label className="text-xs">
            Unit (optional)
            <input
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Unit for worksheet line ${index + 1}`}
              value={line.unit ?? ''}
              onChange={(event) => update(line.id, { unit: event.target.value })}
            />
          </label>
          <label className="text-xs">
            Calculator
            <select
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Calculator for worksheet line ${index + 1}`}
              value={line.calculationBlockId}
              onChange={(event) =>
                update(line.id, {
                  calculationBlockId: event.target.value,
                  resultKey: outputs(event.target.value)[0]?.resultKey ?? '',
                })
              }
            >
              {!calculators.some((item) => item.id === line.calculationBlockId) && (
                <option value={line.calculationBlockId}>
                  {line.calculationBlockId || 'Choose a calculator'} (not connected)
                </option>
              )}
              {calculators.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Result
            <select
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Result for worksheet line ${index + 1}`}
              value={line.resultKey}
              onChange={(event) => update(line.id, { resultKey: event.target.value })}
            >
              {!outputs(line.calculationBlockId).some(
                (rule) => rule.resultKey === line.resultKey,
              ) && (
                <option value={line.resultKey}>
                  {line.resultKey || 'Choose a result'} (unavailable)
                </option>
              )}
              {outputs(line.calculationBlockId).map((rule) => (
                <option key={rule.resultKey} value={rule.resultKey}>
                  {rule.label ? `${rule.label} · ` : ''}
                  {rule.resultKey}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Display role
            <select
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Display role for worksheet line ${index + 1}`}
              value={line.presentation ?? ''}
              onChange={(event) =>
                update(line.id, {
                  presentation: (event.target.value || undefined) as WorksheetLine['presentation'],
                })
              }
            >
              <option value="">Standard row</option>
              <option value="primary">Primary result</option>
              <option value="summary">Summary</option>
              <option value="detail">Supporting detail</option>
            </select>
          </label>
          <label className="text-xs">
            Group (optional)
            <input
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Group for worksheet line ${index + 1}`}
              value={line.group ?? ''}
              onChange={(event) => update(line.id, { group: event.target.value || undefined })}
            />
          </label>
          <label className="text-xs">
            Description (optional)
            <input
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Description for worksheet line ${index + 1}`}
              value={line.description ?? ''}
              onChange={(event) =>
                update(line.id, { description: event.target.value || undefined })
              }
            />
          </label>
          <label className="text-xs">
            Decimal places
            <select
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              aria-label={`Decimal places for worksheet line ${index + 1}`}
              value={line.decimalPlaces ?? ''}
              onChange={(event) =>
                update(line.id, {
                  decimalPlaces: event.target.value === '' ? undefined : Number(event.target.value),
                })
              }
            >
              <option value="">Automatic</option>
              {[0, 1, 2, 3, 4, 5, 6].map((places) => (
                <option key={places} value={places}>
                  {places}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Primary results are prominent; supporting details start collapsed. Decimal places change
            the display only, not the recorded value.
          </p>
          <button
            type="button"
            className="justify-self-start text-xs underline"
            onClick={() =>
              onConfigPatch({ worksheetLines: lines.filter((item) => item.id !== line.id) })
            }
          >
            Remove line {index + 1}
          </button>
        </fieldset>
      ))}
      {!calculators.length && (
        <p className="text-xs text-muted-foreground">
          Connect a calculation engine to this Field to choose its results.
        </p>
      )}
      <button
        type="button"
        disabled={disabled || !calculators.length}
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        onClick={() => {
          const calculator = calculators[0];
          const rule = outputs(calculator.id)[0];
          onConfigPatch({
            worksheetLines: [
              ...lines,
              {
                id: `line-${crypto.randomUUID()}`,
                label: rule?.label || rule?.resultKey || 'New line',
                calculationBlockId: calculator.id,
                resultKey: rule?.resultKey ?? '',
              },
            ],
          });
        }}
      >
        Add worksheet line
      </button>
    </section>
  );
}
