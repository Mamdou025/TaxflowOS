

// ─────────────────────────────────────────────────────────────────────────────
// ThreadMessages — a custom CopilotChat `Messages` slot that renders pinned work
// (deterministically-launched runs + summoned fields/elements) INSIDE the same scroll
// as the conversation. This makes a launched run part of ONE scrollable thread with the
// composer fixed at the bottom — instead of a separate 70%-tall pane stacked ABOVE the
// chat (which read as "two chats").
//
// The default Messages isn't exported, so this reimplements it faithfully: the same
// .copilotKitMessages / .copilotKitMessagesContainer structure + auto-scroll-to-bottom
// and the same per-message RenderMessage call — plus the pinned node (via
// PinnedThreadContext) rendered at the top of the message container.
// ─────────────────────────────────────────────────────────────────────────────

import { Fragment, createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useCopilotChatInternal } from '@copilotkit/react-core';
import { useChatContext, type MessagesProps } from '@copilotkit/react-ui';
import { MessageSpecialistContext, buildMessageSpecialistMap, messageSignature } from './message-specialists';
import { ToolReceipt, buildToolCallInfo, receiptLabelFor } from '../workspace/tool-receipt';

/** Pinned work (runs / fields / elements) to render atop the message scroll. */
export const PinnedThreadContext = createContext<ReactNode>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMessage = { role?: string;[k: string]: any };

// Faithful copy of CopilotKit's internal useScrollToBottom: auto-scroll on new user
// turns / streamed content, but stop following once the user scrolls up.
function useScrollToBottom(userMessageCount: number) {
  const messagesEndRef = useRef<HTMLElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const isUserScrollUpRef = useRef(false);

  const scrollToBottom = () => {
    const c = messagesContainerRef.current;
    if (c && messagesEndRef.current) {
      isProgrammaticScrollRef.current = true;
      c.scrollTop = c.scrollHeight;
    }
  };

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const onScroll = () => {
      if (isProgrammaticScrollRef.current) { isProgrammaticScrollRef.current = false; return; }
      const { scrollTop, scrollHeight, clientHeight } = c;
      isUserScrollUpRef.current = scrollTop + clientHeight < scrollHeight;
    };
    c.addEventListener('scroll', onScroll);
    return () => c.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const mo = new MutationObserver(() => { if (!isUserScrollUpRef.current) scrollToBottom(); });
    mo.observe(c, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);

  useEffect(() => { isUserScrollUpRef.current = false; scrollToBottom(); }, [userMessageCount]);

  return { messagesEndRef, messagesContainerRef };
}

export function ThreadMessages(props: MessagesProps) {
  const {
    inProgress, children, RenderMessage, AssistantMessage, UserMessage, ErrorMessage, ImageRenderer,
    onRegenerate, onCopy, onThumbsUp, onThumbsDown, messageFeedback, markdownTagRenderers, chatError,
  } = props;
  const { icons } = useChatContext();
  const internal = useCopilotChatInternal() as unknown as { messages?: AnyMessage[]; interrupt?: ReactNode };
  const messages = (internal.messages ?? []) as AnyMessage[];
  const interrupt = internal.interrupt ?? null;
  const pinned = useContext(PinnedThreadContext);
  const { messagesContainerRef, messagesEndRef } = useScrollToBottom(
    messages.filter((m) => m?.role === 'user').length
  );
  const last = messages[messages.length - 1];

  // Per-message specialist avatars: map each assistant turn to the specialist of its
  // preceding user turn. Recomputes only when the message set changes (not per stream tick).
  const sig = messageSignature(messages);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the message id/role signature
  const specialistMap = useMemo(() => buildMessageSpecialistMap(messages), [sig]);

  // callId → { name, args } so a tool RESULT message can recover what was called
  // and render a verifiable "tools used" receipt beneath the answer it supports.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the message id/role signature
  const toolCallInfo = useMemo(() => buildToolCallInfo(messages), [sig]);

  return (
    <MessageSpecialistContext.Provider value={specialistMap}>
    <div className="copilotKitMessages" ref={messagesContainerRef}>
      <div className="copilotKitMessagesContainer">
        {/* Pinned work — runs/cards — scroll WITH the conversation (one thread). */}
        {pinned}
        {messages.map((message, index) => {
          // Attach a receipt to a tool RESULT message whose tool warrants one — so
          // every data/research call the AI makes is shown, with its inputs + result,
          // right where it happened. Existing rich cards (web search, runWorkflow)
          // are left to RenderMessage; the receipt fills in the cardless tools.
          const call = message?.role === 'tool' ? toolCallInfo.get(message.toolCallId) : undefined;
          const receiptLabel = call ? receiptLabelFor(call.name) : null;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={index}>
              <RenderMessage
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message={message as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messages={messages as any}
                inProgress={inProgress}
                index={index}
                isCurrentMessage={index === messages.length - 1}
                AssistantMessage={AssistantMessage}
                UserMessage={UserMessage}
                ImageRenderer={ImageRenderer}
                onRegenerate={onRegenerate}
                onCopy={onCopy}
                onThumbsUp={onThumbsUp}
                onThumbsDown={onThumbsDown}
                messageFeedback={messageFeedback}
                markdownTagRenderers={markdownTagRenderers}
              />
              {receiptLabel && call && (
                <ToolReceipt label={receiptLabel} args={call.args} result={message.content} />
              )}
            </Fragment>
          );
        })}
        {inProgress && (last?.role === 'user' || last?.role === 'tool') && (
          <span data-testid="copilot-loading-cursor">{icons?.activityIcon}</span>
        )}
        {interrupt}
        {chatError && ErrorMessage ? <ErrorMessage error={chatError} isCurrentMessage /> : null}
      </div>
      <footer className="copilotKitMessagesFooter" ref={messagesEndRef}>
        {children}
      </footer>
    </div>
    </MessageSpecialistContext.Provider>
  );
}
