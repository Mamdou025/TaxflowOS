import type { ThreadMessageLike, ToolCallMessagePart } from '@assistant-ui/react';
import type { AguiMessage } from './message-codec';

type MessagePart = Exclude<ThreadMessageLike['content'], string>[number];
type MessageWithSource = { metadata?: { custom?: Record<string, unknown> } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseRecordedValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function imageValue(part: Record<string, unknown>): string | undefined {
  if (part.type === 'image' && isRecord(part.source)) {
    const source = part.source;
    if (typeof source.value !== 'string' || !source.value) return undefined;
    if (source.type === 'url') return source.value;
    if (
      source.type === 'data' &&
      typeof source.mimeType === 'string' &&
      /^image\/[a-z0-9.+-]+$/i.test(source.mimeType)
    )
      return `data:${source.mimeType};base64,${source.value}`;
  }
  // Older multimodal turns may use the Chat Completions image-url shape.
  if (part.type === 'image_url' && isRecord(part.image_url)) {
    const url = part.image_url.url;
    if (typeof url === 'string' && url) return url;
  }
  return undefined;
}

function contentParts(content: unknown, includeImages: boolean): MessagePart[] {
  if (typeof content === 'string') return content ? [{ type: 'text', text: content }] : [];
  if (!Array.isArray(content)) return [];
  return content.flatMap((part): MessagePart[] => {
    if (typeof part === 'string') return [{ type: 'text', text: part }];
    if (!isRecord(part)) return [];
    if (part.type === 'text' && typeof part.text === 'string')
      return [{ type: 'text', text: part.text }];
    const image = includeImages ? imageValue(part) : undefined;
    return image ? [{ type: 'image', image }] : [];
  });
}

function errorResult(message: AguiMessage, result: unknown): boolean {
  if ('isError' in message && message.isError === true) return true;
  if ('error' in message && typeof message.error === 'string' && message.error.trim()) return true;
  if (!isRecord(result)) return false;
  return (
    result.isError === true ||
    (typeof result.error === 'string' && result.error.trim().length > 0) ||
    isRecord(result.error)
  );
}

/** Display projection only: the existing agent owns messages, tools and persistence. */
export function projectAssistantUiMessages(messages: readonly AguiMessage[]): ThreadMessageLike[] {
  const results = new Map<string, AguiMessage>();
  for (const message of messages) {
    if (message.role === 'tool' && message.toolCallId) results.set(message.toolCallId, message);
  }
  return messages.flatMap((message, originalRawIndex): ThreadMessageLike[] => {
    if (message.role !== 'user' && message.role !== 'assistant') return [];
    const content = contentParts(message.content, message.role === 'user');
    if (message.role === 'assistant') {
      for (const [index, call] of (message.toolCalls ?? []).entries()) {
        const toolName = call.function?.name;
        if (!toolName) continue;
        const argsText = call.function?.arguments ?? '';
        const parsedArgs = parseRecordedValue(argsText);
        // JSON.parse produces JSON values; tool arguments must be an object.
        const args = isRecord(parsedArgs) ? (parsedArgs as ToolCallMessagePart['args']) : {};
        const resultMessage = call.id ? results.get(call.id) : undefined;
        const result = resultMessage ? parseRecordedValue(resultMessage.content) : undefined;
        content.push({
          type: 'tool-call',
          toolCallId: call.id ?? `taxflow:projection:${originalRawIndex}:tool:${index}`,
          toolName,
          args,
          argsText,
          ...(result !== undefined && resultMessage
            ? { result, isError: errorResult(resultMessage, result) }
            : {}),
        });
      }
    }
    return [
      {
        id: message.id ?? `taxflow:projection:${originalRawIndex}`,
        role: message.role,
        content,
        metadata: { custom: { originalRawIndex, originalMessage: message } },
      },
    ];
  });
}

/** Source identity is view metadata, never a new model or persisted message. */
export function rawMessageIndex(message: MessageWithSource): number | undefined {
  const index = message.metadata?.custom?.originalRawIndex;
  return typeof index === 'number' && Number.isInteger(index) && index >= 0 ? index : undefined;
}

export function rawMessageSource(message: MessageWithSource): AguiMessage | undefined {
  const source = message.metadata?.custom?.originalMessage;
  return isRecord(source) && typeof source.role === 'string' ? (source as AguiMessage) : undefined;
}
