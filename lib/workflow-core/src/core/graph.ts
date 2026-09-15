import type {
  LocalExecutionLog,
  LocalRunRecord,
  LocalWorkflowExecution,
  WorkflowEdge as SchemaWorkflowEdge,
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type {
  EvidenceRef,
  SourceTraceRef,
  ToolRunLog,
  ToolRunResult,
  ToolRunStatus,
  WorkflowRunResult,
} from '@workspace/workflow-contracts/tool-types';
import type {
  LocalEdgeRunStatus,
  LocalToolRunnerResult,
} from '@workspace/workflow-contracts/execution-result';
import type { GraphRequest, GraphRuntime, LocalToolRunMode } from './ports';
import { createWorkflowEdgeRecord } from './edges';
import { presentToolOutput } from './outputs';
function toExecutionStatus(status: ToolRunStatus): 'error' | 'success' {
  return status === 'error' ? 'error' : 'success';
}

function toWorkflowStatus(status: ToolRunStatus): LocalWorkflowExecution['status'] {
  return status === 'error' ? 'error' : 'success';
}

function getWorkflowStatus(results: ToolRunResult[]): ToolRunStatus {
  if (results.some((result) => result.status === 'error')) {
    return 'error';
  }
  if (results.some((result) => result.status === 'needs_review')) {
    return 'needs_review';
  }
  if (results.some((result) => result.status === 'warning')) {
    return 'warning';
  }
  if (results.some((result) => result.status === 'skipped')) {
    return 'warning';
  }
  return 'success';
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

  if (sourceResult.status === 'error' || targetResult.status === 'error') {
    return 'error';
  }

  if (
    sourceResult.status === 'needs_review' ||
    sourceResult.status === 'warning' ||
    sourceResult.status === 'skipped' ||
    targetResult.status === 'needs_review' ||
    targetResult.status === 'warning' ||
    targetResult.status === 'skipped'
  ) {
    return 'warning';
  }

  return 'success';
}

function dedupeEvidence(refs: EvidenceRef[]): EvidenceRef[] {
  return [...new Map(refs.map((ref) => [ref.evidenceId, ref])).values()];
}

function dedupeTrace(refs: SourceTraceRef[]): SourceTraceRef[] {
  return [
    ...new Map(
      refs.map((ref) => [
        `${ref.sourceBlockId}:${ref.rowId || ''}:${ref.evidenceRefId || ''}`,
        ref,
      ]),
    ).values(),
  ];
}

function getActiveSchemaEdges(definition: WorkflowDefinition) {
  return definition.edges.filter((edge) => edge.status === 'active');
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
      if (ancestors.has(edge.targetBlockId) && !ancestors.has(edge.sourceBlockId)) {
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
      if (descendants.has(edge.sourceBlockId) && !descendants.has(edge.targetBlockId)) {
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
  if (mode === 'isolated') {
    return definition.blocks.filter((block) => block.id === selectedBlockId);
  }
  if (mode === 'selected' && selectedBlockId) {
    const ancestors = collectAncestorBlockIds({
      blockId: selectedBlockId,
      edges: getActiveSchemaEdges(definition),
    });
    return definition.blocks.filter((block) => ancestors.has(block.id));
  }

  if (mode === 'downstream' && selectedBlockId) {
    const activeEdges = getActiveSchemaEdges(definition);
    const ancestors = collectAncestorBlockIds({
      blockId: selectedBlockId,
      edges: activeEdges,
    });
    const descendants = collectDescendantBlockIds({
      blockId: selectedBlockId,
      edges: activeEdges,
    });
    for (const id of descendants)
      for (const ancestor of collectAncestorBlockIds({ blockId: id, edges: activeEdges }))
        ancestors.add(ancestor);
    return definition.blocks.filter(
      (block) => ancestors.has(block.id) || descendants.has(block.id),
    );
  }

  return definition.blocks;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Kahn ordering is kept explicit for this local runner.
function orderBlocks({ blocks, edges }: { blocks: WorkflowBlock[]; edges: SchemaWorkflowEdge[] }) {
  const blockIds = new Set(blocks.map((block) => block.id));
  const incomingCounts = new Map(blocks.map((block) => [block.id, 0]));
  const outgoing = new Map<string, SchemaWorkflowEdge[]>();

  for (const edge of edges) {
    if (!(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId))) {
      continue;
    }
    incomingCounts.set(edge.targetBlockId, (incomingCounts.get(edge.targetBlockId) || 0) + 1);
    outgoing.set(edge.sourceBlockId, [...(outgoing.get(edge.sourceBlockId) || []), edge]);
  }

  const byPosition = [...blocks].sort(
    (a, b) => a.position.x - b.position.x || a.position.y - b.position.y,
  );
  const queue = byPosition.filter((block) => incomingCounts.get(block.id) === 0);
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
        const nextBlock = byPosition.find((item) => item.id === edge.targetBlockId);
        if (nextBlock) {
          queue.push(nextBlock);
          queue.sort((a, b) => a.position.x - b.position.x || a.position.y - b.position.y);
        }
      }
    }
  }

  if (ordered.length !== blocks.length)
    throw new Error('The workflow graph contains a cycle. Resolve it before running.');
  return ordered;
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
  const completedAt = startedAt;
  const log: ToolRunLog = {
    at: completedAt,
    id: `${runId}-${block.id}-skipped`,
    level: 'warning',
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
    status: 'skipped',
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
    (edge) => edge.targetBlockId === blockId && subsetIds.has(edge.sourceBlockId),
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
  const stepStartedAt = new Date(result.startedAt);
  const completedAt = new Date(result.completedAt);

  return {
    completedAt,
    duration: String(completedAt.getTime() - stepStartedAt.getTime()),
    error: result.errors.join('\n') || null,
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

export function executeGraph(input: GraphRequest, runtime: GraphRuntime): LocalToolRunnerResult {
  const {
    mode = 'workflow',
    selectedBlockId,
    isolatedInputs = [],
    testInputSource = 'none',
    configSignatures = {},
  } = input;
  const definition = structuredClone(input.definition);
  const now = runtime.now ?? (() => new Date());
  const getToolIdForBlock = runtime.resolveToolId;
  const getToolForBlock = (block: WorkflowBlock) => runtime.getTool(getToolIdForBlock(block));
  if (
    mode !== 'workflow' &&
    (!selectedBlockId || !definition.blocks.some((block) => block.id === selectedBlockId))
  )
    throw new Error('Select an existing block for a partial workflow run.');
  if (mode === 'isolated' && selectedBlockId) {
    const ids = new Set<string>();
    for (const input of isolatedInputs) {
      if (
        input.block.id === selectedBlockId ||
        input.result.blockId !== input.block.id ||
        ids.has(input.block.id)
      )
        throw new Error('Each test input must have a distinct source.');
      ids.add(input.block.id);
      if (!definition.blocks.some((block) => block.id === input.block.id))
        definition.blocks.push(input.block);
      if (
        !definition.edges.some(
          (edge) =>
            edge.status === 'active' &&
            edge.sourceBlockId === input.block.id &&
            edge.targetBlockId === selectedBlockId,
        )
      )
        definition.edges.push(
          createWorkflowEdgeRecord({
            id: `test-input-${input.block.id}`,
            sourceBlockId: input.block.id,
            targetBlockId: selectedBlockId,
            bindingLabel: input.block.label,
            reason: 'Input supplied for an isolated block test',
            createdAt: now().toISOString(),
          }),
        );
    }
  }
  const schemaEdges = getActiveSchemaEdges(definition);
  const executionId = runtime.createId(
    mode === 'workflow' ? 'local-tool-workflow' : `local-tool-${mode}`,
  );
  const startedAt = now();
  const startedAtIso = startedAt.toISOString();
  const runnableBlocks = getExecutionBlocks({
    definition,
    mode,
    selectedBlockId,
  });
  const subsetIds = new Set(runnableBlocks.map((block) => block.id));
  if (!runnableBlocks.length) throw new Error('The workflow has no blocks to execute.');
  if (new Set(definition.blocks.map((block) => block.id)).size !== definition.blocks.length)
    throw new Error('Workflow block IDs must be unique.');
  if (new Set(schemaEdges.map((edge) => edge.id)).size !== schemaEdges.length)
    throw new Error('Workflow edge IDs must be unique.');
  if (mode !== 'isolated') {
    const allIds = new Set(definition.blocks.map((block) => block.id));
    for (const edge of schemaEdges) {
      if (
        (mode === 'workflow' ||
          subsetIds.has(edge.targetBlockId) ||
          (mode === 'downstream' && subsetIds.has(edge.sourceBlockId))) &&
        (!allIds.has(edge.sourceBlockId) || !allIds.has(edge.targetBlockId))
      )
        throw new Error(`Workflow edge '${edge.id}' references a missing block.`);
    }
  }
  if (mode === 'isolated') for (const input of isolatedInputs) subsetIds.add(input.block.id);
  const orderedBlocks = orderBlocks({
    blocks: runnableBlocks,
    edges: schemaEdges,
  });
  const allResults: Record<string, ToolRunResult> = {};
  if (mode === 'isolated')
    for (const input of isolatedInputs) allResults[input.block.id] = input.result;
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
      .filter((upstreamResult): upstreamResult is ToolRunResult => Boolean(upstreamResult));
    const upstreamBlocks = incomingEdges
      .map((edge) => definition.blocks.find((candidate) => candidate.id === edge.sourceBlockId))
      .filter((candidate): candidate is WorkflowBlock => Boolean(candidate));
    const resultStartedAt = now().toISOString();
    const missingNumbers =
      tool?.toolGroup === 'calculation' &&
      toolId !== 'logic.calculation_engine' &&
      // Workpapers validate their own named business fields; many have no amount column.
      toolId !== 'logic.portfolio_workpaper' &&
      upstreamResults.some((item) =>
        ['rows', 'mappedRows', 'selectedRows'].some(
          (key) =>
            Array.isArray(item.output[key]) &&
            ((item.output[key] as unknown[]).length === 0 ||
              (item.output[key] as Record<string, unknown>[]).some(
                (row) => typeof row.amount !== 'number' || !Number.isFinite(row.amount),
              )),
        ),
      );
    const upstreamFailed = upstreamResults.some(
      (item) => item.status === 'error' || item.status === 'skipped',
    );
    const blockedMessage = missingNumbers
      ? 'A preceding record has no numerical value. Choose a number field or enter example numbers to test this calculation.'
      : upstreamFailed
        ? 'A preceding block could not execute. Resolve its message and test again.'
        : null;
    const result = blockedMessage
      ? {
          ...createSkippedResult({
            block,
            message: blockedMessage,
            runId: executionId,
            startedAt: resultStartedAt,
            toolId,
          }),
          status: 'error' as const,
          errors: [blockedMessage],
        }
      : !tool
        ? createSkippedResult({
            block,
            message: `No local deterministic tool is registered for ${block.family} / ${block.subtype}.`,
            runId: executionId,
            startedAt: resultStartedAt,
            toolId,
          })
        : tool.execute({
            allResults,
            block,
            config: { ...tool.defaultConfig, ...block.config, toolId },
            evidenceRefs: dedupeEvidence(upstreamResults.flatMap((item) => item.evidenceRefs)),
            runId: executionId,
            sourceTrace: dedupeTrace(upstreamResults.flatMap((item) => item.sourceTrace)),
            startedAt: resultStartedAt,
            upstreamBlocks,
            upstreamOutputs: Object.fromEntries(
              upstreamResults.map((item) => [item.blockId, item.output]),
            ),
            upstreamResults,
            workflow: definition,
          });

    allResults[block.id] = {
      ...result,
      ...(mode === 'isolated'
        ? { blockTest: { mode: 'isolated' as const, inputs: testInputSource } }
        : {}),
      // Compare against the editable settings, before canvas conversion adds UI metadata.
      configSignature: configSignatures[block.id] ?? JSON.stringify(block.config),
      inputTransfers: incomingEdges.flatMap((edge) => {
        const sourceResult = allResults[edge.sourceBlockId];
        if (!sourceResult) return [];
        return [
          {
            edgeId: edge.id,
            sourceBlockId: edge.sourceBlockId,
            sourceLabel:
              upstreamBlocks.find((source) => source.id === edge.sourceBlockId)?.label ??
              edge.sourceBlockId,
            sourceOutputRole: edge.sourceOutputRole,
            targetInputRole: edge.targetInputRole,
            delivered: result.status !== 'skipped',
            output: sourceResult.output,
          },
        ];
      }),
      input: Object.fromEntries(
        upstreamResults.map((item) => [
          upstreamBlocks.find((source) => source.id === item.blockId)?.label ?? item.blockId,
          presentToolOutput(
            item,
            upstreamBlocks.find((source) => source.id === item.blockId),
            runtime,
          ),
        ]),
      ),
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
      }),
    );
  });

  const completedAt = now();
  const results = orderedBlocks
    .map((block) => allResults[block.id])
    .filter((result): result is ToolRunResult => Boolean(result));
  const edgeStatuses = Object.fromEntries(
    (mode === 'isolated' ? [] : schemaEdges)
      .map((edge) => {
        const status = getEdgeRunStatus({
          sourceResult: allResults[edge.sourceBlockId],
          targetResult: allResults[edge.targetBlockId],
        });

        return status ? [edge.id, status] : null;
      })
      .filter((entry): entry is [string, LocalEdgeRunStatus] => Boolean(entry)),
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
    workflowId: definition.id,
    workflowName: definition.name,
  };
  const record: LocalRunRecord = {
    execution: {
      completedAt,
      duration: String(completedAt.getTime() - startedAt.getTime()),
      error: workflowResult.errors.join('\n') || null,
      id: executionId,
      startedAt,
      status: toWorkflowStatus(workflowStatus),
      workflowId: definition.id,
    },
    logs,
  };

  return {
    blockStatuses: Object.fromEntries(
      results.map((result) => [result.blockId, toExecutionStatus(result.status)]),
    ),
    edgeStatuses,
    record,
    result: workflowResult,
  };
}
