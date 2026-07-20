// ─────────────────────────────────────────────────────────────────────────────
// Stable error codes for the assistant runtime.
//
// A small, closed vocabulary so logs, evals, and any user-facing recovery message
// can key off a code instead of matching free-text. This slice only needs the
// routing/target/tool subset; the list is intentionally extensible.
// ─────────────────────────────────────────────────────────────────────────────

export const ASSISTANT_ERROR_CODES = {
  ROUTE_VALIDATION_FAILED: 'ROUTE_VALIDATION_FAILED',
  ROUTE_EXECUTION_DOWNGRADED: 'ROUTE_EXECUTION_DOWNGRADED',
  WORKFLOW_TARGET_AMBIGUOUS: 'WORKFLOW_TARGET_AMBIGUOUS',
  WORKFLOW_TARGET_MISSING: 'WORKFLOW_TARGET_MISSING',
  TOOL_NOT_AVAILABLE: 'TOOL_NOT_AVAILABLE',
  PROVIDER_CONFIGURATION_ERROR: 'PROVIDER_CONFIGURATION_ERROR',
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  INTENT_GATE_FAILED: 'INTENT_GATE_FAILED',
} as const;

export type AssistantErrorCode = keyof typeof ASSISTANT_ERROR_CODES;

export class AssistantRuntimeError extends Error {
  readonly code: AssistantErrorCode;
  readonly retryable: boolean;
  constructor(code: AssistantErrorCode, message: string, retryable = false) {
    super(message);
    this.name = 'AssistantRuntimeError';
    this.code = code;
    this.retryable = retryable;
  }
}
