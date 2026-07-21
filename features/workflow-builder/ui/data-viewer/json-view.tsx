import { cn } from "@/lib/utils";
import { compactJson } from "./data-preview-utils";

function getScrollFrameHeightClass({
  expanded,
  fill,
}: {
  expanded?: boolean;
  fill?: boolean;
}) {
  if (fill) {
    return "min-h-0 flex-1";
  }
  if (expanded) {
    return "max-h-[62vh]";
  }
  return "max-h-72";
}

export function JsonView({
  expanded,
  fill,
  value,
}: {
  expanded?: boolean;
  fill?: boolean;
  value: unknown;
}) {
  return (
    <pre
      className={cn(
        "overflow-auto rounded border bg-muted/20 p-3 text-xs",
        getScrollFrameHeightClass({ expanded, fill })
      )}
    >
      {compactJson(value)}
    </pre>
  );
}
