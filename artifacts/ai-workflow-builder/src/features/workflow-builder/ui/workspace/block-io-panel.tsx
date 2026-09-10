import type { LocalRunRecord, WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { getToolForBlock, type ToolRunResult } from '@/shared/workflow-engine/local-tool-registry';
import { ReadableData, hasValue } from './readable-data';

export function resultForBlock(run: LocalRunRecord | undefined, id: string): ToolRunResult | undefined {
  const value = run?.logs.find(log => log.nodeId === id)?.output;
  return value && typeof value === 'object' && 'output' in value ? value as ToolRunResult : undefined;
}

function PublicOutput({ block, output }: { block: WorkflowBlock; output: Record<string, unknown> }) {
  const roles = getToolForBlock(block)?.outputRoles ?? [];
  const keys = new Set(roles.map(role => role.outputKey ?? role.id));
  const values = Object.fromEntries(Object.entries(output).filter(([key, value]) => key !== 'backendOutputs' && (keys.size === 0 || keys.has(key)) && hasValue(value)));
  return <ReadableData value={values} />;
}

export function BlockIOPanel({ block, edges, nodes, run, testResult }: {
  block: WorkflowBlock; edges: WorkflowEdge[]; nodes: WorkflowNode[]; run?: LocalRunRecord; testResult?: ToolRunResult | null;
}) {
  const result = resultForBlock(run, block.id);
  const incoming = edges.filter(edge => edge.target === block.id);
  const outgoing = edges.filter(edge => edge.source === block.id);
  const tool = getToolForBlock(block);
  return <div className="min-h-0 flex-1 overflow-auto p-4" data-testid="block-io-panel">
    <div className="mb-4 rounded border bg-muted/20 p-3">
      <h3 className="font-semibold">{block.label} · Input & Output</h3>
      <p className="text-xs text-muted-foreground">{result && run ? `Recorded run · ${new Date(run.execution.startedAt).toLocaleString()} · ${result.status.replaceAll('_', ' ')}` : 'Expected connections and fields · this block has not run in the selected run.'}</p>
      {result && <p className="text-xs text-muted-foreground">These are recorded values. Changes to rules or documents require a new test.</p>}
      {result?.blockTest && <p className="text-sm">Individual block test · {result.blockTest.inputs === 'examples' ? 'Example inputs' : result.blockTest.inputs === 'recorded' ? 'Recorded inputs' : 'Block settings only'}. This is not a full workflow run.</p>}
      {result?.configSignature && result.configSignature !== JSON.stringify(block.config) && <p className="text-sm text-amber-700">This block has changed since the displayed run.</p>}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="min-w-0 space-y-3 rounded border p-3" aria-label="Received inputs">
        <h4 className="font-semibold">Received</h4>
        {result?.inputTransfers?.map(transfer => <details open key={transfer.edgeId} className="rounded border p-2">
          <summary className="text-sm font-medium">From {transfer.sourceLabel}{!transfer.delivered ? ' · block skipped' : ''}</summary>
          <div className="mt-2"><ReadableData value={transfer.output} /></div>
        </details>)}
        {!result?.inputTransfers && result?.input && <ReadableData value={result.input} />}
        {!result && incoming.map(edge => <div className="rounded border p-2 text-sm" key={edge.id}>
          <span className="font-medium">From {nodes.find(node => node.id === edge.source)?.data.block?.label ?? edge.source}</span>
          <p className="text-xs text-muted-foreground">{edge.data?.workflowEdge?.status === 'disabled' ? 'Connection disabled' : 'Waiting for a run'}</p>
        </div>)}
        {incoming.length === 0 && <p className="text-sm text-muted-foreground">{block.family === 'Source' ? 'This source supplies its own document, API response, or configured data.' : 'No incoming connections.'}</p>}
        {!result && <div className="space-y-1 text-xs text-muted-foreground">{tool?.inputRoles.map(role => <p key={role.id}>{role.label} · {role.required ? 'Required' : 'Optional'}</p>)}</div>}
      </section>
      <section className="min-w-0 space-y-3 rounded border p-3" aria-label="Produced outputs">
        <h4 className="font-semibold">Produced</h4>
        {result ? <><PublicOutput block={block} output={result.output} />{[...result.errors, ...result.warnings].map((message, index) => <p role="status" className="text-sm text-amber-700" key={index}>{message}</p>)}</> : <>
          <p className="text-sm text-muted-foreground">Expected outputs — values appear after testing.</p>
          {tool?.outputRoles.map(role => <div className="rounded border p-2" key={role.id}><p className="text-sm font-medium">{role.label}</p><p className="text-xs text-muted-foreground">{role.description}</p></div>)}
        </>}
        <div className="border-t pt-2 text-xs"><span className="font-medium">Sent to: </span>{outgoing.filter(edge => edge.data?.workflowEdge?.status !== 'disabled').map(edge => nodes.find(node => node.id === edge.target)?.data.block?.label ?? edge.target).join(', ') || 'No connected destination'}</div>
      </section>
    </div>
    {testResult && testResult.blockId !== block.id && <section className="mt-4 rounded border p-3"><h4 className="font-semibold">Rulebook test through {nodes.find(node => node.id === testResult.blockId)?.data.block?.label ?? 'connected block'}</h4><p className="text-xs">{testResult.status}</p><ReadableData value={testResult.output} /></section>}
  </div>;
}

export function ConnectionTransferPanel({ edge, source, target, run }: { edge: WorkflowEdge; source?: WorkflowBlock; target?: WorkflowBlock; run?: LocalRunRecord }) {
  const targetResult = target ? resultForBlock(run, target.id) : undefined;
  const transfer = targetResult?.inputTransfers?.find(transfer => transfer.edgeId === edge.id);
  const disabled = edge.data?.workflowEdge?.status === 'disabled';
  const changed = transfer && (transfer.sourceBlockId !== edge.source || transfer.sourceOutputRole !== edge.data?.workflowEdge?.sourceOutputRole || transfer.targetInputRole !== edge.data?.workflowEdge?.targetInputRole);
  const outputRole = source ? getToolForBlock(source)?.outputRoles.find(role => role.id === edge.data?.workflowEdge?.sourceOutputRole) : undefined;
  const inputRole = target ? getToolForBlock(target)?.inputRoles.find(role => role.id === edge.data?.workflowEdge?.targetInputRole) : undefined;
  return <section className="space-y-4" data-testid="connection-transfer-panel">
    <div className="rounded border bg-muted/20 p-3"><h3 className="font-semibold">{source?.label ?? edge.source} → {target?.label ?? edge.target}</h3>
      <p className="text-sm">{outputRole?.label ?? 'Block output'} → {inputRole?.label ?? 'Block input'}</p>
      <p className="text-xs text-muted-foreground">{disabled ? 'Connection currently disabled.' : 'Connection enabled.'}</p>
    </div>
    {transfer && run ? <>
      {changed && <p className="text-sm text-amber-700">Connection settings have changed since this run. This snapshot came from {transfer.sourceLabel}.</p>}
      <p className="text-sm">{transfer.delivered ? 'Input available to the receiving block' : 'Source output recorded; receiving block was skipped'} · {new Date(run.execution.startedAt).toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">This run passed the source output as a whole. The receiving block selects the fields it uses. The connection’s role labels do not filter this snapshot.</p>
      <ReadableData value={transfer.output} />
    </> : <><p className="text-sm text-muted-foreground">No transfer recorded for this connection in the selected run. Test the receiving block to inspect the supplied values.</p>{outputRole && <p className="text-sm">Expected: {outputRole.description}</p>}</>}
  </section>;
}
