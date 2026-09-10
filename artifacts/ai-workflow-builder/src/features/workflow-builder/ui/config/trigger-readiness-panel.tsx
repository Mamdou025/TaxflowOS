import type { WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
import { evaluateReadiness, readinessConditions, type ReadinessCondition } from '@/shared/workflow-engine/trigger-readiness';

export function TriggerReadinessPanel({ config, blocks, outputs = {}, onChange, disabled = false }: { config: Record<string, unknown>; blocks: WorkflowBlock[]; outputs?: Record<string, unknown>; onChange?: (conditions: ReadinessCondition[]) => void; disabled?: boolean }) {
  const conditions = readinessConditions(config, blocks);
  const update = (id: string, patch: Partial<ReadinessCondition>) => onChange?.(conditions.map(condition => condition.id === id ? { ...condition, ...patch } : condition));
  return <section className="space-y-3 rounded border p-3" aria-label="Trigger readiness">
    <h3 className="font-semibold">Workflow start conditions</h3>
    <p className="text-xs text-muted-foreground">Advisory only — you can always start a manual run. Field checks use recorded source outputs; test again after changing data.</p>
    {conditions.length === 0 && <p className="text-sm">No conditions configured. Manual run is available.</p>}
    {conditions.map(condition => {
      const result = evaluateReadiness(condition, blocks, outputs);
      const label = result.status === 'met' ? 'Met' : result.status === 'waiting' ? 'Waiting' : 'Not checked';
      return <div className="space-y-2 rounded border p-3" key={condition.id}>
        <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{condition.kind === 'document' ? 'Document uploaded' : condition.kind === 'api' ? 'API response available' : `Output field: ${condition.path || 'not selected'}`}</span><span className={`rounded px-2 py-1 text-xs ${result.status === 'met' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>{label}</span></div>
        <p className="text-xs">{blocks.find(block => block.id === condition.sourceId)?.label ?? 'No source selected'} · {result.detail}</p>
        {onChange && <div className="flex flex-wrap gap-2">
          <select aria-label="Condition type" className="rounded border bg-background p-1 text-xs" disabled={disabled} value={condition.kind} onChange={event => update(condition.id, { kind: event.target.value as ReadinessCondition['kind'] })}><option value="document">Document uploaded</option><option value="api">API response available</option><option value="field">Output field</option></select>
          <select aria-label="Condition source" className="rounded border bg-background p-1 text-xs" disabled={disabled} value={condition.sourceId} onChange={event => update(condition.id, { sourceId: event.target.value })}><option value="">Choose source</option>{blocks.map(block => <option key={block.id} value={block.id}>{block.label}</option>)}</select>
          {condition.kind === 'field' && <><input aria-label="Condition field" className="rounded border bg-background p-1 text-xs" placeholder="For example: rows.0.amount" value={condition.path ?? ''} disabled={disabled} onChange={event => update(condition.id, { path: event.target.value })} /><select aria-label="Condition comparison" className="rounded border bg-background p-1 text-xs" disabled={disabled} value={condition.operator ?? 'exists'} onChange={event => update(condition.id, { operator: event.target.value as ReadinessCondition['operator'] })}><option value="exists">Has a value</option><option value="equals">Equals</option><option value="greater">Greater than</option></select>{condition.operator && condition.operator !== 'exists' && <input aria-label="Condition expected value" className="rounded border bg-background p-1 text-xs" disabled={disabled} value={condition.value ?? ''} onChange={event => update(condition.id, { value: event.target.value })} />}</>}
          <button type="button" className="text-xs underline" disabled={disabled} onClick={() => onChange(conditions.filter(item => item.id !== condition.id))}>Remove condition</button>
        </div>}
      </div>;
    })}
    {onChange && <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={disabled} onClick={() => onChange([...conditions, { id: crypto.randomUUID(), kind: 'document', sourceId: blocks.find(block => block.family === 'Source')?.id ?? '' }])}>Add condition</button>}
  </section>;
}
