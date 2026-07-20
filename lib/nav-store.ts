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

export const selectedClientAtom = atom('Northstar Inc.');
export const showClientSwitcherAtom = atom(false);
// Fiscal/tax year in scope — shown as a tag next to the Scope orb. A placeholder scope
// parameter for now (static); it will be driven by the per-workflow scope definition
// later (some workflows care about a year, others don't).
export const scopeYearAtom = atom(2025);
export const navActionsAtom = atom<NavAction[]>([]);
