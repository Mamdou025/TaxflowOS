import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/platform/api-client';
import { authClient } from '@/platform/auth/auth-client';
import { buildRunnableWorkflowSnapshot } from '@/shared/workflow-engine/runtime/workflow-runs';
import {
  createWorkflowBlockFromCatalog,
  createWorkflowNodeFromBlock,
} from '@/shared/workflow-engine/workflow/block-factory';
import { createWorkflowEvent } from '@/shared/workflow-engine/workflow/events';
import { createBlankWorkflow } from '@/shared/workflow-engine/workflow/templates/portfolio';
import { type PortfolioWorkflowDef } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { LOCAL_WORKFLOW_ID } from '@/shared/workflow-engine/workflow/contracts';
import {
  parseLocalWorkflowJson,
  saveLocalWorkflowSnapshot,
  saveWorkflowDefinitionSnapshot,
} from '@/shared/workflow-engine/workflow/storage';
import { workflowDefinitionToCanvas } from '@/shared/workflow-engine/workflow/canvas';
import { type WorkflowVisibility } from '@/shared/workflow-engine/state/workflow-store';
import { appendWorkflowChangeEvent } from '@/shared/workflow-engine/audit/change-log';
import {
  createWorkflowAuditEvent,
  summarizeWorkflowForAudit,
  type WorkflowAuditEventType,
} from '@/shared/workflow-engine/audit/workflow-events';
import { ConfigurationOverlay } from '@/features/workflow-builder/ui/overlays/configuration-overlay';
import { ConfirmOverlay } from '@/shared/ui/overlays/confirm-overlay';
import { MakePublicOverlay } from '@/features/workflow-builder/ui/overlays/make-public-overlay';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import {
  buildFapiWorkbookImportPatch,
  parseExcelWorkbookFile,
} from '@/shared/workflow-engine/parsing/excel-utils';
import { useWorkflowState } from './use-workflow-state';
import { useWorkflowHandlers } from './use-workflow-handlers';
import { isExcelSourceNode, applyWorkbookImportPatchToNode } from './workbook-import';

