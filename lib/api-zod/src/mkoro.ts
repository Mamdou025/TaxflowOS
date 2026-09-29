import { z } from 'zod';

export const MKORO_PATH = '/api/mkoro';
export const MKORO_WORKER_PATH = '/api/mkoro-worker';
export const MKORO_OFFLINE_MS = 45_000;
export const MKORO_DELEGATION_CAPABILITY = 'sina-delegation-v1';
export const MKORO_SCREEN_CAPABILITY = 'desktop-screenshots-v1';
export const MKORO_SCREEN_LEASE_MS = 10_000;
export const MKORO_SCREEN_FRAME_TTL_MS = 15_000;
export const MKORO_SCREEN_MAX_BYTES = 512 * 1024;
export const MKORO_SCREEN_MAX_DIMENSION = 1920;
export const MkoroIdSchema = z.string().uuid();
export const MkoroThreadIdSchema = z.string().trim().min(1).max(200);
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
  autoApprove: z.boolean().optional(),
  capabilities: z.array(z.string()),
  status: z.enum(['online', 'offline', 'revoked']),
  lastSeenAt: date.nullable(),
  createdAt: date,
});
export const MkoroApprovalSettingsSchema = z.object({ autoApprove: z.boolean() }).strict();
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
  threadId: MkoroThreadIdSchema.nullable().default(null),
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
export const MkoroDelegationSchema = z
  .object({
    taskType: z.enum(['external_file', 'browser', 'desktop', 'local_file']),
    target: z.string().trim().min(1).max(2000),
    objective: z.string().trim().min(1).max(8000),
    expectedOutput: z.string().trim().min(1).max(2000),
    reasonNoPlatformTool: z.string().trim().min(1).max(1000),
  })
  .strict();
export const MkoroDelegationRequestSchema = MkoroDelegationSchema.extend({
  threadId: MkoroThreadIdSchema,
  workerId: MkoroIdSchema,
  requestId: MkoroIdSchema,
}).strict();
export const MkoroTaskSchema = z.object({
  id: MkoroIdSchema,
  conversationId: MkoroIdSchema,
  workerId: MkoroIdSchema,
  message: z.string(),
  requestId: MkoroIdSchema,
  delegation: MkoroDelegationSchema.nullable().default(null),
  status: z.enum(['queued', 'running', 'waiting_permission', 'completed', 'failed', 'cancelled']),
  cancelRequested: z.boolean(),
  connectionLost: z.boolean(),
  error: z.string().nullable(),
  createdAt: date,
  updatedAt: date,
});
export const MkoroDelegationResponseSchema = z.object({
  conversation: MkoroConversationSchema,
  task: MkoroTaskSchema,
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
export const MkoroScreenLeaseSchema = z.object({
  taskId: MkoroIdSchema,
  leaseId: MkoroIdSchema,
  expiresAt: date,
  intervalMs: z.literal(2000),
});
export const MkoroScreenFrameSchema = z
  .object({
    mimeType: z.literal('image/jpeg'),
    data: z
      .string()
      .min(4)
      .max(Math.ceil(MKORO_SCREEN_MAX_BYTES / 3) * 4),
    width: z.number().int().min(1).max(MKORO_SCREEN_MAX_DIMENSION),
    height: z.number().int().min(1).max(MKORO_SCREEN_MAX_DIMENSION),
    capturedAt: date,
  })
  .strict();
export const MkoroScreenErrorSchema = z
  .object({
    code: z.string().min(1).max(80),
    message: z.string().min(1).max(500),
  })
  .strict();
export const MkoroScreenUploadSchema = z.union([
  z
    .object({ taskId: MkoroIdSchema, leaseId: MkoroIdSchema, frame: MkoroScreenFrameSchema })
    .strict(),
  z
    .object({ taskId: MkoroIdSchema, leaseId: MkoroIdSchema, error: MkoroScreenErrorSchema })
    .strict(),
]);
export const MkoroScreenViewRequestSchema = z.object({ enabled: z.boolean() }).strict();
export const MkoroScreenViewResponseSchema = z.object({ lease: MkoroScreenLeaseSchema.nullable() });
export const MkoroScreenResponseSchema = z.object({
  status: z.enum(['waiting', 'ready', 'unavailable', 'inactive']),
  taskId: MkoroIdSchema,
  leaseExpiresAt: date.nullable(),
  frame: MkoroScreenFrameSchema.optional(),
  error: MkoroScreenErrorSchema.optional(),
});
export const MkoroWorkerPollRequestSchema = z
  .object({
    capabilities: z.array(z.string().max(80)).max(20).optional(),
  })
  .strict();
export const MkoroPollSchema = z.object({
  commands: z.array(MkoroCommandSchema),
  screenLease: MkoroScreenLeaseSchema.nullable().default(null),
});
export type MkoroWorker = z.infer<typeof MkoroWorkerSchema>;
export type MkoroConversation = z.infer<typeof MkoroConversationSchema>;
export type MkoroTask = z.infer<typeof MkoroTaskSchema>;
export type MkoroEvent = z.infer<typeof MkoroEventSchema>;
export type MkoroWorkerEvent = z.infer<typeof MkoroWorkerEventSchema>;
export type MkoroCommand = z.infer<typeof MkoroCommandSchema>;
export type MkoroDelegation = z.infer<typeof MkoroDelegationSchema>;
export type MkoroDelegationRequest = z.infer<typeof MkoroDelegationRequestSchema>;
export type MkoroScreenLease = z.infer<typeof MkoroScreenLeaseSchema>;
export type MkoroScreenFrame = z.infer<typeof MkoroScreenFrameSchema>;
export type MkoroScreenUpload = z.infer<typeof MkoroScreenUploadSchema>;
export type MkoroScreenResponse = z.infer<typeof MkoroScreenResponseSchema>;

// Standard browser/Node intrinsic, without coupling this portable contract to either host's types.
type ParsedTargetUrl = { origin: string; protocol: string; username: string; password: string };
declare const URL: { new (value: string): ParsedTargetUrl };

/** Explicit native targets stay with Sina; arbitrary task text is not an authorization boundary. */
export function validateMkoroDelegationTarget(
  input: Pick<MkoroDelegation, 'taskType' | 'target'>,
  platformOrigins: string[],
): string | null {
  let decoded = input.target;
  try {
    decoded = decodeURIComponent(input.target);
  } catch {
    /* Keep invalid escapes literal. */
  }
  if (/^\/(?:api|w|workflows|sources|connections)(?:[/?#]|$)/i.test(decoded))
    return 'Sina must handle Inscope actions with the platform tools.';
  if (input.target.startsWith('//')) {
    for (const origin of platformOrigins) {
      try {
        if (new URL(`${new URL(origin).protocol}${input.target}`).origin === new URL(origin).origin)
          return 'Sina must handle Inscope actions with the platform tools.';
      } catch {
        /* The normal explicit-target checks below still apply. */
      }
    }
  }
  let target: ParsedTargetUrl | undefined;
  try {
    target = new URL(input.target);
  } catch {
    /* Local paths and application names are valid. */
  }
  if (target && platformOrigins.includes(target.origin))
    return 'Sina must handle Inscope actions with the platform tools.';
  if (input.taskType === 'browser' && (!target || !['https:', 'http:'].includes(target.protocol)))
    return 'A browser delegation needs an explicit HTTP or HTTPS target.';
  if (target && (target.username || target.password))
    return 'Do not include credentials in a computer task target.';
  return null;
}
