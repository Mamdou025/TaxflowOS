const CHAT_TRANSITION_TIMEOUT_MS = 20_000;

/** Bound the whole navigation, including SDK detachment before the HTTP read. */
export function createChatTransition(
  timeoutMessage: string,
  timeoutMs = CHAT_TRANSITION_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(timeoutMessage)), timeoutMs);
  const check = () => controller.signal.throwIfAborted();
  return {
    signal: controller.signal,
    check,
    async wait<T>(work: () => T | Promise<T>): Promise<T> {
      check();
      return new Promise<T>((resolve, reject) => {
        const abort = () => reject(controller.signal.reason);
        controller.signal.addEventListener('abort', abort, { once: true });
        Promise.resolve()
          .then(() => {
            check();
            return work();
          })
          .then((value) => {
            if (controller.signal.aborted) reject(controller.signal.reason);
            else resolve(value);
          }, reject)
          .finally(() => controller.signal.removeEventListener('abort', abort));
      });
    },
    cancel() {
      clearTimeout(timer);
      controller.abort(new DOMException('Chat navigation was superseded.', 'AbortError'));
    },
    finish() {
      clearTimeout(timer);
    },
  };
}
