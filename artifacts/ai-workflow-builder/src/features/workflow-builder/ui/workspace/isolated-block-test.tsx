import { useMemo, useState } from 'react';
import { createBlankWorkflow, createWorkflowBlockFromCatalog, type LocalRunRecord, type WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
import { runLocalWorkflowTools, type LocalToolRunnerResult } from '@/shared/workflow-engine/local-tool-runner';
import { getToolForBlock } from '@/shared/workflow-engine/local-tool-registry';
import { exampleInput, formulaInputNames, recordedBlockInput } from '@/shared/workflow-engine/block-test-inputs';
import { parseNumericInput } from '@/shared/workflow-engine/numeric-input';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { WorkflowTestData } from '@/features/workflows-hub/workflow-test-data';
import { BlockRunPanel } from './block-run-panel';

export function IsolatedBlockTest({ block, nodes, edges, records, workflowId, workflowName, disabled, onResult }: {
  block: WorkflowBlock; nodes: WorkflowNode[]; edges: WorkflowEdge[]; records: LocalRunRecord[];
  workflowId?: string; workflowName: string; disabled?: boolean; onResult: (run: LocalToolRunnerResult) => void;
}) {
  const tool = getToolForBlock(block);
  const ownData = block.family === 'Source' || block.family === 'Trigger' || block.config.canvasNodeType === 'trigger';
  const [inputMode, setInputMode] = useState<'examples' | 'recorded' | 'none'>(ownData ? 'none' : 'examples');
  const [editor, setEditor] = useState<'form' | 'json'>('form');
  const [numbers, setNumbers] = useState(() => formulaInputNames(block).map(name => ({ name, value: '' })));
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [rowPage, setRowPage] = useState(0);
  const currentRowPage = Math.min(rowPage, Math.max(0, Math.ceil(rows.length / 25) - 1));
  const [rowType, setRowType] = useState(block.config.toolId === 'logic.category_rollup_aggregator' || block.config.toolId === 'logic.hierarchy_aggregator' ? 'mappedRows' : 'rows');
  const [json, setJson] = useState('{}');
  const [error, setError] = useState('');
  const [run, setRun] = useState<LocalToolRunnerResult | null>(null);
  const [testedSignature, setTestedSignature] = useState('');
  const uploadDefinition = useMemo(() => {
    const definition = createBlankWorkflow();
    definition.blocks = [createWorkflowBlockFromCatalog('source:excel-workbook', { id: 'block-example-document', label: 'Example document', position: { x: 0, y: 0 }, config: { sourceKind: 'manual_table', toolId: 'source.manual_table', rows: [], requireUpload: true } })];
    definition.edges = [];
    return definition;
  }, []);
  const sources = [...new Set(edges.filter(edge => edge.target === block.id && edge.data?.workflowEdge?.status !== 'disabled').map(edge => edge.source))].flatMap(id => nodes.find(node => node.id === id)?.data.block ?? []);
  const snapshots = sources.map(source => ({ source, input: recordedBlockInput(source, records) }));
  const signature = JSON.stringify({ config: block.config, inputMode, editor, numbers, rows, rowType, json, snapshots: inputMode === 'recorded' ? snapshots.map(s => s.input?.result.runId) : [] });
  const execute = () => {
    setError('');
    try {
      let inputs = inputMode === 'recorded' ? snapshots.flatMap(s => s.input ?? []) : [];
      if (inputMode === 'recorded' && snapshots.some(s => !s.input)) throw new Error(`No usable recorded result for ${snapshots.filter(s => !s.input).map(s => s.source.label).join(', ')}. Test those sources or use example inputs.`);
      if (inputMode === 'examples') {
        let output: Record<string, unknown>;
        if (editor === 'json') {
          const parsed: unknown = JSON.parse(json);
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Enter an input object, such as {"namedValues":{"total":100}}, or use the form.');
          output = parsed as Record<string, unknown>;
        } else {
          const namedValues: Record<string, number> = {};
          for (const number of numbers) {
            if (!number.name.trim() && !number.value.trim()) continue;
            const value = parseNumericInput(number.value);
            if (!number.name.trim() || value === null) throw new Error(`Enter a name and a valid number for ${number.name || 'each value'}. Blank values are not zero.`);
            if (Object.hasOwn(namedValues, number.name.trim())) throw new Error(`Use a unique name: ${number.name}.`);
            Object.defineProperty(namedValues, number.name.trim(), { value, enumerable: true, writable: true });
          }
          const records = rows.map((row, index) => {
            const value = row.amount == null || row.amount === '' ? null : parseNumericInput(row.amount);
            if (row.amount != null && row.amount !== '' && value === null) throw new Error(`Test record ${index + 1}: enter a valid number or leave it blank.`);
            return { ...row, amount: value };
          });
          output = { ...(Object.keys(namedValues).length ? { namedValues } : {}), ...(records.length ? { [rowType]: records } : {}) };
        }
        inputs = Object.keys(output).length ? [exampleInput(output)] : [];
      }
      const result = runLocalWorkflowTools({ nodes, edges, workflowId, workflowName, selectedBlockId: block.id, mode: 'isolated', isolatedInputs: inputs, testInputSource: inputMode });
      setRun(result); setTestedSignature(signature); onResult(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not test this block.');
    }
  };
  return <section aria-label="Individual block test" className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-2 lg:overflow-hidden">
    <div className="min-w-0 space-y-3 border-b p-4 lg:overflow-y-auto lg:border-r">
      <h3 className="font-semibold">Test {block.label} on its own</h3>
      <p className="text-sm text-muted-foreground">Only this block executes. You can reuse its recorded output in another block test.</p>
      <label className="block text-sm">Test inputs <select aria-label="Block test input source" className="ml-2 rounded border bg-background p-1" value={inputMode} onChange={event => setInputMode(event.target.value as typeof inputMode)}>
        <option value="none">Current block settings only</option>{!ownData && <><option value="examples">Example inputs</option><option value="recorded">Recorded upstream outputs</option></>}
      </select></label>
      {block.family === 'Source' && <p className="text-xs text-muted-foreground">This source uses its configured document, saved API response, or rules. Edit those in Properties. API fetching remains available in the source editor.</p>}
      {(block.family === 'Trigger' || block.config.canvasNodeType === 'trigger') && <p className="text-xs text-muted-foreground">This test records the trigger event using its current settings. It does not start the other workflow blocks.</p>}
      {inputMode === 'recorded' && <div className="space-y-1 text-sm"><p>These are saved snapshots; upstream blocks are not refreshed during this test.</p>{snapshots.length ? snapshots.map(({ source, input }) => <p key={source.id}>{source.label}: {input ? `${new Date(input.result.completedAt).toLocaleString()}${input.result.blockTest ? ' · prior block test' : ''}` : 'No usable result, or source settings changed'}</p>) : <p>No upstream connections. This block must use its own settings or example inputs.</p>}</div>}
      {inputMode === 'examples' && <>
        <p className="text-xs text-muted-foreground">Examples are only used for this test. They do not replace workflow documents or saved API data.</p>
        <label className="text-sm">Input editor <select aria-label="Block test input editor" className="ml-2 rounded border bg-background p-1" value={editor} onChange={event => setEditor(event.target.value as typeof editor)}><option value="form">Form</option><option value="json">JSON</option></select></label>
        {editor === 'json' ? <label className="block text-sm">Input object<textarea aria-label="Block test input JSON" className="mt-1 block min-h-36 w-full rounded border bg-background p-2 font-mono text-xs" value={json} onChange={event => setJson(event.target.value)} /><span className="text-xs text-muted-foreground">Use fields such as rows, mappedRows, namedValues, keywordRules, calculatedResults, or backendOutputs for a specific input role.</span></label> : <>
          <div className="space-y-2"><h4 className="text-sm font-medium">Numbers for calculations</h4>{numbers.map((number, index) => <div className="flex gap-2" key={index}><input aria-label={`Test value ${index + 1} name`} placeholder="Value name, e.g. item_total" className="min-w-0 flex-1 rounded border bg-background p-2 text-sm" value={number.name} onChange={event => setNumbers(numbers.map((n, i) => i === index ? { ...n, name: event.target.value } : n))} /><input aria-label={`Test value ${index + 1} number`} placeholder="Number" className="w-28 rounded border bg-background p-2 text-sm" value={number.value} onChange={event => setNumbers(numbers.map((n, i) => i === index ? { ...n, value: event.target.value } : n))} /><button type="button" aria-label={`Remove test value ${index + 1}`} onClick={() => setNumbers(numbers.filter((_, i) => i !== index))}>Remove</button></div>)}<button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => setNumbers([...numbers, { name: '', value: '' }])}>Add test value</button></div>
          <div className="space-y-2"><h4 className="text-sm font-medium">Example records</h4><label className="text-xs">Supply records as <select aria-label="Test record type" value={rowType} onChange={event => setRowType(event.target.value)}><option value="rows">Document records</option><option value="mappedRows">Categorized records</option></select></label>
            {rows.slice(currentRowPage * 25, currentRowPage * 25 + 25).map((row, offset) => { const index = currentRowPage * 25 + offset; return <div key={index} className="flex flex-wrap gap-2"><input aria-label={`Test row ${index + 1} text`} placeholder="Text" value={String(row.label ?? '')} className="min-w-0 flex-1 rounded border bg-background p-1 text-sm" onChange={event => setRows(rows.map((r, i) => i === index ? { ...r, label: event.target.value } : r))} /><input aria-label={`Test row ${index + 1} number`} placeholder="Number (optional)" value={String(row.amount ?? '')} className="w-28 rounded border bg-background p-1 text-sm" onChange={event => setRows(rows.map((r, i) => i === index ? { ...r, amount: event.target.value } : r))} />{rowType === 'mappedRows' && <input aria-label={`Test row ${index + 1} category`} placeholder="Category ID" value={String(row.categoryId ?? '')} className="w-28 rounded border bg-background p-1 text-sm" onChange={event => setRows(rows.map((r, i) => i === index ? { ...r, categoryId: event.target.value } : r))} />}<button type="button" aria-label={`Remove test row ${index + 1}`} onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</button></div>; })}
            <button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => { setRows([...rows, { rowId: `example-${crypto.randomUUID()}`, label: '', amount: null }]); setRowPage(Math.floor(rows.length / 25)); }}>Add test record</button>
            {rows.length > 25 && <div className="flex gap-3 text-xs"><button disabled={currentRowPage === 0} onClick={() => setRowPage(currentRowPage - 1)}>Previous test records</button><span>{rows.length} records / page {currentRowPage + 1}</span><button disabled={(currentRowPage + 1) * 25 >= rows.length} onClick={() => setRowPage(currentRowPage + 1)}>Next test records</button></div>}
            <WorkflowTestData definition={uploadDefinition} onChange={definition => { const source = definition.blocks.find(b => Array.isArray(b.config.rows) && b.config.rows.length > 0); setRows((source?.config.rows ?? []) as Record<string, unknown>[]); setRowPage(0); }} />
          </div>
        </>}
      </>}
      {tool?.inputRoles.length ? <details className="text-xs"><summary>Expected inputs</summary>{tool.inputRoles.map(role => <p key={role.id}>{role.label} · {role.required ? 'Required unless configured in this block' : 'Optional'}</p>)}</details> : null}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {run && testedSignature !== signature && <p role="status" className="text-sm text-amber-700">Inputs or settings changed. Run again to update the displayed result.</p>}
    </div>
    <BlockRunPanel block={block} disabled={disabled} lastRun={run?.result.results[0]} onRun={execute} toolId={tool?.toolId ?? ''} isolated />
  </section>;
}
