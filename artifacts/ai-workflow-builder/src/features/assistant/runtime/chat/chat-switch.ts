import type { AguiMessage } from './message-codec';

const pendingDetach = new WeakMap<object, Promise<void>>();

// The SDK's detachActiveRun() signals its run-cancellation subject synchronously,
// before its first await, so new message writes stop immediately regardless of
// how long the returned promise takes to settle — only its bookkeeping tail
// (clearing internal run state) can still be in flight after that. Code
// inspection (docs/chat-scope-recovery.md) found that tail can stay pending
// indefinitely for some runs ("an unbounded SDK detach race"), which previously
// meant a chat switch could silently consume the entire saved-chat-open budget
// waiting on it. Bound the wait instead: a timeout here still proceeds with the
// switch rather than erroring, since the writes it guards against have already
// stopped.
const DETACH_SETTLE_TIMEOUT_MS = 5_000;

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
  // A retry must still wait for that original completion before replacing
  // history, so this still awaits the same shared promise on every call — just
  // not past the settle timeout. A genuine rejection (an actual detach
  // failure, not a stall) still wins the race and propagates.
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, DETACH_SETTLE_TIMEOUT_MS);
    stopped.then(
      () => {
        clearTimeout(timer);
        resolve();
      },
      (cause) => {
        clearTimeout(timer);
        reject(cause);
      },
    );
  });
}
