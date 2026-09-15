import type { BlockCatalogItem as DomainBlockCatalogItem } from '@workspace/workflow-executors/domain/workflow/block-catalog';
import {
  BLOCK_FAMILY_STAGE as DOMAIN_BLOCK_FAMILY_STAGE,
  FISCAL_STAGE_OPTIONS as DOMAIN_FISCAL_STAGE_OPTIONS,
} from '@workspace/workflow-executors/domain/workflow/block-catalog';
import type {
  BlockFamily as DomainBlockFamily,
  BlockRunStatus as DomainBlockRunStatus,
  BlockStatus as DomainBlockStatus,
  BlockSubtype as DomainBlockSubtype,
  FiscalStage as DomainFiscalStage,
  WorkflowDefinitionStatus as DomainWorkflowDefinitionStatus,
} from '@workspace/workflow-executors/domain/workflow/block-types';
import type {
  EdgeBindingStatus as DomainEdgeBindingStatus,
  EdgeStatus as DomainEdgeStatus,
  WorkflowEdgeHistoryEntry as DomainWorkflowEdgeHistoryEntry,
  WorkflowRelationshipType as DomainWorkflowRelationshipType,
} from '@workspace/workflow-executors/domain/workflow/edge-types';
import {
  CANDIDATE_OUTPUT_RELATIONSHIP_TYPES as DOMAIN_CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
  EDGE_BINDING_STATUS_VALUES as DOMAIN_EDGE_BINDING_STATUS_VALUES,
  EDGE_STATUS_VALUES as DOMAIN_EDGE_STATUS_VALUES,
  GOVERNED_OUTPUT_RELATIONSHIP_TYPES as DOMAIN_GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
  OUTPUT_MAPPING_RELATIONSHIP_TYPES as DOMAIN_OUTPUT_MAPPING_RELATIONSHIP_TYPES,
  WORKFLOW_RELATIONSHIP_LABELS as DOMAIN_WORKFLOW_RELATIONSHIP_LABELS,
  WORKFLOW_RELATIONSHIP_TYPES as DOMAIN_WORKFLOW_RELATIONSHIP_TYPES,
  isCandidateOutputRelationshipType as domainIsCandidateOutputRelationshipType,
  isGovernedOutputRelationshipType as domainIsGovernedOutputRelationshipType,
  isOutputMappingRelationshipType as domainIsOutputMappingRelationshipType,
} from '@workspace/workflow-executors/domain/workflow/edge-types';
import { LOGIC_OUTPUT_GOVERNANCE_WARNING as DOMAIN_LOGIC_OUTPUT_GOVERNANCE_WARNING } from '@workspace/workflow-executors/domain/workflow/workflow-rules';
import type {
  AiProposal as DomainAiProposal,
  AiProposalHistoryEntry as DomainAiProposalHistoryEntry,
  AiProposalStatus as DomainAiProposalStatus,
  BlockRun as DomainBlockRun,
  GovernanceMetadata as DomainGovernanceMetadata,
  LocalExecutionLog as DomainLocalExecutionLog,
  LocalRunRecord as DomainLocalRunRecord,
  LocalWorkflowExecution as DomainLocalWorkflowExecution,
  LocalWorkflowSnapshot as DomainLocalWorkflowSnapshot,
  OutputMappingPreview as DomainOutputMappingPreview,
  OutputMappingPreviewItem as DomainOutputMappingPreviewItem,
  PendingWorkflowConnection as DomainPendingWorkflowConnection,
  RuntimeUiConfig as DomainRuntimeUiConfig,
  RuntimeUiRow as DomainRuntimeUiRow,
  RuntimeUiSection as DomainRuntimeUiSection,
  RuntimeVisibility as DomainRuntimeVisibility,
  SourceMetadata as DomainSourceMetadata,
  WorkflowBlock as DomainWorkflowBlock,
  WorkflowCodeField as DomainWorkflowCodeField,
  WorkflowDefinition as DomainWorkflowDefinition,
  WorkflowDraft as DomainWorkflowDraft,
  WorkflowEdge as DomainWorkflowEdge,
  WorkflowEvent as DomainWorkflowEvent,
  WorkflowEventType as DomainWorkflowEventType,
  WorkflowFormulaField as DomainWorkflowFormulaField,
  WorkflowPosition as DomainWorkflowPosition,
  WorkflowStructure as DomainWorkflowStructure,
  WorkflowVersionSnapshot as DomainWorkflowVersionSnapshot,
} from '@workspace/workflow-executors/domain/workflow/workflow-types';
import {
  AI_PROPOSAL_STATUS_VALUES as DOMAIN_AI_PROPOSAL_STATUS_VALUES,
  WORKFLOW_EVENT_TYPES as DOMAIN_WORKFLOW_EVENT_TYPES,
  WORKFLOW_SCHEMA_VERSION as DOMAIN_WORKFLOW_SCHEMA_VERSION,
} from '@workspace/workflow-executors/domain/workflow/workflow-types';

export type BlockCatalogItem = DomainBlockCatalogItem;

