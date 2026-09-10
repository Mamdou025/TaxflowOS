import { useState } from 'react';
import { calculationValueKey, numericOutputFields } from '@/shared/workflow-engine/calculation-values';
import type { WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';

export function calculationSources(block: WorkflowBlock, edges: WorkflowEdge[], nodes: WorkflowNode[]) {
  const ids = new Set(edges.filter(edge => edge.target === block.id && edge.data?.workflowEdge?.status !== 'disabled').map(edge => edge.source));
  return nodes.filter(node => ids.has(node.id)).map(node => node.data.block).filter((source): source is WorkflowBlock => !!source && !/rules$/.test(String(source.config.sourceKind)));
}

export function CalculationSourcePicker({ sources, outputs, disabled, onInsert }: {
  sources: WorkflowBlock[]; outputs: Record<string, unknown>; disabled: boolean; onInsert: (key: string) => void;
}) {
  const [sourceId, setSourceId] = useState('');
  const [path, setPath] = useState('');
  const source = sources.find(source => source.id === sourceId);
  const fields = source ? numericOutputFields(outputs[source.id]) : [];
  return <div className="space-y-2 rounded border p-2">
    <div className="text-xs font-medium">Value from another block</div>
    <p className="text-[11px] text-muted-foreground">Choose a connected source, API, or calculation. Its current value is read each time you run.</p>
    <select aria-label="Value source block" className="w-full rounded border bg-background p-1 text-xs" disabled={disabled} value={sourceId} onChange={event => { setSourceId(event.target.value); setPath(''); }}>
      <option value="">Choose a block</option>
      {sources.map(source => <option key={source.id} value={source.id}>{source.label}</option>)}
    </select>
    {source && <>
      <div className="flex flex-wrap gap-1">
        {fields.map(field => <button type="button" key={JSON.stringify(field.path)} disabled={disabled} className="rounded border px-2 py-1 text-xs hover:bg-muted" onClick={() => onInsert(calculationValueKey(source.id, field.path))}>{field.path.join(' › ') || 'Value'}</button>)}
      </div>
      {fields.length === 0 && <p className="text-[11px] text-muted-foreground">Run this source to see its numeric fields, or enter an expected field below to build your formula now.</p>}
      <label className="block text-[11px]">Expected output field
        <input aria-label="Expected output field" className="mt-1 w-full rounded border bg-background p-1 text-xs" disabled={disabled} placeholder="For example: rawRows.0.rate" value={path} onChange={event => setPath(event.target.value)} />
      </label>
      <button type="button" className="rounded border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40" disabled={disabled || !path.trim() || path.trim().split('.').some(part => !part)} onClick={() => onInsert(calculationValueKey(source.id, path.trim().split('.')))}>Add field to formula</button>
    </>}
    {sources.length === 0 && <p className="text-[11px] text-muted-foreground">Connect a block to this Compute block to use its output.</p>}
  </div>;
}
