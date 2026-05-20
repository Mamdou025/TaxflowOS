"use client";

import { Check, Eye, EyeOff, FileText, Layers, X } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import type { WorkflowBlock } from "@/lib/local-fiscal-workflow";
import {
  currentWorkflowNameAtom,
  nodesAtom,
  updateNodeDataAtom,
} from "@/lib/workflow-store";

// ── helpers ───────────────────────────────────────────────────────────────────

type BlockItem = {
  blockId: string;
  label: string;
  description?: string;
  block: WorkflowBlock;
  included: boolean;
};

function useFieldBlocks(): BlockItem[] {
  const nodes = useAtomValue(nodesAtom);
  return nodes
    .filter((n) => n.data.block?.family === "Field")
    .map((n) => ({
      blockId: n.id,
      label: n.data.label,
      description: n.data.description,
      block: n.data.block as WorkflowBlock,
      included: n.data.block?.runtime.visible !== false,
    }));
}

// ── BlockRow ─────────────────────────────────────────────────────────────────

function BlockRow({
  item,
  onToggle,
}: {
  item: BlockItem;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
      {/* checkbox toggle */}
      <button
        className={
          "flex size-4 shrink-0 items-center justify-center rounded border transition-colors " +
          (item.included
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background")
        }
        onClick={onToggle}
        title={item.included ? "Exclude from worksheet" : "Include in worksheet"}
        type="button"
      >
        {item.included && <Check className="size-2.5" />}
      </button>

      {/* label + description */}
      <div className="min-w-0 flex-1">
        <div
          className={
            "truncate text-sm font-medium " +
            (item.included ? "text-foreground" : "text-muted-foreground line-through")
          }
        >
          {item.label}
        </div>
        {item.description && (
          <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {item.description}
          </div>
        )}
      </div>

      {/* eye indicator */}
      {item.included ? (
        <Eye className="size-3.5 shrink-0 text-primary/60" />
      ) : (
        <EyeOff className="size-3.5 shrink-0 text-muted-foreground/40" />
      )}
    </div>
  );
}

// ── WorksheetPageMenu ─────────────────────────────────────────────────────────

export function WorksheetPageMenu({
  onClose,
  onOpenPage,
}: {
  onClose: () => void;
  onOpenPage: () => void;
}) {
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const fieldBlocks = useFieldBlocks();

  const includedCount = fieldBlocks.filter((b) => b.included).length;

  function toggle(item: BlockItem) {
    const visible = !item.included;
    updateNodeData({
      id: item.blockId,
      data: {
        block: { ...item.block, runtime: { ...item.block.runtime, visible } },
      },
    });
  }

  function setAll(included: boolean) {
    for (const item of fieldBlocks) {
      if (item.included !== included) toggle(item);
    }
  }

  return (
    <div className="pointer-events-auto w-72 overflow-hidden rounded-lg border bg-background shadow-lg">
      {/* header */}
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <Layers className="size-3" />
            Worksheet Pages
          </div>
          <div className="mt-0.5 truncate font-semibold text-sm">
            {workflowName || "Untitled Workflow"}
          </div>
        </div>
        <button
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* summary bar */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-1.5 text-[10px] text-muted-foreground">
        <span>
          {includedCount} of {fieldBlocks.length} blocks included
        </span>
        {fieldBlocks.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              className="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setAll(true)}
              type="button"
            >
              All
            </button>
            <span className="opacity-40">·</span>
            <button
              className="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setAll(false)}
              type="button"
            >
              None
            </button>
          </div>
        )}
      </div>

      {/* block list */}
      <div className="max-h-72 overflow-y-auto divide-y">
        {fieldBlocks.length === 0 ? (
          <div className="px-4 py-10 text-center text-xs text-muted-foreground">
            <Layers className="mx-auto mb-2 size-6 opacity-30" />
            <p>No display blocks yet.</p>
            <p className="mt-0.5 opacity-70">Add a Field block to the canvas.</p>
          </div>
        ) : (
          fieldBlocks.map((item) => (
            <BlockRow item={item} key={item.blockId} onToggle={() => toggle(item)} />
          ))
        )}
      </div>

      {/* footer: open page button */}
      <div className="border-t px-3 py-2.5">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={includedCount === 0}
          onClick={() => { onClose(); onOpenPage(); }}
          type="button"
        >
          <FileText className="size-3.5" />
          View Worksheet Page
        </button>
        {includedCount === 0 && (
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
            Select at least one block to open the page.
          </p>
        )}
      </div>
    </div>
  );
}
