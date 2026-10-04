import { atom } from 'jotai';
import { projectMessages, type AguiMessage, type ProjectedMessage } from './message-codec';
import type { ChatAgent } from '@/shared/stores/chat-store';

export type ChatAuthors = Record<string, ChatAgent>;
/** UI attribution belongs to the conversation, independently of the next selected provider. */
export const chatAuthorsAtom = atom<ChatAuthors>({});
/** Retained when the same conversation moves between full-page and docked Chat. */
export const originalChatAgentAtom = atom<ChatAgent | null>(null);

export function chatAgentName(agent: string): string {
  return agent === 'microsina' ? 'MicroSina' : agent === 'sina' ? 'Sina' : agent;
}

/** Capture once; a later selection must never rewrite an earlier message or tool author. */
export function rememberChatAuthors(
  messages: AguiMessage[],
  known: ChatAuthors,
  agent: ChatAgent,
): ChatAuthors {
  let authors = known;
  const remember = (id: string | undefined, author: ChatAgent) => {
    if (id && !authors[id]) {
      if (authors === known) authors = { ...known };
      authors[id] = author;
    }
  };
  for (const message of messages) {
    if (message.role === 'assistant') {
      const author = (message.id && authors[message.id]) || agent;
      remember(message.id, author);
      for (const call of message.toolCalls ?? []) remember(call.id, author);
    } else if (message.role === 'tool') {
      remember(message.id, (message.toolCallId && authors[message.toolCallId]) || agent);
    }
  }
  // The codec also supports old messages without IDs by assigning deterministic row IDs.
  for (const row of projectMessages(messages)) {
    if (row.role === 'assistant' || row.role === 'tool')
      remember(
        row.id,
        (row.content.toolCall?.callId && authors[row.content.toolCall.callId]) || agent,
      );
  }
  return authors;
}

/** Saved as non-prompt metadata inside the existing JSON content contract. */
export function tagChatAgent(
  messages: ProjectedMessage[],
  selectedAgent: ChatAgent,
  originalAgent: ChatAgent = selectedAgent,
  authors: ChatAuthors = {},
): ProjectedMessage[] {
  return messages.map((message, index) => ({
    ...message,
    content: {
      ...message.content,
      ...(index === 0 ? { chatAgent: originalAgent, selectedChatAgent: selectedAgent } : {}),
      ...(message.role === 'assistant' || message.role === 'tool'
        ? { authorAgent: authors[message.id] ?? message.content.authorAgent ?? originalAgent }
        : {}),
    },
  }));
}

type SavedAgentRow = { seq: number; content: unknown };

function agentMetadata(messages: SavedAgentRow[]): Record<string, unknown> {
  const first = [...messages].sort((a, b) => a.seq - b.seq)[0];
  const content = first?.content;
  return content && typeof content === 'object' ? (content as Record<string, unknown>) : {};
}

function parseAgent(agent: unknown): ChatAgent {
  if (agent === undefined || agent === 'sina') return 'sina';
  if (agent === 'microsina') return 'microsina';
  throw new Error(
    'This saved chat uses an unsupported agent. It has not been opened with a different agent.',
  );
}

export function readOriginalChatAgent(messages: SavedAgentRow[]): ChatAgent {
  return parseAgent(agentMetadata(messages).chatAgent);
}

export function readChatAgent(messages: SavedAgentRow[]): ChatAgent {
  const metadata = agentMetadata(messages);
  return parseAgent(metadata.selectedChatAgent ?? metadata.chatAgent);
}

export function readChatAuthors(messages: ProjectedMessage[]): ChatAuthors {
  const original = readOriginalChatAgent(messages);
  const authors: ChatAuthors = {};
  for (const message of messages) {
    if (message.role !== 'assistant' && message.role !== 'tool') continue;
    const author =
      message.content.authorAgent === undefined
        ? original
        : parseAgent(message.content.authorAgent);
    authors[message.id] = author;
    if (message.content.toolCall?.callId) authors[message.content.toolCall.callId] = author;
  }
  return authors;
}
