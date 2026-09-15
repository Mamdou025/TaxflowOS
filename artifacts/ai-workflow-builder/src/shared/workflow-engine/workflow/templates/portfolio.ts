import {
  getPortfolioWorkflowDef,
  type PortfolioWorkflowDef,
} from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import {
  type LocalWorkflowSnapshot,
  SAMPLE_CREATED_AT,
  type WorkflowRelationshipType,
  LOCAL_WORKFLOW_ID,
  type WorkflowVersionSnapshot,
  SYSTEM_USER,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
} from '../contracts';
import { createWorkflowBlockFromCatalog } from '../block-factory';
import { cloneJson, createWorkflowEvent } from '../events';
import { createWorkflowEdgeRecord } from '../edges';
import { getWorkflowStructure } from '../canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from '../runtime-ui';
import { getSampleBlockRuns } from './fapi-sample-data';

// ─────────────────────────────────────────────────────────────────────────────
// Sinaxe portfolio workflows — generic builder.
//
// Turns any declarative `PortfolioWorkflowDef` (Tier-1 / Foundation portfolio
// workflows + Platform Services, see templates/portfolio/portfolio-workflows.ts)
// into a LocalWorkflowSnapshot the builder can load, edit and save — reusing the
// exact same snapshot pipeline as the FAPI / Roulement templates. One function
// serves all portfolio workflows; block ids are prefixed with the workflow id so
// every id is globally unique, and positions derive from stage (column) + row.
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_COL_WIDTH = 340;

const PORTFOLIO_ROW_HEIGHT = 150;

export function createPortfolioWorkflow(def: PortfolioWorkflowDef): LocalWorkflowSnapshot {
  const nid = (localId: string) => `${def.id}--${localId}`;

  const blocks = def.blocks.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config ?? {}) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: nid(spec.id),
      label: spec.label,
      position: {
        x: spec.stage * PORTFOLIO_COL_WIDTH,
        y: spec.row * PORTFOLIO_ROW_HEIGHT,
      },
      sample: true,
      status: 'configured',
      updatedAt: SAMPLE_CREATED_AT,
    }),
  );

  const edges = def.edges.map((spec, index) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.label,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `${def.id}--edge-${index}-${spec.from}-${spec.to}`,
      reason: spec.reason || spec.label,
      relationshipType: spec.rel ?? 'provides_data_to',
      sourceBlockId: nid(spec.from),
      sourceOutputRole: spec.fromRole,
      targetBlockId: nid(spec.to),
      targetInputRole: spec.toRole,
    }),
  );

  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((block) => block.id),
    blocks: cloneJson(blocks),
    changeSummary: `${def.name} — Sinaxe portfolio workflow initialized.`,
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((edge) => edge.id),
    edges: cloneJson(edges),
    id: `version-${def.id}-v1`,
    label: `${def.name} v1`,
    mockRuns: cloneJson(mockRuns),
    notes:
      'Sinaxe portfolio blueprint — Trigger → Sources → AI/Logic → judgment checkpoints → Field → Output, mapped from the Canadian Corporate Tax Workflow Portfolio.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: def.name,
  };

  return {
    aiProposals: [],
    blocks,
    description: def.description,
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: `${def.name} initialized.`,
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'Sinaxe portfolio blueprint. No live OCR, AI, form-generation or backend integration is included — blocks depict the standardized workflow structure.',
      sampleWorkflow: {
        description: def.description,
        id: def.id,
        label: def.name,
      },
      tags: ['local', 'sinaxe-portfolio', def.group, def.id],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: def.name,
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

/** Build a portfolio workflow by id (returns null for an unknown id). */
export function createPortfolioWorkflowById(id: string): LocalWorkflowSnapshot | null {
  const def = getPortfolioWorkflowDef(id);
  return def ? createPortfolioWorkflow(def) : null;
}

/** A blank starter workflow — a single Start trigger — for "New workflow". */
const BLANK_WORKFLOW_DEF: PortfolioWorkflowDef = {
  id: 'new-workflow',
  name: 'New workflow',
  description: 'A blank workflow — add blocks in Build to define it.',
  group: 'foundation',
  sub: 'New',
  blocks: [
    {
      catalogId: 'trigger:manual',
      id: 'start',
      label: 'Start',
      description: 'Manual start of the workflow',
      stage: 0,
      row: 0,
    },
  ],
  edges: [],
};

export function createBlankWorkflow(): LocalWorkflowSnapshot {
  return createPortfolioWorkflow(BLANK_WORKFLOW_DEF);
}
