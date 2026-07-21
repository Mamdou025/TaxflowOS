"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkflowCanvas } from "./workflow-canvas";

export function PersistentCanvas() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showCanvas = pathname === "/builder" || pathname.startsWith("/workflows/");

  if (!(isMounted && showCanvas)) {
    return null;
  }

  // Light neumorphic builder ground — a flat gray (#c9c9d4) matching the page
  // grounds; the canvas grid (ai-elements/canvas.tsx) draws dark hairlines on it.
  return (
    <div className="fixed inset-0 z-0" style={{ background: 'var(--sx-canvas-ground)' }}>
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
