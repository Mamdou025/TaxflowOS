import { Background, BackgroundVariant, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
  className?: string;
};

export const Canvas = ({ children, className, ...props }: CanvasProps) => {
  return (
    <ReactFlow
      deleteKeyCode={["Backspace", "Delete"]}
      fitView
      panActivationKeyCode={null}
      selectionOnDrag={false}
      zoomOnDoubleClick={false}
      zoomOnPinch
      style={{ background: "transparent" }}
      className={className}
      {...props}
    >
      {/* Reversed grid: dark hairlines on the gray builder ground (the wrapper
          paints #c9c9d4). Was white lines on a dark #18181c canvas. */}
      <Background
        bgColor="transparent"
        color="var(--sx-canvas-grid)"
        gap={28}
        lineWidth={0.5}
        variant={BackgroundVariant.Lines}
      />
      {children}
    </ReactFlow>
  );
};
