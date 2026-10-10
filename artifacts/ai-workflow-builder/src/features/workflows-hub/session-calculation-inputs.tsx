import { useMemo, useState } from 'react';
import type {
  CalculationInputChoice,
  CalculationInputRequirement,
} from '@workspace/workflow-contracts/domain/calculation-inputs';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import {
  calculationInputOptionsFromOutputs,
  describeCalculationInputs,
  inferCalculationInputs,
  type CalculationInputRule,
  type CalculationInputOptions,
} from '@workspace/workflow-executors/calculation-inputs';
import {
  calculationInputChoices,
  calculationFormSourceOptions,
  type CalculationFormSource,
  type CalculationSourceOption,
} from './workflow-required-inputs-model';
import { SessionConnectedFieldPicker } from './session-connected-field-picker';

const INLINE_SOURCE_OPTION_LIMIT = 100;

function providerLabel(input: CalculationInputRequirement, sources: CalculationFormSource[]) {
  if (input.binding?.kind === 'source') {
    const binding = input.binding;
    const source = sources.find((item) => item.block.id === binding.blockId);
    return `${source?.block.label ?? binding.blockId} → ${binding.path.join('.') || 'value'}`;
  }
  if (input.binding?.kind === 'manual') return 'Entered value';
  if (input.origin === 'default') return 'Configured default';
  return 'Connected value with this name';
}

/** Generated from formula requirements. Provider choices and values apply only to this run. */
export function SessionCalculationInputs({
  config,
  rules,
  sources = [],
  disabled,
  onConfigPatch,
  inputOptions,
  sourceOptions: preparedSourceOptions,
}: {
  config: WorkflowBlock['config'];
  rules: readonly CalculationInputRule[];
  sources?: CalculationFormSource[];
  disabled: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  inputOptions?: CalculationInputOptions;
  sourceOptions?: CalculationSourceOption[];
}) {
  const [pickerName, setPickerName] = useState<string | null>(null);
  const options = useMemo(
    () =>
      inputOptions ??
      calculationInputOptionsFromOutputs(
        sources.flatMap((source) =>
          source.output === undefined ? [] : [{ blockId: source.block.id, output: source.output }],
        ),
      ),
    [inputOptions, sources],
  );
  const inputs = useMemo(
    () => describeCalculationInputs(rules, config, options),
    [rules, config, options],
  );
  const names = inferCalculationInputs(rules);
  const choices = calculationInputChoices(config, names);
  const retiredChoices = Object.keys(calculationInputChoices(config)).filter(
    (name) => !names.includes(name),
  );
  const sourceOptions = useMemo(
    () => preparedSourceOptions ?? calculationFormSourceOptions(sources),
    [preparedSourceOptions, sources],
  );
  const browseSources = sourceOptions.length > INLINE_SOURCE_OPTION_LIMIT;
  const update = (name: string, choice?: CalculationInputChoice) => {
    const next = { ...choices };
    if (choice) next[name] = choice;
    else delete next[name];
    onConfigPatch({ inputChoices: next });
  };
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Fields come from this calculation’s formulas. Enter a value or choose a connected field for
        this run. Zero is a value; a blank is missing. Required source and review steps still apply.
      </p>
      {!!retiredChoices.length && (
        <p role="status" className="text-xs text-amber-700">
          These variables are no longer required: {retiredChoices.join(', ')}. Applying inputs
          removes their choices from this run’s current inputs; earlier history is retained.
        </p>
      )}
      {inputs.map((input) => {
        const choice = choices[input.name];
        const selected =
          choice?.kind === 'source' ? JSON.stringify(choice) : (choice?.kind ?? 'workflow');
        const binding = input.binding;
        const selectedOption = sourceOptions.find((option) => option.value === selected);
        const source =
          binding?.kind === 'source'
            ? sources.find((item) => item.block.id === binding.blockId)
            : undefined;
        return (
          <section
            key={input.name}
            aria-label={`Field ${input.name}`}
            className="space-y-2 rounded border p-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">
                {input.label}
                {input.unit ? ` (${input.unit})` : ''}
              </span>
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
            </p>
            <label className="block space-y-1">
              <span>Value comes from</span>
              <select
                aria-label={`Value provider for ${input.name}`}
                className="block w-full rounded border bg-background p-2"
                value={selected}
                onChange={(event) => {
                  setPickerName(null);
                  const value = event.target.value;
                  update(
                    input.name,
                    value === 'workflow'
                      ? undefined
                      : value === 'manual'
                        ? { kind: 'manual' }
                        : (JSON.parse(value) as CalculationInputChoice),
                  );
                }}
              >
                <option value="workflow">Use workflow setting</option>
                <option value="manual">Enter for this run</option>
                {choice?.kind === 'source' && (browseSources || !selectedOption) && (
                  <option value={selected}>
                    {selectedOption?.label ?? `${providerLabel(input, sources)} — unavailable`}
                  </option>
                )}
                {!browseSources &&
                  sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </label>
            {browseSources && (
              <button
                type="button"
                aria-label={`Browse connected fields for ${input.name}`}
                className="text-xs underline"
                onClick={() => setPickerName(input.name)}
              >
                Choose a connected field ({sourceOptions.length})
              </button>
            )}
            {browseSources && pickerName === input.name && (
              <SessionConnectedFieldPicker
                key={input.name}
                name={input.name}
                options={sourceOptions}
                disabled={disabled}
                onClose={() => setPickerName(null)}
                onChoose={(value) => {
                  update(input.name, JSON.parse(value) as CalculationInputChoice);
                  setPickerName(null);
                }}
              />
            )}
            <p className="break-all text-xs">
              From: {providerLabel(input, sources)}
              {choice ? ' · this run' : ' · workflow setting'}
            </p>
            {input.binding?.kind === 'manual' && (
              <label className="block space-y-1">
                <span>
                  {input.label}
                  {input.unit ? ` (${input.unit})` : ''}
                </span>
                <input
                  aria-label={`Value for ${input.name}`}
                  type="number"
                  step="any"
                  className="block w-full rounded border bg-background p-2"
                  value={input.status === 'provided' ? String(input.value) : ''}
                  onChange={(event) => {
                    const text = event.target.value.trim();
                    if (!text) update(input.name, { kind: 'manual' });
                    else if (Number.isFinite(Number(text)))
                      update(input.name, { kind: 'manual', value: Number(text) });
                  }}
                />
              </label>
            )}
            {input.status === 'provided' ? (
              <p>Value: {input.value}</p>
            ) : (
              <p className="text-xs text-amber-700">
                {input.message ?? 'A numeric value is required.'}
              </p>
            )}
            {source?.capturedAt && (
              <p className="text-xs text-muted-foreground">Source recorded: {source.capturedAt}</p>
            )}
          </section>
        );
      })}
      {!inputs.length && (
        <p className="text-xs text-muted-foreground">
          No variables are required by the current formulas.
        </p>
      )}
    </fieldset>
  );
}
