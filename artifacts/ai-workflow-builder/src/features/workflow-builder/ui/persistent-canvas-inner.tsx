

import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowCanvas } from "./workflow-canvas";

// The actual ReactFlow canvas layer. Split into its own module so persistent-canvas
// can dynamic-import it — this keeps @xyflow/react + WorkflowCanvas (the heavy
// canvas component, d3 zoom/pan, node renderers) out of the shared app-shell chunk
// that loads on every route. Only pulled when a canvas route is active.
export default function PersistentCanvasInner() {
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
