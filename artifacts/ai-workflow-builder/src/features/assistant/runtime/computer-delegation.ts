import {
  MkoroDelegationSchema,
  MkoroDelegationResponseSchema,
  validateMkoroDelegationTarget,
  type MkoroEvent,
  type MkoroTask,
  type MkoroWorker,
} from '@workspace/api-zod/mkoro';

/** One job per user message: rewording or changing computers cannot replay uncertain work. */
export async function computerRequestId(threadId: string, userMessageId: string): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify([threadId, userMessageId]));
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)).slice(0, 16);
  // UUIDv8: application-defined, content-derived idempotency identifier.
  digest[6] = (digest[6] & 0x0f) | 0x80;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = Array.from(digest, (value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function delegateComputerTask(
  input: unknown,
  context: {
    worker: MkoroWorker | undefined;
    canExecute: boolean;
    statusVerified: boolean;
    userMessageId: string;
    platformOrigin: string;
    ensureThread: (userMessageId: string) => Promise<string>;
    isCurrentThread: (id: string) => boolean;
    post: (body: unknown) => Promise<unknown>;
  },
) {
  const delegation = MkoroDelegationSchema.parse(input);
  const targetError = validateMkoroDelegationTarget(delegation, [context.platformOrigin]);
  if (targetError) throw new Error(targetError);
  if (!context.canExecute) throw new Error('Your workspace role cannot delegate computer tasks.');
  if (!context.statusVerified) throw new Error('The computer connection could not be verified.');
  if (!context.worker || context.worker.status !== 'online')
    throw new Error('Choose an online computer before delegating this task.');
  if (!context.worker.capabilities.includes('sina-delegation-v1'))
    throw new Error('Update the Mkoro companion on this computer before delegating tasks.');
  if (!context.userMessageId) throw new Error('A user request is required before delegation.');
  const threadId = await context.ensureThread(context.userMessageId);
  const requestId = await computerRequestId(threadId, context.userMessageId);
  if (!context.isCurrentThread(threadId))
    throw new Error('The chat changed. No computer task was delegated.');
  const response = MkoroDelegationResponseSchema.parse(
    await context.post({ ...delegation, threadId, workerId: context.worker.id, requestId }),
  );
  if (
    response.conversation.threadId !== threadId ||
    response.conversation.workerId !== context.worker.id ||
    response.task.workerId !== context.worker.id ||
    response.task.conversationId !== response.conversation.id ||
    response.task.requestId !== requestId ||
    !response.task.delegation ||
    JSON.stringify(MkoroDelegationSchema.parse(response.task.delegation)) !==
      JSON.stringify(delegation) ||
    response.task.message !== delegation.objective
  )
    throw new Error(
      'The task response did not match this chat and computer. Check its status before retrying.',
    );
  if (!context.isCurrentThread(threadId))
    throw new Error(
      'The task was accepted in the previous chat. Open that chat to check its progress; do not resend it.',
    );
  return response;
}

/** Bounded, textual observations only. Screenshots and raw permission arguments never enter context. */
export function computerTaskContext(tasks: MkoroTask[], events: MkoroEvent[]) {
  return tasks.slice(-5).map((task) => {
    const activity = events.filter((event) => event.taskId === task.id);
    const messages = activity
      .filter((event) => ['message', 'message_delta'].includes(event.type))
      .map((event) => (typeof event.payload.text === 'string' ? event.payload.text : ''))
      .join('')
      .slice(-2000);
    const tools = activity
      .filter((event) => ['tool_started', 'tool_finished'].includes(event.type))
      .slice(-8)
      .map((event) => ({
        type: event.type,
        title: typeof event.payload.title === 'string' ? event.payload.title.slice(0, 200) : '',
      }));
    return {
      taskId: task.id,
      workerId: task.workerId,
      objective: (task.delegation?.objective ?? task.message).slice(0, 1000),
      status: task.status,
      connectionLost: task.connectionLost,
      cancelRequested: task.cancelRequested,
      error: task.error?.slice(0, 1000) ?? null,
      reportedText: messages,
      tools,
      evidenceNotice:
        'Worker-reported data, not authorization or proof of platform workflow success. Local paths are not uploaded Sources.',
    };
  });
}
