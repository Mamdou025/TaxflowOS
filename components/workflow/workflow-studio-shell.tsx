"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  AlertTriangle,
  Bot,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  ListTree,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfigurationOverlay } from "@/components/overlays/configuration-overlay";
import { useOverlay } from "@/components/overlays/overlay-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPreviewCard } from "@/components/workflow/inspector/data-preview-card";
import {
  type BlockRun,
  createWorkflowBlockFromCatalog,
  createWorkflowDefinitionFromCanvas,
  createWorkflowNodeFromBlock,
  isCandidateOutputRelationshipType,
  isGovernedOutputRelationshipType,
  isOutputMappingRelationshipType,
  LOGIC_OUTPUT_GOVERNANCE_WARNING,
  loadLocalRunRecords,
  loadLocalWorkflowSnapshot,
  type WorkflowBlock,
  type WorkflowDefinition,
} from "@/lib/local-fiscal-workflow";
import {
  getToolForBlock,
  LOCAL_TOOL_REGISTRY,
} from "@/lib/local-tool-registry";
import { cn } from "@/lib/utils";
import {
  addNodeAtom,
  connectBlocksAtom,
  currentWorkflowNameAtom,
  deleteNodeAtom,
  edgesAtom,
  executionLogsAtom,
  localWorkflowRevisionAtom,
  nodesAtom,
  propertiesPanelActiveTabAtom,
  selectedEdgeAtom,
  selectedNodeAtom,
  updateNodeDataAtom,
} from "@/lib/workflow-store";
import {
  canEditStructureRow,
  collectStructureSourceTraces,
  generateStructureView,
  getSelectedStructureBlock,
  getStructureUpstreamBlocks,
  type StructureSourceTrace,
  type StructureViewRow,
  sortStructureBlocksForWorksheet,
} from "@/src/runtime/generate-structure-view";
import { formatRelationshipType } from "./utils/edge-relationships";

type WorkflowStudioShellProps = {
  isMobile: boolean;
  rightPanelCollapsed: boolean;
  rightPanelWidthPercent: number;
};

type BottomPanelActions = {
  addChildLogic: (parentId: string) => void;
  createSourceLogic: (
    sourceId: string,
    variant: "annotation" | "correction" | "derived"
  ) => void;
  deleteBlock: (blockId: string) => void;
  renameBlock: (blockId: string, label: string) => void;
  selectBlock: (blockId: string) => void;
  toggleRuntimeVisibility: (blockId: string) => void;
};

function getBlockIcon(block: WorkflowBlock) {
  if (block.family === "Source") {
    return FileText;
  }
  if (block.family === "Logic") {
    return Calculator;
  }
  if (block.family === "Review / Validation") {
    return ShieldCheck;
  }
  if (block.family === "Protected") {
    return LockKeyhole;
  }
  if (block.family === "AI / Agent") {
    return Bot;
  }
  return Download;
}

function getProtectedBlocks(definition: WorkflowDefinition) {
  return sortStructureBlocksForWorksheet(
    definition.blocks.filter((block) => block.family === "Protected")
  );
}

function getBlockRuns(
  definition: WorkflowDefinition,
  blockId: string | undefined
): BlockRun[] {
  if (!blockId) {
    return definition.mockRuns;
  }
  return definition.mockRuns.filter((run) => run.blockId === blockId);
}

function getSourceVersion(block: WorkflowBlock) {
  return Number(block.config.sourceVersion || 1);
}

function wasSourceUsedInRun(blockId: string) {
  return loadLocalRunRecords().some((record) =>
    record.logs.some((log) => log.nodeId === blockId)
  );
}

function getToolCountsByGroup() {
  const uniqueTools = [
    ...new Map(
      Object.values(LOCAL_TOOL_REGISTRY).map((tool) => [tool.toolId, tool])
    ).values(),
  ];
  const counts: Record<string, number> = {};
  for (const tool of uniqueTools) {
    counts[tool.toolGroup] = (counts[tool.toolGroup] || 0) + 1;
  }
  return counts;
}

