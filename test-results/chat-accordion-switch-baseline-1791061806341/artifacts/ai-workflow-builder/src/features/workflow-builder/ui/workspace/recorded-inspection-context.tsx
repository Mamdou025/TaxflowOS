import { createContext, useContext, type ReactNode } from 'react';
import { atom } from 'jotai';
import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { LocalRunRecord } from '@/shared/workflow-engine/workflow/contracts';

/** Exact recorded evidence supplied by the owning run view, never a latest-run lookup. */
export const RecordedInspectionContext = createContext<{
  record?: LocalRunRecord;
  header: ReactNode;
  evidence: ReactNode;
} | null>(null);

export function useRecordedInspection() {
  return useContext(RecordedInspectionContext);
}

// Do not mount the writable library's synchronization subscription in an isolated evidence view.
export const recordedInspectionLibraryAtom = atom<Record<string, PersonalWorkflow>>({});
