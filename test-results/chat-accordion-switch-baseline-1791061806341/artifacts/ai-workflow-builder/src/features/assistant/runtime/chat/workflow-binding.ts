import { projectCompleteMessages, type AguiMessage, type ProjectedMessage } from './message-codec';

export type ChatWorkflowBinding = {
  workflowId: string;
  runId: string;
  /** Missing on legacy chats; null places the card before the first message. */
  afterMessageId?: string | null;
};

/** Capture an ID that survives the codec, excluding unfinished tool exchanges. */
export function workflowAnchorForMessages(messages: AguiMessage[]): string | null {
  return projectCompleteMessages(messages).at(-1)?.id ?? null;
}

/** Metadata-only row: the message codec never places it in the model's transcript. */
export function withWorkflowBinding(
  messages: ProjectedMessage[],
  threadId: string,
  binding: ChatWorkflowBinding | null,
): ProjectedMessage[] {
  return [
    {
      id: `${threadId}:workflow-binding`,
      role: 'system',
      seq: 0,
      content: { workflowBinding: binding },
    },
    ...messages.map((message, index) => ({ ...message, seq: index + 1 })),
  ];
}

export function readWorkflowBinding(messages: { content: unknown }[]): ChatWorkflowBinding | null {
  const metadata = messages.find(
    (message) =>
      message.content &&
      typeof message.content === 'object' &&
      'workflowBinding' in message.content,
  );
  if (!metadata) return null; // Legacy chats must not guess a run.
  const value = (metadata.content as { workflowBinding: unknown }).workflowBinding;
  if (value === null) return null;
  if (
    !value ||
    typeof value !== 'object' ||
    !('workflowId' in value) ||
    typeof value.workflowId !== 'string' ||
    !value.workflowId ||
    !('runId' in value) ||
    typeof value.runId !== 'string' ||
    !value.runId
  )
    throw new Error('This saved chat has an invalid workflow link. No other run was selected.');
  if (
    'afterMessageId' in value &&
    value.afterMessageId !== null &&
    (typeof value.afterMessageId !== 'string' || !value.afterMessageId.trim())
  )
    throw new Error('This saved chat has an invalid workflow position. No other run was selected.');
  return {
    workflowId: value.workflowId,
    runId: value.runId,
    ...('afterMessageId' in value ? { afterMessageId: value.afterMessageId as string | null } : {}),
  };
}
