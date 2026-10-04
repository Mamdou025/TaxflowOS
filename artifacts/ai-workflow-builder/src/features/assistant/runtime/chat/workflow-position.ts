import type { AguiMessage } from './message-codec';
import type { ChatWorkflowBinding } from './workflow-binding';

/** Locate the opening receipt, never a mention or a later input/recalculation action. */
export function workflowMessageIndex(
  messages: AguiMessage[],
  binding: ChatWorkflowBinding | null,
): number {
  if (!binding) return -1;
  const openings = new Set<string>();
  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    if (message.role === 'assistant') {
      for (const call of message.toolCalls ?? []) {
        if (
          call.id &&
          ['runWorkflow', 'openSavedWorkflowVersion'].includes(call.function?.name ?? '')
        )
          openings.add(call.id);
      }
    }
    if (message.role !== 'tool' || !message.toolCallId || !openings.has(message.toolCallId))
      continue;
    try {
      const result =
        typeof message.content === 'string' ? JSON.parse(message.content) : message.content;
      if (
        result &&
        typeof result === 'object' &&
        result.workflowId === binding.workflowId &&
        result.runId === binding.runId
      )
        return index;
    } catch {
      // A failed or incomplete tool receipt cannot identify an execution.
    }
  }
  if (binding.afterMessageId)
    return messages.findIndex(
      (message) =>
        message.id === binding.afterMessageId ||
        message.toolCalls?.some((call) => call.id === binding.afterMessageId),
    );
  return -1;
}
