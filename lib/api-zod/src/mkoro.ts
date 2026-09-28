import { z } from 'zod';

export const MKORO_PATH = '/api/mkoro';
export const MKORO_WORKER_PATH = '/api/mkoro-worker';
export const MKORO_OFFLINE_MS = 45_000;
export const MkoroIdSchema = z.string().uuid();
const date = z.string().datetime();
const text = z.string().max(32_000);
export const MkoroPairRequestSchema = z
  .object({
    pairingToken: z.string().min(40).max(200),
    name: z.string().trim().min(1).max(100),
    capabilities: z.array(z.string().max(80)).max(20).default([]),
  })
  .strict();
export const MkoroPairResponseSchema = z.object({
  workerId: MkoroIdSchema,
  token: z.string(),
  pollIntervalMs: z.number().int().positive(),
});
export const MkoroPairingSchema = z.object({ pairingToken: z.string(), expiresAt: date });
export const MkoroWorkerSchema = z.object({
  id: MkoroIdSchema,
  name: z.string(),
  capabilities: z.array(z.string()),
  status: z.enum(['online', 'offline', 'revoked']),
  lastSeenAt: date.nullable(),
  createdAt: date,
});
export const MkoroWorkersSchema = z.object({ workers: z.array(MkoroWorkerSchema) });
export const MkoroCreateConversationSchema = z
  .object({
    workerId: MkoroIdSchema,
    title: z.string().trim().min(1).max(120).optional(),
  })
  .strict();
export const MkoroConversationSchema = z.object({
  id: MkoroIdSchema,
  workerId: MkoroIdSchema,
  title: z.string(),
  createdAt: date,
  updatedAt: date,
});
export const MkoroConversationsSchema = z.object({
  conversations: z.array(MkoroConversationSchema),
});
export const MkoroMessageRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(16_000),
    requestId: MkoroIdSchema,
  })
  .strict();
export const MkoroTaskSchema = z.object({
  id: MkoroIdSchema,
  conversationId: MkoroIdSchema,
  workerId: MkoroIdSchema,
  message: z.string(),
  requestId: MkoroIdSchema,
  status: z.enum(['queued', 'running', 'waiting_permission', 'completed', 'failed', 'cancelled']),
  cancelRequested: z.boolean(),
  connectionLost: z.boolean(),
  error: z.string().nullable(),
  createdAt: date,
  updatedAt: date,
});
export const MkoroPermissionOptionSchema = z
  .object({
    optionId: z.string().min(1).max(200),
    name: z.string().max(500),
    kind: z.enum(['allow_once', 'allow_always', 'reject_once', 'reject_always']),
  })
  .strict();
export const MkoroEventTypeSchema = z.enum([
  'task_started',
  'message_delta',
  'message',
  'tool_started',
  'tool_finished',
  'permission_required',
  'artifact_created',
  'task_completed',
  'task_failed',
  'task_cancelled',
]);
// Tool output is untrusted display data, never executable UI or authorization.
const payload = z
  .record(z.string().max(100), z.unknown())
  .refine((value) => JSON.stringify(value).length <= 48_000, 'Event payload is too large.');
export const MkoroWorkerEventSchema = z
  .object({
    id: MkoroIdSchema,
    taskId: MkoroIdSchema,
    seq: z.number().int().nonnegative().max(1_000_000),
    type: MkoroEventTypeSchema,
    payload,
  })
  .strict()
  .superRefine((event, ctx) => {
    const schema =
      event.type === 'permission_required'
        ? z.object({
            requestId: z.string().min(1).max(200),
            toolCall: z.unknown().optional(),
            options: z.array(MkoroPermissionOptionSchema).min(1).max(20),
          })
        : ['message', 'message_delta'].includes(event.type)
          ? z.object({ text })
          : event.type === 'task_failed'
            ? z.object({ message: text })
            : null;
    if (schema && !schema.safeParse(event.payload).success)
      ctx.addIssue({ code: 'custom', message: 'Invalid event payload.' });
  });
export const MkoroEventBatchSchema = z
  .object({
    events: z.array(MkoroWorkerEventSchema).min(1).max(40),
  })
  .strict();
export const MkoroEventSchema = z.object({
  id: MkoroIdSchema,
  taskId: MkoroIdSchema,
  seq: z.number().int(),
  type: MkoroEventTypeSchema,
  payload: z.record(z.string(), z.unknown()),
  cursor: z.number().int().nonnegative(),
  createdAt: date,
});
export const MkoroPendingPermissionSchema = z.object({
  taskId: MkoroIdSchema,
  requestId: z.string(),
  toolCall: z.unknown().optional(),
  options: z.array(MkoroPermissionOptionSchema),
});
export const MkoroEventsSchema = z.object({
  task: MkoroTaskSchema,
  events: z.array(MkoroEventSchema),
  cursor: z.number().int().nonnegative(),
  pendingPermissions: z.array(MkoroPendingPermissionSchema),
});
export const MkoroConversationDetailSchema = z.object({
  conversation: MkoroConversationSchema,
  tasks: z.array(MkoroTaskSchema),
  events: z.array(MkoroEventSchema),
  eventsTruncated: z.boolean(),
  tasksTruncated: z.boolean(),
  pendingPermissions: z.array(MkoroPendingPermissionSchema),
});
export const MkoroPermissionRequestSchema = z
  .object({
    requestId: z.string().min(1).max(200),
    optionId: z.string().min(1).max(200),
  })
  .strict();
export const MkoroCommandSchema = z.object({
  id: MkoroIdSchema,
  type: z.enum(['message', 'cancel', 'permission']),
  taskId: MkoroIdSchema,
  payload: z.record(z.string(), z.unknown()),
});
export const MkoroPollSchema = z.object({ commands: z.array(MkoroCommandSchema) });
export type MkoroWorker = z.infer<typeof MkoroWorkerSchema>;
export type MkoroConversation = z.infer<typeof MkoroConversationSchema>;
export type MkoroTask = z.infer<typeof MkoroTaskSchema>;
export type MkoroEvent = z.infer<typeof MkoroEventSchema>;
export type MkoroWorkerEvent = z.infer<typeof MkoroWorkerEventSchema>;
export type MkoroCommand = z.infer<typeof MkoroCommandSchema>;
