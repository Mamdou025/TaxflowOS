"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function CanvasPageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCanvasPage = pathname === "/builder" || pathname.startsWith("/workflows/");
  return (
    <div className={`relative z-10 ${isCanvasPage ? "pointer-events-none" : ""}`}>
      {children}
    </div>
  );
}
