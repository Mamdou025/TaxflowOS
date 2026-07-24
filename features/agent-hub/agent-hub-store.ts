'use client';

// Shared state for the Agent surface — the header tabs (usePageMenu) and the body
// read one source of truth for the active tab.

import { atom } from 'jotai';

export type AgentTab = 'overview' | 'build' | 'lab';

export const agentTabAtom = atom<AgentTab>('overview');
