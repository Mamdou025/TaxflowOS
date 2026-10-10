import type { ReactNode } from 'react';
import {
  ActionBarPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  type ToolCallMessagePartProps,
} from '@assistant-ui/react';
import { MarkdownTextPrimitive } from '@assistant-ui/react-markdown';
import { useAgent, useRenderToolCall } from '@copilotkit/react-core/v2';
import { useAtomValue } from 'jotai';
import { ArrowDown, Copy } from 'lucide-react';
import { coworkerForMessage, SINA } from '@/lib/coworkers';
import { LC } from '@/lib/librechat-theme';
import { chatAgentAtom } from '@/shared/stores/chat-store';
import { chatAgentName, chatAuthorsAtom } from '../runtime/chat/chat-agent';
import { rawMessageSource } from '../runtime/chat/assistant-ui-messages';
import { ToolsUsed } from '../workspace/tool-receipt';
import { ChatWorkflowThread } from './chat-workflow-thread';
import { parseWorkflowInteraction } from '../runtime/chat/workflow-interaction';
import { CoworkerAvatar } from './coworker-avatar';

function MessageText() {
  return (
    <MarkdownTextPrimitive className="break-words text-sm leading-relaxed [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-5" />
  );
}

/** Reuse registered renderers only. CopilotKit remains the sole tool executor. */
function ExistingToolCard(props: ToolCallMessagePartProps) {
  const message = useAuiState((state) => state.message);
  const original = rawMessageSource(message);
  const { agent } = useAgent();
  const renderToolCall = useRenderToolCall();
  const source = agent.messages.find(
    (candidate) => candidate === original || (original?.id && candidate.id === original.id),
  );
  const toolCall =
    source?.role === 'assistant'
      ? source.toolCalls?.find((call) => call.id === props.toolCallId)
      : undefined;
  const toolMessage = agent.messages.find(
    (candidate) => candidate.role === 'tool' && candidate.toolCallId === props.toolCallId,
  );
  const rendered = toolCall
    ? renderToolCall({
        toolCall,
        toolMessage: toolMessage?.role === 'tool' ? toolMessage : undefined,
      })
    : null;
  if (rendered) return <div className="my-3">{rendered}</div>;
  return (
    <div className="my-3">
      {props.result === undefined && (
        <p role="status" className="mb-2 text-xs" style={{ color: LC.muted }}>
          Awaiting tool result…
        </p>
      )}
      {props.isError && (
        <p role="status" className="mb-2 text-xs text-destructive">
          This tool reported an error.
        </p>
      )}
      <ToolsUsed
        calls={[
          {
            id: props.toolCallId,
            name: props.toolName,
            args: props.argsText || props.args,
            result: props.result,
          },
        ]}
      />
    </div>
  );
}

function UserMessage() {
  const id = useAuiState((state) => state.message.id);
  return (
    <MessagePrimitive.Root className="lc-row justify-end" data-message-id={id} data-agent="user">
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3"
        style={{ background: LC.surface, color: LC.text, boxShadow: LC.shadowSm }}
      >
        <MessagePrimitive.Parts components={{ Text: MessageText }} />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  const message = useAuiState((state) => state.message);
  const selectedAgent = useAtomValue(chatAgentAtom);
  const authors = useAtomValue(chatAuthorsAtom);
  const original = rawMessageSource(message);
  const callId = original?.toolCalls?.[0]?.id;
  const author = authors[message.id] || (callId && authors[callId]) || selectedAgent;
  const attributed = coworkerForMessage(original);
  const coworker =
    author === 'microsina' && attributed.id === SINA.id
      ? { ...attributed, id: 'microsina', name: 'MicroSina', initials: 'MS' }
      : attributed;
  if (message.metadata.custom.workflowInteraction) {
    const selection = parseWorkflowInteraction(message.metadata.custom.workflowInteraction)!;
    return (
      <MessagePrimitive.Root data-message-id={message.id} data-agent="workspace">
        <div
          role="status"
          aria-label="Workflow selection"
          className={`my-3 rounded-xl border p-3 text-sm ${selection.status === 'failed' ? 'border-destructive/40 text-destructive' : 'bg-primary/5'}`}
        >
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Workflow selection</p>
          <p>{selection.message}</p>
        </div>
      </MessagePrimitive.Root>
    );
  }
  if (message.metadata.custom.workflow === true)
    return (
      <MessagePrimitive.Root data-message-id={message.id} data-agent="workflow-engine">
        <ChatWorkflowThread />
      </MessagePrimitive.Root>
    );
  return (
    <MessagePrimitive.Root className="lc-row" data-message-id={message.id} data-agent={author}>
      <span className="lc-avatar" aria-hidden="true">
        <CoworkerAvatar coworker={coworker} size={26} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5" style={{ color: LC.body }}>
        <div className="mb-1 text-xs font-semibold" style={{ color: LC.muted }}>
          {chatAgentName(author)}
        </div>
        <MessagePrimitive.Parts
          components={{ Text: MessageText, tools: { Fallback: ExistingToolCard } }}
        />
        {message.content.some((part) => part.type === 'text' && part.text.trim()) && (
          <ActionBarPrimitive.Root hideWhenRunning className="mt-2">
            <ActionBarPrimitive.Copy
              type="button"
              aria-label="Copy response"
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted data-[copied=true]:text-primary"
            >
              <Copy size={13} aria-hidden="true" />
              Copy
            </ActionBarPrimitive.Copy>
          </ActionBarPrimitive.Root>
        )}
      </div>
    </MessagePrimitive.Root>
  );
}

function ReplyStatus() {
  const running = useAuiState((state) => state.thread.isRunning);
  const agent = useAtomValue(chatAgentAtom);
  if (!running) return null;
  return (
    <div role="status" className="mb-4 flex items-center gap-2 text-xs" style={{ color: LC.muted }}>
      <span aria-hidden="true" className="lc-typing" />
      {chatAgentName(agent)} is replying…
    </div>
  );
}

/** One scroll surface, including the exact live workflow and bound computer tasks. */
export function AssistantUITranscript({
  hidden = false,
  pinned,
}: {
  hidden?: boolean;
  pinned?: ReactNode;
}) {
  return (
    <ThreadPrimitive.Viewport
      role="log"
      aria-label="Conversation"
      data-assistant-ui-thread
      hidden={hidden}
      className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
    >
      <div className="mx-auto w-full max-w-[860px]">
        <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
        {pinned}
        <ReplyStatus />
      </div>
      <div className="sticky bottom-2 flex justify-end">
        <ThreadPrimitive.ScrollToBottom
          type="button"
          aria-label="Scroll to latest message"
          className="rounded-full border bg-background p-2 shadow-sm disabled:invisible"
        >
          <ArrowDown size={16} aria-hidden="true" />
        </ThreadPrimitive.ScrollToBottom>
      </div>
    </ThreadPrimitive.Viewport>
  );
}
