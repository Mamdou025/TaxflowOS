import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Provider, createStore } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';
import type {
  LocalRunRecord,
  WorkflowDefinition,
} from '@/shared/workflow-engine/workflow/contracts';
import { workflowDefinitionToCanvas } from '@/shared/workflow-engine/workflow/canvas';
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  edgesAtom,
  executionLogsAtom,
  focusNodeIdAtom,
  isWorkflowOwnerAtom,
  nodesAtom,
  openBlockConfigIdAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
} from '@/shared/workflow-engine/state/workflow-store';
import { WorkflowCanvas } from '@/features/workflow-builder/ui/workflow-canvas';
import { RecordedInspectionContext } from '@/features/workflow-builder/ui/workspace/recorded-inspection-context';
import { OverlayProvider } from '@/shared/ui/overlays/overlay-provider';
import { OverlayContainer } from '@/shared/ui/overlays/overlay-container';

/** The regular Build canvas and workspace, scoped away from authoring state and persistence. */
export function RecordedWorkflowBuilder({
  definition,
  record,
  statuses,
  selectedBlockId,
  onSelect,
  header,
  evidence,
}: {
  definition: WorkflowDefinition;
  record?: LocalRunRecord;
  statuses: Record<string, string>;
  selectedBlockId: string;
  onSelect: (id: string) => void;
  header: ReactNode;
  evidence: ReactNode;
}) {
  const [store] = useState(() => {
    const isolated = createStore();
    isolated.set(isWorkflowOwnerAtom, false);
    isolated.set(currentWorkflowIdAtom, definition.id);
    isolated.set(currentWorkflowNameAtom, definition.name);
    isolated.set(selectedNodeAtom, selectedBlockId);
    isolated.set(focusNodeIdAtom, selectedBlockId);
    isolated.set(openBlockConfigIdAtom, selectedBlockId);
    return isolated;
  });
  useEffect(() => {
    const graph = workflowDefinitionToCanvas(definition);
    store.set(
      nodesAtom,
      graph.nodes.map((node) => ({
        ...node,
        selected: node.id === selectedBlockId,
        data: {
          ...node.data,
          status:
            statuses[node.id] === 'error'
              ? 'error'
              : statuses[node.id] === 'success'
                ? 'success'
                : 'idle',
        },
      })),
    );
    store.set(edgesAtom, graph.edges);
    store.set(selectedExecutionIdAtom, record?.execution.id ?? null);
    store.set(
      executionLogsAtom,
      Object.fromEntries((record?.logs ?? []).map((log) => [log.nodeId, log])),
    );
    store.set(selectedNodeAtom, selectedBlockId);
  }, [store, definition, record, statuses, selectedBlockId]);
  useEffect(
    () =>
      store.sub(selectedNodeAtom, () => {
        const id = store.get(selectedNodeAtom);
        if (id && id !== selectedBlockId) onSelect(id);
      }),
    [store, selectedBlockId, onSelect],
  );
  const inspection = useMemo(() => ({ record, header, evidence }), [record, header, evidence]);
  return (
    <Provider store={store}>
      <RecordedInspectionContext.Provider value={inspection}>
        <OverlayProvider>
          <div
            className="relative min-h-[320px] flex-1"
            aria-label="Recorded workflow graph"
            style={{ background: 'var(--sx-canvas-ground)' }}
          >
            <ReactFlowProvider>
              <WorkflowCanvas />
            </ReactFlowProvider>
          </div>
          <OverlayContainer />
        </OverlayProvider>
      </RecordedInspectionContext.Provider>
    </Provider>
  );
}
