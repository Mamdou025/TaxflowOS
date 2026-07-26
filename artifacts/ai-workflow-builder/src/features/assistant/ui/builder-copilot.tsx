

// ─────────────────────────────────────────────────────────────────────────────
// BuilderCopilot — headless per-page instrumentation for the Workflow Builder.
//
// Mounted by the builder page (inside the app-shell CopilotKit provider), it
// teaches the ambient assistant what's on the canvas and what the user has
// selected ("the thing they clicked on"), and gives it a full set of build verbs
// so the chat can command the builder end-to-end: focus/edit a block, add blocks
// from the catalog, wire them, delete, rename, load a built workflow, save, run.
// Renders nothing.
//
// GROUNDING: it also publishes the block catalog (valid block types the chat may
// add), the built workflows it can load, and a live health check (missing
// source/output, blocks not wired in) — so the model only proposes valid moves
// and can proactively surface + fix gaps.
//
// This is the Phase-4 pattern: each page registers its own useCopilotReadable
// (context) + useCopilotAction (capabilities); the follow-you-everywhere panel
// adapts for free because it reads whatever the current page published.
// ─────────────────────────────────────────────────────────────────────────────

import { useAtomValue, useSetAtom } from 'jotai';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { builderBridgeAtom } from '@/lib/builder-bridge';
import {
  BLOCK_CATALOG,
  createFapiTemplateWorkflow,
  createPortfolioWorkflowById,
  createWorkflowBlockFromCatalog,
  createWorkflowNodeFromBlock,
  getBlockCatalogItem,
  PORTFOLIO_WORKFLOWS,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from '@/shared/workflow-engine/local-fiscal-workflow';
import { getWorkflowConfig, WORKFLOW_CONFIGS } from '@/shared/workflow-engine/runtime/workflow-runs';
import { usePageChat } from '@/lib/page-chat-store';
import {
  addNodeAtom,
  connectBlocksAtom,
  currentWorkflowNameAtom,
  deleteNodeAtom,
  edgesAtom,
  focusNodeIdAtom,
  hasUnsavedChangesAtom,
  nodesAtom,
  selectedEdgeAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  updateNodeDataAtom,
  type WorkflowEdge,
  type WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';

// Config values can be huge (e.g. a source block's parsed rows). Summarize so the
// model gets shape, not a data dump.
function summarizeConfig(config: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!config) return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(config)) {
    if (Array.isArray(v)) out[k] = `[${v.length} item${v.length === 1 ? '' : 's'}]`;
    else if (v && typeof v === 'object') out[k] = '{…}';
    else if (typeof v === 'string' && v.length > 120) out[k] = `${v.slice(0, 117)}…`;
    else out[k] = v;
  }
  return out;
}

// Parse an LLM-supplied config value: JSON when it parses, otherwise the raw string.
function parseValue(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return raw; }
}

// The block types the chat may add, distilled from BLOCK_CATALOG once. `catalogId`
// is what addBlock takes. Static — the catalog doesn't change at runtime.
const CATALOG_SUMMARY = BLOCK_CATALOG.map((item) => ({
  catalogId: item.id,
  family: item.family,
  subtype: item.subtype,
  label: item.label,
  description: item.description,
}));

// The built workflows the chat can load onto the canvas (the run-config registry).
const BUILT_WORKFLOWS = Object.entries(WORKFLOW_CONFIGS).map(([id, cfg]) => ({
  workflowId: id,
  name: cfg.name,
}));

// Sinaxe portfolio blueprints — also loadable onto the canvas via loadWorkflow,
// but structural (not runnable). Canadian Corporate Tax Portfolio + Platform Services.
const PORTFOLIO_BLUEPRINTS = PORTFOLIO_WORKFLOWS.map((w) => ({
  workflowId: w.id,
  name: w.name,
  group: w.group,
  summary: w.sub,
}));

