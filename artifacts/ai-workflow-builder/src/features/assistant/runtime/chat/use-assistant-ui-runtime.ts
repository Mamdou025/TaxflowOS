import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  MessageNotSentError,
  useExternalStoreRuntime,
  type AttachmentAdapter,
  type ThreadMessageLike,
} from '@assistant-ui/react';
import { useCopilotContext } from '@copilotkit/react-core';
import { useAgent, useAgentContext, useCopilotKit } from '@copilotkit/react-core/v2';
import { chatAgentAtom } from '@/shared/stores/chat-store';
import { chatSessionAtom } from '@/features/workflows-hub/workflow-session-store';
import type { Assistant } from '../../ui/use-assistant';
import type { ArmedComposerTool } from '../../workspace/composer-context';
import { formatArmedMessage } from '../../ui/runnable-tools';
import { projectAssistantUiMessages, rawMessageIndex } from './assistant-ui-messages';
import { workflowMessageIndex } from './workflow-position';
import { workflowInteractionAtom } from './workflow-interaction-store';

// Files stay local until Send. Source parsing and document context remain owned
// by the existing workspace ingestion adapters, not assistant-ui's text parsers.
const attachments: AttachmentAdapter = {
  accept: '*',
  async add({ file }) {
    return {
      id: crypto.randomUUID(),
      type: 'file',
      name: file.name,
      contentType: file.type,
      file,
      status: { type: 'requires-action', reason: 'composer-send' },
    };
  },
  async remove() {},
  async send(attachment) {
    return { ...attachment, status: { type: 'complete' }, content: [] };
  },
};

