import { cn } from "@/lib/utils";
import { JsonView } from "./json-view";
import { SchemaView } from "./schema-view";
import { TableView } from "./table-view";
import { TraceView } from "./trace-view";
import type { DataDisplayView } from "./types";

export function DataDisplayViewer({
  className,
  contextData,
  expanded,
  fill,
  outputType,
  value,
  view,
}: {
  className?: string;
  contextData?: Record<string, unknown>;
  expanded?: boolean;
  fill?: boolean;
  outputType?: string;
  value: unknown;
  view: DataDisplayView;
}) {
  return (
    <div className={cn("min-h-0", fill && "flex h-full flex-col", className)}>
      {view === "table" && (
        <TableView
          contextData={contextData}
          expanded={expanded}
          fill={fill}
          outputType={outputType}
          value={value}
        />
      )}
      {view === "json" && (
        <JsonView expanded={expanded} fill={fill} value={value} />
      )}
      {view === "schema" && (
        <SchemaView fill={fill} outputType={outputType} value={value} />
      )}
      {view === "trace" && (
        <TraceView contextData={contextData} fill={fill} value={value} />
      )}
    </div>
  );
}
