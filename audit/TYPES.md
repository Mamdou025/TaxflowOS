# Types & Domain Model

*Last updated: 2026-05-18*

All core types live in `src/domain/workflow/`. Re-exports and runtime types are in `lib/local-tool-registry.ts` and `backend/runtime/types.ts`.

---

## Block Family & Subtype Enums

### `BlockFamily` (`src/domain/workflow/block-types.ts`)
```typescript
type BlockFamily =
  | "Trigger"   // added 2026-05-18
  | "Source"
  | "Logic"
  | "Review/Validation"
  | "Field"
  | "Output"
  | "AI/Agent"
```

### `BlockSubtype` (28+ values)
**Trigger subtypes:**
`Manual / On Demand` · `Schedule / Cron` · `Webhook / API Event`

**Source subtypes:**
`Manual Entry` · `Excel/Workbook` · `PDF/Document` · `API/HTTP Request` · `Database Query` · `Web/URL` · `AI Search Result` · `Currency Rate` · `Keyword Rules` · `Aggregation Rules` · `Rollup Rules` · `Calculation Rules`

**Logic subtypes:**
`Classification/Mapping` · `Calculation Engine` · `Category Rollup Aggregator` · `Hierarchy Aggregator`

**Review/Validation subtypes:** (planned)
`Readiness Check` · `Trust Review` · `Approval Gate` · `Completeness Check`

**Output subtypes:**
`CSV Export` · `Excel Export` · `PDF Report` · `Evidence Pack` · `Canonical JSON` · `Taxprep Handoff` · `ONESOURCE Handoff`

**Field subtypes:**
`Field Block`

**AI/Agent subtypes:**
`AI Proposal`

---

## Block Status Enums

### `BlockStatus` — lifecycle state of a block in the workflow
```typescript
type BlockStatus =
  | "draft"
  | "configured"
  | "needs-review"
  | "approved"
  | "locked"
  | "running"
  | "success"
  | "error"
```

### `BlockRunStatus` — execution status during a run
```typescript
type BlockRunStatus =
  | "pending"
  | "running"
  | "success"
  | "warning"
  | "error"
  | "skipped"
```

### `WorkflowDefinitionStatus`
```typescript
type WorkflowDefinitionStatus = "draft" | "published"
```

---

## Core Block Type

### `WorkflowBlock` (`src/domain/workflow/workflow-types.ts`)
```typescript
interface WorkflowBlock {
  id: string
  family: BlockFamily
  subtype: BlockSubtype
  label: string
  description?: string
  status: BlockStatus
  position: { x: number; y: number }
  config: Record<string, unknown>

  // optional: code execution
  code?: WorkflowCodeField

  // optional: formula execution
  formula?: WorkflowFormulaField

  // optional: evidence metadata (Source blocks)
  source?: SourceMetadata

  // optional: governance metadata (Protected blocks)
  governance?: GovernanceMetadata

  // runtime rendering control
  runtime: RuntimeVisibility

  catalogId?: string
  sample?: unknown
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt?: string
}
```

---

## Nested Block Types

### `WorkflowCodeField`
```typescript
interface WorkflowCodeField {
  language: string
  body: string
  entrypoint?: string
}
```

### `WorkflowFormulaField`
```typescript
interface WorkflowFormulaField {
  expression: string
  outputKey: string
  inputs: string[]
}
```

### `SourceMetadata`
Tracks immutable evidence anchors. Set on Source-family blocks.
```typescript
interface SourceMetadata {
  sourceType: string
  locator: string
  valuePreview?: string
  immutable: boolean
  treatedAsEvidence: boolean
  locks: {
    labelLocked: boolean
    locatorLocked: boolean
    valuesLocked: boolean
  }
}
```

### `GovernanceMetadata`
Controls governance protection on any block that holds a protected value.
```typescript
interface GovernanceMetadata {
  protected: boolean
  protectedKind: ProtectedKind
  steward?: string
  lockedInRuntime: boolean
  requiresUnlockToEdit: boolean
  editIntent?: string
  approvalState: "draft" | "review-required" | "approved"
}
```

### `ProtectedKind` (`src/domain/workflow/protected-rules.ts`)
```typescript
type ProtectedKind =
  | "input"
  | "result"
  | "official-line"
  | "locked-rate"
  | "final-reviewed-amount"
  | "summary-result"
```

### `RuntimeVisibility`
Controls what is exposed to the runtime UI.
```typescript
interface RuntimeVisibility {
  visible: boolean
  editableInRuntime: boolean
  generatedUiLocked: boolean
  masked: boolean
  showInRuns: boolean
  outputKey?: string         // key for final handoff mapping
}
```

---

## Edge Types

### `WorkflowEdge` (`src/domain/workflow/workflow-types.ts`)
```typescript
interface WorkflowEdge {
  id: string
  sourceBlockId: string
  targetBlockId: string
  relationshipType: WorkflowRelationshipType
  reason?: string
  sourceOutputRole?: string
  targetInputRole?: string
  bindingLabel?: string
  bindingStatus: BindingStatus
  status: EdgeStatus
  createdBy: string
  createdAt: string
  confidence?: number
  notes?: string
  history: EdgeHistoryEntry[]
}
```