// Cheap, deterministic structural health check — grounds the chat so it can say
// "your Currency Rate block isn't wired into anything" and offer to fix it.
function computeWorkflowHealth(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const ids = new Set(nodes.map((n) => n.id));
  const inbound = new Set(edges.map((e) => e.target));
  const outbound = new Set(edges.map((e) => e.source));
  const familyCounts: Record<string, number> = {};
  const notWiredIn: Array<{ id: string; label: string }> = [];
  const noDownstream: Array<{ id: string; label: string }> = [];

  for (const n of nodes) {
    const family = n.data?.block?.family ?? 'Unknown';
    familyCounts[family] = (familyCounts[family] ?? 0) + 1;
    const label = n.data?.label ?? n.id;
    // Triggers/Sources legitimately have no input; Outputs/Review legitimately
    // have no output — everything else with a dangling side is a wiring gap.
    if (family !== 'Trigger' && family !== 'Source' && !inbound.has(n.id)) {
      notWiredIn.push({ id: n.id, label });
    }
    if (family !== 'Output' && family !== 'Review / Validation' && !outbound.has(n.id)) {
      noDownstream.push({ id: n.id, label });
    }
  }

  const danglingEdges = edges
    .filter((e) => !ids.has(e.source) || !ids.has(e.target))
    .map((e) => e.id);
  const hasSource = (familyCounts.Source ?? 0) > 0;
  const hasOutput = (familyCounts.Output ?? 0) > 0;

  const issues: string[] = [];
  if (!hasSource) issues.push('No Source block — the workflow has no evidence input.');
  if (!hasOutput) issues.push('No Output block — the workflow produces no final result.');
  for (const b of notWiredIn) issues.push(`"${b.label}" has no incoming connection (not wired into the flow).`);
  for (const b of noDownstream) issues.push(`"${b.label}" has no outgoing connection (its result feeds nothing downstream).`);
  for (const id of danglingEdges) issues.push(`Edge ${id} references a block that no longer exists.`);

  return { familyCounts, hasSource, hasOutput, notWiredIn, noDownstream, issues };
}

