// ─────────────────────────────────────────────────────────────────────────────
// The Product Kernel — one canonical vocabulary.
//
// Pure types + pure helpers, no React/jotai. This is the SINGLE set of concepts that
// every workflow, agent, tool, page, and generated interface will operate through.
// Migration is strangler-fig: this file freezes the target vocabulary; thin adapters
// in the existing files (Steps 3–7) fold the current runtimes onto it without a
// rewrite. See docs/kernel-migration-spec.md.
//
// Status: Step 2 (kernel types) — types only, no behavior change. The existing strong
// pieces (Evidence, Governance, WorkflowDefinition) are re-exported unchanged; the
// net-new concepts (Scope, WorkflowRun, Checkpoint, ActionRequest, AuditEvent, Artifact,
// AgentDefinition, AgentRun, Surface, Capability) are defined here as the target.
//
// The eight concepts that must share one vocabulary across builder / assistant / agents
// / backend: Assistant, Agent, Workflow, Tool, Rulebook, Artifact, Surface, Event.
// ─────────────────────────────────────────────────────────────────────────────

export * from './scope';
export * from './evidence';
export * from './capability';
export * from './audit';
export * from './workflow';
export * from './gateway';
export * from './agent';
export * from './artifact';
export * from './surface';
