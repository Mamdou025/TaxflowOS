// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Evidence & lineage (re-export, unchanged)
//
// The existing evidence/lineage types are already the strongest pieces of the
// codebase — the kernel adopts them verbatim rather than reinventing them
// (kernel-migration-spec §2.1: EvidenceReference "Keep as-is; re-export from kernel").
// `EvidenceReference` is the kernel's canonical name for the existing `EvidenceRef`.
// ─────────────────────────────────────────────────────────────────────────────

import type { EvidenceRef, SourceTraceRef } from '@/shared/workflow-engine/execution/runtime/types';

/** Canonical kernel name for an immutable pointer to a source value. */
export type EvidenceReference = EvidenceRef;

export type { EvidenceRef, SourceTraceRef };

// Governance/protection is likewise already modeled; re-export as the kernel vocabulary.
export type {
  GovernanceMetadata,
  SourceMetadata,
} from '@/shared/workflow-engine/domain/workflow/workflow-types';
export type { ProtectedKind } from '@/shared/workflow-engine/domain/workflow/protected-rules';
