import type { MkoroEvent } from '@workspace/api-zod/mkoro';

export type MkoroTranscriptItem =
  | { kind: 'text'; id: string; text: string }
  | { kind: 'tool'; id: string; title: string; status: string; text: string }
  | { kind: 'artifact'; id: string; name: string; path: string };

export function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
export function string(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
function toolText(value: unknown): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((item: unknown) => {
      const block = record(item);
      const content = record(block.content);
      return content.type === 'text' ? string(content.text) : '';
    })
    .filter(Boolean)
    .join('\n')
    .slice(0, 8000);
}

/** Render observable messages and tool results; never execute tool-provided HTML. */
export function projectMkoroEvents(events: MkoroEvent[]): MkoroTranscriptItem[] {
  const items: MkoroTranscriptItem[] = [];
  const toolIndexes = new Map<string, number>();
  for (const event of [...events].sort((a, b) => a.cursor - b.cursor)) {
    const payload = event.payload;
    if (event.type === 'message_delta' || event.type === 'message') {
      const text = string(payload.text);
      if (!text) continue;
      const last = items.at(-1);
      if (event.type === 'message_delta' && last?.kind === 'text') last.text += text;
      else items.push({ kind: 'text', id: event.id, text });
    } else if (event.type === 'tool_started' || event.type === 'tool_finished') {
      const id = string(payload.toolCallId, event.id);
      const index = toolIndexes.get(id);
      const previous = index === undefined ? undefined : items[index];
      const status = string(
        payload.status,
        event.type === 'tool_started' ? 'in_progress' : 'completed',
      );
      const next: MkoroTranscriptItem = {
        kind: 'tool',
        id,
        title: string(
          payload.title,
          previous?.kind === 'tool' ? previous.title : 'Computer action',
        ),
        status,
        text: toolText(payload.content) || (previous?.kind === 'tool' ? previous.text : ''),
      };
      if (index === undefined) {
        toolIndexes.set(id, items.length);
        items.push(next);
      } else items[index] = next;
    } else if (event.type === 'artifact_created') {
      items.push({
        kind: 'artifact',
        id: event.id,
        name: string(payload.name, 'Output file'),
        path: string(payload.path),
      });
    }
  }
  return items;
}
