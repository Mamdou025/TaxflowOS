import { atom } from 'jotai';
import type { WorkflowSourceDocument } from '@/features/documents/workflow-source-client';

/** Explicit source context for this mounted chat workspace; never changes library membership. */
export const selectedChatDocumentAtom = atom<WorkflowSourceDocument | null>(null);

export type ComposerWorkflowScope = { id: string; name: string };
export const selectedChatWorkflowAtom = atom<ComposerWorkflowScope | null>(null);
