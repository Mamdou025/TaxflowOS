import { atom } from 'jotai';

export const CLIENTS = [
  'Northstar Inc.',
  'Meridian Energy Corp.',
  'Atlas Financial Group',
  'Cascade Technologies Ltd.',
  'Vantage Capital Partners',
  'Solaris Group',
  'Pinnacle Holdings',
  'Redwood Industries',
];

export type NavAction = {
  id: string;
  label: string;
  href: string;
};

// Conversation labels only; these do not identify a company dataset or grant access.
export const selectedClientAtom = atom('');
export const showClientSwitcherAtom = atom(false);
export const scopeYearAtom = atom<number | null>(null);
export const navActionsAtom = atom<NavAction[]>([]);
