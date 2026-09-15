export type SourceKind = 'document' | 'connected-dataset' | 'manual' | 'web';
export type SourceLifecycleStatus = 'active' | 'archived' | 'deleted' | 'purged';
export type SourceRetrievalPolicy = 'selected-only' | 'selected-and-authorized';
export type SourceRole = 'owner' | 'editor' | 'viewer';
export type SourceLifecycleAction = 'archive' | 'delete' | 'restore' | 'purge';

export type SourceIdentity = {
  sourceId: string;
  workspaceId: string;
  kind: SourceKind;
  label: string;
  revision: number;
  contentHash: string | null;
  clientId: string | null;
};

export type SourceLocator = {
  kind: 'document-chunk';
  chunkIndex: number;
};

export type SourceEvidence = {
  citationId: string;
  source: SourceIdentity;
  locator: SourceLocator;
  retrievedAt: string;
  similarity: number;
  selection: 'selected' | 'relevant';
};

export type SourcePassage = {
  content: string;
  evidence: SourceEvidence;
};

export type RetrievalLimitation = {
  code: 'SELECTED_SOURCE_UNAVAILABLE' | 'EMBEDDINGS_UNAVAILABLE' | 'RETRIEVAL_FAILED';
  message: string;
  retryable: boolean;
  sourceId?: string;
};

export type SourceRetrievalResult =
  | {
      status: 'ok';
      passages: SourcePassage[];
      limitations: RetrievalLimitation[];
    }
  | {
      status: 'empty' | 'unavailable';
      passages: [];
      limitations: RetrievalLimitation[];
    };

export type SourceCandidate = {
  identity: SourceIdentity;
  lifecycleStatus: SourceLifecycleStatus;
  inLibrary: boolean;
  content: string;
  chunkIndex: number;
  similarity: number;
};

export type SourceSelection = {
  passages: SourcePassage[];
  unavailableSelectedSourceIds: string[];
};

export type SourceOperationReceipt = {
  operationId: string;
  connector: string;
  status: 'succeeded' | 'failed';
  attempts: number;
  observedAt: string;
  retryable: boolean;
};

export function citationIdFor(sourceId: string, revision: number, chunkIndex: number): string {
  return `source:${sourceId}:r${revision}:chunk:${chunkIndex}`;
}

export function selectSourcePassages({
  candidates,
  workspaceId,
  clientId = null,
  selectedSourceIds = [],
  policy,
  limit,
  retrievedAt,
}: {
  candidates: SourceCandidate[];
  workspaceId: string;
  clientId?: string | null;
  selectedSourceIds?: string[];
  policy: SourceRetrievalPolicy;
  limit: number;
  retrievedAt: string;
}): SourceSelection {
  const selected = new Set(selectedSourceIds);
  const eligible = candidates.filter(
    (candidate) =>
      candidate.identity.workspaceId === workspaceId &&
      (clientId === null || candidate.identity.clientId === clientId) &&
      candidate.lifecycleStatus === 'active' &&
      (selected.has(candidate.identity.sourceId) ||
        (policy === 'selected-and-authorized' && candidate.inLibrary)),
  );
  eligible.sort((left, right) => {
    const selectedDelta =
      Number(selected.has(right.identity.sourceId)) - Number(selected.has(left.identity.sourceId));
    return selectedDelta || right.similarity - left.similarity;
  });

  const available = new Set(eligible.map((candidate) => candidate.identity.sourceId));
  const passages = eligible.slice(0, Math.max(0, limit)).map((candidate) => {
    const selection: SourceEvidence['selection'] = selected.has(candidate.identity.sourceId)
      ? 'selected'
      : 'relevant';
    return {
      content: candidate.content,
      evidence: {
        citationId: citationIdFor(
          candidate.identity.sourceId,
          candidate.identity.revision,
          candidate.chunkIndex,
        ),
        locator: { kind: 'document-chunk' as const, chunkIndex: candidate.chunkIndex },
        retrievedAt,
        selection,
        similarity: candidate.similarity,
        source: candidate.identity,
      },
    };
  });
  return {
    passages,
    unavailableSelectedSourceIds: [...selected].filter((sourceId) => !available.has(sourceId)),
  };
}

const ACTION_ROLES: Record<SourceLifecycleAction, readonly SourceRole[]> = {
  archive: ['owner', 'editor'],
  delete: ['owner', 'editor'],
  restore: ['owner'],
  purge: ['owner'],
};

const ACTION_TARGET: Record<SourceLifecycleAction, SourceLifecycleStatus> = {
  archive: 'archived',
  delete: 'deleted',
  restore: 'active',
  purge: 'purged',
};

const VALID_FROM: Record<SourceLifecycleAction, readonly SourceLifecycleStatus[]> = {
  archive: ['active'],
  delete: ['active', 'archived'],
  restore: ['archived', 'deleted'],
  purge: ['deleted'],
};

export class SourceLifecycleError extends Error {
  constructor(
    readonly code: 'FORBIDDEN' | 'INVALID_TRANSITION',
    message: string,
  ) {
    super(message);
    this.name = 'SourceLifecycleError';
  }
}

export function transitionSource(
  role: SourceRole,
  current: SourceLifecycleStatus,
  action: SourceLifecycleAction,
): SourceLifecycleStatus {
  if (!ACTION_ROLES[action].includes(role)) {
    throw new SourceLifecycleError('FORBIDDEN', `${role} cannot ${action} sources.`);
  }
  const target = ACTION_TARGET[action];
  if (current === target) return target;
  if (!VALID_FROM[action].includes(current)) {
    throw new SourceLifecycleError(
      'INVALID_TRANSITION',
      `A ${current} source cannot be changed with ${action}.`,
    );
  }
  return target;
}
