import {
  createWorkflowDefinitionFromCanvas,
  LOCAL_WORKFLOW_ID,
  type LocalExecutionLog,
  type LocalRunRecord,
  type LocalWorkflowExecution,
  type WorkflowEdge as SchemaWorkflowEdge,
  type WorkflowBlock,
  type WorkflowDefinition,
} from "./local-fiscal-workflow";
import {
  type EvidenceRef,
  getToolForBlock,
  getToolIdForBlock,
  type SourceTraceRef,
  type ToolRunLog,
  type ToolRunResult,
  type ToolRunStatus,
  type WorkflowRunResult,
} from "./local-tool-registry";
import type { WorkflowEdge, WorkflowNode } from "./workflow-store";

type LocalToolRunMode = "downstream" | "selected" | "workflow";
export type LocalEdgeRunStatus = "error" | "success" | "warning";

export type LocalToolRunnerResult = {
  blockStatuses: Record<string, "error" | "success">;
  edgeStatuses: Record<string, LocalEdgeRunStatus>;
  record: LocalRunRecord;
  result: WorkflowRunResult;
};

function makeRunId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toExecutionStatus(status: ToolRunStatus): "error" | "success" {
  return status === "error" ? "error" : "success";
}

function toWorkflowStatus(
  status: ToolRunStatus
): LocalWorkflowExecution["status"] {
  return status === "error" ? "error" : "success";
}

function getWorkflowStatus(results: ToolRunResult[]): ToolRunStatus {
  if (results.some((result) => result.status === "error")) {
    return "error";
  }
  if (results.some((result) => result.status === "needs_review")) {
    return "needs_review";
  }
  if (results.some((result) => result.status === "warning")) {
    return "warning";
  }
  if (results.some((result) => result.status === "skipped")) {
    return "warning";
  }
  return "success";
}

function dedupeMessages(messages: string[]) {
  return [...new Set(messages.filter(Boolean))];
}

function getEdgeRunStatus({
  sourceResult,
  targetResult,
}: {
  sourceResult?: ToolRunResult;
  targetResult?: ToolRunResult;
}): LocalEdgeRunStatus | null {
  if (!(sourceResult && targetResult)) {
    return null;
  }

  if (
    sourceResult.status === "error" ||
    sourceResult.status === "skipped" ||
    targetResult.status === "error" ||
    targetResult.status === "skipped"
  ) {
    return "error";
  }

  if (
    sourceResult.status === "needs_review" ||
    sourceResult.status === "warning" ||
    targetResult.status === "needs_review" ||
    targetResult.status === "warning"
  ) {
    return "warning";
  }

  return "success";
}

function dedupeEvidence(refs: EvidenceRef[]): EvidenceRef[] {
  return [...new Map(refs.map((ref) => [ref.evidenceId, ref])).values()];
}

function dedupeTrace(refs: SourceTraceRef[]): SourceTraceRef[] {
  return [
    ...new Map(
      refs.map((ref) => [
        `${ref.sourceBlockId}:${ref.rowId || ""}:${ref.evidenceRefId || ""}`,
        ref,
      ])
    ).values(),
  ];
}

function getActiveSchemaEdges(definition: WorkflowDefinition) {
  return definition.edges.filter((edge) => edge.status === "active");
}

function collectAncestorBlockIds({
  blockId,
  edges,
}: {
  blockId: string;
  edges: SchemaWorkflowEdge[];
}) {
  const ancestors = new Set<string>([blockId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const edge of edges) {
      if (
        ancestors.has(edge.targetBlockId) &&
        !ancestors.has(edge.sourceBlockId)
      ) {
        ancestors.add(edge.sourceBlockId);
        changed = true;
      }
    }
  }

  return ancestors;
}

function collectDescendantBlockIds({
  blockId,
  edges,
}: {
  blockId: string;
  edges: SchemaWorkflowEdge[];
}) {
  const descendants = new Set<string>([blockId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const edge of edges) {
      if (
        descendants.has(edge.sourceBlockId) &&
        !descendants.has(edge.targetBlockId)
      ) {
        descendants.add(edge.targetBlockId);
        changed = true;
      }
    }
  }

  return descendants;
}

