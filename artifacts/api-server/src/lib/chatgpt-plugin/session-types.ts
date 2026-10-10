import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import type { SessionAction } from '@workspace/workflow-core/sessions';

/** Identity is supplied by the authenticated adapter, never by tool arguments. */
export type SessionActor = { userId: string; workspaceId: string };
export type SessionPermission = 'read' | 'write' | 'execute';
export type SessionChange =
  | { kind: 'inputs'; blockId: string; patch: Record<string, unknown> }
  | { kind: 'source'; blockId: string; captureId: string; mode: 'replace' | 'add' };
export type SessionTarget = {
  workflowId: string;
  runId: string;
  expectedRevision: number;
  expectedLibraryRevision: number;
};
export type SessionDifference = { field: string; before: unknown; after: unknown };
export type SessionPreview = {
  reviewToken: string;
  workflowId: string;
  runId: string;
  revision: number;
  libraryRevision: number;
  expiresAt: string;
  changes: SessionDifference[];
  affectedBlockIds: string[];
  approvalInvalidated: boolean;
};
export type SessionReceipt = {
  workflowId: string;
  runId: string;
  version: number;
  revision: number;
  libraryRevision: number;
  paused: true;
  computed: boolean;
  executedBlockIds: string[];
  completedAt: string;
  stopReason?: string;
};
export type SessionHistory = {
  id: string;
  kind: 'start' | 'change' | 'recalculate';
  actorId: string;
  at: string;
  revisionBefore: number | null;
  revisionAfter: number;
  changes: SessionDifference[];
  affectedBlockIds: string[];
};
export type PreparedSessionChange = SessionTarget & {
  action: Extract<SessionAction, { kind: 'inputs' | 'source' }>;
};
export type SessionOperation = {
  key: string;
  actorId: string;
  workspaceId: string;
  workflowId: string;
  runId: string | null;
  kind: SessionHistory['kind'];
  requestHash: string;
  action: Record<string, unknown>;
  preview: Omit<SessionPreview, 'reviewToken'> | null;
  receipt: SessionReceipt | null;
  createdAt: string;
  expiresAt: string;
};
export type SessionTransaction = {
  library: WorkflowLibrary;
  libraryRevision: number;
  getOperation(key: string): Promise<SessionOperation | undefined>;
  putOperation(operation: SessionOperation): Promise<void>;
  saveLibrary(library: WorkflowLibrary, expectedRevision: number): Promise<number>;
  listOperations(workflowId: string, runId: string): Promise<SessionOperation[]>;
};
export type SessionStore = {
  /** Re-check current membership, lock revisions, and commit all mutations atomically. */
  transaction<T>(
    actor: SessionActor,
    permission: SessionPermission,
    work: (transaction: SessionTransaction) => Promise<T>,
  ): Promise<T>;
};
export type CapturedSessionSource = {
  id: string;
  workflowId: string;
  runId: string;
  blockId: string;
  name: string;
  rows: Record<string, unknown>[];
  extraction: DocumentExtraction;
};
export type SessionCaptures = {
  /** Must authenticate capture ownership and return an immutable server-parsed snapshot. */
  resolve(actor: SessionActor, captureId: string): Promise<CapturedSessionSource>;
};
export class SessionCommandError extends Error {
  constructor(
    public readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'FORBIDDEN' | 'CONFLICT' | 'EXPIRED',
    message: string,
  ) {
    super(message);
    this.name = 'SessionCommandError';
  }
}
