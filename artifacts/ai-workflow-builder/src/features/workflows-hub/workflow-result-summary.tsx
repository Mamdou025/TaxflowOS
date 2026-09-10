import type { WorkflowDefinition } from '@/shared/workflow-engine/local-fiscal-workflow';
import type { ToolRunResult } from '@/shared/workflow-engine/local-tool-registry';
import { useState } from 'react';

export function WorkflowResultSummary({ definition, results }: { definition?: WorkflowDefinition; results: ToolRunResult[] }) {
  const [digits, setDigits] = useState('full');
  const [hidden, setHidden] = useState<string[]>([]);
  const calculationIds = new Set(results.filter(result => result.toolId === 'logic.calculation_engine').map(result => result.blockId));
  const hasDownstreamCalculation = (id: string, visited = new Set<string>()): boolean => {
    if (visited.has(id)) return false; visited.add(id);
    return (definition?.edges ?? []).filter(edge => edge.sourceBlockId === id && edge.status !== 'disabled').some(edge => calculationIds.has(edge.targetBlockId) || hasDownstreamCalculation(edge.targetBlockId, visited));
  };
  const final = results.filter(result => calculationIds.has(result.blockId) && !hasDownstreamCalculation(result.blockId));
  const issues = [...new Set(results.flatMap(result => [...result.errors, ...result.warnings]))];
  const hasErrors = results.some(result => result.errors.length || result.status === 'error');
  const rows = final.flatMap(result => Object.entries((result.output.calculatedResults ?? {}) as Record<string, number>).map(([key, value]) => {
    const detail = ((result.output.resultDetails ?? {}) as Record<string, { label?: string; unit?: string }>)[key];
    return { key: `${result.blockId}:${key}`, label: detail?.label || key.replaceAll('_', ' '), value, unit: detail?.unit || '', block: definition?.blocks.find(block => block.id === result.blockId)?.label || 'Calculation' };
  }));
  return <section aria-label="Final workflow results" className="space-y-3 rounded-xl border bg-background p-4">
    <h3 className="text-lg font-semibold">{hasErrors ? 'Results need attention' : 'Final results'}</h3>
    {hasErrors && <p role="alert">The workflow has errors. Any values shown below are incomplete; resolve the errors and run again.</p>}
    {!rows.length ? <p>No final numeric results were produced. Review the block details below.</p> : <>
      <label className="text-xs">Display precision <select aria-label="Result display precision" value={digits} onChange={event => setDigits(event.target.value)}><option value="full">Full precision</option>{[0, 2, 4, 6].map(value => <option key={value} value={value}>{value} decimal places</option>)}</select></label>
      <p className="text-xs text-muted-foreground">Display formatting does not change values sent to other blocks or exported in JSON.</p>
      <details><summary>Choose displayed results</summary>{rows.map(row => <label className="block text-sm" key={row.key}><input type="checkbox" checked={!hidden.includes(row.key)} onChange={event => setHidden(event.target.checked ? hidden.filter(key => key !== row.key) : [...hidden, row.key])} /> {row.label}</label>)}</details>
      <table className="w-full text-sm"><thead><tr><th className="text-left">Result</th><th className="text-right">Value</th><th className="text-left pl-3">Unit</th></tr></thead><tbody>{rows.filter(row => !hidden.includes(row.key)).map(row => <tr key={row.key} className="border-t"><td className="py-2">{row.label}<span className="block text-xs text-muted-foreground">{row.block}</span></td><td className="text-right font-semibold tabular-nums">{row.value.toLocaleString(undefined, digits === 'full' ? { maximumSignificantDigits: 21 } : { minimumFractionDigits: Number(digits), maximumFractionDigits: Number(digits) })}</td><td className="pl-3">{row.unit || '—'}</td></tr>)}</tbody></table>
    </>}
    {issues.length > 0 && <details className="rounded border border-amber-500 p-2" open={hasErrors}><summary>{issues.length} review {issues.length === 1 ? 'message' : 'messages'}</summary><ul className="list-disc pl-5 text-sm">{issues.map(issue => <li key={issue}>{issue}</li>)}</ul></details>}
  </section>;
}
