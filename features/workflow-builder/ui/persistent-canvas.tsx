"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// The ReactFlow canvas + provider live in a separate module loaded on demand, so
// @xyflow/react stays out of the shared app-shell bundle (loaded on every route)
// and only ships when a canvas route (/builder, /workflows/*) is actually open.
const PersistentCanvasInner = dynamic(() => import("./persistent-canvas-inner"), { ssr: false });

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

  return <PersistentCanvasInner />;
}
