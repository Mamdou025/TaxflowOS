import type { AguiMessage } from './message-codec';

const pendingDetach = new WeakMap<object, Promise<void>>();

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
  if (!chat.agent) return;
  const agent = chat.agent;
  let stopped = pendingDetach.get(agent);
  if (!stopped) {
    stopped = agent.detachActiveRun();
    pendingDetach.set(agent, stopped);
    const clear = () => {
      if (pendingDetach.get(agent) === stopped) pendingDetach.delete(agent);
    };
    void stopped.then(clear, clear);
  }
  // The SDK may clear its detach handle before its completion promise settles.
  // A retry must still wait for that original completion before replacing history.
  await stopped;
}