### `EdgeStatus`
```typescript
type EdgeStatus = "active" | "proposed" | "rejected" | "disabled"
```

### `BindingStatus`
```typescript
type BindingStatus = "invalid" | "missing" | "valid" | "warning"
```

### `WorkflowRelationshipType` (35+ values, `src/domain/workflow/edge-types.ts`)

**Data flow:** `provides_data_to` · `extracted_into` · `referenced_by` · `transforms_into` · `aggregates_into` · `branches_to` · `depends_on`

**Validation:** `checked_by` · `requires_review_by` · `triggers_validation` · `approves_for` · `blocks_until_resolved` · `certifies`

**Governed output:** `feeds_protected_input` · `feeds_protected_result` · `maps_to_output` · `included_in_handoff`

**Candidate output:** `feeds_output_input` · `included_in_output_preview` · `maps_to_output_candidate`

**AI context:** `feeds_ai_context` · `provides_context_to_ai` · `requests_ai_review` · `supplies_candidate_data`

**AI proposals:** `proposes` · `suggests_mapping` · `suggests_formula` · `suggests_workflow_change`

---

## Workflow Document Types

### `WorkflowDefinition` — the main workflow document
```typescript
interface WorkflowDefinition {
  schemaVersion: string
  id: string
  name: string
  description?: string
  status: WorkflowDefinitionStatus
  metadata: {
    kind: string
    sampleWorkflow?: boolean
    tags: string[]
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
    notes?: string
  }
  blocks: WorkflowBlock[]
  edges: WorkflowEdge[]
  structure: WorkflowStructure
  runtimeUiConfig: RuntimeUiConfig
  outputMappingPreview: OutputMappingPreview
  mockRuns: LocalWorkflowExecution[]
  versionSnapshots: WorkflowVersionSnapshot[]
  latestPublishedVersionId?: string
  publishedVersion?: WorkflowVersionSnapshot
  aiProposals: AiProposal[]
  events: WorkflowEvent[]
}
```

### `WorkflowStructure`
```typescript
interface WorkflowStructure {
  layout: "canvas-columns"
  entryBlockId?: string
  blockOrder: string[]
  columns: WorkflowColumn[]
}
```

---

## Runtime UI Types

### `RuntimeUiConfig`
Generated config for the runtime user-facing form.
```typescript
interface RuntimeUiConfig {
  runtimeConfigId: string
  sourceWorkflowId: string
  sourceSnapshotId?: string
  generatedAt: string
  sections: RuntimeUiSection[]
  visibleRows: RuntimeUiRow[]
  hiddenRows: RuntimeUiRow[]
  reviewerOnlyRows: RuntimeUiRow[]
  advancedRows: RuntimeUiRow[]
}
```

### `RuntimeUiRow`
A single configurable item in the runtime UI.
```typescript
interface RuntimeUiRow {
  id: string
  blockId: string
  label: string
  family: BlockFamily
  subtype: BlockSubtype
  visible: boolean
  readOnly: boolean
  locked: boolean
  reviewerOnly: boolean
  advancedOnly: boolean
  sourceReadOnly: boolean
  protectedLocked: boolean
  outputKey?: string
  allowedActions: string[]
}
```

### `OutputMappingPreview`
Tracks final output readiness and governed value mappings.
```typescript
interface OutputMappingPreview {
  outputs: OutputMappingEntry[]
}
interface OutputMappingEntry {
  blockId: string
  readinessStatus: string
  mappedProtectedValues: MappedProtectedValue[]
  candidateLogicMappings: CandidateLogicMapping[]
  governanceWarnings: string[]
}
```

---

## Execution Types

### `BlockRun` — a single block execution record
```typescript
interface BlockRun {
  id: string
  blockId: string
  blockLabel: string
  status: BlockRunStatus
  startedAt: string
  completedAt?: string
  durationMs?: number
  input?: unknown
  output?: unknown
  error?: string
}
```

### `LocalWorkflowExecution` — a full workflow test run (no DB)
```typescript
interface LocalWorkflowExecution {
  runId: string
  workflowId: string
  workflowName: string
  status: BlockRunStatus
  startedAt: string
  completedAt?: string
  blockRuns: BlockRun[]
}
```

### `LocalExecutionLog`
```typescript
interface LocalExecutionLog {
  runId: string
  entries: LocalLogEntry[]
}
```

---

## Version Snapshot Types

### `WorkflowVersionSnapshot` — immutable snapshot of a workflow version
```typescript
interface WorkflowVersionSnapshot {
  id: string
  schemaVersion: string
  workflowId: string
  workflowName: string
  versionNumber: number
  label: string
  status: WorkflowDefinitionStatus
  createdBy: string
  createdAt: string
  changeSummary?: string
  blockCount: number
  edgeCount: number
  blockIds: string[]
  edgeIds: string[]
  blocks: WorkflowBlock[]
  edges: WorkflowEdge[]
  structure: WorkflowStructure
  runtimeUiConfig: RuntimeUiConfig
  outputMappingPreview: OutputMappingPreview
  aiProposals: AiProposal[]
  mockRuns: LocalWorkflowExecution[]
  validationWarnings: string[]
}
```

