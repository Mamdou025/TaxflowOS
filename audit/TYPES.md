# Types & Domain Model

*Last updated: 2026-07-21*

All core types live in `src/domain/workflow/`. Re-exports and runtime types are in `lib/local-tool-registry.ts` and `backend/runtime/types.ts`.

> **Vocabulary stabilization (2026-07-17) — kernel-migration Step 1, green-first.** `npx tsc --noEmit` went **130 → 0 errors**, all taxonomy drift. Changes were **additive/zero-behavior**: reconciled `BlockSubtype` with the subtypes the tool registry already uses; made `"Protected"` a *legal* `BlockFamily` via an internal superset (public palette unchanged); added `"field"` to both `ToolGroup` definitions; added the `initiates` edge label; filled `Protected`/`Trigger` keys in exhaustive family-keyed maps; isolated legacy `tax-ui/` from the tsc program. The **deeper removals** the spec ultimately wants (drop `"Protected"`-as-family → `GovernanceMetadata`; drop `Field` from the workflow domain) were **deferred** to the kernel node-model step (spec §2.2) because they touch connection-validation + the FAPI worksheet and aren't required for green. See `### Notes` below.

---

## Product Kernel (`lib/kernel/`) [NEW — 2026-07-17, kernel-migration Step 2]

The single canonical vocabulary — **pure types + pure helpers, no React/jotai**. Types only, **no behavior change**: the strong existing pieces are re-exported unchanged; the net-new concepts are defined as the target the runtimes will fold onto via adapters (Steps 3–7). Barrel: `lib/kernel/index.ts`. See `docs/kernel-migration-spec.md`.

