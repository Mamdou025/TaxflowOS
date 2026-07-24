'use client';

// Page-menu contract — lets an inline page publish its menu into the shared panel
// header (instead of drawing its own toolbar/sidebar inside the narrow panel body
// that shares width with the chat). The page calls usePageMenu(pageKey, menu, deps)
// and the ChatWorkspace panel header renders the ACTIVE tab's menu.

import { atom, useSetAtom } from 'jotai';
import { useEffect, type ReactNode } from 'react';

export type MenuButton = {
  kind: 'button';
  id: string;
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  primary?: boolean;   // filled/accent (e.g. Run)
  title?: string;
};
export type MenuDropdownItem = { id: string; label: string; onClick: () => void; disabled?: boolean; danger?: boolean };
export type MenuDropdown = {
  kind: 'dropdown';
  id: string;
  label?: string;
  icon?: ReactNode;
  items: MenuDropdownItem[];
  title?: string;
};
export type MenuSeparator = { kind: 'separator'; id: string };
/** A non-interactive text label (e.g. the current item's name, breadcrumb-style).
 *  `width` reserves a fixed slot (px) so items after it keep a consistent x. */
export type MenuLabel = { kind: 'label'; id: string; text: string; strong?: boolean; width?: number };
export type PageMenuItem = MenuButton | MenuDropdown | MenuSeparator | MenuLabel;

/** left = near the tabs (File/Edit/Add…); right = far end (Save/Run…). */
export type PageMenu = { left?: PageMenuItem[]; right?: PageMenuItem[] };

export const pageMenusAtom = atom<Record<string, PageMenu>>({});

/**
 * Register (and keep updated) the menu for an inline page. `deps` control when the
 * menu is rebuilt — include any state the item callbacks/flags depend on (e.g.
 * hasUnsavedChanges, isRunning) so the header never shows a stale menu. Cleans up
 * on unmount / key change so closing a tab drops its menu.
 */
export function usePageMenu(key: string, menu: PageMenu, deps: unknown[] = []) {
  const set = useSetAtom(pageMenusAtom);
  useEffect(() => {
    set((prev) => ({ ...prev, [key]: menu }));
    return () =>
      set((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    // menu is intentionally rebuilt from `deps`; key/set are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, set, ...deps]);
}
