import { workspaceStorage } from '@/platform/auth/workspace-context';
import { useReactFlow } from '@xyflow/react';
import { useAtom } from 'jotai';
import {
  ChevronDown,
  Copy,
  Download,
  Globe,
  Layers,
  LayoutTemplate,
  ListTree,
  Loader2,
  PanelRight,
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
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { NeumorphicSidebar } from '@/components/neumorphic-sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  createWorkflowBlockFromCatalog,
  createWorkflowNodeFromBlock,
} from '@/shared/workflow-engine/workflow/block-factory';
import { PORTFOLIO_WORKFLOWS } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { LOCAL_WORKFLOW_ID } from '@/shared/workflow-engine/workflow/contracts';
import { loadLocalWorkflowSnapshot } from '@/shared/workflow-engine/workflow/storage';
import { publishLocalWorkflowSnapshot } from '@/shared/workflow-engine/workflow/publishing';
import { workflowDefinitionToCanvas } from '@/shared/workflow-engine/workflow/canvas';
import { activeRightPanelAtom } from '@/shared/workflow-engine/state/workflow-store';
import { appendWorkflowChangeEvent } from '@/shared/workflow-engine/audit/change-log';
import {
  createWorkflowAuditEvent,
  summarizeWorkflowForAudit,
} from '@/shared/workflow-engine/audit/workflow-events';
import { ConfigurationOverlay } from '@/features/workflow-builder/ui/overlays/configuration-overlay';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import { WorkflowIcon } from '@/shared/ui/workflow-icon';
import { useWorkflowState } from './use-workflow-state';
import { useWorkflowActions } from './use-workflow-actions';
import { type LocalPublishStatus, LOCAL_PUBLISH_STATUS_KEY } from './types';

