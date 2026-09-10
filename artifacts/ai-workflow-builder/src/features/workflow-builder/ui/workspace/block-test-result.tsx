import type { WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
import type { ToolRunResult } from '@/shared/workflow-engine/local-tool-registry';
import { presentToolOutput } from '@/shared/workflow-engine/present-tool-output';
import { ReadableData } from './readable-data';

export function BlockTestResult({ block, result }: { block?: WorkflowBlock; result: ToolRunResult }) {
  return <details open className="mt-2 rounded border p-3">
    <summary className="cursor-pointer text-sm">Test result: {block?.label} — {result.status.replaceAll('_', ' ')}</summary>
    {[...result.errors, ...result.warnings].map((message, index) => <p className="mt-2 text-xs text-amber-700" key={index}>{message}</p>)}
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      <section className="min-w-0"><h4 className="mb-2 font-medium">Input</h4><div className="max-h-52 overflow-auto"><ReadableData value={result.input ?? {}} /></div></section>
      <section className="min-w-0"><h4 className="mb-2 font-medium">Output</h4><div className="max-h-52 overflow-auto"><ReadableData value={presentToolOutput(result, block)} /></div></section>
    </div>
  </details>;
}
