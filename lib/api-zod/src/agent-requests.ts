/** HTTP transport allowance, independent of a model's token/context limit. */
export const AGENT_REQUEST_LIMIT_BYTES = 4 * 1024 * 1024;
export const AGENT_REQUEST_TOO_LARGE =
  'Agent request exceeds 4 MiB. Instructions, conversation history and attached documents count toward this limit. Reduce attached reference material or start a new conversation, then retry. Your instructions have not been shortened.';

/** Callers measure the serialized UTF-8 body with their platform's encoder. */
export function agentRequestSizeError(bytes: number): string | undefined {
  return bytes > AGENT_REQUEST_LIMIT_BYTES
    ? `Request size: ${(bytes / 1024 / 1024).toFixed(2)} MiB. ${AGENT_REQUEST_TOO_LARGE}`
    : undefined;
}
