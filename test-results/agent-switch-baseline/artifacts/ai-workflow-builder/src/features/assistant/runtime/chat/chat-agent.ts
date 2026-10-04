import type { ProjectedMessage } from './message-codec';
import type { ChatAgent } from '@/shared/stores/chat-store';

/** Saved as non-prompt metadata inside the existing JSON content contract. */
export function tagChatAgent(messages: ProjectedMessage[], agent: ChatAgent): ProjectedMessage[] {
  return messages.map((message, index) =>
    index === 0
      ? {
          ...message,
          content: { ...message.content, chatAgent: agent },
        }
      : message,
  );
}

export function readChatAgent(messages: { seq: number; content: unknown }[]): ChatAgent {
  const first = [...messages].sort((a, b) => a.seq - b.seq)[0];
  const content = first?.content;
  const agent =
    content && typeof content === 'object' && 'chatAgent' in content
      ? content.chatAgent
      : undefined;
  if (agent === undefined || agent === 'sina') return 'sina';
  if (agent === 'microsina') return 'microsina';
  throw new Error(
    'This saved chat uses an unsupported agent. It has not been opened with a different agent.',
  );
}
