

// Tells a page whether it's rendered INLINE inside the Scope panel (vs its own
// full-page route). Inline pages hide their own chrome (toolbar/sidebar) and
// publish their menu into the shared panel header via usePageMenu instead.

import { createContext, useContext, type ReactNode } from 'react';

const InlinePageContext = createContext(false);

export function InlinePageProvider({ children }: { children: ReactNode }) {
  return <InlinePageContext.Provider value={true}>{children}</InlinePageContext.Provider>;
}

export function useInlinePage(): boolean {
  return useContext(InlinePageContext);
}
