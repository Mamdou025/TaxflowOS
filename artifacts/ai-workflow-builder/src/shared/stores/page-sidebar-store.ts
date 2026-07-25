

// Page-sidebar contract — lets an inline page publish a CONTEXTUAL section into
// the Scope left sidebar (below "Clients & Chats"), instead of drawing its own
// second sidebar inside the panel body (which steals width from the canvas). The
// page calls usePageSidebar(pageKey, Component) and the ChatWorkspace sidebar
// renders the ACTIVE page's section. Mirrors usePageMenu (header) for the sidebar.

import { atom, useSetAtom } from 'jotai';
import { useEffect, type ComponentType } from 'react';

/** pageKey → the sidebar-section component to render for that page. */
export const pageSidebarsAtom = atom<Record<string, ComponentType>>({});

/**
 * Register a stable, module-scope component as the active page's sidebar section.
 * Pass a component that reads shared atoms (not props) so it stays in sync with
 * the page body. Cleans up on unmount / key change.
 */
export function usePageSidebar(key: string, Component: ComponentType) {
  const set = useSetAtom(pageSidebarsAtom);
  useEffect(() => {
    set((prev) => ({ ...prev, [key]: Component }));
    return () =>
      set((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  }, [key, set, Component]);
}