// Compact "workflow at a glance" card — what the builder looks like when the chat
// brings it INTO the conversation (the Page ⇄ Chat Embed). Reads the live atoms so
// it stays in sync while docked in the thread.
function WorkflowGlance() {
  const nodes = useAtomValue(nodesAtom);
  const edges = useAtomValue(edgesAtom);
  const name = useAtomValue(currentWorkflowNameAtom);
  const health = computeWorkflowHealth(nodes, edges);
  const families = Object.entries(health.familyCounts);
  return (
    <div style={{ padding: '14px 16px', color: '#27272a' }}>
      <div style={{ fontSize: 13.5, fontWeight: 650 }}>{name || 'Untitled workflow'}</div>
      <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
        {nodes.length} block{nodes.length === 1 ? '' : 's'} · {edges.length} connection{edges.length === 1 ? '' : 's'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {families.map(([fam, n]) => (
          <span key={fam} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.05)', color: '#3f3f46' }}>
            {fam} · {n}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        {health.issues.length === 0 ? (
          <div style={{ fontSize: 12, color: '#15803d' }}>✓ No structural issues.</div>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#b45309', marginBottom: 4 }}>
              {health.issues.length} issue{health.issues.length === 1 ? '' : 's'}
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#71717a', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {health.issues.slice(0, 6).map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export function BuilderCopilot() {
  const nodes = useAtomValue(nodesAtom);
  const edges = useAtomValue(edgesAtom);
  const selectedId = useAtomValue(selectedNodeAtom);
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  const unsaved = useAtomValue(hasUnsavedChangesAtom);
  const bridge = useAtomValue(builderBridgeAtom);

  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);
  const setFocusNode = useSetAtom(focusNodeIdAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const addNode = useSetAtom(addNodeAtom);
  const connectBlocks = useSetAtom(connectBlocksAtom);
  const deleteNode = useSetAtom(deleteNodeAtom);

  const blocks = nodes.map((n) => ({
    id: n.id,
    label: n.data?.label ?? n.id,
    family: n.data?.block?.family,
    subtype: n.data?.block?.subtype,
    status: n.data?.status ?? 'idle',
  }));
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const health = computeWorkflowHealth(nodes, edges);

  // The whole workflow on the canvas — name, block roster, wiring, selection.
  useCopilotReadable({
    description: 'The workflow currently open in the Workflow Builder canvas: its name, whether it has unsaved changes, every block (id, label, family, subtype, status), the connections between blocks, and which block is selected. This is what the user is building right now.',
    value: {
      workflowName,
      unsavedChanges: unsaved,
      blockCount: blocks.length,
      blocks,
      connections: edges.map((e) => ({ from: e.source, to: e.target })),
      selectedBlockId: selectedId,
    },
  });

  // The selected block ("the thing they clicked on") in full detail.
  useCopilotReadable({
    description: 'The block the user has selected/clicked in the builder, with its editable config. Null when nothing is selected. Use this to answer "what is this block / what does it do" and to edit the right block.',
    value: selectedNode
      ? {
          id: selectedNode.id,
          label: selectedNode.data?.label,
          family: selectedNode.data?.block?.family,
          subtype: selectedNode.data?.block?.subtype,
          description: selectedNode.data?.block?.description,
          status: selectedNode.data?.status,
          config: summarizeConfig(selectedNode.data?.config as Record<string, unknown> | undefined),
        }
      : 'No block is selected on the canvas.',
  });

  // GROUNDING — the valid block types the chat may add via addBlock. The model
  // must pass one of these catalogId values; families group them.
  useCopilotReadable({
    description: 'The catalog of block types that can be added to the builder with the addBlock action. Each entry has a catalogId (pass this to addBlock), family, subtype, label and description. Only these catalogIds are valid.',
    value: CATALOG_SUMMARY,
  });

  // GROUNDING — the pre-built (runnable) workflows the chat can open with loadWorkflow.
  useCopilotReadable({
    description: 'The pre-built RUNNABLE workflows that can be opened onto the canvas with the loadWorkflow action, by workflowId (fapi, roulement, expense, campaign). Loading one replaces whatever is currently open.',
    value: BUILT_WORKFLOWS,
  });

  // GROUNDING — the Sinaxe portfolio blueprints, also loadable via loadWorkflow.
  useCopilotReadable({
    description: 'The Sinaxe portfolio blueprints (Canadian Corporate Tax Workflow Portfolio + Platform Services) that can ALSO be opened onto the canvas with loadWorkflow, by workflowId (e.g. "pf-t1134", "pf-scope-service"). These are structural, editable templates — not runnable. Loading one replaces whatever is open.',
    value: PORTFOLIO_BLUEPRINTS,
  });

  // GROUNDING — live health/validation so the chat can flag + fix gaps proactively.
  useCopilotReadable({
    description: "A live validation check of the open workflow: family counts, whether it has a Source and an Output, which blocks are not wired in / feed nothing downstream, and a human-readable list of issues. Use this to proactively tell the user what's incomplete and offer to fix it.",
    value: health,
  });

  // ── Page ⇄ Chat surface ──────────────────────────────────────────────────────
  // Opt the builder into the general contract: the chat can COMMAND it (checkHealth
  // / listBlocks, dispatched via commandPage) and BRING IT INTO the chat (the
  // WorkflowGlance Embed). The bespoke actions below stay the fine-grained edit
  // path; this is the uniform, discoverable page-level surface. Rebuilt only when
  // the workflow's structure/name changes (sig), so the chat hook stays quiet.
  const sig =
    nodes.map((n) => `${n.id}:${n.data?.label}:${n.data?.block?.family}`).join('|') +
    '#' + edges.map((e) => `${e.source}>${e.target}`).join('|');
  usePageChat(
    {
      pageKey: 'workflow-builder',
      title: 'Workflow Builder',
      context: {
        workflowName,
        blockCount: blocks.length,
        connectionCount: edges.length,
        familyCounts: health.familyCounts,
        issues: health.issues,
      },
      commands: [
        {
          id: 'checkHealth',
          label: 'Check workflow health',
          description: 'Return the structural issues in the open workflow (missing Source/Output, blocks not wired in or feeding nothing).',
          run: () =>
            health.issues.length
              ? `Found ${health.issues.length} issue(s):\n- ${health.issues.join('\n- ')}`
              : 'No structural issues — the workflow looks well-formed.',
        },
        {
          id: 'listBlocks',
          label: 'List blocks',
          description: 'List every block on the canvas with its id, family and subtype.',
          run: () =>
            blocks.length
              ? blocks.map((b) => `${b.label} [${b.id}] — ${b.family} / ${b.subtype}`).join('\n')
              : 'The canvas is empty.',
        },
      ],
      Embed: WorkflowGlance,
    },
    [workflowName, sig, blocks.length, edges.length, health.issues.length]
  );

  // ── Actions ──────────────────────────────────────────────────────────────────

  // Select + scroll to + highlight a block by id.
  useCopilotAction({
    name: 'focusBlock',
    description: 'Select a block on the builder canvas and scroll to + center + highlight it. Use when the user wants to go to / look at / work on a specific block. blockId must be one of the block ids from the builder-workflow context.',
    followUp: false,
    parameters: [{ name: 'blockId', type: 'string', description: 'the block id to focus', required: true }],
    handler: async ({ blockId }: { blockId: string }) => {
      const node = nodes.find((n) => n.id === blockId);
      if (!node) return `No block "${blockId}" on the canvas.`;
      setSelectedNode(blockId);
      setFocusNode(blockId);
      return `Focused ${node.data?.label ?? blockId}.`;
    },
  });

  // Edit one config value on a block (merges into node.data.config, same path as
  // the inspector → autosaves + re-flows the engine).
  useCopilotAction({
    name: 'editBlockConfig',
    description: 'Change one configuration value on a builder block. Use for "set the FX rate on the currency block to 1.5", "rename this block", etc. value is parsed as JSON when possible (numbers/booleans/objects), else kept as text. blockId + key must exist in the builder context.',
    followUp: false,
    parameters: [
      { name: 'blockId', type: 'string', description: 'the block id to edit', required: true },
      { name: 'key', type: 'string', description: 'the config key to set (e.g. "overrideRate", "label")', required: true },
      { name: 'value', type: 'string', description: 'the new value (JSON-encoded where applicable)', required: true },
    ],
    handler: async ({ blockId, key, value }: { blockId: string; key: string; value: string }) => {
      const node = nodes.find((n) => n.id === blockId);
      if (!node) return `No block "${blockId}" on the canvas.`;
      const parsed = parseValue(value);
      // "label" lives on node.data directly; everything else is a config key.
      if (key === 'label') {
        updateNodeData({ id: blockId, data: { label: String(parsed) } });
      } else {
        updateNodeData({ id: blockId, data: { config: { ...(node.data?.config ?? {}), [key]: parsed } } });
      }
      setSelectedNode(blockId);
      setFocusNode(blockId);
      return `Set ${key} = ${JSON.stringify(parsed)} on ${node.data?.label ?? blockId}.`;
    },
  });

  // Add a new block from the catalog onto the canvas.
  useCopilotAction({
    name: 'addBlock',
    description: 'Add a new block to the builder canvas from the catalog. catalogId MUST be one of the catalogId values in the block-catalog context (e.g. "source:currency-rate", "logic:transformation", "output:canonical-json"). Optionally give it a label. Returns the new block id — use it with connectBlocks to wire it in.',
    followUp: false,
    parameters: [
      { name: 'catalogId', type: 'string', description: 'catalog id of the block type to add (from the block-catalog context)', required: true },
      { name: 'label', type: 'string', description: 'optional custom label for the block', required: false },
    ],
    handler: async ({ catalogId, label }: { catalogId: string; label?: string }) => {
      if (!getBlockCatalogItem(catalogId)) {
        return `"${catalogId}" is not a valid catalogId. Pick one from the block-catalog context (e.g. "source:currency-rate", "logic:transformation").`;
      }
      const maxX = nodes.length ? Math.max(...nodes.map((n) => n.position?.x ?? 0)) : 0;
      const baseY = nodes[0]?.position?.y ?? 160;
      const id = nanoid();
      const block = createWorkflowBlockFromCatalog(catalogId, {
        id,
        label,
        position: { x: maxX + 320, y: baseY + (nodes.length % 4) * 90 },
      });
      addNode(createWorkflowNodeFromBlock(block, { selected: true }));
      setSelectedNode(id);
      setFocusNode(id);
      setHasUnsavedChanges(true);
      return `Added ${block.label} (${block.family} / ${block.subtype}) as block "${id}". Wire it in with connectBlocks.`;
    },
  });

  // Connect two blocks (creates an edge source → target).
  useCopilotAction({
    name: 'connectBlocks',
    description: 'Wire one block into another by creating a connection from sourceBlockId to targetBlockId (data flows source → target). Both ids must exist on the canvas (see the builder-workflow context).',
    followUp: false,
    parameters: [
      { name: 'sourceBlockId', type: 'string', description: 'the upstream block the connection comes FROM', required: true },
      { name: 'targetBlockId', type: 'string', description: 'the downstream block the connection goes TO', required: true },
    ],
    handler: async ({ sourceBlockId, targetBlockId }: { sourceBlockId: string; targetBlockId: string }) => {
      if (sourceBlockId === targetBlockId) return 'A block cannot be connected to itself.';
      const source = nodes.find((n) => n.id === sourceBlockId);
      const target = nodes.find((n) => n.id === targetBlockId);
      if (!source) return `No block "${sourceBlockId}" on the canvas.`;
      if (!target) return `No block "${targetBlockId}" on the canvas.`;
      if (edges.some((e) => e.source === sourceBlockId && e.target === targetBlockId)) {
        return `${source.data?.label ?? sourceBlockId} is already connected to ${target.data?.label ?? targetBlockId}.`;
      }
      connectBlocks({ source: sourceBlockId, target: targetBlockId });
      setHasUnsavedChanges(true);
      return `Connected ${source.data?.label ?? sourceBlockId} → ${target.data?.label ?? targetBlockId}.`;
    },
  });

  // Delete a block (Source evidence is protected, mirroring the studio's rule).
  useCopilotAction({
    name: 'deleteBlock',
    description: 'Delete a block from the canvas by id (also removes its connections). Source blocks are read-only evidence and cannot be deleted — add downstream Logic to correct them instead.',
    followUp: false,
    parameters: [{ name: 'blockId', type: 'string', description: 'the block id to delete', required: true }],
    handler: async ({ blockId }: { blockId: string }) => {
      const node = nodes.find((n) => n.id === blockId);
      if (!node) return `No block "${blockId}" on the canvas.`;
      if (node.data?.block?.family === 'Source') {
        return `"${node.data?.label ?? blockId}" is a Source (read-only evidence) and cannot be deleted. Add downstream Logic to correct or reinterpret it instead.`;
      }
      deleteNode(blockId);
      setHasUnsavedChanges(true);
      return `Deleted ${node.data?.label ?? blockId}.`;
    },
  });

  // Rename the whole workflow.
  useCopilotAction({
    name: 'renameWorkflow',
    description: 'Rename the workflow currently open in the builder.',
    followUp: false,
    parameters: [{ name: 'name', type: 'string', description: 'the new workflow name', required: true }],
    handler: async ({ name }: { name: string }) => {
      const trimmed = name.trim();
      if (!trimmed) return 'Workflow name cannot be empty.';
      setCurrentWorkflowName(trimmed);
      setHasUnsavedChanges(true);
      return `Renamed the workflow to "${trimmed}".`;
    },
  });

  // Load a pre-built workflow onto the canvas (replaces what's open).
  useCopilotAction({
    name: 'loadWorkflow',
    description: 'Open a pre-built workflow OR a Sinaxe portfolio blueprint onto the builder canvas, replacing whatever is currently open. workflowId is either a runnable id ("fapi", "roulement", "expense", "campaign") or a blueprint id from the portfolio-blueprints context (e.g. "pf-t1134", "pf-scope-service", "pf-eifel").',
    followUp: false,
    parameters: [{ name: 'workflowId', type: 'string', description: 'id of the workflow or blueprint to open', required: true }],
    handler: async ({ workflowId }: { workflowId: string }) => {
      const cfg = getWorkflowConfig(workflowId);
      const snapshot = (cfg
        ? cfg.buildSnapshot()
        : createPortfolioWorkflowById(workflowId)) as ReturnType<typeof createFapiTemplateWorkflow> | null;
      if (!snapshot) {
        return `"${workflowId}" is not a known workflow. Runnable: ${BUILT_WORKFLOWS.map((w) => w.workflowId).join(', ')}. Blueprints: ${PORTFOLIO_BLUEPRINTS.map((w) => w.workflowId).join(', ')}.`;
      }
      const canvas = workflowDefinitionToCanvas(snapshot);
      const selected = canvas.nodes.find((n) => n.selected) || canvas.nodes[0];
      setNodes(
        canvas.nodes.map((node) => ({
          ...node,
          selected: selected ? node.id === selected.id : false,
          data: { ...node.data, status: 'idle' as const },
        }))
      );
      setEdges(canvas.edges);
      setCurrentWorkflowName(snapshot.name);
      setSelectedNode(selected?.id ?? null);
      setSelectedEdge(null);
      setSelectedExecutionId(null);
      setHasUnsavedChanges(false);
      saveWorkflowDefinitionSnapshot(snapshot);
      toast.success(`Opened ${snapshot.name}`);
      return `Opened "${snapshot.name}" (${canvas.nodes.length} blocks) on the canvas.`;
    },
  });

  // Save the current draft.
  useCopilotAction({
    name: 'saveWorkflow',
    description: 'Save the workflow currently open in the builder (persists the local draft).',
    followUp: false,
    parameters: [],
    handler: async () => {
      if (!bridge) return "The builder isn't ready yet — try again in a moment.";
      bridge.save();
      return 'Saved the workflow.';
    },
  });

  // Run the current workflow. NB: named distinctly from the chat's `runWorkflow`
  // (use-assistant) — both register on /builder (docked panel + this), and two
  // CopilotKit actions sharing a name collide, one silently shadowing the other.
  useCopilotAction({
    name: 'runBuilderWorkflow',
    description: 'Run/execute the workflow currently open in the visual builder canvas (no arguments — it runs whatever is on the canvas). For running a NAMED workflow from the chat, use runWorkflow instead.',
    followUp: false,
    parameters: [],
    handler: async () => {
      if (!bridge) return "The builder isn't ready yet — try again in a moment.";
      if (bridge.isExecuting) return 'The workflow is already running.';
      bridge.run();
      return 'Started the workflow run.';
    },
  });

  return null;
}
