import type {
  BlockFamily,
  BlockSubtype,
  WorkflowBlock,
  WorkflowDefinition,
} from "../../lib/local-fiscal-workflow";

export type BlockExecutionStatus =
  | "error"
  | "needs_review"
  | "skipped"
  | "success"
  | "warning";

export type ToolGroup =
  | "calculation"
  | "data_extraction"
  | "data_preparation"
  | "field"
  | "mapping"
  | "output"
  | "protected"
  | "review"
  | "routing"
  | "source";

export type ToolInputRole = {
  id: string;
  label: string;
  description: string;
  required: boolean;
  acceptedFamilies: BlockFamily[];
  acceptedSourceKinds?: string[];
  acceptedOutputTypes?: string[];
  allowMultiple: boolean;
};

export type ToolOutputRole = {
  id: string;
  label: string;
  description: string;
  outputType: string;
  canRouteToFamilies: BlockFamily[];
  samplePreview?: unknown;
  outputKey?: string;
};

export type EvidenceRef = {
  evidenceId: string;
  sourceBlockId: string;
  sourceLabel: string;
  immutable: true;
  label?: string;
  locator?: string;
  rowId?: string;
  ruleId?: string;
  field?: string;
  sourceKind?: string;
  valuePreview?: string;
};

export type SourceTraceRef = {
  sourceBlockId: string;
  sourceLabel: string;
  sourceKind?: string;
  evidenceRefId?: string;
  relationshipPath: string[];
  edgeId?: string;
  rowId?: string;
  ruleId?: string;
  field?: string;
  valuePreview?: string;
};

export type ToolRunLog = {
  id: string;
  at: string;
  level: "error" | "info" | "warning";
  message: string;
  details?: Record<string, unknown>;
};

export type ToolOutput = Record<string, unknown>;

export type ToolRunResult = {
  runId: string;
  blockId: string;
  toolId: string;
  status: BlockExecutionStatus;
  outputs: Record<string, ToolOutput>;
  primaryOutputRole?: string;
  logs: ToolRunLog[];
  warnings: string[];
  errors: string[];
  evidenceRefs: EvidenceRef[];
  sourceTrace: SourceTraceRef[];
  confidence?: number;
  startedAt: string;
  completedAt: string;
};

export type ToolExecutionContext = {
  runId: string;
  block: WorkflowBlock;
  config: Record<string, unknown>;
  inputsByRole: Record<string, unknown[]>;
  startedAt: string;
  workflow?: WorkflowDefinition;
  upstreamBlocks?: WorkflowBlock[];
  upstreamResults?: ToolRunResult[];
  evidenceRefs?: EvidenceRef[];
  sourceTrace?: SourceTraceRef[];
};

export type ToolDefinition = {
  toolId: string;
  family: BlockFamily;
  subtype?: BlockSubtype;
  toolGroup: ToolGroup;
  displayName: string;
  description: string;
  inputRoles: ToolInputRole[];
  outputRoles: ToolOutputRole[];
  defaultConfig: Record<string, unknown>;
  runMode: "local_mock";
  execute?: (context: ToolExecutionContext) => ToolRunResult;
  runnerKey?: string;
};

export type RegisteredToolModule = {
  definition: ToolDefinition;
  run: (context: ToolExecutionContext) => ToolRunResult;
};