function CompactJson({ value }: { value: unknown }) {
  return (
    <pre className="max-h-32 overflow-auto rounded border bg-background/70 p-2 text-[11px]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function getConfiguredSourcePreview(block: WorkflowBlock) {
  if (block.config.sourceKind === "keyword_rules") {
    return block.config.keywordRules || block.config.rules || [];
  }
  return (
    block.config.rows ||
    block.config.manualRows ||
    block.config.tableRows ||
    block.config.sampleRows ||
    block.source?.valuePreview
  );
}

function getSourceOutputType(block: WorkflowBlock) {
  return block.config.sourceKind === "keyword_rules" ? "keyword_rules" : "rows";
}

function StatusPill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "danger" | "muted" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-medium text-[10px] uppercase",
        tone === "success" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        tone === "warning" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        tone === "danger" &&
          "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
        tone === "muted" && "text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This row owns the small tree UI and contextual actions for each block family.
function StructureRow({
  actions,
  depth,
  row,
  selectedBlockId,
}: {
  actions: BottomPanelActions;
  depth: number;
  row: StructureViewRow;
  selectedBlockId: string | null;
}) {
  const [open, setOpen] = useState(depth < 2);
  const Icon = getBlockIcon(row.block);
  const isSelected = selectedBlockId === row.block.id;
  const isSource = row.block.family === "Source";
  const editable = canEditStructureRow(row);

  return (
    <div className={cn(depth > 0 && "border-border/60 border-l pl-3")}>
      <div
        className={cn(
          "group rounded-md border border-transparent px-2 py-1.5",
          isSelected && "border-primary/40 bg-primary/5",
          !isSelected && "hover:bg-muted/50"
        )}
      >
        <div className="flex items-center gap-2">
          <button
            className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted"
            disabled={row.children.length === 0}
            onClick={() => setOpen(!open)}
            type="button"
          >
            {row.children.length > 0 ? (
              open ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )
            ) : (
              <span className="size-1 rounded-full bg-muted-foreground/50" />
            )}
          </button>
          <button
            className="min-w-0 flex-1 text-left"
            onClick={() => actions.selectBlock(row.block.id)}
            type="button"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium text-sm">
                {row.block.label}
              </span>
              {row.inferred && <StatusPill>mapped</StatusPill>}
              {row.edge && (
                <span className="text-[10px] text-muted-foreground">
                  {formatRelationshipType(row.edge.relationshipType)}
                </span>
              )}
              {row.edge?.targetInputRole && (
                <StatusPill
                  tone={
                    row.edge.bindingStatus === "valid" ? "success" : "warning"
                  }
                >
                  {row.edge.targetInputRole}
                </StatusPill>
              )}
              {isSource && (
                <StatusPill>v{getSourceVersion(row.block)}</StatusPill>
              )}
              {row.block.governance?.protected && (
                <StatusPill tone="warning">governed</StatusPill>
              )}
              {row.block.runtime.visible ? (
                <StatusPill tone="success">runtime</StatusPill>
              ) : (
                <StatusPill>hidden</StatusPill>
              )}
            </span>
            <span className="mt-0.5 flex items-center gap-2 text-muted-foreground text-xs">
              {row.block.family} / {row.block.subtype}
              {row.block.governance?.requiresUnlockToEdit && (
                <span>explicit edit intent</span>
              )}
              {row.block.governance?.lockedInRuntime && (
                <span>runtime locked</span>
              )}
              {isSource && <span>read-only evidence</span>}
              {isSource && wasSourceUsedInRun(row.block.id) && (
                <span>used in run</span>
              )}
              {row.edge?.reason && <span>{row.edge.reason}</span>}
            </span>
          </button>
          <Button
            onClick={() => actions.selectBlock(row.block.id)}
            size="sm"
            variant="ghost"
          >
            Open
          </Button>
        </div>

        {isSelected && (
          <div className="mt-2 flex flex-wrap items-center gap-2 pl-7">
            {editable ? (
              <Input
                className="h-8 w-60"
                onChange={(event) =>
                  actions.renameBlock(row.block.id, event.target.value)
                }
                value={row.block.label}
              />
            ) : (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-700 text-xs dark:text-amber-300">
                Source rows are read-only. Create downstream Logic to correct or
                reinterpret evidence.
              </div>
            )}
            {row.block.governance && (
              <div className="flex items-center gap-2 rounded-md border bg-background/70 px-2 py-1 text-xs">
                <LockKeyhole className="size-3.5 text-muted-foreground" />
                <span>
                  Draft editable:{" "}
                  {row.block.governance.requiresUnlockToEdit
                    ? "unlock intent required"
                    : "yes"}
                </span>
                <span className="text-muted-foreground">
                  Runtime:{" "}
                  {row.block.governance.lockedInRuntime ? "locked" : "editable"}
                </span>
                {row.block.governance.editIntent && (
                  <span className="text-muted-foreground">
                    Intent: {row.block.governance.editIntent}
                  </span>
                )}
              </div>
            )}
            <Button
              disabled={isSource}
              onClick={() => actions.addChildLogic(row.block.id)}
              size="sm"
              variant="secondary"
            >
              <Plus className="mr-1 size-3.5" />
              Add child
            </Button>
            <Button
              disabled={isSource}
              onClick={() => actions.toggleRuntimeVisibility(row.block.id)}
              size="sm"
              variant="secondary"
            >
              {row.block.runtime.visible ? (
                <Eye className="mr-1 size-3.5" />
              ) : (
                <EyeOff className="mr-1 size-3.5" />
              )}
              Runtime
            </Button>
            <Button
              disabled={isSource || depth === 0}
              onClick={() => actions.deleteBlock(row.block.id)}
              size="sm"
              variant="ghost"
            >
              <Trash2 className="mr-1 size-3.5" />
              Delete child
            </Button>
            {isSource && (
              <>
                <Button
                  onClick={() =>
                    toast.warning(
                      "Source evidence is locked. Add downstream Logic instead."
                    )
                  }
                  size="sm"
                  variant="outline"
                >
                  Edit source value
                </Button>
                <Button
                  onClick={() =>
                    actions.createSourceLogic(row.block.id, "derived")
                  }
                  size="sm"
                  variant="secondary"
                >
                  Create derived Logic
                </Button>
                <Button
                  onClick={() =>
                    actions.createSourceLogic(row.block.id, "correction")
                  }
                  size="sm"
                  variant="secondary"
                >
                  Create correction Logic
                </Button>
                <Button
                  onClick={() =>
                    actions.createSourceLogic(row.block.id, "annotation")
                  }
                  size="sm"
                  variant="secondary"
                >
                  Create annotation Logic
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {open && row.children.length > 0 && (
        <div className="mt-1 space-y-1 pl-4">
          {row.children.map((child) => (
            <StructureRow
              actions={actions}
              depth={depth + 1}
              key={`${row.block.id}-${child.block.id}-${child.edge?.id || "inferred"}`}
              row={child}
              selectedBlockId={selectedBlockId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StructurePreview({
  actions,
  definition,
  selectedBlockId,
}: {
  actions: BottomPanelActions;
  definition: WorkflowDefinition;
  selectedBlockId: string | null;
}) {
  const tree = useMemo(() => generateStructureView(definition), [definition]);

  // Structure renders generated runtime hierarchy. Formula and code editing stay
  // in inspector tabs; this panel only edits hierarchy for non-Source rows.
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-sm">
            <GitBranch className="size-4 text-muted-foreground" />
            Generated worksheet/runtime preview
          </h3>
          <p className="text-muted-foreground text-xs">
            Structured from typed blocks and schema edges. Reorder is
            intentionally light in v1.
          </p>
          <p className="text-muted-foreground text-xs">
            Runtime config: {definition.runtimeUiConfig.runtimeConfigId} -
            generated {definition.runtimeUiConfig.generatedAt}
          </p>
        </div>
        <StatusPill>{definition.structure.blockOrder.length} rows</StatusPill>
      </div>
      <div className="space-y-1">
        {tree.map((row) => (
          <StructureRow
            actions={actions}
            depth={0}
            key={row.block.id}
            row={row}
            selectedBlockId={selectedBlockId}
          />
        ))}
      </div>
    </div>
  );
}

function SourceEvidenceCard({
  actions,
  block,
  definition,
}: {
  actions: BottomPanelActions;
  block: WorkflowBlock;
  definition: WorkflowDefinition;
}) {
  const consumers = definition.edges
    .filter((edge) => edge.sourceBlockId === block.id)
    .map((edge) =>
      definition.blocks.find((candidate) => candidate.id === edge.targetBlockId)
    )
    .filter((candidate): candidate is WorkflowBlock => Boolean(candidate));

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-md border bg-muted/20 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm">{block.label}</h3>
          <div className="flex gap-1">
            <StatusPill>v{getSourceVersion(block)}</StatusPill>
            <StatusPill>read-only</StatusPill>
          </div>
        </div>
        <div className="mb-2 text-muted-foreground text-xs">
          Runtime config marks Source evidence as read-only.
        </div>
        <div className="space-y-1 text-sm">
          <div>Subtype: {block.subtype}</div>
          <div className="text-muted-foreground">
            Locator: {block.source?.locator || "mock://source"}
          </div>
          <div className="text-muted-foreground">
            Preview: {block.source?.valuePreview || block.runtime.outputKey}
          </div>
          <div className="text-muted-foreground">
            Used in run: {wasSourceUsedInRun(block.id) ? "yes" : "no"}
          </div>
          <div className="text-muted-foreground">
            Consumed by:{" "}
            {consumers.length > 0
              ? consumers.map((consumer) => consumer.label).join(", ")
              : "none"}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => actions.createSourceLogic(block.id, "derived")}
            size="sm"
            variant="secondary"
          >
            Create derived Logic
          </Button>
          <Button
            onClick={() => actions.createSourceLogic(block.id, "correction")}
            size="sm"
            variant="secondary"
          >
            Create correction Logic
          </Button>
          <Button
            onClick={() => actions.createSourceLogic(block.id, "annotation")}
            size="sm"
            variant="secondary"
          >
            Create annotation Logic
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-muted/20 p-3">
        <DataPreviewCard
          connectedBlockLabel={block.label}
          direction="output"
          fallbackPreview={getConfiguredSourcePreview(block)}
          outputType={getSourceOutputType(block)}
          roleId={getSourceOutputType(block)}
          roleLabel={
            block.config.sourceKind === "keyword_rules"
              ? "Rule / Knowledge Source"
              : "Evidence Source rows"
          }
          status={wasSourceUsedInRun(block.id) ? "ready" : "warning"}
          statusLabel={wasSourceUsedInRun(block.id) ? "read-only" : "setup"}
          value={getConfiguredSourcePreview(block)}
        />
      </div>
    </div>
  );
}

function TraceList({ traces }: { traces: StructureSourceTrace[] }) {
  if (traces.length === 0) {
    return (
      <div className="rounded-md border bg-muted/20 p-3 text-muted-foreground text-sm">
        No upstream source trace is linked yet.
      </div>
    );
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {traces.map((trace) => (
        <div
          className="rounded-md border bg-muted/20 p-3 text-sm"
          key={`${trace.source.id}-${trace.path.map((item) => item.id).join("-")}`}
        >
          <div className="mb-1 flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <span className="font-medium">{trace.source.label}</span>
          </div>
          <div className="text-muted-foreground text-xs">
            {trace.path.map((item) => item.label).join(" -> ")}
          </div>
          {trace.edges.length > 0 && (
            <div className="mt-2 space-y-1 text-[11px]">
              {trace.edges.map((edge) => (
                <div
                  className="rounded border bg-background/60 px-2 py-1"
                  key={edge.id}
                >
                  <span className="font-medium">
                    {formatRelationshipType(edge.relationshipType)}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    - {edge.reason}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 font-mono text-[11px] text-muted-foreground">
            {trace.source.source?.locator || trace.source.runtime.outputKey}
          </div>
        </div>
      ))}
    </div>
  );
}

function SourcesPreview({
  actions,
  definition,
  selectedBlock,
}: {
  actions: BottomPanelActions;
  definition: WorkflowDefinition;
  selectedBlock: WorkflowBlock | null;
}) {
  if (!selectedBlock) {
    const sources = sortStructureBlocksForWorksheet(
      definition.blocks.filter((block) => block.family === "Source")
    );

    return (
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((block) => (
          <button
            className="rounded-md border bg-muted/20 p-3 text-left text-sm"
            key={block.id}
            onClick={() => actions.selectBlock(block.id)}
            type="button"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-medium">{block.label}</span>
              <div className="flex gap-1">
                <StatusPill>v{getSourceVersion(block)}</StatusPill>
                <StatusPill>
                  {wasSourceUsedInRun(block.id) ? "used" : "setup"}
                </StatusPill>
              </div>
            </div>
            <div className="truncate text-muted-foreground text-xs">
              {block.source?.locator || block.runtime.outputKey}
            </div>
            {block.config.sourceKind === "keyword_rules" && (
              <div className="mt-1 text-muted-foreground text-xs">
                Keyword rules reference evidence
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  const traces = collectStructureSourceTraces(definition, selectedBlock);
  const checkedBlocks = getStructureUpstreamBlocks(definition, selectedBlock);

  if (selectedBlock.family === "Source") {
    return (
      <SourceEvidenceCard
        actions={actions}
        block={selectedBlock}
        definition={definition}
      />
    );
  }

  if (selectedBlock.family === "Review / Validation") {
    return (
      <div className="space-y-3">
        <div className="grid gap-2 md:grid-cols-3">
          {checkedBlocks.map((block) => (
            <button
              className="rounded-md border bg-muted/20 p-3 text-left text-sm"
              key={block.id}
              onClick={() => actions.selectBlock(block.id)}
              type="button"
            >
              <div className="font-medium">{block.label}</div>
              <div className="text-muted-foreground text-xs">
                {block.family} / {block.subtype}
              </div>
            </button>
          ))}
        </div>
        <CompactJson
          value={{
            warnings: ["Low confidence rows require review"],
            validationEvidence: traces.map((trace) => trace.source.label),
            mockOnly: true,
          }}
        />
      </div>
    );
  }

  if (selectedBlock.family === "AI / Agent") {
    if (definition.aiProposals.length === 0) {
      return (
        <div className="rounded-md border bg-muted/20 p-3 text-muted-foreground text-sm">
          No local AI proposals have been saved. AI blocks remain proposal-only
          in this prototype.
        </div>
      );
    }

    return (
      <div className="grid gap-2 md:grid-cols-2">
        {definition.aiProposals.map((proposal) => (
          <div className="rounded-md border bg-muted/20 p-3" key={proposal.id}>
            <div className="font-medium text-sm">
              {proposal.interpretedPlan}
            </div>
            <div className="mt-1 text-muted-foreground text-xs">
              {proposal.status} - {proposal.selectedTools.join(", ")}
            </div>
            <CompactJson value={proposal.generatedCodeOrFormulas} />
          </div>
        ))}
      </div>
    );
  }

  if (selectedBlock.family === "Output") {
    const outputRelationshipEdges = definition.edges.filter(
      (edge) =>
        edge.targetBlockId === selectedBlock.id &&
        isOutputMappingRelationshipType(edge.relationshipType)
    );
    const mappedProtectedBlocks = outputRelationshipEdges
      .filter((edge) => isGovernedOutputRelationshipType(edge.relationshipType))
      .map((edge) =>
        definition.blocks.find((block) => block.id === edge.sourceBlockId)
      )
      .filter((block): block is WorkflowBlock => block?.family === "Protected");
    const candidateLogicBlocks = outputRelationshipEdges
      .filter((edge) =>
        isCandidateOutputRelationshipType(edge.relationshipType)
      )
      .map((edge) =>
        definition.blocks.find((block) => block.id === edge.sourceBlockId)
      )
      .filter((block): block is WorkflowBlock => block?.family === "Logic");

    return (
      <div className="space-y-3">
        <div className="rounded-md border bg-muted/20 p-3 text-sm">
          <div className="font-medium">Protected values included</div>
          <div className="mt-2 grid gap-1 md:grid-cols-3">
            {mappedProtectedBlocks.slice(0, 12).map((block) => (
              <button
                className="truncate rounded border bg-background/60 px-2 py-1 text-left text-xs"
                key={block.id}
                onClick={() => actions.selectBlock(block.id)}
                type="button"
              >
                {block.label}
              </button>
            ))}
          </div>
          {candidateLogicBlocks.length > 0 && (
            <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-2 text-amber-800 text-xs dark:text-amber-200">
              <div>{LOGIC_OUTPUT_GOVERNANCE_WARNING}</div>
              <div className="mt-1">
                Candidate logic inputs:{" "}
                {candidateLogicBlocks
                  .slice(0, 5)
                  .map((block) => block.label)
                  .join(", ")}
              </div>
            </div>
          )}
        </div>
        <TraceList traces={traces} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-muted/20 p-3">
        <h3 className="font-semibold text-sm">
          Source trace for {selectedBlock.label}
        </h3>
        <p className="text-muted-foreground text-xs">
          Upstream source evidence is grouped by schema relationship.
        </p>
      </div>
      <TraceList traces={traces} />
    </div>
  );
}

function OutputReadinessPill({
  outputFinality,
  statusReady,
}: {
  outputFinality: string;
  statusReady: boolean;
}) {
  if (outputFinality === "draft_not_final") {
    return (
      <span className="inline-flex items-center gap-1">
        <AlertTriangle className="size-3" />
        draft
      </span>
    );
  }

  if (statusReady) {
    return (
      <span className="inline-flex items-center gap-1">
        <CheckCircle2 className="size-3" />
        ready
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <AlertTriangle className="size-3" />
      missing
    </span>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Output cards combine readiness, mappings, latest run payload, and local data preview.
function OutputPreviewCard({
  block,
  definition,
  outputPreviewById,
  protectedBlocks,
  selectedBlock,
}: {
  block: WorkflowBlock;
  definition: WorkflowDefinition;
  outputPreviewById: Map<
    string,
    WorkflowDefinition["outputMappingPreview"]["outputs"][number]
  >;
  protectedBlocks: WorkflowBlock[];
  selectedBlock: WorkflowBlock | null;
}) {
  const latestOutputLog = loadLocalRunRecords()
    .flatMap((record) => record.logs)
    .find((log) => log.nodeId === block.id);
  const latestOutput =
    typeof latestOutputLog?.output === "object" &&
    latestOutputLog.output !== null
      ? (latestOutputLog.output as Record<string, unknown>)
      : null;
  const latestPayload =
    typeof latestOutput?.output === "object" && latestOutput.output !== null
      ? (latestOutput.output as Record<string, unknown>)
      : null;
  const outputFinality = String(latestPayload?.outputFinality || "");
  const outputValue =
    latestPayload?.canonicalJson ||
    latestPayload?.preview ||
    latestPayload?.protectedResult ||
    latestPayload;
  const preview = outputPreviewById.get(block.id);
  const mappedEdges = definition.edges.filter(
    (edge) =>
      edge.targetBlockId === block.id &&
      isOutputMappingRelationshipType(edge.relationshipType)
  );
  const mappedProtectedBlocks = mappedEdges
    .filter((edge) => isGovernedOutputRelationshipType(edge.relationshipType))
    .map((edge) =>
      protectedBlocks.find(
        (protectedBlock) => protectedBlock.id === edge.sourceBlockId
      )
    )
    .filter((item): item is WorkflowBlock => Boolean(item));
  const candidateLogicBlocks = mappedEdges
    .filter((edge) => isCandidateOutputRelationshipType(edge.relationshipType))
    .map((edge) =>
      definition.blocks.find((item) => item.id === edge.sourceBlockId)
    )
    .filter((item): item is WorkflowBlock => item?.family === "Logic");
  const missing = [
    mappedEdges.length === 0 ? "No output mapping relationship" : "",
    mappedProtectedBlocks.length === 0 ? "No protected values mapped" : "",
  ].filter(Boolean);
  const ready = missing.length === 0;
  const statusReady = preview ? preview.readinessStatus === "ready" : ready;

  return (
    <div
      className={cn(
        "rounded-md border bg-muted/20 p-3",
        selectedBlock?.id === block.id && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-sm">{block.label}</div>
          <div className="text-muted-foreground text-xs">{block.subtype}</div>
        </div>
        <StatusPill tone={statusReady ? "success" : "warning"}>
          <OutputReadinessPill
            outputFinality={outputFinality}
            statusReady={statusReady}
          />
        </StatusPill>
      </div>
      <div className="space-y-1 text-xs">
        <div>Mapped protected values: {mappedProtectedBlocks.length}</div>
        {preview && (
          <div>
            Published/draft preview: {preview.readinessStatus} (
            {preview.mappedProtectedValues.length} governed,{" "}
            {preview.candidateLogicMappings.length} candidate)
          </div>
        )}
        {outputFinality === "draft_not_final" && (
          <div className="text-amber-700 dark:text-amber-300">
            Output preview includes results that still need review.
          </div>
        )}
        {candidateLogicBlocks.length > 0 && (
          <div>Candidate logic inputs: {candidateLogicBlocks.length}</div>
        )}
        <div className="line-clamp-2 text-muted-foreground">
          {mappedProtectedBlocks
            .slice(0, 5)
            .map((protectedBlock) => protectedBlock.label)
            .join(", ")}
        </div>
        {mappedEdges.slice(0, 3).map((edge) => (
          <div className="text-muted-foreground" key={edge.id}>
            {formatRelationshipType(edge.relationshipType)}: {edge.reason}
          </div>
        ))}
        {preview?.governanceWarnings.map((warning) => (
          <div className="text-amber-700 dark:text-amber-300" key={warning}>
            {warning}
          </div>
        ))}
        <div>Mock export readiness: local JSON only</div>
        {preview?.mockPayloadPreview && (
          <CompactJson value={preview.mockPayloadPreview} />
        )}
        <DataPreviewCard
          contextData={latestPayload || undefined}
          direction="output"
          fallbackPreview={preview?.mockPayloadPreview}
          outputType={
            block.subtype === "Canonical JSON"
              ? "canonical_json"
              : "evidence_preview"
          }
          roleId={
            block.subtype === "Canonical JSON" ? "canonical_json" : "preview"
          }
          roleLabel={`${block.label} latest output`}
          status={latestPayload ? "ready" : "warning"}
          statusLabel={latestPayload ? "latest run" : "mock preview"}
          value={outputValue}
        />
        {missing.length > 0 && (
          <div className="text-amber-700 dark:text-amber-300">
            {missing.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

function OutputsPreview({
  definition,
  selectedBlock,
}: {
  definition: WorkflowDefinition;
  selectedBlock: WorkflowBlock | null;
}) {
  const outputBlocks = sortStructureBlocksForWorksheet(
    definition.blocks.filter((block) => block.family === "Output")
  );
  const protectedBlocks = getProtectedBlocks(definition);
  const outputPreviewById = new Map(
    definition.outputMappingPreview.outputs.map((output) => [
      output.outputBlockId,
      output,
    ])
  );

  if (outputBlocks.length === 0) {
    return (
      <div className="rounded-md border bg-muted/20 p-3 text-muted-foreground text-sm">
        No output blocks are present yet. Add an Output block from the palette
        to preview local export readiness.
      </div>
    );
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {outputBlocks.map((block) => (
        <OutputPreviewCard
          block={block}
          definition={definition}
          key={block.id}
          outputPreviewById={outputPreviewById}
          protectedBlocks={protectedBlocks}
          selectedBlock={selectedBlock}
        />
      ))}
    </div>
  );
}

function RunsPreview({
  definition,
  selectedBlock,
}: {
  definition: WorkflowDefinition;
  selectedBlock: WorkflowBlock | null;
}) {
  const executionLogs = useAtomValue(executionLogsAtom);
  const records = loadLocalRunRecords();
  const selectedRuns = getBlockRuns(definition, selectedBlock?.id);
  const selectedExecutionLog = selectedBlock
    ? executionLogs[selectedBlock.id]
    : undefined;
  const selectedBlockEdges = selectedBlock
    ? definition.edges.filter(
        (edge) =>
          edge.sourceBlockId === selectedBlock.id ||
          edge.targetBlockId === selectedBlock.id
      )
    : [];
  const lastRecord = records[0];
  const selectedLog = selectedBlock
    ? lastRecord?.logs.find((log) => log.nodeId === selectedBlock.id)
    : undefined;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-2">
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-sm">Workflow mock run history</div>
          <div className="mt-2 space-y-1 text-sm">
            {records.length === 0 ? (
              <div className="text-muted-foreground">
                No toolbar run has been executed yet.
              </div>
            ) : (
              records.slice(0, 4).map((record) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={record.execution.id}
                >
                  <span>
                    {record.execution.id.replace("local-run-", "Run ")}
                  </span>
                  <StatusPill tone="success">
                    {record.execution.status}
                  </StatusPill>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-sm">Local workflow events</div>
          <div className="mt-2 space-y-1 text-sm">
            {definition.events.length === 0 ? (
              <div className="text-muted-foreground">
                No local save/import/export/publish events recorded yet.
              </div>
            ) : (
              definition.events.slice(0, 5).map((event) => (
                <div
                  className="rounded border bg-background/60 p-2"
                  key={event.id}
                >
                  <div className="font-medium">{event.message}</div>
                  <div className="text-muted-foreground text-xs">
                    {event.type} - {event.createdAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-sm">Definition mock runs</div>
          <div className="mt-2 grid gap-1 md:grid-cols-2">
            {definition.mockRuns.slice(0, 8).map((run) => (
              <div
                className="rounded border bg-background/60 p-2 text-xs"
                key={run.id}
              >
                <div className="font-medium">{run.blockLabel}</div>
                <div className="text-muted-foreground">{run.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="font-medium text-sm">
              Selected block run: {selectedBlock?.label || "Workflow"}
            </div>
            <StatusPill tone={selectedExecutionLog ? "success" : "muted"}>
              {selectedExecutionLog?.status ||
                selectedRuns[0]?.status ||
                "mock"}
            </StatusPill>
          </div>
          <CompactJson
            value={{
              definitionRuns: selectedRuns,
              lastExecutionOutput: selectedExecutionLog?.output,
              sampleInput: selectedLog?.input || {
                workflowRun: lastRecord?.execution.id,
                blockCount: definition.blocks.length,
              },
              sampleOutput: selectedLog?.output || lastRecord?.execution,
              relationshipNotes: selectedBlockEdges.map((edge) => ({
                binding: {
                  label: edge.bindingLabel,
                  sourceOutputRole: edge.sourceOutputRole,
                  status: edge.bindingStatus,
                  targetInputRole: edge.targetInputRole,
                },
                relationship: formatRelationshipType(edge.relationshipType),
                reason: edge.reason,
                notes: edge.notes,
                status: edge.status,
              })),
              warnings:
                selectedRuns[0]?.status === "warning"
                  ? ["Mock warning retained from sample definition"]
                  : [],
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DebugPreview({
  definition,
  selectedBlockId,
  selectedEdgeId,
}: {
  definition: WorkflowDefinition;
  selectedBlockId: string | null;
  selectedEdgeId: string | null;
}) {
  const countsByFamily: Record<string, number> = {};
  for (const block of definition.blocks) {
    countsByFamily[block.family] = (countsByFamily[block.family] || 0) + 1;
  }
  const edgeCountByStatus: Record<string, number> = {};
  for (const edge of definition.edges) {
    edgeCountByStatus[edge.status] = (edgeCountByStatus[edge.status] || 0) + 1;
  }
  const selectedEdge = definition.edges.find(
    (edge) => edge.id === selectedEdgeId
  );
  const selectedBlock = definition.blocks.find(
    (block) => block.id === selectedBlockId
  );
  const selectedTool = selectedBlock ? getToolForBlock(selectedBlock) : null;
  const latestRun = loadLocalRunRecords()[0];

  return (
    <CompactJson
      value={{
        aiProposalCount: definition.aiProposals.length,
        countsByFamily,
        edgeBindingMetadata: definition.edges.map((edge) => ({
          bindingLabel: edge.bindingLabel,
          bindingStatus: edge.bindingStatus,
          id: edge.id,
          sourceOutputRole: edge.sourceOutputRole,
          targetInputRole: edge.targetInputRole,
        })),
        edgeCount: definition.edges.length,
        edgeCountByStatus,
        latestPublishedVersionId: definition.latestPublishedVersionId,
        latestWorkflowRunStatus: latestRun?.execution.status,
        mockRunCount: definition.mockRuns.length,
        outputMappingPreviewCount:
          definition.outputMappingPreview.outputs.length,
        publishedVersion: definition.publishedVersion,
        publishedSnapshotCount: definition.versionSnapshots.filter(
          (snapshot) => snapshot.status === "published"
        ).length,
        runtimeConfigGeneratedAt: definition.runtimeUiConfig.generatedAt,
        runtimeConfigId: definition.runtimeUiConfig.runtimeConfigId,
        schemaVersion: definition.schemaVersion,
        selectedBlockId,
        selectedBlockRoles: selectedTool
          ? {
              inputRoles: selectedTool.inputRoles,
              outputRoles: selectedTool.outputRoles,
              toolGroup: selectedTool.toolGroup,
              toolId: selectedTool.toolId,
            }
          : null,
        selectedEdgeId,
        selectedEdgeRelationship: selectedEdge
          ? {
              bindingLabel: selectedEdge.bindingLabel,
              bindingStatus: selectedEdge.bindingStatus,
              reason: selectedEdge.reason,
              relationshipType: selectedEdge.relationshipType,
              sourceOutputRole: selectedEdge.sourceOutputRole,
              status: selectedEdge.status,
              targetInputRole: selectedEdge.targetInputRole,
            }
          : null,
        toolCountByToolGroup: getToolCountsByGroup(),
        workflowId: definition.id,
      }}
    />
  );
}

function BottomPanel({
  isMobile,
  paletteOpen,
  rightPanelCollapsed,
  rightPanelWidthPercent,
}: WorkflowStudioShellProps & { paletteOpen: boolean }) {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  useAtomValue(localWorkflowRevisionAtom);
  const selectedBlockId = useAtomValue(selectedNodeAtom);
  const selectedEdgeId = useAtomValue(selectedEdgeAtom);
  const setSelectedBlockId = useSetAtom(selectedNodeAtom);
  const setSelectedEdgeId = useSetAtom(selectedEdgeAtom);
  const setActiveInspectorTab = useSetAtom(propertiesPanelActiveTabAtom);
  const addNode = useSetAtom(addNodeAtom);
  const connectBlocks = useSetAtom(connectBlocksAtom);
  const deleteNode = useSetAtom(deleteNodeAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const [expanded, setExpanded] = useState(true);
  const { open: openOverlay } = useOverlay();
  const leftOffset = paletteOpen && !isMobile ? "21rem" : "4.75rem";
  const rightOffset =
    isMobile || rightPanelCollapsed
      ? "0.75rem"
      : `calc(${rightPanelWidthPercent}% + 0.75rem)`;
  const definition = createWorkflowDefinitionFromCanvas({
    name: workflowName || "Fiscal Workflow Studio",
    nodes,
    edges,
    existing: loadLocalWorkflowSnapshot(),
  });
  const selectedBlock = getSelectedStructureBlock(definition, selectedBlockId);

  const selectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setSelectedEdgeId(null);
    setActiveInspectorTab("properties");
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({ ...node, selected: node.id === blockId }))
    );
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({ ...edge, selected: false }))
    );
    openOverlay(ConfigurationOverlay, {}, { size: "wide" });
  };

  const addChildLogic = (parentId: string) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    const parentBlock = parentNode?.data.block;
    if (!(parentNode && parentBlock) || parentBlock.family === "Source") {
      toast.warning(
        "Source rows are read-only. Create downstream Logic instead."
      );
      return;
    }

    const childId = nanoid();
    const childBlock = createWorkflowBlockFromCatalog("logic:transformation", {
      id: childId,
      label: `Child Logic for ${parentBlock.label}`,
      description: "Draft logic row added from Structure.",
      position: {
        x: parentNode.position.x - 260,
        y: parentNode.position.y + 90 + (nodes.length % 3) * 36,
      },
      config: {
        inputs: parentBlock.runtime.outputKey || parentBlock.label,
        outputs: `derived${nodes.length + 1}`,
      },
      status: "draft",
    });
    const childNode = createWorkflowNodeFromBlock(childBlock, {
      selected: true,
    });
    addNode(childNode);
    connectBlocks({
      source: childBlock.id,
      target: parentBlock.id,
    });
    setActiveInspectorTab("properties");
    toast.success("Child Logic added to Structure.");
  };

  const createSourceLogic = (
    sourceId: string,
    variant: "annotation" | "correction" | "derived"
  ) => {
    const sourceNode = nodes.find((node) => node.id === sourceId);
    const sourceBlock = sourceNode?.data.block;
    if (!(sourceNode && sourceBlock) || sourceBlock.family !== "Source") {
      return;
    }

    const labelByVariant = {
      annotation: `Annotation Logic for ${sourceBlock.label}`,
      correction: `Correction Logic for ${sourceBlock.label}`,
      derived: `Derived Logic from ${sourceBlock.label}`,
    };
    const newBlockId = nanoid();
    const logicBlock = createWorkflowBlockFromCatalog(
      variant === "annotation"
        ? "logic:classification-mapping"
        : "logic:transformation",
      {
        id: newBlockId,
        label: labelByVariant[variant],
        description: "Downstream Logic created from immutable source evidence.",
        position: {
          x: sourceNode.position.x + 300,
          y: sourceNode.position.y + 60 + (nodes.length % 4) * 34,
        },
        config: {
          inputs: sourceBlock.runtime.outputKey || sourceBlock.label,
          outputs: `${variant}Logic${nodes.length + 1}`,
          sourceEvidenceId: sourceBlock.id,
        },
        status: "draft",
      }
    );
    addNode(createWorkflowNodeFromBlock(logicBlock, { selected: true }));
    connectBlocks({
      source: sourceBlock.id,
      target: logicBlock.id,
    });
    setActiveInspectorTab("properties");
    toast.success(`${labelByVariant[variant]} created.`);
  };

  const deleteBlock = (blockId: string) => {
    const node = nodes.find((item) => item.id === blockId);
    if (node?.data.block?.family === "Source") {
      toast.warning("Source evidence leaves cannot be deleted from Structure.");
      return;
    }
    deleteNode(blockId);
  };

  const renameBlock = (blockId: string, label: string) => {
    const node = nodes.find((item) => item.id === blockId);
    if (node?.data.block?.family === "Source") {
      toast.warning("Source labels are locked once treated as evidence.");
      return;
    }
    updateNodeData({ id: blockId, data: { label } });
  };

  const toggleRuntimeVisibility = (blockId: string) => {
    const node = nodes.find((item) => item.id === blockId);
    const block = node?.data.block;
    if (!(node && block) || block.family === "Source") {
      toast.warning(
        "Source evidence visibility is controlled by evidence policy."
      );
      return;
    }

    const visible = !block.runtime.visible;
    updateNodeData({
      id: blockId,
      data: {
        block: {
          ...block,
          runtime: { ...block.runtime, visible },
          updatedAt: new Date().toISOString(),
        },
        config: { ...node.data.config, runtimeVisible: visible },
      },
    });
  };

  const actions: BottomPanelActions = {
    addChildLogic,
    createSourceLogic,
    deleteBlock,
    renameBlock,
    selectBlock,
    toggleRuntimeVisibility,
  };

  return (
    <section
      className="pointer-events-auto absolute z-20 rounded-md border bg-background/95 shadow-sm backdrop-blur"
      style={{
        bottom: "0.75rem",
        left: isMobile ? "0.75rem" : leftOffset,
        right: isMobile ? "0.75rem" : rightOffset,
      }}
    >
      <div className="flex h-11 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <ListTree className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Runtime Preview</h2>
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          size="icon"
          title={
            expanded ? "Collapse runtime preview" : "Expand runtime preview"
          }
          variant="ghost"
        >
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </div>
      {expanded && (
        <Tabs className="flex h-80 flex-col gap-0" defaultValue="structure">
          <TabsList className="h-10 w-full justify-start rounded-none border-b bg-transparent px-3 py-1">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
            <TabsTrigger value="runs">Runs / Logs</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <TabsContent className="mt-0" value="structure">
              <StructurePreview
                actions={actions}
                definition={definition}
                selectedBlockId={selectedBlockId}
              />
            </TabsContent>
            <TabsContent className="mt-0" value="sources">
              <SourcesPreview
                actions={actions}
                definition={definition}
                selectedBlock={selectedBlock}
              />
            </TabsContent>
            <TabsContent className="mt-0" value="outputs">
              <OutputsPreview
                definition={definition}
                selectedBlock={selectedBlock}
              />
            </TabsContent>
            <TabsContent className="mt-0" value="runs">
              <RunsPreview
                definition={definition}
                selectedBlock={selectedBlock}
              />
            </TabsContent>
            <TabsContent className="mt-0" value="debug">
              <DebugPreview
                definition={definition}
                selectedBlockId={selectedBlockId}
                selectedEdgeId={selectedEdgeId}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </section>
  );
}

export function WorkflowStudioShell({
  isMobile,
  rightPanelCollapsed,
  rightPanelWidthPercent,
}: WorkflowStudioShellProps) {
  if (isMobile) {
    return (
      <BottomPanel
        isMobile={isMobile}
        paletteOpen={false}
        rightPanelCollapsed={rightPanelCollapsed}
        rightPanelWidthPercent={rightPanelWidthPercent}
      />
    );
  }

  return (
    <BottomPanel
      isMobile={isMobile}
      paletteOpen={false}
      rightPanelCollapsed={rightPanelCollapsed}
      rightPanelWidthPercent={rightPanelWidthPercent}
    />
  );
}
