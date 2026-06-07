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
      <Background
        bgColor="transparent"
        color="rgba(255,255,255,0.055)"
        gap={28}
        lineWidth={0.5}
        variant={BackgroundVariant.Lines}
      />
      {children}
    </ReactFlow>
  );
};
