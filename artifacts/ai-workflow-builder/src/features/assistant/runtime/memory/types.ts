// ─────────────────────────────────────────────────────────────────────────────
// Assistant memory — shared types + validated write input.
//
// Memory = durable facts/preferences the user explicitly asks the assistant to
// remember (never auto-inferred). Tenant boundary is the userId (enforced on the
// server); clientId/fiscalYear/workflowId are optional scope filters.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

export const MEMORY_KINDS = ['preference', 'fact', 'scope'] as const;
export type MemoryKind = (typeof MEMORY_KINDS)[number];

/** A memory as seen by the retrieval policy / client (row-shape subset). */
export type MemoryView = {
  id: string;
  clientId: string | null;
  fiscalYear: number | null;
  workflowId: string | null;
  kind: MemoryKind;
  subject: string | null;
  content: string;
  source: 'user' | 'assistant';
  createdAt: string | number | Date;
};

/** Validated body for POST /api/assistant/memory. */
export const SaveMemoryInputSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  subject: z.string().trim().max(200).optional(),
  kind: z.enum(MEMORY_KINDS).optional(),
  clientId: z.string().trim().max(200).nullish(),
  fiscalYear: z.number().int().min(1900).max(3000).nullish(),
  workflowId: z.string().trim().max(200).nullish(),
  source: z.enum(['user', 'assistant']).optional(),
});
export type SaveMemoryInput = z.infer<typeof SaveMemoryInputSchema>;
