import type { ResponseValueMapping } from '@workspace/source-connectors/http-json';
import { resolveResponseValues } from '@workspace/source-connectors/http-json';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function ApiOutputMappingEditor({
  config,
  disabled,
  onConfigPatch,
}: {
  config: Record<string, unknown>;
  disabled: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
}) {
  const mappings = (
    Array.isArray(config.outputMappings) ? config.outputMappings : []
  ) as ResponseValueMapping[];
  const update = (index: number, patch: Partial<ResponseValueMapping>) =>
    onConfigPatch({
      outputMappings: mappings.map((mapping, i) =>
        i === index ? { ...mapping, ...patch } : mapping,
      ),
    });
  let preview: string;
  try {
    const result = resolveResponseValues(config.fetchedPayload, mappings, config);
    preview = JSON.stringify(result.namedValues, null, 2);
  } catch (error) {
    preview = error instanceof Error ? error.message : 'Fetch a response to preview outputs.';
  }
  return (
    <div className="space-y-3 rounded-md border p-3">
      <h4 className="text-xs font-medium">Response → named outputs</h4>
      <p className="text-xs text-muted-foreground">
        Name the values the next step needs. Paths use dots and array indexes, such as data.name or
        results.0.value. Use * for an array to average; leave the path empty for the entire
        response.
      </p>
      {mappings.map((mapping, index) => (
        <div key={index} className="space-y-2 rounded border p-2">
          <label className="block text-xs">
            Output name
            <Input
              disabled={disabled}
              value={mapping.name}
              onChange={(event) => update(index, { name: event.target.value })}
            />
          </label>
          <label className="block text-xs">
            Response path
            <Input
              disabled={disabled}
              value={mapping.path}
              onChange={(event) => update(index, { path: event.target.value })}
            />
          </label>
          <label className="block text-xs">
            Value type
            <select
              className="ml-2 rounded border bg-background p-1"
              disabled={disabled}
              value={mapping.type}
              onChange={(event) =>
                update(index, {
                  type: event.target.value as ResponseValueMapping['type'],
                  operation: 'value',
                })
              }
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="json">JSON</option>
            </select>
          </label>
          {mapping.type === 'number' && (
            <>
              <label className="block text-xs">
                Selection
                <select
                  className="ml-2 rounded border bg-background p-1"
                  disabled={disabled}
                  value={mapping.operation ?? 'value'}
                  onChange={(event) =>
                    update(index, { operation: event.target.value as 'value' | 'mean' })
                  }
                >
                  <option value="value">One value</option>
                  <option value="mean">Average of values</option>
                </select>
              </label>
              <label className="block text-xs">
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={mapping.positive ?? false}
                  onChange={(event) => update(index, { positive: event.target.checked })}
                />{' '}
                Require a positive number
              </label>
              {mapping.operation === 'mean' && (
                <label className="block text-xs">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={mapping.skipMissing ?? false}
                    onChange={(event) => update(index, { skipMissing: event.target.checked })}
                  />{' '}
                  Skip missing observations
                </label>
              )}
            </>
          )}
          {mapping.overrideKey && (
            <label className="block text-xs">
              Manual override (clear to use API)
              <Input
                disabled={disabled}
                value={
                  config[mapping.overrideKey] == null ? '' : String(config[mapping.overrideKey])
                }
                onChange={(event) =>
                  onConfigPatch({
                    [mapping.overrideKey!]:
                      event.target.value === ''
                        ? null
                        : mapping.type === 'number'
                          ? Number(event.target.value)
                          : event.target.value,
                  })
                }
              />
            </label>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() =>
              onConfigPatch({ outputMappings: mappings.filter((_, i) => i !== index) })
            }
          >
            Remove output
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() =>
          onConfigPatch({
            outputMappings: [
              ...mappings,
              { name: `value${mappings.length + 1}`, path: '', type: 'text' },
            ],
          })
        }
      >
        Add output
      </Button>
      <div className="text-xs">Output preview from saved response / explicit overrides</div>
      <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">{preview}</pre>
    </div>
  );
}
