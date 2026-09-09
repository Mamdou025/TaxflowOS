

// Run ONE block and see what it actually produced.
//
// The Runs tab used to show the workflow's global run history — useful, but not an
// answer to "what does this block do?". You could open a block, read its config,
// and still have no way to see its output without running the whole workflow and
// inferring backwards.
//
// `mode: "selected"` in the local runner already did the right thing: it executes
// the block PLUS its ancestors, because a block with no upstream inputs produces
// nothing meaningful. So a single-block run here is a real run of a real slice —
// the same executor, the same evidence, the same warnings as the full workflow.
// This panel just surfaces its result.
//
// It shows outputs, logs, warnings and errors verbatim. A block that refuses to
// compute ("needs mapped_rows input") says exactly that, which is the honest and
// useful answer — not an empty panel.

import { AlertTriangle, CheckCircle2, Loader2, Play, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { ToolRunResult } from "@/shared/workflow-engine/local-tool-registry";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";

type BlockRunPanelProps = {
  block: WorkflowBlock;
  disabled?: boolean;
  lastRun?: ToolRunResult | null;
  onRun: () => void;
  running?: boolean;
  toolId: string;
};

const STATUS_STYLES: Record<string, { className: string; icon: React.ReactNode }> = {
  error: {
    className: "border-red-500/40 bg-red-500/10",
    icon: <XCircle className="size-4 text-red-500" />,
  },
  needs_review: {
    className: "border-amber-500/40 bg-amber-500/10",
    icon: <AlertTriangle className="size-4 text-amber-500" />,
  },
  success: {
    className: "border-emerald-500/40 bg-emerald-500/10",
    icon: <CheckCircle2 className="size-4 text-emerald-500" />,
  },
  warning: {
    className: "border-amber-500/40 bg-amber-500/10",
    icon: <AlertTriangle className="size-4 text-amber-500" />,
  },
};

function summarize(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    return `{ ${keys.slice(0, 4).join(", ")}${keys.length > 4 ? ", …" : ""} }`;
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 77)}…` : text;
}

export function BlockRunPanel({
  block,
  disabled,
  lastRun,
  onRun,
  running,
  toolId,
}: BlockRunPanelProps) {
  const status = lastRun?.status ?? null;
  const style = status ? STATUS_STYLES[status] : null;
  const outputs = Object.entries(
    (lastRun?.output ?? {}) as Record<string, unknown>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm">
            Run this block
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
            Executes <span className="font-mono">{toolId}</span> together with the
            blocks feeding it, so the result is what this block really produces —
            not a preview.
          </p>
        </div>
        <Button
          className="shrink-0"
          disabled={disabled || running}
          onClick={onRun}
          size="sm"
        >
          {running ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
          {running ? "Running…" : "Run block"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {lastRun ? (
          <div className="space-y-4">
            <div className={`rounded-md border p-3 ${style?.className ?? "bg-muted/30"}`}>
              <div className="flex items-center gap-2">
                {style?.icon}
                <span className="font-medium text-foreground text-sm capitalize">
                  {String(status).replaceAll("_", " ")}
                </span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {lastRun.evidenceRefs.length} evidence ·{" "}
                  {lastRun.sourceTrace.length} traced
                </span>
              </div>
              {lastRun.errors.length > 0 && (
                <ul className="mt-2 space-y-1 text-foreground text-xs">
                  {lastRun.errors.map((error) => (
                    <li key={error}>• {error}</li>
                  ))}
                </ul>
              )}
              {lastRun.warnings.length > 0 && (
                <ul className="mt-2 space-y-1 text-foreground text-xs">
                  {lastRun.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              )}
            </div>

            {outputs.length > 0 && (
              <div>
                <h4 className="mb-2 font-medium text-foreground text-xs">
                  Outputs
                </h4>
                <div className="overflow-hidden rounded-md border">
                  <table className="w-full text-xs">
                    <tbody>
                      {outputs.map(([key, value]) => (
                        <tr className="border-b last:border-b-0" key={key}>
                          <td className="w-1/3 bg-muted/30 p-2 align-top font-mono text-[11px] text-muted-foreground">
                            {key}
                          </td>
                          <td className="p-2 align-top text-foreground">
                            {summarize(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {lastRun.logs.length > 0 && (
              <div>
                <h4 className="mb-2 font-medium text-foreground text-xs">Log</h4>
                <div className="space-y-1">
                  {lastRun.logs.map((log) => (
                    <div
                      className="rounded bg-muted/40 p-2 text-[11px] text-muted-foreground"
                      key={log.id}
                    >
                      <span className="font-medium uppercase">{log.level}</span> ·{" "}
                      {log.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details>
              <summary className="cursor-pointer text-[11px] text-muted-foreground">
                Raw result
              </summary>
              <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
                {JSON.stringify(lastRun.output, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-xs leading-relaxed">
              This block hasn't been run yet. Press <b>Run block</b> to execute{" "}
              <b>{block.label}</b> and see its real output — the same executor the
              full workflow uses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
