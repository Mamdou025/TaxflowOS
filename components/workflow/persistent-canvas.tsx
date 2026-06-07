"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { chatTakeoverAtom } from "@/lib/chat-store";
import { WorkflowCanvas } from "./workflow-canvas";

export function PersistentCanvas() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [bgDark, setBgDark] = useState(false);
  const chatTakeover = useAtomValue(chatTakeoverAtom);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showCanvas = pathname === "/builder" || pathname.startsWith("/workflows/");

  // Reset to light then fade dark each time the canvas becomes visible
  useEffect(() => {
    if (showCanvas) {
      setBgDark(false);
      const t = setTimeout(() => setBgDark(true), 60);
      return () => clearTimeout(t);
    }
  }, [showCanvas]);

  if (!(isMounted && showCanvas)) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: bgDark ? '#18181c' : '#eaeaef',
        opacity: chatTakeover ? 0.35 : 1,
        pointerEvents: chatTakeover ? 'none' : 'auto',
        transition: [
          'background 900ms cubic-bezier(0.23,1,0.32,1)',
          chatTakeover
            ? 'opacity 480ms ease-out'
            : 'opacity 560ms cubic-bezier(0.23,1,0.32,1)',
        ].join(', '),
      }}
    >
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