function getExecutionBlocks({
  definition,
  mode,
  selectedBlockId,
}: {
  definition: WorkflowDefinition;
  mode: LocalToolRunMode;
  selectedBlockId?: string | null;
}) {
  if (mode === "selected" && selectedBlockId) {
    const ancestors = collectAncestorBlockIds({
      blockId: selectedBlockId,
      edges: getActiveSchemaEdges(definition),
    });
    return definition.blocks.filter((block) => ancestors.has(block.id));
  }

  if (mode === "downstream" && selectedBlockId) {
    const activeEdges = getActiveSchemaEdges(definition);
    const ancestors = collectAncestorBlockIds({
      blockId: selectedBlockId,
      edges: activeEdges,
    });
    const descendants = collectDescendantBlockIds({
      blockId: selectedBlockId,
      edges: activeEdges,
    });
    return definition.blocks.filter(
      (block) => ancestors.has(block.id) || descendants.has(block.id)
    );
  }

  return definition.blocks;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Kahn ordering is kept explicit for this local runner.
function orderBlocks({
  blocks,
  edges,
}: {
  blocks: WorkflowBlock[];
  edges: SchemaWorkflowEdge[];
}) {
  const blockIds = new Set(blocks.map((block) => block.id));
  const incomingCounts = new Map(blocks.map((block) => [block.id, 0]));
  const outgoing = new Map<string, SchemaWorkflowEdge[]>();

  for (const edge of edges) {
    if (
      !(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId))
    ) {
      continue;
    }
    incomingCounts.set(
      edge.targetBlockId,
      (incomingCounts.get(edge.targetBlockId) || 0) + 1
    );
    outgoing.set(edge.sourceBlockId, [
      ...(outgoing.get(edge.sourceBlockId) || []),
      edge,
    ]);
  }

  const byPosition = [...blocks].sort(
    (a, b) => a.position.x - b.position.x || a.position.y - b.position.y
  );
  const queue = byPosition.filter(
    (block) => incomingCounts.get(block.id) === 0
  );
  const ordered: WorkflowBlock[] = [];

  while (queue.length > 0) {
    const block = queue.shift();
    if (!block) {
      continue;
    }
    ordered.push(block);

    for (const edge of outgoing.get(block.id) || []) {
      const nextCount = (incomingCounts.get(edge.targetBlockId) || 0) - 1;
      incomingCounts.set(edge.targetBlockId, nextCount);
      if (nextCount === 0) {
        const nextBlock = byPosition.find(
          (item) => item.id === edge.targetBlockId
        );
        if (nextBlock) {
          queue.push(nextBlock);
          queue.sort(
            (a, b) => a.position.x - b.position.x || a.position.y - b.position.y
          );
        }
      }
    }
  }

  const orderedIds = new Set(ordered.map((block) => block.id));
  return [
    ...ordered,
    ...byPosition.filter((block) => !orderedIds.has(block.id)),
  ];
}

function createSkippedResult({
  block,
  message,
  runId,
  startedAt,
  toolId,
}: {
  block: WorkflowBlock;
  message: string;
  runId: string;
  startedAt: string;
  toolId: string;
}): ToolRunResult {
  const completedAt = new Date().toISOString();
  const log: ToolRunLog = {
    at: completedAt,
    id: `tool-log-${block.id}-${Date.now()}`,
    level: "warning",
    message,
  };

  return {
    blockId: block.id,
    completedAt,
    errors: [],
    evidenceRefs: [],
    logs: [log],
    output: { reason: message, skipped: true },
    runId,
    sourceTrace: [],
    startedAt,
    status: "skipped",
    toolId,
    warnings: [message],
  };
}

function getIncomingEdges({
  blockId,
  edges,
  subsetIds,
}: {
  blockId: string;
  edges: SchemaWorkflowEdge[];
  subsetIds: Set<string>;
}) {
  return edges.filter(
    (edge) =>
      edge.targetBlockId === blockId && subsetIds.has(edge.sourceBlockId)
  );
}

function createExecutionLog({
  block,
  executionId,
  index,
  result,
  startedAt,
}: {
  block: WorkflowBlock;
  executionId: string;
  index: number;
  result: ToolRunResult;
  startedAt: Date;
}): LocalExecutionLog {
  const stepStartedAt = new Date(startedAt.getTime() + index * 80);
  const completedAt = new Date(stepStartedAt.getTime() + 72);

  return {
    completedAt,
    duration: String(completedAt.getTime() - stepStartedAt.getTime()),
    error: result.errors.join("\n") || null,
    executionId,
    id: `${executionId}-${block.id}`,
    input: {
      sourceTrace: result.sourceTrace,
      toolId: result.toolId,
      upstream: result.output.upstreamBlockIds,
    },
    nodeId: block.id,
    nodeName: block.label,
    nodeType: `${block.family} / ${block.subtype}`,
    output: result,
    startedAt: stepStartedAt,
    status: toExecutionStatus(result.status),
  };
}

function createWorkflowDefinition({
  edges,
  nodes,
  workflowName,
}: {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  workflowName: string;
}) {
  return createWorkflowDefinitionFromCanvas({
    edges,
    name: workflowName || "Fiscal Workflow Studio",
    nodes,
    status: "draft",
  });
}

