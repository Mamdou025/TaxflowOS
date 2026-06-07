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
export const navActionsAtom = atom<NavAction[]>([]);
