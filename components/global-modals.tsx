"use client";

import { OverlayContainer } from "@/shared/ui/overlays/overlay-container";
import { OverlaySync } from "@/shared/ui/overlays/overlay-sync";

/**
 * Global modals and overlays that need to be rendered once at app level
 */
export function GlobalModals() {
  return (
    <>
      <OverlayContainer />
      <OverlaySync />
    </>
  );
}
