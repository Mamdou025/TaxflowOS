import { workspaceStorage } from '@/platform/auth/workspace-context';
import type {
  WorkflowEdge as CanvasWorkflowEdge,
  WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import {
  type LocalWorkflowSnapshot,
  LOCAL_WORKFLOW_STORAGE_KEY,
  type WorkflowDefinition,
  type WorkflowEvent,
  type WorkflowDefinitionStatus,
  type WorkflowEdge,
} from './contracts';
import { createWorkflowDefinitionFromCanvas } from './canvas';
import { appendWorkflowEvent } from './events';
import { LOCAL_SAMPLE_DATASET } from './sample-data';
import { normalizeWorkflowDefinition } from './normalization';

export type LocalWorkflowLoadResult = {
  snapshot: LocalWorkflowSnapshot | null;
  warning?: string;
};

function readStoredWorkflowDefinitionResult(): LocalWorkflowLoadResult {
  if (typeof window === 'undefined') {
    return { snapshot: null };
  }

  const stored = workspaceStorage.getItem(LOCAL_WORKFLOW_STORAGE_KEY);
  if (!stored) {
    return { snapshot: null };
  }

  try {
    return { snapshot: parseLocalWorkflowJson(stored) };
  } catch (error) {
    return {
      snapshot: null,
      warning: error instanceof Error ? error.message : 'Saved local workflow could not be loaded.',
    };
  }
}

export function readStoredWorkflowDefinition(): WorkflowDefinition | null {
  return readStoredWorkflowDefinitionResult().snapshot;
}

export function loadLocalWorkflowSnapshot(): LocalWorkflowSnapshot | null {
  return readStoredWorkflowDefinition();
}

export function loadLocalWorkflowSnapshotResult(): LocalWorkflowLoadResult {
  return readStoredWorkflowDefinitionResult();
}

export function saveLocalWorkflowSnapshot({
  description,
  edges,
  event,
  name,
  nodes,
  status,
}: {
  description?: string;
  edges: CanvasWorkflowEdge[];
  event?: WorkflowEvent;
  name: string;
  nodes: WorkflowNode[];
  status?: WorkflowDefinitionStatus;
}): LocalWorkflowSnapshot {
  const existing = readStoredWorkflowDefinition();
  const snapshot = createWorkflowDefinitionFromCanvas({
    description,
    edges,
    existing,
    name,
    nodes,
    status: status || existing?.status || 'draft',
  });
  snapshot.events = appendWorkflowEvent(snapshot, event);

  if (typeof window !== 'undefined') {
    workspaceStorage.setItem(LOCAL_WORKFLOW_STORAGE_KEY, JSON.stringify(snapshot, null, 2));
  }

  return snapshot;
}

export function saveWorkflowDefinitionSnapshot(snapshot: WorkflowDefinition): WorkflowDefinition {
  if (typeof window !== 'undefined') {
    workspaceStorage.setItem(LOCAL_WORKFLOW_STORAGE_KEY, JSON.stringify(snapshot, null, 2));
  }

  return snapshot;
}

export function parseLocalWorkflowJson(text: string): LocalWorkflowSnapshot {
  const parsed = JSON.parse(text) as Partial<
    LocalWorkflowSnapshot & {
      nodes?: WorkflowNode[];
      edges?: Array<CanvasWorkflowEdge | WorkflowEdge>;
      sampleDataset?: typeof LOCAL_SAMPLE_DATASET;
      version?: number;
    }
  >;

  if (Array.isArray(parsed.blocks)) {
    return normalizeWorkflowDefinition(parsed);
  }

  if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
    const canvasEdges = (parsed.edges as CanvasWorkflowEdge[]).map((edge) => ({
      ...edge,
      type: edge.type || 'animated',
    }));
    return createWorkflowDefinitionFromCanvas({
      name: parsed.name || 'Imported Fiscal Workflow',
      description: parsed.description || 'Imported local workflow.',
      nodes: parsed.nodes,
      edges: canvasEdges,
      status: parsed.status || 'draft',
    });
  }

  throw new Error('Imported JSON must include typed blocks or legacy nodes.');
}
