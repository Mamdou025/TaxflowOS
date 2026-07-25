import { collectTraceLines } from "./data-preview-utils";
import { EmptyState } from "./table-view";

export function TraceView({
  contextData,
  fill,
  value,
}: {
  contextData?: Record<string, unknown>;
  fill?: boolean;
  value: unknown;
}) {
  const lines = collectTraceLines(value, contextData);

  if (lines.length === 0) {
    return (
      <EmptyState>No lineage trace is available for this value yet.</EmptyState>
    );
  }

  return (
    <ol
      className={`space-y-1 border-muted border-l pl-3 text-xs ${
        fill ? "min-h-0 flex-1 overflow-auto" : ""
      }`}
    >
      {lines.map((line, index) => (
        <li className="flex gap-2 py-1" key={line}>
          <span className="text-muted-foreground">{index + 1}</span>
          <span className="break-words">{line}</span>
        </li>
      ))}
    </ol>
  );
}