export function LocalStudioTopBar({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay } = useOverlay();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [mounted, setMounted] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useAtom(activeRightPanelAtom);

  const togglePanel = (panel: 'runtime-preview' | 'ai-panel' | 'pages' | 'settings') => {
    setActiveRightPanel((current) => (current === panel ? null : panel));
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [publishStatus, setPublishStatus] = useState<LocalPublishStatus>(() => {
    if (typeof window === 'undefined') {
      return 'draft';
    }
    const snapshot = loadLocalWorkflowSnapshot();
    return snapshot?.status === 'published' ||
      workspaceStorage.getItem(LOCAL_PUBLISH_STATUS_KEY) === 'published'
      ? 'published'
      : 'draft';
  });
  const [latestPublishedVersion, setLatestPublishedVersion] = useState<number | null>(
    () => loadLocalWorkflowSnapshot()?.publishedVersion?.versionNumber ?? null,
  );
  const graphInitializedRef = useRef(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInputValue, setNameInputValue] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const updatePublishStatus = useCallback((status: LocalPublishStatus) => {
    setPublishStatus(status);
    if (typeof window !== 'undefined') {
      workspaceStorage.setItem(LOCAL_PUBLISH_STATUS_KEY, status);
    }
  }, []);

  useEffect(() => {
    if (!graphInitializedRef.current) {
      graphInitializedRef.current = true;
      return;
    }

    if (state.hasUnsavedChanges && publishStatus === 'published') {
      updatePublishStatus('draft');
    }
  }, [state.hasUnsavedChanges, publishStatus, updatePublishStatus]);

  useEffect(() => {
    if (state.hasUnsavedChanges) {
      return;
    }

    const snapshot = loadLocalWorkflowSnapshot();
    if (!snapshot) {
      return;
    }

    setPublishStatus(snapshot.status === 'published' ? 'published' : 'draft');
    setLatestPublishedVersion(snapshot.publishedVersion?.versionNumber ?? null);
  }, [state.hasUnsavedChanges]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNameCommit = useCallback(() => {
    const trimmed = nameInputValue.trim();
    if (trimmed && trimmed !== state.workflowName) {
      state.setCurrentWorkflowName(trimmed);
    }
    setIsEditingName(false);
  }, [nameInputValue, state]);

  const getCanvasCenterPosition = () => {
    const flowWrapper = document.querySelector('.react-flow');
    if (!flowWrapper) {
      return null;
    }

    const rect = flowWrapper.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    position.x -= 96;
    position.y -= 96;
    return position;
  };

  const handleAddCatalogSource = (catalogId: string) => {
    if (catalogId === 'source:keyword-rules' || catalogId === 'source:aggregation-rules') {
      const existingRulebook = state.nodes.find((node) => node.data.block?.catalogId === catalogId);
      if (existingRulebook) {
        state.setSelectedNodeId(existingRulebook.id);
        state.setActiveTab('properties');
        openOverlay(ConfigurationOverlay, {}, { size: 'wide' });
        return;
      }
    }

    const position = getCanvasCenterPosition();
    if (!position) {
      return;
    }
    const sourceDefaults: Record<string, { config: Record<string, unknown>; label: string }> = {
      'source:aggregation-rules': {
        config: {
          outputs: 'aggregation_rules',
          sourceKind: 'aggregation_rules',
          sourceStatus: 'draft',
          sourceVersion: 1,
          toolId: 'source.aggregation_rules',
        },
        label: 'Aggregation Rulebook',
      },
      'source:currency-rate': {
        config: {
          documentCurrency: 'USD',
          fapiYear: 2025,
          outputs: 'exchange_rate, rate_metadata',
          overrideRate: 1.35,
          rateProvider: 'bank_of_canada',
          rateType: 'annual_average',
          reportingCurrency: 'CAD',
          sourceKind: 'currency_rate',
          sourceStatus: 'draft',
          sourceVersion: 1,
          toolId: 'source.currency_rate',
        },
        label: 'Bank of Canada FX Rate',
      },
      'source:excel-workbook': {
        config: {
          outputs: 'selected_rows',
          sourceKind: 'excel_workbook',
          sourceStatus: 'draft',
          sourceVersion: 1,
          toolId: 'source.manual_table',
        },
        label: 'Uploaded Workbook',
      },
      'source:keyword-rules': {
        config: {
          outputs: 'keyword_rules',
          sourceKind: 'keyword_rules',
          sourceStatus: 'draft',
          sourceVersion: 1,
          toolId: 'source.keyword_rules',
        },
        label: 'Keyword Rulebook',
      },
    };
    const sourceDefault = sourceDefaults[catalogId] || sourceDefaults['source:excel-workbook'];
    const block = createWorkflowBlockFromCatalog(catalogId, {
      id: nanoid(),
      label: sourceDefault.label,
      position,
      config: sourceDefault.config,
    });
    state.addNode(createWorkflowNodeFromBlock(block, { selected: true }));
    state.setSelectedNodeId(block.id);
    state.setActiveTab('properties');
    openOverlay(ConfigurationOverlay, {}, { size: 'wide' });
  };

  const handlePublish = () => {
    if (state.isLocal) {
      const result = publishLocalWorkflowSnapshot({
        edges: state.edges,
        name: state.workflowName,
        nodes: state.nodes,
        notes: 'Published from the local Workflow Studio toolbar.',
      });
      state.setNodes(workflowDefinitionToCanvas(result.workflow).nodes);
      state.setEdges(workflowDefinitionToCanvas(result.workflow).edges);
      state.setHasUnsavedChanges(false);
      setLatestPublishedVersion(result.snapshot.versionNumber);
      appendWorkflowChangeEvent(
        createWorkflowAuditEvent({
          actor: 'workflow-toolbar',
          after: summarizeWorkflowForAudit({
            edgeCount: result.workflow.edges.length,
            name: result.workflow.name,
            nodeCount: result.workflow.blocks.length,
            status: 'published',
          }),
          metadata: {
            versionNumber: result.snapshot.versionNumber,
            warningCount: result.warnings.length,
          },
          reason: 'Workflow published from the local toolbar.',
          targetObjectId: state.currentWorkflowId || LOCAL_WORKFLOW_ID,
          targetObjectType: 'workflow',
          type: 'workflow_published',
          workflowId: state.currentWorkflowId || LOCAL_WORKFLOW_ID,
        }),
      );
      if (result.warnings.length > 0) {
        toast.warning(
          `Published locally with ${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'}`,
        );
      } else {
        toast.success('Published locally');
      }
    }
    updatePublishStatus('published');
  };

  const statusLabel = state.hasUnsavedChanges || publishStatus === 'draft' ? 'Draft' : 'Published';
  const isPublished = statusLabel === 'Published';

  return (
    <>
      {/* Hidden file inputs — kept in component tree so refs work (pointer-events-none on parent is CSS-only) */}
      <input
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            actions.handleUploadExcelSource(file).catch((error) => {
              toast.error(
                error instanceof Error ? error.message : 'Failed to upload Excel workbook',
              );
            });
            updatePublishStatus('draft');
            setLatestPublishedVersion(null);
          }
          event.target.value = '';
        }}
        ref={excelInputRef}
        type="file"
      />
      <input
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            actions
              .handleImportWorkflow(file)
              .then((snapshot) => {
                updatePublishStatus(snapshot.status);
                setLatestPublishedVersion(snapshot.publishedVersion?.versionNumber ?? null);
              })
              .catch((error) => {
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

      {/* Toolbar controls as a left neumorphic sidebar over the canvas (Step 3) —
          the same control groups, reflowed vertically (buttons made full-width via
          arbitrary variants, horizontal dividers). */}
      {mounted && (
        <NeumorphicSidebar
          floating
          collapseHideLabels
          contentClassName="items-stretch gap-1.5 [&_.neu-action]:w-full [&_.neu-action]:justify-start [&_.h-4.w-px]:my-1.5 [&_.h-4.w-px]:mx-0 [&_.h-4.w-px]:h-px [&_.h-4.w-px]:w-full"
        >
          {/* ── Identity (no home button — global nav logo handles it) ── */}
          <div className="flex shrink-0 items-center gap-1.5 px-1">
            <WorkflowIcon className="size-4 shrink-0 text-(--neu-text) opacity-70" />
            {isEditingName ? (
              <input
                ref={nameInputRef}
                autoFocus
                className="w-36 rounded bg-transparent px-1 text-sm font-semibold text-(--neu-text) outline-none ring-1 ring-(--neu-text)/25"
                maxLength={60}
                onBlur={handleNameCommit}
                onChange={(e) => setNameInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameCommit();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                value={nameInputValue}
              />
            ) : (
              <button
                className="max-w-40 truncate rounded px-1 py-0.5 text-left text-sm font-semibold text-(--neu-text) transition-opacity hover:opacity-60"
                onClick={() => {
                  setNameInputValue(state.workflowName || '');
                  setIsEditingName(true);
                }}
                title="Click to rename"
              >
                {state.workflowName || 'Workflow Studio'}
              </button>
            )}
            <button
              className={`inline-flex shrink-0 cursor-pointer items-center rounded px-1.5 py-0.5 font-medium text-[10px] transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 ${
                isPublished
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              }`}
              disabled={state.isGenerating || state.isSaving}
              onClick={handlePublish}
              title={isPublished ? 'Republish' : 'Click to publish'}
            >
              {statusLabel}
            </button>
          </div>

          <div className="mx-1 h-4 w-px shrink-0 bg-(--neu-text)/15" />

          {/* ── File ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="neu-action gap-1 px-2.5 text-(--neu-text)"
                disabled={state.isGenerating}
                size="sm"
                variant="ghost"
              >
                File
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <LayoutTemplate className="size-4" />
                  New from template
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-60">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Starter templates
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex flex-col items-start gap-0.5 py-2"
                    onClick={() => {
                      actions.handleLoadWorkingSourceDemo();
                      updatePublishStatus('draft');
                      setLatestPublishedVersion(null);
                    }}
                  >
                    <span className="text-sm font-medium">FAPI Calculation</span>
                    <span className="text-xs text-muted-foreground">
                      Trial balance → classify → rollup → compute → display
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex flex-col items-start gap-0.5 py-2"
                    onClick={() => {
                      actions.handleLoadRoullementFiscalTemplate();
                      updatePublishStatus('draft');
                      setLatestPublishedVersion(null);
                    }}
                  >
                    <span className="text-sm font-medium">Roulement fiscal</span>
                    <span className="text-xs text-muted-foreground">
                      Biens → classification → PBR → élection art. 85 → T2057
                    </span>
                  </DropdownMenuItem>
                  {(
                    [
                      ['platform', 'Sinaxe portfolio · Platform services'],
                      ['foundation', 'Sinaxe portfolio · Foundation'],
                      ['tier1', 'Sinaxe portfolio · Tier 1'],
                    ] as const
                  ).map(([group, heading]) => (
                    <Fragment key={group}>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {heading}
                      </DropdownMenuLabel>
                      {PORTFOLIO_WORKFLOWS.filter((w) => w.group === group).map((w) => (
                        <DropdownMenuItem
                          key={w.id}
                          className="flex flex-col items-start gap-0.5 py-2"
                          onClick={() => {
                            actions.handleLoadPortfolioWorkflow(w);
                            updatePublishStatus('draft');
                            setLatestPublishedVersion(null);
                          }}
                        >
                          <span className="text-sm font-medium">
                            {w.name.replace(/^Platform Services · /, '')}
                          </span>
                          <span className="text-xs text-muted-foreground">{w.sub}</span>
                        </DropdownMenuItem>
                      ))}
                    </Fragment>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={actions.handleClearWorkflow}>
                New blank workflow
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={state.isGenerating}
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="size-4" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  state.isDownloading ||
                  state.nodes.length === 0 ||
                  state.isGenerating ||
                  !state.currentWorkflowId
                }
                onClick={actions.handleDownload}
              >
                {state.isDownloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={state.isGenerating || state.isSaving}
                onClick={handlePublish}
              >
                <Globe
                  className={
                    isPublished ? 'size-4 text-emerald-600 dark:text-emerald-400' : 'size-4'
                  }
                />
                {isPublished ? 'Published' : 'Publish'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={state.isGenerating}
                onClick={actions.handleDeleteWorkflow}
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Delete workflow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── Edit ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="neu-action gap-1 px-2.5 text-(--neu-text)"
                disabled={state.isGenerating}
                size="sm"
                variant="ghost"
              >
                Edit
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem disabled={!state.canUndo} onClick={() => state.undo()}>
                <Undo2 className="size-4" />
                Undo
                <DropdownMenuShortcut>Ctrl+Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!state.canRedo} onClick={() => state.redo()}>
                <Redo2 className="size-4" />
                Redo
                <DropdownMenuShortcut>Ctrl+Y</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={actions.handleDuplicate}>
                <Copy className="size-4" />
                Duplicate workflow
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={actions.handleClearWorkflow} variant="destructive">
                <RotateCcw className="size-4" />
                Clear canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── Add ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="neu-action gap-1 px-2.5 text-(--neu-text)"
                disabled={state.isGenerating}
                size="sm"
                variant="ghost"
              >
                <Plus className="size-3.5" />
                Add
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sources
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAddCatalogSource('source:excel-workbook')}>
                Workbook Source
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddCatalogSource('source:currency-rate')}>
                FX Rate Source
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={state.isGenerating}
                onClick={() => excelInputRef.current?.click()}
              >
                <Upload className="size-4" />
                Upload Excel file…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Rulebooks
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAddCatalogSource('source:keyword-rules')}>
                Keyword Rulebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddCatalogSource('source:aggregation-rules')}>
                Aggregation Rulebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* push right-side controls to the end */}
          <div className="flex-1" />

          {/* ── Runtime Preview toggle ── */}
          <Button
            className="neu-action gap-1.5 px-2.5 text-(--neu-text)"
            onClick={() => togglePanel('runtime-preview')}
            size="sm"
            title={
              activeRightPanel === 'runtime-preview'
                ? 'Close runtime preview'
                : 'Open runtime preview'
            }
            variant="ghost"
          >
            <ListTree
              className={`size-4 transition-opacity ${activeRightPanel === 'runtime-preview' ? 'opacity-100' : 'opacity-40'}`}
            />
            Preview
          </Button>

          {/* ── AI Panel toggle ── */}
          <Button
            className="neu-action gap-1.5 px-2.5 text-(--neu-text)"
            onClick={() => togglePanel('ai-panel')}
            size="sm"
            title={activeRightPanel === 'ai-panel' ? 'Close AI panel' : 'Open AI panel'}
            variant="ghost"
          >
            <PanelRight
              className={`size-4 transition-opacity ${activeRightPanel === 'ai-panel' ? 'opacity-100' : 'opacity-40'}`}
            />
            AI
          </Button>

          {/* ── Pages toggle ── */}
          <Button
            className="neu-action gap-1.5 px-2.5 text-(--neu-text)"
            onClick={() => togglePanel('pages')}
            size="sm"
            title={activeRightPanel === 'pages' ? 'Close pages' : 'Open pages'}
            variant="ghost"
          >
            <Layers
              className={`size-4 transition-opacity ${activeRightPanel === 'pages' ? 'opacity-100' : 'opacity-40'}`}
            />
            Pages
          </Button>

          {/* ── Settings toggle + Dev Tools dropdown ── */}
          <Button
            className="neu-action gap-1.5 px-2.5 text-(--neu-text)"
            disabled={state.isGenerating}
            onClick={() => togglePanel('settings')}
            size="sm"
            title={activeRightPanel === 'settings' ? 'Close settings' : 'Open settings'}
            variant="ghost"
          >
            <Settings2
              className={`size-4 transition-opacity ${activeRightPanel === 'settings' ? 'opacity-100' : 'opacity-40'}`}
            />
            Settings
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="neu-action px-1.5 text-(--neu-text) opacity-40 hover:opacity-80"
                disabled={state.isGenerating}
                size="sm"
                title="Dev tools"
                variant="ghost"
              >
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Dev tools
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  actions.handleLoadSingleItemDemo();
                  updatePublishStatus('draft');
                  setLatestPublishedVersion(null);
                }}
              >
                Load Z Demo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  actions.handleLoadExpandedDemo();
                  updatePublishStatus('draft');
                  setLatestPublishedVersion(null);
                }}
              >
                Load Expanded Demo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  actions.handleResetSample();
                  updatePublishStatus('draft');
                  setLatestPublishedVersion(null);
                }}
              >
                Reset FAPI Sample
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mx-1 h-4 w-px shrink-0 bg-(--neu-text)/15" />

          {/* ── Save ── */}
          <Button
            className="neu-action relative gap-1.5 px-2.5 text-(--neu-text)"
            disabled={!state.currentWorkflowId || state.isGenerating || state.isSaving}
            onClick={actions.handleSave}
            size="sm"
            variant="ghost"
          >
            {state.isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
            {state.hasUnsavedChanges && !state.isSaving && (
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-400" />
            )}
          </Button>

          {/* ── Run ── */}
          <Button
            className="gap-1.5 px-3"
            disabled={state.isExecuting || state.nodes.length === 0 || state.isGenerating}
            onClick={() => actions.handleExecute()}
            size="sm"
            variant="default"
          >
            {state.isExecuting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                Run
              </>
            )}
          </Button>
        </NeumorphicSidebar>
      )}
    </>
  );
}
