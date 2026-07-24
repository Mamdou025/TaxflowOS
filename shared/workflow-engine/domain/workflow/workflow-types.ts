import type {
  BlockFamily,
  BlockRunStatus,
  BlockStatus,
  BlockSubtype,
  WorkflowDefinitionStatus,
} from "./block-types";
import type {
  EdgeBindingStatus,
  EdgeStatus,
  WorkflowEdgeHistoryEntry,
  WorkflowRelationshipType,
} from "./edge-types";
import type { ProtectedKind } from "./protected-rules";

export const WORKFLOW_SCHEMA_VERSION = "workflow-studio.local.v1";

export type AiProposalStatus = "proposed" | "approved" | "rejected";

export const AI_PROPOSAL_STATUS_VALUES = [
  "proposed",
  "approved",
  "rejected",
] as const satisfies readonly AiProposalStatus[];

export type AiProposalHistoryEntry = {
  id: string;
  action: "created" | "revised" | "approved" | "rejected";
  by: string;
  at: string;
  notes?: string;
};

export type WorkflowPosition = {
  x: number;
  y: number;
};

export type WorkflowCodeField = {
  language: "typescript" | "javascript" | "json" | "sql" | "text";
  body: string;
  entrypoint?: string;
};

export type WorkflowFormulaField = {
  expression: string;
  outputKey: string;
  inputs: string[];
};

export type SourceMetadata = {
  sourceType: Extract<
    BlockSubtype,
    | "Manual Entry"
    | "Excel / Workbook"
    | "PDF / Document"
    | "API / HTTP Request"
    | "Database Query"
    | "Web / URL"
    | "AI Search Result"
    | "Keyword Rules"
    | "Aggregation Rules"
    | "Rollup Rules"
    | "Calculation Rules"
  >;
  locator: string;
  valuePreview?: string;
  immutable: true;
  treatedAsEvidence: boolean;
  labelLocked: boolean;
  locatorLocked: boolean;
  valuesLocked: boolean;
};

export type GovernanceMetadata = {
  protected: boolean;
  protectedKind?: ProtectedKind;
  steward: string;
  lockedInRuntime: boolean;
  requiresUnlockToEdit: boolean;
  editIntent?: string;
  approvalState: "draft" | "review-required" | "approved";
};

export type RuntimeVisibility = {
  visible: boolean;
  editableInRuntime: boolean;
  generatedUiLocked: boolean;
  masked: boolean;
  showInRuns: boolean;
  outputKey?: string;
};

