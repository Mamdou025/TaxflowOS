

// ─────────────────────────────────────────────────────────────────────────────
// Worksheet-intel registry — the bridge between mounted worksheets and the chat.
//
// Each open worksheet registers its live `WorksheetIntel` here (keyed by id); the
// assistant's global explain/why/search actions read this registry at call time
// and dispatch to the right worksheet. This keeps action NAMES unique (registered
// once, globally) while supporting any number of worksheets open at once — the
// readable each worksheet publishes tells the model which ids exist.
// ─────────────────────────────────────────────────────────────────────────────

import { atom } from 'jotai';
import type { WorksheetIntel } from './types';

export const worksheetIntelRegistryAtom = atom<Record<string, WorksheetIntel>>({});

export const registerWorksheetIntelAtom = atom(null, (_get, set, intel: WorksheetIntel) => {
  set(worksheetIntelRegistryAtom, (prev) => ({ ...prev, [intel.id]: intel }));
});

export const unregisterWorksheetIntelAtom = atom(null, (get, set, id: string) => {
  const prev = get(worksheetIntelRegistryAtom);
  if (!(id in prev)) return;
  const next = { ...prev };
  delete next[id];
  set(worksheetIntelRegistryAtom, next);
});

/** Choose which worksheet a query targets: explicit id (exact → fuzzy), else the
 *  sole open worksheet, else null (caller asks the user / model to disambiguate). */
export function pickIntel(reg: Record<string, WorksheetIntel>, id?: string): WorksheetIntel | null {
  const ids = Object.keys(reg);
  if (id) {
    const q = id.toLowerCase();
    if (reg[id]) return reg[id];
    const byId = ids.find((k) => k.toLowerCase() === q);
    if (byId) return reg[byId];
    const byTitle = ids.find((k) => reg[k].title.toLowerCase().includes(q));
    if (byTitle) return reg[byTitle];
    return null;
  }
  if (ids.length === 1) return reg[ids[0]];
  return null;
}

export function listIntel(reg: Record<string, WorksheetIntel>): Array<{ id: string; title: string }> {
  return Object.values(reg).map((i) => ({ id: i.id, title: i.title }));
}
