import { Button } from "@/components/ui/button";
import type { DataDisplayView } from "./types";

export const DATA_VIEW_LABELS: Record<DataDisplayView, string> = {
  json: "JSON",
  schema: "Schema",
  table: "Table",
  trace: "Trace",
};

export const DATA_VIEW_ORDER: DataDisplayView[] = [
  "table",
  "json",
  "schema",
  "trace",
];

export function DataViewTabs({
  className,
  onViewChange,
  view,
  views = DATA_VIEW_ORDER,
}: {
  className?: string;
  onViewChange: (view: DataDisplayView) => void;
  view: DataDisplayView;
  views?: DataDisplayView[];
}) {
  return (
    <div className={className}>
      {views.map((item) => (
        <Button
          className="h-7 px-2 text-xs"
          key={item}
          onClick={() => onViewChange(item)}
          size="sm"
          type="button"
          variant={view === item ? "secondary" : "ghost"}
        >
          {DATA_VIEW_LABELS[item]}
        </Button>
      ))}
    </div>
  );
}
