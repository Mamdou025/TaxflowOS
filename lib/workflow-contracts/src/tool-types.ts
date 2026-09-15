import type { BlockFamily, BlockSubtype } from './domain/block-types';
import type { WorkflowBlock, WorkflowDefinition } from './domain/workflow-types';

export type ToolRunStatus = 'error' | 'needs_review' | 'skipped' | 'success' | 'warning';

export type ToolSchemaField = {
  key: string;
  type: 'array' | 'boolean' | 'number' | 'object' | 'string';
  description?: string;
  required?: boolean;
};

export type ToolInputSchema = {
  fields: ToolSchemaField[];
};

export type ToolOutputSchema = {
  fields: ToolSchemaField[];
};

export type EvidenceRef = {
  evidenceId: string;
  sourceBlockId: string;
  sourceLabel: string;
  immutable: true;
  label?: string;
  locator?: string;
  rowId?: string;
  valuePreview?: string;
};

export type SourceTraceRef = {
  sourceBlockId: string;
  sourceLabel: string;
  evidenceRefId?: string;
  relationshipPath: string[];
  rowId?: string;
  valuePreview?: string;
};

export type ToolRunLog = {
  id: string;
  at: string;
  level: 'error' | 'info' | 'warning';
  message: string;
  details?: Record<string, unknown>;
};

export type ToolRunResult = {
  blockTest?: { mode: 'isolated'; inputs: 'examples' | 'recorded' | 'none' };
  configSignature?: string;
  input?: Record<string, unknown>;
  inputTransfers?: {
    edgeId: string;
    sourceBlockId: string;
    sourceLabel: string;
    sourceOutputRole?: string;
    targetInputRole?: string;
    delivered: boolean;
    output: Record<string, unknown>;
  }[];
  runId: string;
  blockId: string;
  toolId: string;
  status: ToolRunStatus;
  output: Record<string, unknown>;
  logs: ToolRunLog[];
  warnings: string[];
  errors: string[];
  evidenceRefs: EvidenceRef[];
  sourceTrace: SourceTraceRef[];
  confidence?: number;
  startedAt: string;
  completedAt: string;
};

export type WorkflowRunResult = {
  runId: string;
  workflowId: string;
  workflowName: string;
  status: ToolRunStatus;
  startedAt: string;
  completedAt: string;
  results: ToolRunResult[];
  logs: ToolRunLog[];
  warnings: string[];
  errors: string[];
};

export type ToolExecutionContext = {
  allResults: Record<string, ToolRunResult>;
  block: WorkflowBlock;
  config: Record<string, unknown>;
  evidenceRefs: EvidenceRef[];
  runId: string;
  sourceTrace: SourceTraceRef[];
  startedAt: string;
  upstreamBlocks: WorkflowBlock[];
  upstreamResults: ToolRunResult[];
  upstreamOutputs: Record<string, unknown>;
  workflow: WorkflowDefinition;
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
  inputSchema: ToolInputSchema;
  outputSchema: ToolOutputSchema;
  defaultConfig: Record<string, unknown>;
  runMode: 'local_mock';
  execute: (context: ToolExecutionContext) => ToolRunResult;
};

export type ToolGroup =
  | 'calculation'
  | 'data_extraction'
  | 'data_preparation'
  | 'field'
  | 'mapping'
  | 'output'
  | 'protected'
  | 'review'
  | 'routing'
  | 'source';

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

export type FiscalRow = {
  rowId: string;
  label: string;
  amount: number;
  account?: string;
  categoryId?: string;
  categoryLabel?: string;
  currency?: string;
  description?: string;
  target?: string;
  confidence?: number;
  lineId?: string;
  matchedKeyword?: string;
  matchedRuleId?: string;
  ruleId?: string;
  ruleTrace?: SourceTraceRef[];
  ruleSourceTrace?: SourceTraceRef[];
  sectionId?: string;
  subsectionId?: string;
  suggestedLine?: string;
  suggestedSection?: string;
  suggestedSubsection?: string;
  sourceRow?: Record<string, unknown>;
  sourceTrace?: SourceTraceRef[];
  evidenceRefs?: EvidenceRef[];
  status?: string;
};

export type FinalityStatus = 'draft' | 'failed' | 'final' | 'review_ready';

export type ValidationGateIssue = {
  blockId: string;
  blocking: boolean;
  label: string;
  message: string;
  overridden?: boolean;
  pass: boolean;
  status: string;
};

export type KeywordRule = {
  ruleId: string;
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
  exactKeywords?: string[];
  containsKeywords?: string[];
  excludeKeywords?: string[];
  confidence: number;
  description?: string;
  comment?: string;
  matchMode?: 'contains' | 'exact' | 'starts_with';
  scope?: string;
  lineId?: string;
  sectionId?: string;
  subsectionId?: string;
  suggestedLine?: string;
  suggestedSection?: string;
  suggestedSubsection?: string;
  suggestedUse?: string;
  tags?: string[];
  target?: string;
  sourceTrace?: SourceTraceRef[];
  evidenceRefs?: EvidenceRef[];
};

export type KeywordMapperConflict = {
  rowId: string;
  label: string;
  matchedRuleIds: string[];
};

export type NumericValueRef = { key: string; label: string; value: number };