| Module | Key exports | Notes |
|---|---|---|
| `scope.ts` | `ActorKind` · `Actor` · `Scope` · `EMPTY_SCOPE` · `scopeContains()` · `mergeScope()` | **`ActorKind` is now the single source of truth** (Human/Agent/Workflow/Tool/System); `lib/coworkers.ts` re-exports it. `Scope` = client/entity/affiliate/period/workflow/run — the binding today's app lacks. |
| `evidence.ts` | `EvidenceReference` (= `EvidenceRef`) · `SourceTraceRef` · `GovernanceMetadata` · `SourceMetadata` · `ProtectedKind` | **Re-export only** — the existing evidence/governance types are adopted verbatim. |
| `workflow.ts` | `NodeKind` (source/task/review-gate/governed-value/output) · `Executor`(Kind) · `WorkflowRun` · `NodeRun` · `Checkpoint` · `WorkflowVersion` · `Runner` + re-exported `WorkflowDefinition`/`WorkflowBlock`/`WorkflowEdge` | Freezes the 5 canonical node kinds + 4 executor kinds (§2.2) and ONE run model unifying the three today (`RunState`/`LocalWorkflowExecution`/`WorkflowExecution`). |
| `audit.ts` | `AuditEvent` · `AuditEventType` · `AuditLinks` · `ApprovalState` | Typed, durable, linkable event stream — `pushTrail`/`workspaceTrailAtom` become a view over it. |
| `gateway.ts` | `ActionRequest` · `ActionResult` · `Dispatch` | Contract for the one choke point (validate→authorize→approval?→execute→persist→audit). NOT `lib/ai-gateway/*` (that's LLM billing). |
| `agent.ts` | `AgentDefinition` · `AgentRun` · `AgentRunStep` · `ToolInvocation` · `agentRunHasNoOrphanInvocations()` | Versioned agents (tools/workflows/permissions/memory/output-contract) replacing the `Agent` shell. **★ `ToolInvocation` + the no-orphan invariant is the typed home for the "can't ask follow-up questions after a workflow" bug** (a `pending` invocation must resolve before the next user turn; structural fix = explicit `agents` on `CopilotRuntime`, Step 6). |
| `artifact.ts` | `Artifact` · `ArtifactBody` · `DataBinding` | Net-new — durable, versioned, run+scope-bound generated UI; layout binds to values, never owns them. |
| `surface.ts` | `Surface` · `SurfaceKind` · `Anchor` · `SurfaceCommand` · `ResourceRef` | Unified page-adapter contract (folds resource-registry + page-chat-store + page-menu-store) adding scope/selection/resources/permissions. |
| `capability.ts` | `Capability` · `CapabilityKind` · `RiskLevel` · `JsonSchema` | Tool/Engine/Rulebook/Integration with a stable id + typed I/O the gateway authorizes against. |

---

## Assistant Runtime — routing types (`lib/assistant-runtime/`) [NEW — 2026-07-18]

Runtime-validated (zod) types for the Ask/Propose/Execute intent gate. Server-only, no React/jotai. See `docs/assistant-routing-policy.md`.

| Type / export | Where | Notes |
|---|---|---|
| `AssistantRoute` (+ `AssistantRouteSchema`) | `routing/route-schema.ts` | The per-turn classification: `mode` (`ask`/`propose`/`execute`) · `intent` (21-value enum) · `explicitness` · `target {kind,id,name,confidence}` · `detectedNegation` · `referencesPendingAction` · `missingContext` · `allowedToolGroups` · `requiresApproval` · `confidence` · `auditSummary` · `source`. **`mode` and `target` are separate** — a workflow name is a target, never a command. `fallbackRoute()` is the never-restrict fail-open route. |
| `AssistantMode` · `AssistantIntent` · `Explicitness` · `RouteTarget` | `routing/route-schema.ts` | Component enums/objects of `AssistantRoute`. |
| `ToolRiskGroup` · `TOOL_GROUP_OF` · `MODE_DENIED_GROUPS` · `deniedToolNames()` | `routing/tool-groups.ts` | Maps real action names (`runWorkflow`, `editField`, …) → risk groups; declares which groups each mode withholds. |
| `WorkflowTarget` · `resolveWorkflowTarget()` | `routing/workflow-targets.ts` | Static target table (ids mirror `WORKFLOW_CONFIGS`: fapi/roulement/expense/campaign) with EN/FR aliases; returns matched ids + ambiguity + year/client. |
| `GateInput` · `GateDecision` · `computeGateDecision()` · `applyGateDecision()` | `routing/gate.ts` | Structural input (messages/tools/context) → primitive decision (tool names to withhold + directive); apply helper preserves concrete element types. |
| `AssistantRuntimeConfig` · `IntentGateMode` · `ModelTier` | `config.ts` | Env-resolved feature flags + model policy (`ASSISTANT_INTENT_GATE`, `ASSISTANT_MODEL_TIERING`, conductor/fast/deep tiers + reasoning). |
| `ModelDecision` · `ModelTierName` · `pickModelDecision()` · `tierForRoute()` · `normalizeModelSpec()` | `model-policy.ts` | Per-turn model tiering: route → tier (fast/standard/deep) → provider-prefixed model spec (null when it equals the baseline). |
| `MemoryView` · `MemoryKind` · `SaveMemoryInput`(Schema) · `MemoryScope` · `selectRelevantMemories()` | `memory/{types,retrieval}.ts` | Durable memory: validated write input + PURE retrieval policy (global-always, client-specific-only-for-its-client, no cross-client bleed). Backed by the `assistant_memories` table + `memory/repository.ts` (fail-soft Drizzle CRUD). |
| `Specialist` · `SPECIALISTS` · `selectSpecialist()` · `specialistForWorkflow()` · `specialistDirective()` | `agents/specialists.ts` | "Many hats": route → the workflow's domain specialist (Sofi/Théo/Mira/Nova) + the persona directive injected into model context. Pure/isomorphic (server injects; client `SpecialistPresence` shows who). |
| `AssistantMemory` · `NewAssistantMemory` · `assistantMemories` | `lib/db/schema.ts` | Drizzle table + inferred row types; migration `drizzle/0005_strange_deathstrike.sql`. |
| `AssistantErrorCode` · `AssistantRuntimeError` | `errors.ts` | Stable error-code vocabulary for routing/target/tool failures. |

*Nothing imports the kernel yet except `lib/coworkers.ts` (`ActorKind`).* Adapters that fold the existing runtimes onto these types are Steps 3–7.

---

## Resource registry — editable field binding (`lib/resource-registry.tsx`) [2026-07-17]

`ResourceField` (an inline-editable anchor) gained an optional **`binding`**:
```typescript
type ResourceField = {
  id: string; tag: string; ccy: string; default: string;
  hint?: string; editKeywords: string[];
  binding?: { workflowId: string; inputKey: string }; // NEW
}
```
When present, the field reads/writes `runEditsAtom[workflowId].inputs[inputKey]` — the SAME engine input the worksheet + chat run + engine share — instead of the standalone `fieldValuesAtom`. Set on `fx → { workflowId:'fapi', inputKey:'fxRate' }`, so the chat's inline FX field, the worksheet, and the run are ONE value. Consumed by `InlineFieldCard` and the assistant's editable-field-values readable. New helper **`resolveFieldId(query): string | null`** fuzzy-maps a loose field reference (`FX_RATE`/`fx rate`/`fxRate`) to the real id for the `editField` action.

---

## Block Family & Subtype Enums

### `BlockFamily` (`src/domain/workflow/block-types.ts`)
The **public palette** is seven families; `"Protected"` is an **internal** governed-value family (carried on blocks/tools, not user-addable). Canonical spellings use spaces: `"Review / Validation"`, `"AI / Agent"`.
```typescript
const PUBLIC_BLOCK_FAMILIES = [                       // the builder palette (7)
  "Trigger", "Source", "Logic", "Review / Validation", "Field", "Output", "AI / Agent",
] as const;
const BLOCK_FAMILIES = [...PUBLIC_BLOCK_FAMILIES, "Protected"] as const;  // + internal
type BlockFamily = (typeof BLOCK_FAMILIES)[number];   // 8 values
// isPublicBlockFamily() checks PUBLIC_BLOCK_FAMILIES → excludes "Protected"
```

### `BlockSubtype` (~52 values)
Reconciled 2026-07-17 with the subtypes the tool registry actually assigns (the union had drifted behind usage). Groups:

**Trigger:** `Manual / On Demand` · `Schedule / Cron` · `Webhook / API Event`

**Source:** `Manual Entry` · `Excel / Workbook` · `PDF / Document` · `API / HTTP Request` · `Database Query` · `Web / URL` · `AI Search Result` · `Currency Rate` · `Keyword Rules` · `Aggregation Rules` · `Rollup Rules` · `Calculation Rules` · *(extraction, added)* `Excel Table Reader` · `PDF Text Parser` · `PDF Table Parser` · `OCR Extractor` · `API Response Parser`

**Logic:** `Classification / Mapping` · `Calculation Engine` · `Category Rollup Aggregator` · `Hierarchy Aggregator` · *(code-mode, added)* `Formula` · `Script` · `Condition` · `Aggregation` · `Transformation`

**Review / Validation** *(gates, added):* `Approval Gate` · `Required Input Check` · `Missing Source Check` · `Unmatched Rows Check` · `Low Confidence Warning` · `Formula Consistency Check` · `Manual Override Review` · `Output Readiness Check`

**Field:** `Field Block`

**Output:** `CSV Export` · `Excel Export` · `PDF Report` · `Evidence Pack` · `Canonical JSON` · `Taxprep Handoff` · `ONESOURCE Handoff`

**Protected** *(governed values, added):* `Protected Input` · `Protected Result` · `Official Line` · `Locked Rate` · `Final Reviewed Amount` — mapped to `ProtectedKind` by `getProtectedKindForSubtype()`.

**AI / Agent:** `AI Search` · `AI Mapping Suggestion` · `AI Formula Proposal` · `AI Workflow Proposal`

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

---

### Notes

**Vocabulary stabilization — 2026-07-17 (kernel-migration Step 1, green-first).** `tsc` 130 → 0, taxonomy drift only.
- **`ToolGroup`** now includes `"field"` — defined **twice** (`backend/runtime/types.ts` *and* a shadow copy in `lib/local-tool-registry.ts`); both were updated. Collapsing the duplicate is deferred to the kernel step. `"protected"` remains a `ToolGroup` value.
- **`WorkflowRelationshipType`** was unchanged, but the `WORKFLOW_RELATIONSHIP_LABELS` record was missing the `initiates` label (added).
- **Exhaustive `Record<BlockFamily, …>` maps** now carry a `Protected` key (and, where long-missing, a `Trigger` key): `FAMILY_NODE_STYLES` (family-node-shape), `labelsByFamily` (block-data-flow-pane), `BLOCK_FAMILY_STAGE` (block-catalog — `Protected → "output"`, no dedicated `FiscalStage`), `BLOCK_FAMILY_RULES` (workflow-rules), the inspector `familyIcon` map. Previously these returned `undefined` for those families (latent gaps); now filled.
- **`local-tool-registry.ts`**: the "Field Block" tool was missing a required `inputSchema` (masked by the prior `toolGroup:"field"` type error); added.
- **Bug fixed in passing** (`components/workflow/workflow-toolbar.tsx`): a dead `import { Map }` from lucide-react **shadowed the global `Map`**, so `new Map()` in `getMissingIntegrations()` constructed the icon component and `.set()` threw at runtime. Removing the dead import restores the function.
- **`tax-ui/`** is excluded from the tsc program (`tsconfig.json`). Only the dead `Map.tsx`/`const.ts` roots are dropped; the dynamically-imported `@tax/pages/*` still type-check via import-following.

**Protected → governance detection seam — 2026-07-18 (kernel-migration Step 1 deferred-item, behaviour-preserving).** `tsc` 0 → 0; the run engine is untouched (`lib/workflow-runs/*` has zero Protected/governance refs), so FAPI parity holds by construction, not just by test.
- New single predicate **`isGovernedValueBlock(block)`** in `src/domain/workflow/protected-rules.ts`: `block.governance?.protected === true || block.family === "Protected"` — governance metadata is the primary signal (spec §2.2); the family literal is a compatibility fallback. Uses a minimal structural probe (no `WorkflowBlock` import → no type cycle; works on domain blocks and canvas `node.data.block`).
- All **20 scattered `family === "Protected"` detection sites** now route through it: `src/audit/workflow-events.ts`, `src/runtime/generate-structure-view.ts`, `src/state/workflow-commands.ts` (×5 — delete/unlock/audit guards, via a local `isGoverned`), `lib/local-ai-workflow-assistant.ts` (×9), `lib/local-tool-registry.ts` (×3 tool-runner filters), `components/workflow/inspector/mock-runs.ts`. The **only** `=== "Protected"` left in the repo is the predicate itself.
- **Provably inert today**: repo-wide, `protected: true` appears only in legacy `tax-ui` data — no workflow block sets `governance.protected` — so the predicate reduces exactly to the old family check.
- **Deliberately left as legal `BlockFamily` refs** (data, not detection): `acceptedFamilies`/`canRouteToFamilies` role arrays (`lib/local-tool-registry.ts`) + `RELATIONSHIP_TYPES_BY_FAMILY_PAIR` (`workflow-rules.ts`) — audit found these are **display-only** hints ("Accepts: …" in the inspector), *not* enforced connection validation, so reworking them is cosmetic; `FAMILY_ORDER` (family-keyed structure ordering); `getBlocksByFamily(def, "Protected")` lookups; `family: "Protected"` tool/definition declarations.

**Deferred to the kernel node-model step (spec §2.2) — NOT done here:**
- Finish Protected → governance: **populate `getGovernanceMetadata`** (it currently returns `undefined`) so governance is the sole signal, then drop the `family === "Protected"` fallback in the predicate and retire the `"Protected"` family value. ⚠ Populating governance activates the governance-guarded branches in `getFiscalOutputForStage` / `mappedProtectedValues` (`lib/local-fiscal-workflow.ts`) — verify each downstream reader before flipping. Convert the display-only `acceptedFamilies`/`FAMILY_ORDER` refs to a governance axis in the same pass.
- Drop `Field` from the workflow domain (`Field` family + `"Field Block"` subtype + `"field"` visualRole/ToolGroup) and move field display to the worksheet surface.
- Collapse the duplicate `ToolGroup`/`ToolDefinition` definitions and the parallel node taxonomies (`visualRole`, `FiscalStage`, `ToolGroup`) onto derived presentation.