/** One engine owns tools/history; assistant-ui owns the visible conversation. */
export function useAssistantUiRuntime(
  assistant: Assistant,
  instructions: string,
  armedTool: ArmedComposerTool | null,
  clearArmedTool: () => void,
) {
  const { agent, isReady } = useAgent();
  const { copilotkit } = useCopilotKit();
  const { additionalInstructions } = useCopilotContext();
  const provider = useAtomValue(chatAgentAtom);
  const workflow = useAtomValue(chatSessionAtom);
  const workflowInteraction = useAtomValue(workflowInteractionAtom);
  const [error, setError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [attaching, setAttaching] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [interrupt, setInterrupt] = useState(copilotkit.interruptElement);
  const mounted = useRef(true);
  const submitting = useRef(false);
  const latest = useRef(assistant);
  latest.current = assistant;
  const liveAgent = useRef({ agent, isReady });
  liveAgent.current = { agent, isReady };
  const errorText =
    provider === 'microsina'
      ? 'MicroSina could not complete its reply. Check the Foundry connection and Azure server identity, then retry. Sina has not been used as a fallback.'
      : 'Sina could not complete its reply. Check the connection and retry.';

  // The installed SDK retains setChatInstructions as legacy state, but its v2
  // runAgent transport sends registered context. Register with that owner so
  // ordinary replies, tool follow-ups and retries all receive the host rules.
  useAgentContext({
    description: 'InScope host interaction instructions',
    value: additionalInstructions?.length
      ? [
          instructions,
          'Additionally, follow these instructions:',
          ...additionalInstructions.map((value) => `- ${value}`),
        ].join('\n')
      : instructions,
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    setError('');
    const subscription = agent.subscribe({
      onRunStartedEvent: () => {
        setError('');
      },
      onRunFailed: ({ error: failure }) => {
        if (failure.name !== 'AbortError') setError(errorText);
      },
      onRunErrorEvent: () => {
        setError(errorText);
      },
    });
    return () => subscription.unsubscribe();
  }, [agent, errorText]);
  useEffect(() => {
    setInterrupt(copilotkit.interruptElement);
    const subscription = copilotkit.subscribe({
      onInterruptElementChanged: ({ interruptElement }) => setInterrupt(interruptElement),
    });
    return () => subscription.unsubscribe();
  }, [copilotkit]);

  const running = agent.isRunning || assistant.replyPending || retrying;
  const raw = agent.messages;
  const workflowKey = workflow ? `${workflow.workflowId}:${workflow.runId}` : '';
  const fallback = useRef({ key: '', index: -1 });
  if (fallback.current.key !== workflowKey)
    fallback.current = { key: workflowKey, index: raw.length - 1 };
  const messages = useMemo(() => {
    const projected = projectAssistantUiMessages(raw);
    const lastAssistant = projected.findLastIndex((message) => message.role === 'assistant');
    const latestUserIndex = raw.findLastIndex((message) => message.role === 'user');
    if (lastAssistant >= 0 && (rawMessageIndex(projected[lastAssistant]) ?? -1) > latestUserIndex) {
      projected[lastAssistant] = {
        ...projected[lastAssistant],
        status: running
          ? { type: 'running' }
          : error
            ? { type: 'incomplete', reason: 'error', error }
            : { type: 'complete', reason: 'stop' },
      };
    }
    if (workflow) {
      const receiptIndex = workflowMessageIndex(raw, workflow);
      const position =
        receiptIndex >= 0
          ? receiptIndex
          : workflow.afterMessageId !== undefined
            ? -1
            : Math.min(fallback.current.index, raw.length - 1);
      const insertion =
        projected.findLastIndex((message) => (rawMessageIndex(message) ?? -1) <= position) + 1;
      // A view-only row keeps live forms mounted at the opening receipt. It never
      // enters agent.messages, the provider request, or saved conversation data.
      const card: ThreadMessageLike = {
        id: `workspace-workflow:${workflowKey}`,
        role: 'assistant',
        content: [],
        status: { type: 'complete', reason: 'stop' },
        metadata: { custom: { workflow: true } },
      };
      projected.splice(insertion, 0, card);
    }
    if (workflowInteraction) {
      const position = workflowInteraction.afterMessageId
        ? raw.findIndex(
            (message) =>
              message.id === workflowInteraction.afterMessageId ||
              (message.role === 'assistant' &&
                message.toolCalls?.some((call) => call.id === workflowInteraction.afterMessageId)),
          )
        : -1;
      const insertion =
        projected.findLastIndex((message) => {
          const index = rawMessageIndex(message);
          return index !== undefined && index <= position;
        }) + 1;
      projected.splice(insertion, 0, {
        id: `workspace-selection:${workflowInteraction.id}`,
        role: 'assistant',
        content: [],
        status: { type: 'complete', reason: 'stop' },
        metadata: { custom: { workflowInteraction } },
      });
    }
    return projected;
  }, [raw, raw.length, running, error, workflow, workflowKey, workflowInteraction]);

  const lastUser = raw.findLastIndex((message) => message.role === 'user');
  const canRetry =
    Boolean(error) &&
    !assistant.restoring &&
    !assistant.restoreError &&
    !running &&
    isReady &&
    lastUser >= 0 &&
    !raw
      .slice(lastUser + 1)
      .some(
        (message) =>
          message.role === 'tool' || (message.role === 'assistant' && message.toolCalls?.length),
      );
  const retry = async () => {
    if (!canRetry || submitting.current || agent.isRunning) return;
    setRetrying(true);
    setError('');
    // Retry only a failed text turn. Previously completed tools stay in history;
    // a turn containing any tool call cannot be automatically replayed here.
    agent.setMessages(raw.slice(0, lastUser + 1));
    try {
      await copilotkit.runAgent({ agent });
    } catch {
      if (mounted.current) setError(errorText);
    } finally {
      if (mounted.current) setRetrying(false);
    }
  };

  const runtime = useExternalStoreRuntime({
    messages,
    convertMessage: (message: ThreadMessageLike) => message,
    isRunning: running,
    isLoading: assistant.restoring,
    isDisabled: assistant.restoring || Boolean(assistant.restoreError),
    isSendDisabled: attaching,
    unstable_enableToolInvocations: false,
    adapters: { attachments },
    onCancel: assistant.interruptReply,
    onNew: async (message) => {
      const epoch = assistant.getConversationEpoch();
      const current = () => mounted.current && epoch === latest.current.getConversationEpoch();
      if (submitting.current || agent.isRunning || assistant.restoring || assistant.restoreError)
        throw new MessageNotSentError('Wait for the current operation before sending.');
      submitting.current = true;
      setSubmissionError('');
      try {
        const files = (message.attachments ?? []).flatMap((attachment) =>
          attachment.file ? [attachment.file] : [],
        );
        setAttaching(files.length > 0);
        const note = files.length ? await assistant.onAttach(files) : '';
        if (!current())
          throw new MessageNotSentError('The conversation changed before this message was sent.');
        if (!liveAgent.current.isReady)
          throw new MessageNotSentError(
            'Chat is unavailable. Your message and attachments are still here; try sending again when the connection is ready.',
          );
        if (liveAgent.current.agent.isRunning || (files.length > 0 && latest.current.replyPending))
          throw new MessageNotSentError(
            'A reply started while the attachment was being prepared. Send again when it finishes.',
          );
        const text = message.content
          .flatMap((part) => (part.type === 'text' ? [part.text] : []))
          .join('\n')
          .trim();
        const body = [text, note].filter(Boolean).join('\n\n');
        if (!body) throw new MessageNotSentError('Enter a message or attach a file.');
        setError('');
        // appendMessage accepts the user turn synchronously. Resolve this send
        // when accepted; the agent subscription reports subsequent stream errors.
        void latest.current
          .say(armedTool ? formatArmedMessage(armedTool.name, body) : body)
          .catch(() => {
            if (current()) setError(errorText);
          });
        if (armedTool) clearArmedTool();
      } catch (failure) {
        const message = failure instanceof Error ? failure.message : 'Could not send this message.';
        if (current()) setSubmissionError(message);
        throw new MessageNotSentError(message);
      } finally {
        submitting.current = false;
        if (mounted.current) setAttaching(false);
      }
    },
  });
  return {
    runtime,
    connectionNotice: isReady
      ? ''
      : copilotkit.runtimeConnectionStatus === 'connecting' ||
          copilotkit.runtimeConnectionStatus === 'disconnected'
        ? 'Connecting to chat…'
        : `${provider === 'microsina' ? 'MicroSina' : 'Sina'} is unavailable. Your draft stays here; workflows and file imports remain available.`,
    error,
    canRetry,
    retry,
    attaching,
    agentReady: isReady,
    submissionError,
    interrupt,
    reportAttachmentError: (failure: unknown) =>
      setSubmissionError(
        failure instanceof Error ? failure.message : 'Could not attach this file.',
      ),
  };
}
