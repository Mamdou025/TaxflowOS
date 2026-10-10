import {
  calculationInputOptionsFromOutputs,
  describeCalculationInputs,
} from '@workspace/workflow-executors/calculation-inputs';
import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { calculationSources } from './calculation-source-picker';
import { calculationInputRules, calculationSourceFields } from './calculation-variable-model';

export function CalculationVariablePanel({
  block,
  edges,
  nodes,
  outputs,
  disabled,
  onChange,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  outputs: Record<string, unknown>;
  disabled: boolean;
  onChange: (key: string, value: unknown) => void;
}) {
  const sources = calculationSources(block, edges, nodes);
  const requirements = describeCalculationInputs(
    calculationInputRules(block, edges, nodes),
    block.config,
    calculationInputOptionsFromOutputs(
      sources
        .filter((source) => outputs[source.id] !== undefined)
        .map((source) => ({ blockId: source.id, output: outputs[source.id] })),
    ),
  );
  const definitions = Array.isArray(block.config.inputDefinitions)
    ? block.config.inputDefinitions
    : [];
  const inputValues =
    block.config.inputValues &&
    typeof block.config.inputValues === 'object' &&
    !Array.isArray(block.config.inputValues)
      ? (block.config.inputValues as Record<string, unknown>)
      : {};
  const update = (name: string, patch: Record<string, unknown>) => {
    const existing = definitions.find((definition) => definition?.name === name);
    const definition = { ...existing, name, type: 'number', ...patch };
    onChange('inputDefinitions', [
      ...definitions.filter((item) => item?.name !== name),
      definition,
    ]);
  };
  return (
    <details
      className="max-h-80 shrink-0 overflow-y-auto border-b p-3 text-xs"
      open={requirements.some((input) => input.status !== 'provided')}
    >
      <summary className="cursor-pointer font-medium">
        Required variables · {requirements.length}
      </summary>
      <p className="my-2 text-muted-foreground">
        Your formulas determine these inputs. Choose where each value comes from. Units describe
        values; they do not convert them. Source values are from the last run; run again after
        changing a source.
      </p>
      {!requirements.length && <p>Add variables to a formula to choose their values here.</p>}
      <div className="space-y-3">
        {requirements.map((input) => {
          const binding = input.binding;
          const source =
            binding?.kind === 'source'
              ? sources.find((item) => item.id === binding.blockId)
              : undefined;
          return (
            <fieldset key={input.name} disabled={disabled} className="space-y-2 rounded border p-2">
              <legend className="px-1 font-mono font-semibold">{input.name}</legend>
              <div className="flex flex-wrap gap-2">
                <label>
                  Label{' '}
                  <input
                    aria-label={`Label for ${input.name}`}
                    className="rounded border bg-background p-1"
                    value={input.label === input.name ? '' : input.label}
                    onChange={(event) => update(input.name, { label: event.target.value })}
                  />
                </label>
                <span className="self-center text-muted-foreground">Number</span>
                <label>
                  Unit{' '}
                  <input
                    aria-label={`Unit for ${input.name}`}
                    className="w-24 rounded border bg-background p-1"
                    value={input.unit ?? ''}
                    onChange={(event) => update(input.name, { unit: event.target.value })}
                  />
                </label>
              </div>
              <label className="block">
                Value comes from
                <select
                  aria-label={`Value provider for ${input.name}`}
                  className="ml-2 rounded border bg-background p-1"
                  value={binding?.kind ?? 'connected'}
                  onChange={(event) =>
                    update(input.name, {
                      binding:
                        event.target.value === 'connected'
                          ? undefined
                          : event.target.value === 'manual'
                            ? { kind: 'manual' }
                            : { kind: 'source', blockId: sources[0]?.id ?? '', path: [] },
                    })
                  }
                >
                  <option value="connected">Connected value with this name</option>
                  <option value="manual">Enter value</option>
                  <option value="source" disabled={!sources.length}>
                    Choose a connected field
                  </option>
                </select>
              </label>
              {binding?.kind === 'manual' && (
                <label className="block">
                  {input.label}
                  {input.unit ? ` (${input.unit})` : ''}
                  <input
                    aria-label={`Value for ${input.name}`}
                    type="number"
                    step="any"
                    className="ml-2 rounded border bg-background p-1"
                    value={
                      typeof inputValues[input.name] === 'number'
                        ? String(inputValues[input.name])
                        : ''
                    }
                    onChange={(event) => {
                      const next = { ...inputValues };
                      if (!event.target.value.trim()) delete next[input.name];
                      else if (Number.isFinite(Number(event.target.value)))
                        next[input.name] = Number(event.target.value);
                      onChange('inputValues', next);
                    }}
                  />
                </label>
              )}
              {binding?.kind === 'source' && (
                <div className="space-y-2">
                  <select
                    aria-label={`Source block for ${input.name}`}
                    className="w-full rounded border bg-background p-1"
                    value={binding.blockId}
                    onChange={(event) =>
                      update(input.name, {
                        binding: { kind: 'source', blockId: event.target.value, path: [] },
                      })
                    }
                  >
                    {!source && <option value={binding.blockId}>Choose a connected block</option>}
                    {sources.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {source && (
                    <div className="flex flex-wrap gap-1">
                      {calculationSourceFields(source, outputs[source.id]).map((path) => (
                        <button
                          type="button"
                          key={JSON.stringify(path)}
                          className="rounded border px-2 py-1"
                          onClick={() => update(input.name, { binding: { ...binding, path } })}
                        >
                          {path.join(' › ') || 'Value'}
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="block">
                    Output field
                    <input
                      aria-label={`Source field for ${input.name}`}
                      className="ml-2 rounded border bg-background p-1"
                      value={binding.path.join('.')}
                      placeholder="For example: namedValues.exchangeRate"
                      onChange={(event) =>
                        update(input.name, {
                          binding: {
                            ...binding,
                            path: event.target.value ? event.target.value.split('.') : [],
                          },
                        })
                      }
                    />
                  </label>
                  <p className="text-muted-foreground">
                    Choose a declared field or enter its path. An empty path uses a numeric block
                    output. The source must be connected and run.
                  </p>
                </div>
              )}
              <p
                role="status"
                className={input.status === 'provided' ? 'text-muted-foreground' : 'text-amber-700'}
              >
                {input.status === 'provided'
                  ? `${input.origin === 'source' || input.origin === 'connected' ? 'Last run value' : 'Available'}: ${input.value}${input.origin === 'default' ? ' (explicit default)' : ''}`
                  : (input.message ?? `Missing value for ${input.name}.`)}
              </p>
            </fieldset>
          );
        })}
      </div>
    </details>
  );
}
