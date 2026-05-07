import type {
  WorkflowBlock,
  WorkflowDefinition,
  WorkflowEdge,
} from "@/lib/local-fiscal-workflow";

// Canvas owns graph editing, inspector owns formulas/code/configuration, and
// Structure owns this generated runtime worksheet view. Keep this module pure so
// the rendered Structure tree cannot become a duplicate calculation editor.
export type StructureViewRow = {
  block: WorkflowBlock;
  children: StructureViewRow[];
  edge?: WorkflowEdge;
  inferred?: boolean;
};

export type StructureSourceTrace = {
  edges: WorkflowEdge[];
  path: WorkflowBlock[];
  source: WorkflowBlock;
};

const FAMILY_ORDER: WorkflowBlock["family"][] = [
  "Output",
  "Protected",
  "Review / Validation",
  "Logic",
  "AI / Agent",
  "Source",
];

function getBlockMap(definition: WorkflowDefinition) {
  return new Map(definition.blocks.map((block) => [block.id, block]));
}

function getIncomingEdges(definition: WorkflowDefinition) {
  const incoming = new Map<string, WorkflowEdge[]>();
  for (const edge of definition.edges) {
    const current = incoming.get(edge.targetBlockId) || [];
    current.push(edge);
    incoming.set(edge.targetBlockId, current);
  }
  return incoming;
}

export function sortStructureBlocksForWorksheet(blocks: WorkflowBlock[]) {
  return [...blocks].sort((a, b) => {
    const familyDelta =
      FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family);
    if (familyDelta !== 0) {
      return familyDelta;
    }
    return a.position.y - b.position.y || a.position.x - b.position.x;
  });
}

function buildUpstreamRows({
  block,
  blockMap,
  depth = 0,
  incoming,
  visited,
}: {
  block: WorkflowBlock;
  blockMap: Map<string, WorkflowBlock>;
  depth?: number;
  incoming: Map<string, WorkflowEdge[]>;
  visited: Set<string>;
}): StructureViewRow[] {
  if (depth > 7 || visited.has(block.id)) {
    return [];
  }

  const nextVisited = new Set(visited).add(block.id);
  const upstream = incoming
    .get(block.id)
    ?.map((edge) => ({
      block: blockMap.get(edge.sourceBlockId),
      edge,
    }))
    .filter((item): item is { block: WorkflowBlock; edge: WorkflowEdge } =>
      Boolean(item.block)
    );

  return sortStructureBlocksForWorksheet(
    upstream?.map((item) => item.block) || []
  ).map((childBlock) => {
    const edge = upstream?.find(
      (item) => item.block.id === childBlock.id
    )?.edge;
    return {
      block: childBlock,
      children:
        childBlock.family === "Source"
          ? []
          : buildUpstreamRows({
              block: childBlock,
              blockMap,
              depth: depth + 1,
              incoming,
              visited: nextVisited,
            }),
      edge,
    };
  });
}

export function generateStructureView(
  definition: WorkflowDefinition
): StructureViewRow[] {
  const blockMap = getBlockMap(definition);
  const incoming = getIncomingEdges(definition);
  const outputs = sortStructureBlocksForWorksheet(
    definition.blocks.filter((block) => block.family === "Output")
  );
  const protectedSummary = sortStructureBlocksForWorksheet(
    definition.blocks.filter(
      (block) =>
        block.family === "Protected" &&
        (block.subtype === "Final Reviewed Amount" ||
          block.subtype === "Protected Result")
    )
  );
  let roots = outputs;
  if (roots.length === 0) {
    roots =
      protectedSummary.length > 0
        ? protectedSummary
        : sortStructureBlocksForWorksheet(
            definition.blocks.filter((block) => block.family !== "Source")
          );
  }

  return roots.map((root) => {
    const upstreamRows = buildUpstreamRows({
      block: root,
      blockMap,
      incoming,
      visited: new Set(),
    });
    const protectedChildren =
      root.family === "Output"
        ? protectedSummary.map((block) => ({
            block,
            children: buildUpstreamRows({
              block,
              blockMap,
              incoming,
              visited: new Set([root.id]),
            }),
            inferred: true,
          }))
        : [];

    return {
      block: root,
      children: [...protectedChildren, ...upstreamRows],
    };
  });
}

export function collectStructureSourceTraces(
  definition: WorkflowDefinition,
  block: WorkflowBlock
): StructureSourceTrace[] {
  const blockMap = getBlockMap(definition);
  const incoming = getIncomingEdges(definition);
  const traces: StructureSourceTrace[] = [];

  function visit(
    current: WorkflowBlock,
    path: WorkflowBlock[],
    edgePath: WorkflowEdge[]
  ) {
    if (current.family === "Source") {
      traces.push({ edges: edgePath, path, source: current });
      return;
    }

    for (const edge of incoming.get(current.id) || []) {
      const source = blockMap.get(edge.sourceBlockId);
      if (source && !path.some((item) => item.id === source.id)) {
        visit(source, [...path, source], [...edgePath, edge]);
      }
    }
  }

  visit(block, [block], []);
  return traces;
}

export function getSelectedStructureBlock(
  definition: WorkflowDefinition,
  selectedBlockId: string | null
): WorkflowBlock | null {
  return (
    definition.blocks.find((block) => block.id === selectedBlockId) ||
    definition.blocks[0] ||
    null
  );
}

export function canEditStructureRow(row: StructureViewRow) {
  return row.block.family !== "Source";
}

export function getStructureUpstreamBlocks(
  definition: WorkflowDefinition,
  block: WorkflowBlock
): WorkflowBlock[] {
  const incoming = getIncomingEdges(definition);
  const blockMap = getBlockMap(definition);
  return (incoming.get(block.id) || [])
    .map((edge) => blockMap.get(edge.sourceBlockId))
    .filter((candidate): candidate is WorkflowBlock => Boolean(candidate));
}
