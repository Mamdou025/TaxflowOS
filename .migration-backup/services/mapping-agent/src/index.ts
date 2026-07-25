// biome-ignore-all lint/performance/noBarrelFile: This file is the documented public API for provider-independent integrations.
export { type MappingAgentOptions, runMappingAgent } from "./engine";
export { DeterministicRuleProvider } from "./providers/deterministic";
export {
  AdapterMappingProvider,
  type ExternalProviderAdapter,
  type MappingProvider,
  type MappingProviderContext,
} from "./providers/provider";
export {
  loadRulePack,
  type MappingRule,
  type WorkflowRulePack,
} from "./rule-pack";
export {
  type ExtractedFact,
  type MappingDecision,
  type MappingRequest,
  type MappingRun,
  mappingDecisionSchema,
  mappingRunSchema,
  type ReferenceDocumentInput,
  type TrialBalanceInput,
  type ValidationIssue,
} from "./types";
