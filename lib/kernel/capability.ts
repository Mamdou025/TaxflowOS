// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Capability
//
// A Capability is anything a Task/agent can invoke: a deterministic Tool, a
// calculation Engine, a Rulebook, or an external Integration. Each gets a stable
// versioned id and a typed I/O contract so the Action Gateway (./gateway) can
// authorize an actor against it (kernel-migration-spec §2.1 "Capability").
// Derives from the existing `ToolDefinition` (backend/runtime), rulebook editors,
// lib/google/*, lib/steps/*.
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal JSON-Schema shape for typed I/O contracts (refined later). */
export type JsonSchema = Record<string, unknown>;

export type CapabilityKind = 'tool' | 'engine' | 'rulebook' | 'integration';

/** How dangerous invoking the capability is — drives whether approval is required. */
export type RiskLevel = 'read' | 'compute' | 'mutate' | 'external';

export type Capability = {
  /** Stable id the gateway authorizes against, e.g. "workflow.addBlock", "google.drive.read". */
  id: string;
  version: number;
  kind: CapabilityKind;
  displayName: string;
  description: string;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  riskLevel: RiskLevel;
  /** Agent ids permitted to invoke this capability (empty = user-only). */
  permittedAgents: string[];
  /** Whether an invocation must pass a human approval checkpoint. */
  requiresApproval: boolean;
  /** The AuditEvent type emitted when this capability runs. */
  auditEventType: string;
};
