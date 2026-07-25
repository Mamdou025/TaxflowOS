// ─────────────────────────────────────────────────────────────────────────────
// Folder tree — the Scope sidebar's organizer for companies/clients and their
// chat history. Top-level nodes are client/company folders; they nest arbitrary
// subfolders (engagements, years); chats are the leaves (the chat history, filed
// under whichever folder they belong to). Persisted to localStorage.
//
// Display/seed data for now — chats aren't backed by a real transcript store yet,
// so selecting one highlights it (the wiring point is `selectedChatAtom`).
// ─────────────────────────────────────────────────────────────────────────────

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type TreeNode = {
  id: string;
  name: string;
  kind: 'folder' | 'chat';
  children?: TreeNode[];
  /** For chats: a relative "last active" label. */
  updated?: string;
};

// Client names mirror lib/nav-store CLIENTS so the active-client folder highlights.
const SEED: TreeNode[] = [
  {
    id: 'cl-northstar', name: 'Northstar Inc.', kind: 'folder', children: [
      {
        id: 'f-northstar-fapi', name: 'FAPI · 2025', kind: 'folder', children: [
          { id: 'ch-1', name: 'FAPI readiness review', kind: 'chat', updated: '2h ago' },
          { id: 'ch-2', name: 'Trial balance classification', kind: 'chat', updated: 'Yesterday' },
        ],
      },
      {
        id: 'f-northstar-t1134', name: 'T1134 · 2025', kind: 'folder', children: [
          { id: 'ch-3', name: 'Foreign affiliate disclosures', kind: 'chat', updated: '3d ago' },
        ],
      },
      { id: 'ch-4', name: 'GROSS approval — $538,100', kind: 'chat', updated: '1w ago' },
    ],
  },
  {
    id: 'cl-meridian', name: 'Meridian Energy Corp.', kind: 'folder', children: [
      {
        id: 'f-meridian-q2', name: 'Q2 Provision', kind: 'folder', children: [
          { id: 'ch-5', name: 'Provision review', kind: 'chat', updated: '18m ago' },
        ],
      },
      { id: 'ch-6', name: '3 rows need a category', kind: 'chat', updated: '2d ago' },
    ],
  },
  {
    id: 'cl-cascade', name: 'Cascade Technologies Ltd.', kind: 'folder', children: [
      { id: 'ch-7', name: 'T1134 compliance review', kind: 'chat', updated: '1w ago' },
    ],
  },
];

export const folderTreeAtom = atomWithStorage<TreeNode[]>('inscope.folders.v1', SEED);
export const expandedFoldersAtom = atomWithStorage<Record<string, boolean>>('inscope.folders.expanded.v1', { 'cl-northstar': true });
/** The chat currently opened from the tree (session-only; display highlight for now). */
export const selectedChatAtom = atom<string | null>(null);

export function uid(prefix: string): string {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rnd}`;
}

// ── Pure tree transforms (immutable) ────────────────────────────────────────────
function mapNode(nodes: TreeNode[], id: string, fn: (n: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map((n) =>
    n.id === id ? fn(n) : n.children ? { ...n, children: mapNode(n.children, id, fn) } : n,
  );
}

/** Append `child` under `parentId` (null → a new top-level/client folder). */
export function addChild(nodes: TreeNode[], parentId: string | null, child: TreeNode): TreeNode[] {
  if (parentId === null) return [...nodes, child];
  return mapNode(nodes, parentId, (n) => ({ ...n, children: [...(n.children ?? []), child] }));
}

export function removeNode(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => (n.children ? { ...n, children: removeNode(n.children, id) } : n));
}

export function renameNode(nodes: TreeNode[], id: string, name: string): TreeNode[] {
  return mapNode(nodes, id, (n) => ({ ...n, name }));
}