export type WorkflowBlock = {
  id: string;
  family: BlockFamily;
  subtype: BlockSubtype;
  label: string;
  description: string;
  status: BlockStatus;
  position: WorkflowPosition;
  config: Record<string, unknown>;
  code?: WorkflowCodeField;
  formula?: WorkflowFormulaField;
  source?: SourceMetadata;
  governance?: GovernanceMetadata;
  runtime: RuntimeVisibility;
  catalogId?: string;
  sample?: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

export type WorkflowEdge = {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  relationshipType: WorkflowRelationshipType;
  reason: string;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus: EdgeBindingStatus;
  status: EdgeStatus;
  createdBy: string;
  createdAt: string;
  confidence: number;
  notes: string;
  history: WorkflowEdgeHistoryEntry[];
};

export type BlockRun = {
  id: string;
  blockId: string;
  blockLabel: string;
  status: BlockRunStatus;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  input?: unknown;
  output?: unknown;
  error?: { message: string };
};

export type WorkflowStructure = {
  layout: "canvas-columns";
  entryBlockId?: string;
  blockOrder: string[];
  columns: Array<{
    id: string;
    family: BlockFamily;
    label: string;
    blockIds: string[];
  }>;
};

export type RuntimeUiRow = {
  id: string;
  blockId: string;
  label: string;
  family: BlockFamily;
  subtype: BlockSubtype;
  visible: boolean;
  readOnly: boolean;
  locked: boolean;
  reviewerOnly: boolean;
  advancedOnly: boolean;
  sourceReadOnly: boolean;
  protectedLocked: boolean;
  outputKey?: string;
  allowedActions: string[];
};

export type RuntimeUiSection = {
  id: string;
  label: string;
  family: BlockFamily;
  rows: RuntimeUiRow[];
};

export type RuntimeUiConfig = {
  runtimeConfigId: string;
  sourceWorkflowId: string;
  sourceSnapshotId?: string;
  generatedAt: string;
  sections: RuntimeUiSection[];
  visibleRows: string[];
  hiddenRows: string[];
  reviewerOnlyRows: string[];
  advancedRows: string[];
  allowedActions: string[];
};

export type OutputMappingPreviewItem = {
  outputBlockId: string;
  outputLabel: string;
  outputSubtype: BlockSubtype;
  readinessStatus: "ready" | "missing" | "warning";
  mappedProtectedValues: Array<{
    edgeId: string;
    protectedBlockId: string;
    protectedLabel: string;
    relationshipType: Extract<
      WorkflowRelationshipType,
      "included_in_handoff" | "maps_to_output"
    >;
  }>;
  candidateLogicMappings: Array<{
    edgeId: string;
    logicBlockId: string;
    logicLabel: string;
    relationshipType: Extract<
      WorkflowRelationshipType,
      | "feeds_output_input"
      | "included_in_output_preview"
      | "maps_to_output_candidate"
    >;
  }>;
  governanceWarnings: string[];
  ignoredRelationshipCount: number;
  missingRequirements: string[];
  includedSourceTraceSetting: string;
  mockPayloadPreview: Record<string, unknown>;
};

export type OutputMappingPreview = {
  id: string;
  sourceWorkflowId: string;
  sourceSnapshotId?: string;
  generatedAt: string;
  outputs: OutputMappingPreviewItem[];
};

export type WorkflowVersionSnapshot = {
  id: string;
  schemaVersion: typeof WORKFLOW_SCHEMA_VERSION;
  workflowId: string;
  workflowName: string;
  versionNumber: number;
  label: string;
  status: WorkflowDefinitionStatus;
  createdBy: string;
  createdAt: string;
  changeSummary: string;
  blockCount: number;
  edgeCount: number;
  blockIds: string[];
  edgeIds: string[];
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  structure: WorkflowStructure;
  runtimeUiConfig: RuntimeUiConfig;
  outputMappingPreview: OutputMappingPreview;
  aiProposals: AiProposal[];
  mockRuns: BlockRun[];
  notes?: string;
  validationWarnings: string[];
};

export type AiProposal = {
  id: string;
  title?: string;
  originalPrompt: string;
  interpretedPlan: string;
  selectedTools: string[];
  generatedBlocks: WorkflowBlock[];
  generatedEdges: WorkflowEdge[];
  generatedCodeOrFormulas: Array<{
    blockId: string;
    kind: "code" | "formula";
    value: string;
  }>;
  status: AiProposalStatus;
  approvalResult?: {
    approvedBy: string;
    approvedAt: string;
    notes?: string;
  };
  rejectionResult?: {
    rejectedBy: string;
    rejectedAt: string;
    reason: string;
  };
  createdAt: string;
  createdBy?: string;
  relatedSelectedBlockId?: string;
  relatedSelectedEdgeId?: string;
  confidence?: number;
  notes?: string;
  history?: AiProposalHistoryEntry[];
};

export type WorkflowDefinition = {
  schemaVersion: typeof WORKFLOW_SCHEMA_VERSION;
  id: string;
  name: string;
  description: string;
  status: WorkflowDefinitionStatus;
  metadata: {
    kind: "generic-fiscal-workflow";
    sampleWorkflow?: {
      id: string;
      label: string;
      description: string;
    };
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    notes?: string;
  };
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  structure: WorkflowStructure;
  runtimeUiConfig: RuntimeUiConfig;
  outputMappingPreview: OutputMappingPreview;
  mockRuns: BlockRun[];
  versionSnapshots: WorkflowVersionSnapshot[];
  latestPublishedVersionId?: string;
  publishedVersion?: {
    id: string;
    versionNumber: number;
    createdAt: string;
  };
  aiProposals: AiProposal[];
  events: WorkflowEvent[];
};

export type WorkflowDraft = {
  id: string;
  definition: WorkflowDefinition;
  dirty: boolean;
  selectedBlockId: string | null;
  lastSavedAt: string | null;
};

export type PendingWorkflowConnection = {
  sourceBlockId: string;
  targetBlockId: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  createdAt: string;
};

export type WorkflowEventType =
  | "ai_proposal_approved"
  | "ai_proposal_created"
  | "ai_proposal_rejected"
  | "export_workflow"
  | "import_workflow"
  | "migration"
  | "publish_snapshot"
  | "reset_sample"
  | "save_draft"
  | "validation_warning"
  | "workflow_command";

export const WORKFLOW_EVENT_TYPES = [
  "ai_proposal_approved",
  "ai_proposal_created",
  "ai_proposal_rejected",
  "export_workflow",
  "import_workflow",
  "migration",
  "publish_snapshot",
  "reset_sample",
  "save_draft",
  "validation_warning",
  "workflow_command",
] as const satisfies readonly WorkflowEventType[];

export type WorkflowEvent = {
  id: string;
  type: WorkflowEventType;
  message: string;
  createdAt: string;
  createdBy: string;
  details?: Record<string, unknown>;
};

export type LocalWorkflowSnapshot = WorkflowDefinition;

export type LocalExecutionLog = {
  id: string;
  executionId: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "pending" | "running" | "success" | "error";
  startedAt: Date;
  completedAt: Date | null;
  duration: string | null;
  input?: unknown;
  output?: unknown;
  error: string | null;
};

export type LocalWorkflowExecution = {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "success" | "error" | "cancelled";
  startedAt: Date;
  completedAt: Date | null;
  duration: string | null;
  error: string | null;
};

export type LocalRunRecord = {
  execution: LocalWorkflowExecution;
  logs: LocalExecutionLog[];
};
