import { useReactFlow } from '@xyflow/react';
import { useAtom, useSetAtom } from 'jotai';
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Globe,
  Loader2,
  Lock,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  Undo2,
  Upload,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { ButtonGroup } from '@/shared/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { createDefaultWorkflowBlockCandidate } from '@/shared/workflow-engine/workflow/block-factory';
import {
  deleteEdgeAtom,
  deleteNodeAtom,
  edgesAtom,
  nodesAtom,
  selectedEdgeAtom,
  selectedNodeAtom,
} from '@/shared/workflow-engine/state/workflow-store';
import { ConfigurationOverlay } from '@/features/workflow-builder/ui/overlays/configuration-overlay';
import { ConfirmOverlay } from '@/shared/ui/overlays/confirm-overlay';
import { ExportWorkflowOverlay } from '@/features/workflow-builder/ui/overlays/export-workflow-overlay';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import { WorkflowIcon } from '@/shared/ui/workflow-icon';
import { useWorkflowState } from './use-workflow-state';
import { useWorkflowActions } from './use-workflow-actions';

// Toolbar Actions Component - handles add step, undo/redo, save, and run buttons
export function ToolbarActions({
  workflowId,
  state,
  actions,
}: {
  workflowId?: string;
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay, push } = useOverlay();
  const [selectedNodeId] = useAtom(selectedNodeAtom);
  const [selectedEdgeId] = useAtom(selectedEdgeAtom);
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const deleteNode = useSetAtom(deleteNodeAtom);
  const deleteEdge = useSetAtom(deleteEdgeAtom);
  const { screenToFlowPosition } = useReactFlow();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const hasSelection = selectedNode || selectedEdge;

  // For non-owners viewing public workflows, don't show toolbar actions
  // (Duplicate button is now in the main toolbar next to Sign In)
  if (workflowId && !state.isOwner) {
    return null;
  }

  if (!workflowId) {
    return null;
  }

  const handleDeleteConfirm = () => {
    const isNode = Boolean(selectedNodeId);
    const itemType = isNode ? 'Node' : 'Connection';

    push(ConfirmOverlay, {
      title: `Delete ${itemType}`,
      message: `Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmVariant: 'destructive' as const,
      onConfirm: () => {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          deleteEdge(selectedEdgeId);
        }
      },
    });
  };

  const handleAddStep = () => {
    // Get the ReactFlow wrapper (the visible canvas container)
    const flowWrapper = document.querySelector('.react-flow');
    if (!flowWrapper) {
      return;
    }

    const rect = flowWrapper.getBoundingClientRect();
    // Calculate center in absolute screen coordinates
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert to flow coordinates
    const position = screenToFlowPosition({ x: centerX, y: centerY });

    // Adjust for node dimensions to center it properly
    // Action node is 192px wide and 192px tall (w-48 h-48 in Tailwind)
    const nodeWidth = 192;
    const nodeHeight = 192;
    position.x -= nodeWidth / 2;
    position.y -= nodeHeight / 2;

    // Check if there's already a node at this position
    const offset = 20; // Offset distance in pixels
    const threshold = 20; // How close nodes need to be to be considered overlapping

    const finalPosition = { ...position };
    let hasOverlap = true;
    let attempts = 0;
    const maxAttempts = 20; // Prevent infinite loop

    while (hasOverlap && attempts < maxAttempts) {
      hasOverlap = state.nodes.some((node) => {
        const dx = Math.abs(node.position.x - finalPosition.x);
        const dy = Math.abs(node.position.y - finalPosition.y);
        return dx < threshold && dy < threshold;
      });

      if (hasOverlap) {
        // Offset diagonally down-right
        finalPosition.x += offset;
        finalPosition.y += offset;
        attempts += 1;
      }
    }

    const newNode = createDefaultWorkflowBlockCandidate({
      id: nanoid(),
      position: finalPosition,
    });

    state.addNode(newNode);
    state.setSelectedNodeId(newNode.id);
    state.setActiveTab('properties');
    openOverlay(ConfigurationOverlay, {}, { size: 'wide' });
  };

  return (
    <>
      {/* Add Step - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={state.isGenerating}
          onClick={handleAddStep}
          size="icon"
          title="Add Step"
          variant="secondary"
        >
          <Plus className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Properties - Mobile Vertical (always visible) */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 dark:hover:bg-white/5"
          onClick={() => openOverlay(ConfigurationOverlay, {}, { size: 'wide' })}
          size="icon"
          title="Configuration"
          variant="secondary"
        >
          <Settings2 className="size-4" />
        </Button>
        {/* Delete - Show when node or edge is selected */}
        {hasSelection && (
          <Button
            className="border hover:bg-black/5 dark:hover:bg-white/5"
            onClick={handleDeleteConfirm}
            size="icon"
            title="Delete"
            variant="secondary"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </ButtonGroup>

      {/* Add Step - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={state.isGenerating}
          onClick={handleAddStep}
          size="icon"
          title="Add Step"
          variant="secondary"
        >
          <Plus className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Undo/Redo - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canUndo || state.isGenerating}
          onClick={() => state.undo()}
          size="icon"
          title="Undo"
          variant="secondary"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canRedo || state.isGenerating}
          onClick={() => state.redo()}
          size="icon"
          title="Redo"
          variant="secondary"
        >
          <Redo2 className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Undo/Redo - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canUndo || state.isGenerating}
          onClick={() => state.undo()}
          size="icon"
          title="Undo"
          variant="secondary"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canRedo || state.isGenerating}
          onClick={() => state.redo()}
          size="icon"
          title="Redo"
          variant="secondary"
        >
          <Redo2 className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Save/Download - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <SaveButton handleSave={actions.handleSave} state={state} />
        <DownloadButton actions={actions} state={state} />
        {state.isLocal && <ImportButton actions={actions} state={state} />}
        {state.isLocal && <ResetSampleButton actions={actions} state={state} />}
      </ButtonGroup>

      {/* Save/Download - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <SaveButton handleSave={actions.handleSave} state={state} />
        <DownloadButton actions={actions} state={state} />
        {state.isLocal && <ImportButton actions={actions} state={state} />}
        {state.isLocal && <ResetSampleButton actions={actions} state={state} />}
      </ButtonGroup>

      {/* Visibility Toggle */}
      {!state.isLocal && <VisibilityButton actions={actions} state={state} />}

      <RunButtonGroup actions={actions} state={state} />
    </>
  );
}

// Save Button Component
function SaveButton({
  state,
  handleSave,
}: {
  state: ReturnType<typeof useWorkflowState>;
  handleSave: () => Promise<void>;
}) {
  if (state.isLocal) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex h-9 max-w-[220px] items-center gap-2 overflow-hidden rounded-md border bg-secondary px-3 text-secondary-foreground sm:max-w-none">
          <WorkflowIcon className="size-4 shrink-0" />
          <p className="truncate font-medium text-sm">{state.workflowName}</p>
        </div>
      </div>
    );
  }

  return (
    <Button
      className="relative border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={!state.currentWorkflowId || state.isGenerating || state.isSaving}
      onClick={handleSave}
      size="icon"
      title={state.isSaving ? 'Saving...' : 'Save workflow'}
      variant="secondary"
    >
      {state.isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {state.hasUnsavedChanges && !state.isSaving && (
        <div className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
      )}
    </Button>
  );
}

// Download Button Component
function DownloadButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay } = useOverlay();
  let title = 'Export workflow as code';
  if (state.isLocal) {
    title = 'Export workflow JSON';
  }
  if (state.isDownloading) {
    title = 'Preparing download...';
  }

  const handleClick = () => {
    if (state.isLocal) {
      actions.handleDownload();
      return;
    }

    openOverlay(ExportWorkflowOverlay, {
      onExport: actions.handleDownload,
      isDownloading: state.isDownloading,
    });
  };

  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={
        state.isDownloading ||
        state.nodes.length === 0 ||
        state.isGenerating ||
        !state.currentWorkflowId
      }
      onClick={handleClick}
      size="icon"
      title={title}
      variant="secondary"
    >
      {state.isDownloading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
    </Button>
  );
}

function ImportButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
        disabled={state.isGenerating}
        onClick={() => inputRef.current?.click()}
        size="icon"
        title="Import workflow JSON"
        variant="secondary"
      >
        <Upload className="size-4" />
      </Button>
      <input
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            actions.handleImportWorkflow(file).catch((error) => {
              toast.error(
                error instanceof Error ? error.message : 'Failed to import workflow JSON',
              );
            });
          }
          event.target.value = '';
        }}
        ref={inputRef}
        type="file"
      />
    </>
  );
}

function ResetSampleButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={state.isGenerating}
      onClick={actions.handleResetSample}
      size="icon"
      title="Reset sample workflow"
      variant="secondary"
    >
      <RotateCcw className="size-4" />
    </Button>
  );
}

// Visibility Button Component
function VisibilityButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const isPublic = state.workflowVisibility === 'public';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="border hover:bg-black/5 dark:hover:bg-white/5"
          disabled={!state.currentWorkflowId || state.isGenerating}
          size="icon"
          title={isPublic ? 'Public workflow' : 'Private workflow'}
          variant="secondary"
        >
          {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => actions.handleToggleVisibility('private')}
        >
          <Lock className="size-4" />
          Private
          {!isPublic && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => actions.handleToggleVisibility('public')}
        >
          <Globe className="size-4" />
          Public
          {isPublic && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Run Button Group Component
function RunButtonGroup({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={state.isExecuting || state.nodes.length === 0 || state.isGenerating}
      onClick={() => actions.handleExecute()}
      size="icon"
      title="Run Workflow"
      variant="secondary"
    >
      {state.isExecuting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Play className="size-4" />
      )}
    </Button>
  );
}

// Duplicate Button Component - placed next to Sign In for non-owners
export function DuplicateButton({
  isDuplicating,
  onDuplicate,
}: {
  isDuplicating: boolean;
  onDuplicate: () => void;
}) {
  return (
    <Button
      className="h-9 border hover:bg-black/5 dark:hover:bg-white/5"
      disabled={isDuplicating}
      onClick={onDuplicate}
      size="sm"
      title="Duplicate to your workflows"
      variant="secondary"
    >
      {isDuplicating ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Copy className="mr-2 size-4" />
      )}
      Duplicate
    </Button>
  );
}

// Workflow Menu Component
export function WorkflowMenuComponent({
  workflowId,
  state,
  actions,
}: {
  workflowId?: string;
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="neu-surface flex h-9 max-w-[160px] items-center overflow-hidden rounded-md sm:max-w-none">
        <DropdownMenu onOpenChange={(open) => open && actions.loadWorkflows()}>
          <DropdownMenuTrigger className="flex h-full cursor-pointer items-center gap-2 px-3 font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
            <WorkflowIcon className="size-4 shrink-0" />
            <p className="truncate font-medium text-sm">
              {workflowId ? (
                state.workflowName
              ) : (
                <>
                  <span className="sm:hidden">New</span>
                  <span className="hidden sm:inline">New Workflow</span>
                </>
              )}
            </p>
            <ChevronDown className="size-3 shrink-0 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem asChild className="flex items-center justify-between">
              <a href="/">New Workflow {!workflowId && <Check className="size-4 shrink-0" />}</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {state.allWorkflows.length === 0 ? (
              <DropdownMenuItem disabled>No workflows found</DropdownMenuItem>
            ) : (
              state.allWorkflows
                .filter((w) => w.name !== '__current__')
                .map((workflow) => (
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    key={workflow.id}
                    onClick={() => state.router.push(`/workflows/${workflow.id}`)}
                  >
                    <span className="truncate">{workflow.name}</span>
                    {workflow.id === state.currentWorkflowId && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {workflowId && !state.isOwner && (
        <span className="text-muted-foreground text-xs uppercase lg:hidden">Read-only</span>
      )}
    </div>
  );
}