// Hook for workflow actions
export function useWorkflowActions(state: ReturnType<typeof useWorkflowState>) {
  const { open: openOverlay } = useOverlay();
  const {
    currentWorkflowId,
    isLocal,
    workflowName,
    setCurrentWorkflowName,
    nodes,
    edges,
    updateNodeData,
    isExecuting,
    setIsExecuting,
    setIsSaving,
    setHasUnsavedChanges,
    clearWorkflow,
    setWorkflowVisibility,
    setAllWorkflows,
    setIsDownloading,
    setIsDuplicating,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
    triggerExecute,
    setTriggerExecute,
    router,
    session,
  } = state;

  const { handleSave, handleExecute } = useWorkflowHandlers({
    currentWorkflowId,
    workflowName,
    nodes,
    edges,
    updateNodeData,
    isExecuting,
    setIsExecuting,
    setIsSaving,
    setHasUnsavedChanges,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
  });

  const recordWorkflowAuditEvent = ({
    after,
    metadata,
    reason,
    type,
  }: {
    after?: {
      edgeCount: number;
      name?: string;
      nodeCount: number;
      status?: string;
    };
    metadata?: Record<string, unknown>;
    reason?: string;
    type: WorkflowAuditEventType;
  }) => {
    appendWorkflowChangeEvent(
      createWorkflowAuditEvent({
        actor: 'workflow-toolbar',
        after: summarizeWorkflowForAudit(
          after || {
            edgeCount: edges.length,
            name: workflowName,
            nodeCount: nodes.length,
          },
        ),
        metadata,
        reason,
        targetObjectId: currentWorkflowId || LOCAL_WORKFLOW_ID,
        targetObjectType: 'workflow',
        type,
        workflowId: currentWorkflowId || LOCAL_WORKFLOW_ID,
      }),
    );
  };

  // Listen for execute trigger from keyboard shortcut
  useEffect(() => {
    if (triggerExecute) {
      setTriggerExecute(false);
      handleExecute();
    }
  }, [triggerExecute, setTriggerExecute, handleExecute]);

  const handleClearWorkflow = () => {
    openOverlay(ConfirmOverlay, {
      title: 'Clear Workflow',
      message:
        'Are you sure you want to clear all nodes and connections? This action cannot be undone.',
      confirmLabel: 'Clear Workflow',
      confirmVariant: 'destructive' as const,
      destructive: true,
      onConfirm: () => {
        if (isLocal) {
          setNodes([]);
          setEdges([]);
          setSelectedNodeId(null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveLocalWorkflowSnapshot({
            edges: [],
            event: createWorkflowEvent({
              type: 'save_draft',
              message: 'Local draft cleared.',
            }),
            name: workflowName,
            nodes: [],
            status: 'draft',
          });
          setHasUnsavedChanges(false);
          return;
        }
        clearWorkflow();
      },
    });
  };

  const handleDeleteWorkflow = () => {
    openOverlay(ConfirmOverlay, {
      title: 'Delete Workflow',
      message: `Are you sure you want to delete "${workflowName}"? This will permanently delete the workflow. This cannot be undone.`,
      confirmLabel: 'Delete Workflow',
      confirmVariant: 'destructive' as const,
      destructive: true,
      onConfirm: async () => {
        if (!currentWorkflowId) {
          return;
        }
        if (isLocal) {
          const blank = {
            ...createBlankWorkflow(),
            events: [
              createWorkflowEvent({
                type: 'save_draft',
                message: 'Local workflow deleted. Opened a blank workflow.',
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(blank);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(blank.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(blank);
          setHasUnsavedChanges(false);
          toast.success('Local workflow deleted');
          return;
        }
        try {
          await api.workflow.delete(currentWorkflowId);
          toast.success('Workflow deleted successfully');
          window.location.href = '/';
        } catch (error) {
          console.error('Failed to delete workflow:', error);
          toast.error('Failed to delete workflow. Please try again.');
        }
      },
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadLocalWorkflow = () => {
    const snapshot = saveLocalWorkflowSnapshot({
      edges,
      event: createWorkflowEvent({
        type: 'export_workflow',
        message: 'Workflow JSON exported locally.',
      }),
      name: workflowName,
      nodes,
    });
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json',
    });
    const safeName = snapshot.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'workflow';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `workflow-studio-${safeName}-${timestamp}.json`;
    downloadBlob(blob, fileName);
    recordWorkflowAuditEvent({
      metadata: { fileName, format: 'json' },
      reason: 'Workflow JSON exported from the local toolbar.',
      type: 'workflow_exported',
    });
    toast.success('Workflow JSON exported');
  };

  const downloadWorkflowCode = async (workflowId: string) => {
    toast.info('Preparing workflow files for download...');
    const result = await api.workflow.download(workflowId);

    if (!result.success) {
      throw new Error(result.error || 'Failed to prepare download');
    }

    if (!result.files) {
      throw new Error('No files to download');
    }

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const [path, content] of Object.entries(result.files)) {
      zip.file(path, content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const fileName = `${workflowName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-workflow.zip`;
    downloadBlob(blob, fileName);
    recordWorkflowAuditEvent({
      metadata: { fileName, format: 'zip', workflowId },
      reason: 'Workflow code package exported from the toolbar.',
      type: 'workflow_exported',
    });
    toast.success('Workflow downloaded successfully!');
  };

  const handleDownload = async () => {
    if (!currentWorkflowId) {
      toast.error('Please save the workflow before downloading');
      return;
    }

    setIsDownloading(true);

    try {
      if (isLocal) {
        downloadLocalWorkflow();
      } else {
        await downloadWorkflowCode(currentWorkflowId);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download workflow');
    } finally {
      setIsDownloading(false);
    }
  };

  const loadWorkflows = async () => {
    if (isLocal) {
      return;
    }

    try {
      const workflows = await api.workflow.getAll();
      setAllWorkflows(workflows);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const handleToggleVisibility = async (newVisibility: WorkflowVisibility) => {
    if (isLocal) {
      return;
    }

    if (!currentWorkflowId) {
      return;
    }

    // Show confirmation overlay when making public
    if (newVisibility === 'public') {
      openOverlay(MakePublicOverlay, {
        onConfirm: async () => {
          try {
            await api.workflow.update(currentWorkflowId, {
              visibility: 'public',
            });
            setWorkflowVisibility('public');
            toast.success('Workflow is now public');
          } catch (error) {
            console.error('Failed to update visibility:', error);
            toast.error('Failed to update visibility. Please try again.');
          }
        },
      });
      return;
    }

    // Switch to private immediately (no risks)
    try {
      await api.workflow.update(currentWorkflowId, {
        visibility: newVisibility,
      });
      setWorkflowVisibility(newVisibility);
      toast.success('Workflow is now private');
    } catch (error) {
      console.error('Failed to update visibility:', error);
      toast.error('Failed to update visibility. Please try again.');
    }
  };

  const handleDuplicate = async () => {
    if (isLocal) {
      return;
    }

    if (!currentWorkflowId) {
      return;
    }

    setIsDuplicating(true);
    try {
      // Auto-sign in as anonymous if user has no session
      if (!session?.user) {
        await authClient.signIn.anonymous();
        // Wait for session to be established
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const newWorkflow = await api.workflow.duplicate(currentWorkflowId);
      toast.success('Workflow duplicated successfully');
      router.push(`/workflows/${newWorkflow.id}`);
    } catch (error) {
      console.error('Failed to duplicate workflow:', error);
      toast.error('Failed to duplicate workflow. Please try again.');
    } finally {
      setIsDuplicating(false);
    }
  };

  return {
    handleSave,
    handleExecute,
    handleClearWorkflow,
    handleDeleteWorkflow,
    handleDownload,
    loadWorkflows,
    handleToggleVisibility,
    handleDuplicate,
    handleImportWorkflow: async (file: File) => {
      const text = await file.text();
      const parsedSnapshot = parseLocalWorkflowJson(text);
      const snapshot = {
        ...parsedSnapshot,
        events: [
          createWorkflowEvent({
            type: 'import_workflow',
            message: `Imported workflow JSON from ${file.name}.`,
            details: { fileName: file.name },
          }),
          ...parsedSnapshot.events,
        ],
      };
      const canvas = workflowDefinitionToCanvas(snapshot);
      setNodes(canvas.nodes);
      setEdges(canvas.edges);
      setCurrentWorkflowName(snapshot.name);
      setSelectedNodeId(canvas.nodes[0]?.id ?? null);
      setSelectedExecutionId(null);
      setExecutionLogs({});
      saveWorkflowDefinitionSnapshot(snapshot);
      recordWorkflowAuditEvent({
        after: {
          edgeCount: snapshot.edges.length,
          name: snapshot.name,
          nodeCount: snapshot.blocks.length,
          status: snapshot.status,
        },
        metadata: { fileName: file.name },
        reason: 'Workflow JSON imported into the local draft.',
        type: 'workflow_imported',
      });
      setHasUnsavedChanges(false);
      toast.success('Workflow JSON imported');
      return snapshot;
    },
    handleUploadExcelSource: async (file: File) => {
      const workbook = await parseExcelWorkbookFile(file);
      let nextNodes = nodes;
      let nextEdges = edges;
      let targetNode = nextNodes.find(isExcelSourceNode);
      let nextWorkflowName = workflowName;

      if (!targetNode) {
        const block = createWorkflowBlockFromCatalog('source:excel-workbook', {
          id: nanoid(),
          label: 'Document',
          position: { x: 0, y: 0 },
        });
        targetNode = createWorkflowNodeFromBlock(block, { selected: true });
        nextNodes = [...nextNodes, targetNode];
      }

      if (!targetNode) {
        throw new Error('No Excel Source block is available for upload.');
      }

      const workbookImport = buildFapiWorkbookImportPatch(
        workbook,
        targetNode.data.block?.config || {},
      );
      const patch = workbookImport.excelSourcePatch;
      nextNodes = nextNodes.map((node) =>
        applyWorkbookImportPatchToNode({
          excelPatch: patch,
          node,
          targetNodeId: targetNode.id,
          workbook,
          workbookImport,
        }),
      );
      setNodes(nextNodes);
      setEdges(nextEdges);
      setCurrentWorkflowName(nextWorkflowName);
      setSelectedNodeId(targetNode.id);
      setSelectedExecutionId(null);
      setExecutionLogs({});
      setHasUnsavedChanges(true);
      setActiveTab('properties');
      saveLocalWorkflowSnapshot({
        edges: nextEdges,
        event: createWorkflowEvent({
          message: `Uploaded Excel workbook ${file.name}.`,
          type: 'save_draft',
        }),
        name: nextWorkflowName,
        nodes: nextNodes,
        status: 'draft',
      });
      openOverlay(ConfigurationOverlay, {}, { size: 'wide' });
      const importedParts = [
        workbookImport.keywordRules.length > 0 ? 'keyword rules' : '',
        workbookImport.aggregationRules.length > 0 ? 'aggregation rules' : '',
        Object.keys(workbookImport.expectedResults).length > 0 ? 'expected results' : '',
      ].filter(Boolean);
      toast.success(
        importedParts.length > 0
          ? `Excel workbook loaded with ${importedParts.join(', ')}`
          : 'Excel workbook loaded into Source',
      );
    },
    handleLoadPortfolioWorkflow: (def: PortfolioWorkflowDef) => {
      openOverlay(ConfirmOverlay, {
        confirmLabel: `Open ${def.name}`,
        confirmVariant: 'default' as const,
        message: `Open “${def.name}”? Current local nodes and connections will be replaced.`,
        onConfirm: () => {
          const template = buildRunnableWorkflowSnapshot(def.id);
          if (!template) {
            toast.error('This workflow is unavailable. Choose one from the executable catalog.');
            return;
          }
          const snapshot = {
            ...template,
            events: [
              createWorkflowEvent({
                message: `Local studio loaded ${def.name}.`,
                type: 'save_draft',
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(snapshot);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(snapshot.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(snapshot);
          setHasUnsavedChanges(false);
          toast.success(`${def.name} loaded`);
        },
        title: def.name,
      });
    },
  };
}