export type BlockFamily = DomainBlockFamily;

export type BlockRunStatus = DomainBlockRunStatus;

export type BlockStatus = DomainBlockStatus;

export type BlockSubtype = DomainBlockSubtype;

export type FiscalStage = DomainFiscalStage;

export type WorkflowDefinitionStatus = DomainWorkflowDefinitionStatus;

export type EdgeBindingStatus = DomainEdgeBindingStatus;

export type EdgeStatus = DomainEdgeStatus;

export type WorkflowEdgeHistoryEntry = DomainWorkflowEdgeHistoryEntry;

export type WorkflowRelationshipType = DomainWorkflowRelationshipType;

export type AiProposal = DomainAiProposal;

export type AiProposalHistoryEntry = DomainAiProposalHistoryEntry;

export type AiProposalStatus = DomainAiProposalStatus;

export type BlockRun = DomainBlockRun;

export type GovernanceMetadata = DomainGovernanceMetadata;

export type LocalExecutionLog = DomainLocalExecutionLog;

export type LocalRunRecord = DomainLocalRunRecord;

export type LocalWorkflowExecution = DomainLocalWorkflowExecution;

export type LocalWorkflowSnapshot = DomainLocalWorkflowSnapshot;

export type OutputMappingPreview = DomainOutputMappingPreview;

export type OutputMappingPreviewItem = DomainOutputMappingPreviewItem;

export type PendingWorkflowConnection = DomainPendingWorkflowConnection;

export type RuntimeUiConfig = DomainRuntimeUiConfig;

export type RuntimeUiRow = DomainRuntimeUiRow;

export type RuntimeUiSection = DomainRuntimeUiSection;

export type RuntimeVisibility = DomainRuntimeVisibility;

export type SourceMetadata = DomainSourceMetadata;

export type WorkflowBlock = DomainWorkflowBlock;

export type WorkflowCodeField = DomainWorkflowCodeField;

export type WorkflowDefinition = DomainWorkflowDefinition;

export type WorkflowDraft = DomainWorkflowDraft;

export type WorkflowEdge = DomainWorkflowEdge;

export type WorkflowEvent = DomainWorkflowEvent;

export type WorkflowEventType = DomainWorkflowEventType;

export type WorkflowFormulaField = DomainWorkflowFormulaField;

export type WorkflowPosition = DomainWorkflowPosition;

export type WorkflowStructure = DomainWorkflowStructure;

export type WorkflowVersionSnapshot = DomainWorkflowVersionSnapshot;

export const BLOCK_FAMILY_STAGE = DOMAIN_BLOCK_FAMILY_STAGE;

export const FISCAL_STAGE_OPTIONS = DOMAIN_FISCAL_STAGE_OPTIONS;

export const CANDIDATE_OUTPUT_RELATIONSHIP_TYPES = DOMAIN_CANDIDATE_OUTPUT_RELATIONSHIP_TYPES;

export const EDGE_BINDING_STATUS_VALUES = DOMAIN_EDGE_BINDING_STATUS_VALUES;

export const EDGE_STATUS_VALUES = DOMAIN_EDGE_STATUS_VALUES;

export const GOVERNED_OUTPUT_RELATIONSHIP_TYPES = DOMAIN_GOVERNED_OUTPUT_RELATIONSHIP_TYPES;

export const OUTPUT_MAPPING_RELATIONSHIP_TYPES = DOMAIN_OUTPUT_MAPPING_RELATIONSHIP_TYPES;

export const WORKFLOW_RELATIONSHIP_LABELS = DOMAIN_WORKFLOW_RELATIONSHIP_LABELS;

export const WORKFLOW_RELATIONSHIP_TYPES = DOMAIN_WORKFLOW_RELATIONSHIP_TYPES;

export const isCandidateOutputRelationshipType = domainIsCandidateOutputRelationshipType;

export const isGovernedOutputRelationshipType = domainIsGovernedOutputRelationshipType;

export const isOutputMappingRelationshipType = domainIsOutputMappingRelationshipType;

export const LOGIC_OUTPUT_GOVERNANCE_WARNING = DOMAIN_LOGIC_OUTPUT_GOVERNANCE_WARNING;

export const AI_PROPOSAL_STATUS_VALUES = DOMAIN_AI_PROPOSAL_STATUS_VALUES;

export const WORKFLOW_EVENT_TYPES = DOMAIN_WORKFLOW_EVENT_TYPES;

export const LOCAL_WORKFLOW_ID = 'local-fiscal-studio';

export const LOCAL_WORKFLOW_STORAGE_KEY = 'workflow-studio.local-workflow';

export const LOCAL_RUNS_STORAGE_KEY = 'workflow-studio.local-runs';

export const LOCAL_WORKFLOW_SCHEMA_VERSION = DOMAIN_WORKFLOW_SCHEMA_VERSION;

export const SYSTEM_USER = 'workflow-studio';

export const SAMPLE_CREATED_AT = '2026-04-28T12:00:00.000Z';
