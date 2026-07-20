// ─────────────────────────────────────────────────────────────────────────────
// Assistant runtime — public barrel.
//
// The reliability/intent slice: a deterministic Ask/Propose/Execute classifier
// and an enforced, fail-open gate that scopes the model's tool set per turn so a
// workflow MENTION can no longer start a run and an explicit command is reliably
// caught. See docs/assistant-routing-policy.md.
// ─────────────────────────────────────────────────────────────────────────────

export { getAssistantRuntimeConfig, intentGateActive } from './config';
export type { AssistantRuntimeConfig, IntentGateMode, ModelTier } from './config';
export { ASSISTANT_ERROR_CODES, AssistantRuntimeError } from './errors';
export type { AssistantErrorCode } from './errors';

export {
  AssistantRouteSchema,
  ROUTE_SCHEMA_VERSION,
  fallbackRoute,
} from './routing/route-schema';
export type {
  AssistantRoute,
  AssistantMode,
  AssistantIntent,
  Explicitness,
  RouteTarget,
} from './routing/route-schema';

export { classifyDeterministic } from './routing/classify';
export type { ClassifyContext } from './routing/classify';
export { applyRoutePolicy, EXECUTE_CONFIDENCE_THRESHOLD } from './routing/route-policy';
export { computeGateDecision, applyGateDecision, classifyTurn, decideEnforcement } from './routing/gate';
export type { GateInput, GateDecision } from './routing/gate';
export { pickModelDecision, tierForRoute, normalizeModelSpec } from './model-policy';
export type { ModelDecision, ModelTierName } from './model-policy';

export { selectRelevantMemories } from './memory/retrieval';
export type { MemoryScope } from './memory/retrieval';
export { SaveMemoryInputSchema, MEMORY_KINDS } from './memory/types';
export type { MemoryView, MemoryKind, SaveMemoryInput } from './memory/types';

export { SPECIALISTS, selectSpecialist, specialistForWorkflow, specialistDirective } from './agents/specialists';
export type { Specialist } from './agents/specialists';
export { deniedToolNames, groupOfTool, TOOL_GROUP_OF, MODE_DENIED_GROUPS } from './routing/tool-groups';
export type { ToolRiskGroup } from './routing/tool-groups';
export { resolveWorkflowTarget, WORKFLOW_TARGETS } from './routing/workflow-targets';
export { classifyWithLLM, ROUTER_SYSTEM_PROMPT } from './routing/intent-router';