---

## AI Proposal Types

### `AiProposal`
```typescript
interface AiProposal {
  id: string
  title?: string
  originalPrompt: string
  interpretedPlan: string
  selectedTools: string[]
  generatedBlocks: WorkflowBlock[]
  generatedEdges: WorkflowEdge[]
  generatedCodeOrFormulas: unknown[]
  status: "proposed" | "approved" | "rejected"
  approvalResult?: unknown
  rejectionResult?: unknown
  createdAt: string
  createdBy?: string
  relatedSelectedBlockId?: string
  relatedSelectedEdgeId?: string
  confidence?: number
  notes?: string
  history: AiProposalHistoryEntry[]
}
```

---

## Tool / Execution Types

### `ToolDefinition` (`lib/local-tool-registry.ts`)
```typescript
interface ToolDefinition {
  toolId: string
  label: string
  description?: string
  family: BlockFamily
  subtype: BlockSubtype
  inputRoles: ToolInputRole[]
  outputRoles: ToolOutputRole[]
}
```

### `ToolRunResult`
```typescript
interface ToolRunResult {
  runId: string
  blockId: string
  toolId: string
  status: ToolRunStatus
  output: Record<string, unknown>
  logs: ToolRunLog[]
  warnings: string[]
  errors: string[]
  evidenceRefs: EvidenceRef[]
  sourceTrace: SourceTraceRef[]
  confidence?: number
  startedAt: string
  completedAt: string
}
```

### `ToolRunStatus`
```typescript
type ToolRunStatus = "error" | "needs_review" | "skipped" | "success" | "warning"
```

### `ToolExecutionContext`
Injected into each block's `run()` function during execution.
```typescript
interface ToolExecutionContext {
  allResults: Record<string, ToolRunResult>
  block: WorkflowBlock
  config: Record<string, unknown>
  evidenceRefs: EvidenceRef[]
  runId: string
  sourceTrace: SourceTraceRef[]
  startedAt: string
  upstreamBlocks: WorkflowBlock[]
  upstreamResults: ToolRunResult[]
  upstreamOutputs: Record<string, unknown>
  workflow: WorkflowDefinition
}
```

### `WorkflowRunResult`
```typescript
interface WorkflowRunResult {
  runId: string
  workflowId: string
  workflowName: string
  status: ToolRunStatus
  startedAt: string
  completedAt: string
  results: ToolRunResult[]
  logs: ToolRunLog[]
  warnings: string[]
  errors: string[]
}
```

---

## Evidence & Lineage Types

### `EvidenceRef` — pointer to a source value
```typescript
interface EvidenceRef {
  evidenceId: string
  sourceBlockId: string
  sourceLabel: string
  immutable: boolean
  label?: string
  locator?: string
  rowId?: string
  valuePreview?: string
}
```

### `SourceTraceRef` — ancestry chain for a derived value
```typescript
interface SourceTraceRef {
  sourceBlockId: string
  sourceLabel: string
  evidenceRefId?: string
  relationshipPath: string[]
  rowId?: string
  valuePreview?: string
}
```

### `ToolRunLog`
```typescript
interface ToolRunLog {
  id: string
  at: string
  level: "error" | "info" | "warning"
  message: string
  details?: unknown
}
```

---

## Block Catalog Types

### `BlockCatalogItem` (`lib/local-fiscal-workflow.ts`)
```typescript
interface BlockCatalogItem {
  id: string                    // "source:manual-entry"
  family: BlockFamily
  subtype: BlockSubtype
  label: string
  description: string
  defaultConfig: Record<string, unknown>
}
```

---

## Source Rule Helper Types (`src/domain/workflow/source-rules.ts`)

**Constants:**
- `SOURCE_LOCKED_CONFIG_KEYS: string[]` — `["sourceLabel", "sourceLocator", "sourceValue", "valuePreview"]`

**Functions:**
- `isSourceEvidenceImmutable(block)` — checks `source?.treatedAsEvidence && immutable`
- `canMutateSourceEvidence(block)` — inverse
- `isExcelWorkbookSource(block?)` — detects Excel blocks
- `hasExcelSourceEvidence(config)` — checks for uploaded rows/workbook/file metadata
- `sourceHasLockableEvidence(block)` — whether block can have locked evidence

---

## Inspector Rule Types (`src/domain/workflow/inspector-rules.ts`)

**`INSPECTOR_TABS`:** `properties` · `code` · `runs`

**`LOGIC_CODE_MODES`:** `Formula` · `Script` · `Condition` · `Aggregation` · `Transformation` · `AI-assisted logic` · `Classification/Mapping`

**Functions:**
- `getDefaultInspectorTabForFamily(family)` — Logic → `"code"`, others → `"properties"`
- `getDefaultInspectorTabForSelection({family, selectionKind})` — edges → `"properties"`, blocks → family default
