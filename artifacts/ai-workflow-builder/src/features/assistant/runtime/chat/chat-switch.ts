import type { AguiMessage } from './message-codec';

export function assertCurrentChatRequest(messages: AguiMessage[], expectedUserMessageId: string) {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  if (!expectedUserMessageId || lastUser?.id !== expectedUserMessageId)
    throw new Error('The user request changed. No computer task was delegated.');
}

/** Stop the model/tool follow-up loop, then let its event stream settle before replacing messages. */
export async function stopChatBeforeSwitch(chat: {
  stopGeneration: () => void;
  agent?: { detachActiveRun: () => Promise<void> };
}) {
  chat.stopGeneration();
  await chat.agent?.detachActiveRun();
}
