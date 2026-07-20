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

  // The whole app is dark-grid now, so the canvas starts dark immediately — no
  // light→dark fade (that wash was the main "slow" feeling on entry).
  return (
    <div className="fixed inset-0 z-0" style={{ background: '#18181c' }}>
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
