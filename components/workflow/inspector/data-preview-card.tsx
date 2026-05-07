"use client";

import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  compactJson,
  getDefaultView,
  getItemCount,
  getPreviewText,
} from "@/components/workflow/data-viewer/data-preview-utils";
import { DATA_VIEW_LABELS as DATA_VIEW_LABELS_INTERNAL } from "@/components/workflow/data-viewer/data-view-tabs";
import { DataDisplayViewer as DataDisplayViewerInternal } from "@/components/workflow/data-viewer/data-viewer";
import type {
  DataConsumer,
  DataDisplayView as LocalDataDisplayView,
  DataStatus as LocalDataStatus,
} from "@/components/workflow/data-viewer/types";
import { cn } from "@/lib/utils";

export type DataPreviewCardProps = {
  acceptedTypes?: string[];
  bindingLabel?: string;
  className?: string;
  connectedBlockLabel?: string;
  consumers?: DataConsumer[];
  contextData?: Record<string, unknown>;
  description?: string;
  direction: "input" | "output";
  fallbackPreview?: unknown;
  onCreateSource?: () => void;
  outputType?: string;
  roleId: string;
  roleLabel: string;
  sourceOutputRole?: string;
  status?: LocalDataStatus;
  statusLabel?: string;
  value?: unknown;
};

function getStatusClasses(status: LocalDataStatus) {
  if (status === "ready") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  if (status === "error" || status === "missing") {
    return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
  }
  return "text-muted-foreground";
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component coordinates compact metadata, missing state, consumers, and four local data views.
export function DataPreviewCard({
  acceptedTypes = [],
  bindingLabel,
  className,
  connectedBlockLabel,
  consumers = [],
  contextData,
  description,
  direction,
  fallbackPreview,
  onCreateSource,
  outputType,
  roleId,
  roleLabel,
  sourceOutputRole,
  status = "ready",
  statusLabel,
  value,
}: DataPreviewCardProps) {
  const dataValue = value ?? fallbackPreview;
  const [view, setView] = useState<LocalDataDisplayView>(
    getDefaultView(outputType)
  );
  const count = useMemo(
    () => getItemCount(dataValue, contextData),
    [contextData, dataValue]
  );
  const preview = useMemo(
    () => getPreviewText({ contextData, outputType, value: dataValue }),
    [contextData, dataValue, outputType]
  );
  const connectedLabel =
    connectedBlockLabel &&
    `${connectedBlockLabel}${sourceOutputRole ? `.${sourceOutputRole}` : ""}`;
  const consumerLabel =
    consumers.length > 0
      ? consumers
          .map(
            (consumer) =>
              `${consumer.blockLabel}.${consumer.targetInputRole || "input"}`
          )
          .join(", ")
      : "";

  const copyJson = async () => {
    await navigator.clipboard.writeText(compactJson(dataValue));
    toast.success("Copied data JSON");
  };

  return (
    <div className={cn("rounded-md border bg-background/70 p-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-sm">{roleLabel}</div>
          <div className="text-[11px] text-muted-foreground">
            Role: {roleId}
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 font-medium text-[10px] uppercase",
            getStatusClasses(status)
          )}
        >
          {statusLabel || status}
        </span>
      </div>
      {description && (
        <div className="mt-1 text-muted-foreground text-xs">{description}</div>
      )}
      <div className="mt-2 space-y-1.5 text-xs">
        {connectedLabel && (
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">
              {direction === "input" ? "From" : "Block"}
            </span>
            <span className="break-words font-medium">{connectedLabel}</span>
          </div>
        )}
        {bindingLabel && (
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">Binding</span>
            <span className="break-words font-medium">{bindingLabel}</span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="w-16 shrink-0 text-muted-foreground">Type</span>
          <span className="break-words font-medium">
            {outputType || "local_data"}
            {count !== undefined && (
              <span className="font-normal text-muted-foreground">
                {" "}
                | Items: {count}
              </span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-16 shrink-0 text-muted-foreground">Preview</span>
          <span className="break-words font-medium">{preview}</span>
        </div>
        {consumerLabel && (
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">
              Consumers
            </span>
            <span className="break-words font-medium">{consumerLabel}</span>
          </div>
        )}
      </div>

      {status === "missing" && (
        <div className="mt-2 max-h-40 overflow-y-auto space-y-2 rounded border border-amber-500/30 bg-amber-500/10 p-2 text-amber-800 text-xs dark:text-amber-200">
          <div>Missing required input.</div>
          {acceptedTypes.length > 0 && (
            <div>Suggested: {acceptedTypes.join(", ")}</div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.info(
                  "Connect an existing block, then assign this input role on the edge."
                )
              }
              size="sm"
              type="button"
              variant="outline"
            >
              Connect existing block
            </Button>
            {onCreateSource && (
              <Button
                onClick={onCreateSource}
                size="sm"
                type="button"
                variant="secondary"
              >
                Create Source
              </Button>
            )}
          </div>
        </div>
      )}

      {direction === "output" && consumers.length === 0 && (
        <div className="mt-2 text-muted-foreground text-xs">
          No downstream consumer yet.
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1 border-t pt-2">
        {(["table", "json", "schema", "trace"] as LocalDataDisplayView[]).map(
          (item) => (
            <Button
              className="h-7 px-2 text-xs"
              key={item}
              onClick={() => setView(item)}
              size="sm"
              type="button"
              variant={view === item ? "secondary" : "ghost"}
            >
              {DATA_VIEW_LABELS_INTERNAL[item]}
            </Button>
          )
        )}
        <Button
          className="ml-auto h-7 px-2 text-xs"
          onClick={copyJson}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Copy className="size-3" />
          Copy
        </Button>
      </div>

      <div className="mt-2">
        <DataDisplayViewerInternal
          contextData={contextData}
          outputType={outputType}
          value={dataValue}
          view={view}
        />
      </div>
    </div>
  );
}