export function runLocalWorkflowTools({
  edges,
  mode = "workflow",
  nodes,
  selectedBlockId,
  workflowName,
}: {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  workflowName: string;
  mode?: LocalToolRunMode;
  selectedBlockId?: string | null;
}): LocalToolRunnerResult {
  const definition = createWorkflowDefinition({ edges, nodes, workflowName });
  const schemaEdges = getActiveSchemaEdges(definition);
  const executionId = makeRunId(
    mode === "workflow" ? "local-tool-workflow" : `local-tool-${mode}`
  );
  const startedAt = new Date();
  const startedAtIso = startedAt.toISOString();
  const runnableBlocks = getExecutionBlocks({
    definition,
    mode,
    selectedBlockId,
  });
  const subsetIds = new Set(runnableBlocks.map((block) => block.id));
  const orderedBlocks = orderBlocks({
    blocks: runnableBlocks,
    edges: schemaEdges,
  });
  const allResults: Record<string, ToolRunResult> = {};
  const logs: LocalExecutionLog[] = [];

  orderedBlocks.forEach((block, index) => {
    const tool = getToolForBlock(block);
    const toolId = getToolIdForBlock(block);
    const incomingEdges = getIncomingEdges({
      blockId: block.id,
      edges: schemaEdges,
      subsetIds,
    });
    const upstreamResults = incomingEdges
      .map((edge) => allResults[edge.sourceBlockId])
      .filter((upstreamResult): upstreamResult is ToolRunResult =>
        Boolean(upstreamResult)
      );
    const upstreamBlocks = incomingEdges
      .map((edge) =>
        definition.blocks.find(
          (candidate) => candidate.id === edge.sourceBlockId
        )
      )
      .filter((candidate): candidate is WorkflowBlock => Boolean(candidate));
    const missingInputs =
      block.family !== "Source" &&
      incomingEdges.length > 0 &&
      upstreamResults.length === 0;
    const resultStartedAt = new Date(
      startedAt.getTime() + index * 80
    ).toISOString();
    const result =
      !tool || missingInputs
        ? createSkippedResult({
            block,
            message: tool
              ? "Required upstream tool results were not available."
              : `No local deterministic tool is registered for ${block.family} / ${block.subtype}.`,
            runId: executionId,
            startedAt: resultStartedAt,
            toolId,
          })
        : tool.execute({
            allResults,
            block,
            config: { ...tool.defaultConfig, ...block.config, toolId },
            evidenceRefs: dedupeEvidence(
              upstreamResults.flatMap((item) => item.evidenceRefs)
            ),
            runId: executionId,
            sourceTrace: dedupeTrace(
              upstreamResults.flatMap((item) => item.sourceTrace)
            ),
            startedAt: resultStartedAt,
            upstreamBlocks,
            upstreamOutputs: Object.fromEntries(
              upstreamResults.map((item) => [item.blockId, item.output])
            ),
            upstreamResults,
            workflow: definition,
          });

    allResults[block.id] = {
      ...result,
      output: {
        bindingValidation: incomingEdges.map((edge) => ({
          bindingLabel: edge.bindingLabel,
          bindingStatus: edge.bindingStatus,
          sourceBlockId: edge.sourceBlockId,
          sourceOutputRole: edge.sourceOutputRole,
          targetInputRole: edge.targetInputRole,
        })),
        ...result.output,
        upstreamBlockIds: upstreamBlocks.map((item) => item.id),
      },
    };
    logs.push(
      createExecutionLog({
        block,
        executionId,
        index,
        result: allResults[block.id],
        startedAt,
      })
    );
  });

  const completedAt = new Date(startedAt.getTime() + logs.length * 90 + 120);
  const results = orderedBlocks
    .map((block) => allResults[block.id])
    .filter((result): result is ToolRunResult => Boolean(result));
  const edgeStatuses = Object.fromEntries(
    schemaEdges
      .map((edge) => {
        const status = getEdgeRunStatus({
          sourceResult: allResults[edge.sourceBlockId],
          targetResult: allResults[edge.targetBlockId],
        });

        return status ? [edge.id, status] : null;
      })
      .filter((entry): entry is [string, LocalEdgeRunStatus] => Boolean(entry))
  );
  const workflowStatus = getWorkflowStatus(results);
  const workflowResult: WorkflowRunResult = {
    completedAt: completedAt.toISOString(),
    errors: dedupeMessages(results.flatMap((result) => result.errors)),
    logs: results.flatMap((result) => result.logs),
    results,
    runId: executionId,
    startedAt: startedAtIso,
    status: workflowStatus,
    warnings: dedupeMessages(results.flatMap((result) => result.warnings)),
    workflowId: definition.id || LOCAL_WORKFLOW_ID,
    workflowName: definition.name,
  };
  const record: LocalRunRecord = {
    execution: {
      completedAt,
      duration: String(completedAt.getTime() - startedAt.getTime()),
      error: workflowResult.errors.join("\n") || null,
      id: executionId,
      startedAt,
      status: toWorkflowStatus(workflowStatus),
      workflowId: definition.id || LOCAL_WORKFLOW_ID,
    },
    logs,
  };

  return {
    blockStatuses: Object.fromEntries(
      results.map((result) => [
        result.blockId,
        toExecutionStatus(result.status),
      ])
    ),
    edgeStatuses,
    record,
    result: workflowResult,
  };
}
