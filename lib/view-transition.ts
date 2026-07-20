// Client-side View Transition helper.
//
// `@view-transition { navigation: auto }` (globals.css) only animates
// cross-document navigations — Next's client-side router.push never triggers it.
// So to transition between routes on a SPA nav (e.g. the /home → / "Scope" move)
// we explicitly wrap the navigation in document.startViewTransition(). The root
// crossfade is styled in globals.css (::view-transition-old/new(root)).
//
// The VT snapshots the "new" DOM when the callback's promise resolves, so we give
// React a couple of frames to commit the destination route before resolving.

type DocWithVT = Document & { startViewTransition?: (cb: () => Promise<void> | void) => unknown };

export function viewTransitionNav(navigate: () => void): void {
  if (typeof document === 'undefined') { navigate(); return; }
  const doc = document as DocWithVT;
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduced) { navigate(); return; }

  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        navigate();
        // Wait for React to commit + paint the new route before the VT captures
        // its "new" snapshot; the timeout is a safety net if paint is slow.
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 90)));
      }),
  );
}
