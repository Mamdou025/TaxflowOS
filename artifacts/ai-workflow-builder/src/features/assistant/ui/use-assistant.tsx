import { stopChatBeforeSwitch } from '../runtime/chat/chat-switch';
import { searchWorkspace, HIT_ICON, type SearchHit } from './workflow-composer-search';
export type { SearchHit } from './workflow-composer-search';
import { WorkflowSessionPanel } from '@/features/workflows-hub/workflow-session-panel';
import {
  openWorkflowSession,
  chatWorkflowIdsAtom,
  chatSessionAtom,
  bindChatSession,
} from '@/features/workflows-hub/workflow-session-store';
import { useSessionTools } from './use-session-tools';

// ─────────────────────────────────────────────────────────────────────────────
// useAssistant — the shared brain of the assistant surface.
//
// It registers the workspace tools + readable context with CopilotKit, owns the
// conversation-launch state (say / newChat / hero), the composer's search +
// tools + file-attach handlers, and the launcher actions. Both surfaces consume
// it: the full-screen **focus mode** (`ChatWorkspace`, on `/`) and the global
// **docked panel** (`AssistantPanel`, everywhere else). They never mount at the
// same time (the panel returns null on `/`), so the CopilotKit actions register
// exactly once.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import type { ChatAgent } from '@/shared/stores/chat-store';
import { WorkflowCommandResult } from './workflow-command-result';
import {
  AgentRunReview,
  isAgentRunReviewResult,
  requestAgentWorkflowRun,
} from './agent-run-review';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { useRouter, usePathname } from '@/lib/router';
import { Globe, FileText, Workflow, Bot, Sparkles } from 'lucide-react';
import {
  useCopilotAction,
  useCopilotReadable,
  useCopilotChatInternal,
} from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import {
  workspaceWindowsAtom,
  activeWorkspaceWindowAtom,
  openWorkspaceWindowAtom,
  closeWorkspaceWindowAtom,
  closeAllWorkspaceWindowsAtom,
  pushTrailAtom,
  activeRunAtom,
} from '@/shared/stores/workspace-store';
import { pageChatSurfacesAtom } from '@/lib/page-chat-store';
import { SurfaceEmbed } from './surface-embed';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import {
  getPage,
  listPages,
  anchorToPage,
  getFieldContext,
  buildAgentCatalog,
  resolveFieldId,
} from '@/shared/stores/resource-registry';
import { InlineFieldCard } from '@/features/assistant/workspace/inline-field-card';
import {
  WorkflowRunFlow,
  WorkflowElementCard,
  RunProposalCard,
} from '@/features/assistant/workspace/workflow-run-flow';
import type { ComposerSuggestion } from '@/features/assistant/workspace/aside-thread';
import {
  getWorkflowConfig,
  WORKFLOW_CONFIGS,
} from '@/shared/workflow-engine/runtime/workflow-runs';
import { PORTFOLIO_WORKFLOWS } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { aimBuilderAtWorkflowAtom } from '@/features/workflows-hub/workflows-store';
import { WORKFLOWS } from '@/lib/agents';
const GenUIRender = lazy(() =>
  import('@/features/genui/genui-render').then((module) => ({ default: module.GenUIRender })),
);
import { useChatContext } from '../runtime/chat/use-chat-context';
import { chatContextLockedAtom } from '../runtime/chat/chat-context-store';
import { attachChatFile } from '../runtime/chat/chat-context-sources';
import { recordWorkflowSelection } from '../runtime/chat/workflow-interaction-store';
import {
  recordWorkItemAtom,
  workIdFor,
  workKeyFromText,
  type WorkItemType,
} from '@/lib/work-store';
import { UI_CONCIERGE, UI_COMPOSER } from '@/lib/coworkers';
import { CoworkerAvatar } from './coworker-avatar';
import { useChatPersistence } from '@/features/assistant/runtime/chat/use-chat-persistence';
import type { ToolResult } from './tool-result-card';
import { useWorkspaceRetrievalTools } from './use-workspace-retrieval-tools';
import { useAgentWorkflowTools } from './use-agent-workflow-tools';
import { useLiveDataTools } from './use-live-data-tools';
import { useMkoroDelegation } from './use-mkoro-delegation';

// ── Work-item classification ────────────────────────────────────────────────────
const WORKSHEET_KEYS = new Set(['fapi', 't1134', 'surplus']);
function pageWorkType(pageKey: string): WorkItemType {
  return WORKSHEET_KEYS.has(pageKey) ? 'worksheet' : 'page';
}
function shortWorkTitle(text: string, max = 46): string {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

// ── Composer search ────────────────────────────────────────────────────────────
// Portfolio IDs and runtime IDs refer to the same available workflow definitions.
const PORTFOLIO_BLUEPRINTS = PORTFOLIO_WORKFLOWS.map((w) => ({
  workflowId: w.id,
  runWorkflowId: getWorkflowConfig(w.id.replace(/^pf-/, ''))?.id ?? null,
  name: w.name,
  group: w.group,
  summary: w.description,
  requiredColumns: getWorkflowConfig(w.id.replace(/^pf-/, ''))?.requiredColumns,
}));

// Human label for the current route — what the assistant reports as "where we are".
function describeRoute(pathname: string): { route: string; label: string } {
  const map: Record<string, string> = {
    '/': 'Assistant — full-screen focus mode',
    '/fapi': 'FAPI worksheet',
    '/t1134': 'T1134 worksheet',
    '/surplus': 'Surplus worksheet',
  };
  if (map[pathname]) return { route: pathname, label: map[pathname] };
  if (pathname.startsWith('/workflows'))
    return { route: pathname, label: 'Saved workflow (database)' };
  return { route: pathname, label: pathname };
}

export type PinnedElement = { workflowId: string; element: 'source' | 'output' };

// Renders the (non-blocking) runWorkflow action. The tool call is resolved
// immediately by its handler; this render owns the UI lifecycle locally.
// Offer-then-accept: it first shows a PROPOSAL card (what the run will do + what
// it needs). The live run only begins when the user clicks Start — so a workflow
// is never kicked off without an explicit accept. Stop/complete handled locally.
export type Assistant = ReturnType<typeof useAssistant>;

export function useAssistant() {
  useSessionTools();
  const { selectWorkbook, importDialog } = useWorkbookImport();
  const router = useRouter();
  const pathname = usePathname();
  const windows = useAtomValue(workspaceWindowsAtom);
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const closeWindow = useSetAtom(closeWorkspaceWindowAtom);
  const closeAll = useSetAtom(closeAllWorkspaceWindowsAtom);
  const pushTrail = useSetAtom(pushTrailAtom);
  const recordWork = useSetAtom(recordWorkItemAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const aimBuilder = useSetAtom(aimBuilderAtWorkflowAtom);
  const activeRun = useAtomValue(activeRunAtom);
  // Pages open next to the chat that opted into the Page ⇄ Chat contract. Subscribed
  // so the "commandable surfaces" readable stays live; each surface is rebuilt only
  // on its own meaningful changes (its usePageChat deps), so this stays quiet.
  const surfaces = useAtomValue(pageChatSurfacesAtom);
  // Read the worksheet-intel registry at call time (not via subscription) so these
  // handlers see the latest live intel without re-rendering this heavy hook.
  const store = useStore();

  const chatContext = useChatContext();

  // Open a workflow (or Sinaxe blueprint) in the NEW builder: the Workflows surface's
  // Build tab (InlineBuilder), docked beside the chat — NOT the legacy standalone
  // /builder page (the older UI). aimBuilder points the surface at the workflow +
  // block (see aimBuilderAtWorkflowAtom); this only has to bring the surface up. A
  // workflow with no portfolio surface yet falls back to the legacy canvas so the
  // click still works rather than landing on an empty "Select a workflow" state.
  const openInlineBuilder = (workflowId: string, blockId = '') => {
    if (aimBuilder({ workflowId, blockId })) {
      const page = getPage('workflows');
      openWindow({ pageKey: 'workflows', title: page?.title ?? 'Workflows' });
    } else {
      openWindow({ pageKey: 'workflow-builder', title: 'Workflow Builder' });
    }
  };

  // ── CopilotKit context + tools ───────────────────────────────────────────────
  // Where the user is right now. Registered here so it's live on EVERY route (the
  // docked panel on non-"/" pages, focus mode on "/"). Pages that want to expose
  // their own selection/detail add further readables locally (e.g. BuilderCopilot).
  const here = describeRoute(pathname);
  useCopilotReadable({
    description:
      'The page the user is currently looking at (their current location in the app). Use this to ground answers in where they are.',
    value: here,
  });

  useCopilotReadable({
    description: 'Pages currently open in the workspace',
    value: windows.map((w) => ({ pageKey: w.pageKey, title: w.title })),
  });

  // ── Page ⇄ Chat contract: command the adjacent page + summon any page inline ──
  // The general pattern. Every page that opts in (usePageChat) publishes a surface
  // here: a live context snapshot, the commands the chat can run on it, and whether
  // it can be brought into the chat. Two generic actions below act on ANY of them.
  useCopilotReadable({
    description:
      "Pages/panels open next to the chat that it can act on. For each: pageKey, title, a live context snapshot of what's on that page, and the commands you can run on it (id, label, description, parameters). To DO something to the page the user is looking at, call commandPage with its commandId. To show a page inside the conversation, call bringIntoChat with its pageKey.",
    value: Object.values(surfaces).map((s) => ({
      pageKey: s.pageKey,
      title: s.title,
      context: s.context ?? null,
      commands: (s.commands ?? []).map((c) => ({
        id: c.id,
        label: c.label,
        description: c.description,
        parameters: c.parameters ?? [],
      })),
      canBringIntoChat: true,
    })),
  });

  // Run a named command on an open page. pageKey defaults to the page the user is
  // looking at (the active tab), then to the only open surface — so "add a block"
  // just works when one page is open. args are JSON.
  useCopilotAction({
    name: 'commandPage',
    description:
      "Run a command on a page/panel open next to the chat (see the commandable-surfaces context for each page's commandId list + parameters). Use this to ACT on the page the user is looking at — e.g. its checks, edits, or actions. pageKey is optional: it defaults to the active page, then to the only open one. argsJson is a JSON object of the command's parameters.",
    followUp: false,
    parameters: [
      {
        name: 'commandId',
        type: 'string',
        description: 'the command id to run (from the commandable-surfaces context)',
        required: true,
      },
      {
        name: 'pageKey',
        type: 'string',
        description: 'which page (optional — defaults to the active/only page)',
        required: false,
      },
      {
        name: 'argsJson',
        type: 'string',
        description: 'JSON object of the command arguments (optional)',
        required: false,
      },
    ],
    handler: async ({
      commandId,
      pageKey,
      argsJson,
    }: {
      commandId: string;
      pageKey?: string;
      argsJson?: string;
    }) => {
      const reg = store.get(pageChatSurfacesAtom);
      const keys = Object.keys(reg);
      // Explicit pageKey must exist — never silently fall back to another page.
      if (pageKey && !reg[pageKey]) {
        return { error: `"${pageKey}" is not an open commandable page.`, commandablePages: keys };
      }
      const activeWin = store.get(activeWorkspaceWindowAtom);
      const surface =
        (pageKey ? reg[pageKey] : undefined) ??
        (activeWin ? reg[activeWin.pageKey] : undefined) ??
        (keys.length === 1 ? reg[keys[0]] : undefined);
      if (!surface) {
        return keys.length
          ? { error: 'More than one page is open — pass pageKey.', commandablePages: keys }
          : { error: 'No commandable page is open. Open one first.' };
      }
      const command = surface.commands?.find((c) => c.id === commandId);
      if (!command) {
        return {
          error: `No command "${commandId}" on ${surface.title}.`,
          available: (surface.commands ?? []).map((c) => c.id),
        };
      }
      let args: Record<string, unknown> = {};
      if (argsJson) {
        try {
          args = JSON.parse(argsJson);
        } catch {
          return { error: 'argsJson must be valid JSON.' };
        }
      }
      const result = await command.run(args);
      pushTrail({ text: `${surface.title}: ${command.label}`, tone: 'calculation' });
      return result;
    },
  });

  // Bring a page/panel INTO the chat — render it inline in the conversation.
  useCopilotAction({
    name: 'bringIntoChat',
    description:
      'Bring a page or panel INTO the chat — render it inline in the conversation so the user can see/work with it without leaving the chat. Use for "show me X here", "bring the dashboard into the chat", "pull the workflow in". pageKey is one of the open commandable surfaces (see that context) or any registered page key. Prefer this over openPage when the user wants it "here" / "in the chat".',
    followUp: false,
    parameters: [
      {
        name: 'pageKey',
        type: 'string',
        description: 'the page/panel to bring into the chat',
        required: true,
      },
    ],
    handler: async ({ pageKey }: { pageKey: string }) => {
      const title =
        store.get(pageChatSurfacesAtom)[pageKey]?.title ?? getPage(pageKey)?.title ?? pageKey;
      pushTrail({ text: `Brought ${title} into the chat`, tone: 'info' });
      recordWork({
        id: workIdFor(pageWorkType(pageKey), pageKey),
        type: pageWorkType(pageKey),
        title,
        status: 'open',
        by: UI_CONCIERGE,
        open: { kind: 'page', pageKey },
      });
      return `Showing ${title} inline in the chat.`;
    },
    render: ({ args }: { args: { pageKey?: string } }) =>
      args?.pageKey ? (
        <div data-work-id={workIdFor(pageWorkType(args.pageKey), args.pageKey)}>
          <SurfaceEmbed pageKey={args.pageKey} />
        </div>
      ) : (
        <></>
      ),
  });

  useCopilotReadable({
    description:
      'The workflow run currently in the chat (null if none), INCLUDING its live figures once a source is loaded. Use this to tell the user where we are and what it is waiting for, to answer questions about the run ("what is my biggest income category", "how much is net FAPI"), and to feed generateUI with the run\'s ACTUAL numbers (categories, lines, summary) — even while the run is still active/unapproved. Amounts are in `data.currency`.',
    value: activeRun
      ? {
          workflow: activeRun.workflowName,
          document: activeRun.documentLabel,
          step: `${activeRun.stepIndex + 1}/${activeRun.totalSteps} — ${activeRun.stepLabel}`,
          phase: activeRun.phase,
          awaiting: activeRun.awaiting,
          result: activeRun.headline,
          figures: activeRun.data ?? 'No figures yet — the source document has not been provided.',
        }
      : 'No workflow is currently running.',
  });

  // Explicit sources are published by useChatContext. Exact saved-run context
  // belongs to useSessionTools; workspace-wide legacy previews are not chat inputs.

  // Available built-in templates are independent of the user's saved drafts.
  useCopilotReadable({
    description:
      'Built-in portfolio templates, independent of saved workspace drafts. workflowId opens the template; runWorkflowId is the exact execution ID, or null when no runtime is available. Discover executable templates with listAvailableWorkflows. Use supplied records and required columns; do not claim a workpaper prepares or files a complete statutory return. Never invent missing records, rates or applicability decisions.',
    value: PORTFOLIO_BLUEPRINTS,
  });

  const pageEnum = listPages()
    .map((p) => p.key)
    .join(', ');
  const workflowEnum = Object.keys(WORKFLOW_CONFIGS).join(', ');

  useCopilotAction({
    name: 'openPage',
    description: `Open a registered worksheet as a tab. Valid pageKey: ${pageEnum}.`,
    followUp: false,
    parameters: [
      { name: 'pageKey', type: 'string', description: 'one of: ' + pageEnum, required: true },
    ],
    handler: async ({ pageKey }: { pageKey: string }) => {
      const def = getPage(pageKey);
      if (!def) return `No page "${pageKey}".`;
      openWindow({ pageKey, title: def.title });
      pushTrail({ text: `Opened ${def.title}`, tone: 'navigation' });
      recordWork({
        id: workIdFor(pageWorkType(pageKey), pageKey),
        type: pageWorkType(pageKey),
        title: def.title,
        status: 'open',
        by: UI_CONCIERGE,
        open: { kind: 'page', pageKey },
      });
      return `Opened ${def.title}.`;
    },
  });

  useCopilotAction({
    name: 'focusAnchor',
    description:
      'Open a page and highlight an anchor listed in the current page catalog. Do not invent an anchor for a workflow source or result.',
    followUp: false,
    parameters: [{ name: 'anchor', type: 'string', description: 'the anchor id', required: true }],
    handler: async ({ anchor }: { anchor: string }) => {
      const pk = anchorToPage(anchor);
      if (!pk) return `No anchor "${anchor}".`;
      const def = getPage(pk);
      openWindow({ pageKey: pk, title: def?.title ?? pk });
      window.dispatchEvent(
        new CustomEvent('cwp-focus-anchor', { detail: { pageKey: pk, anchor } }),
      );
      pushTrail({ text: `Focused ${def?.title ?? pk}`, tone: 'navigation' });
      recordWork({
        id: workIdFor(pageWorkType(pk), pk),
        type: pageWorkType(pk),
        title: def?.title ?? pk,
        status: 'open',
        detail: `Focused ${anchor}`,
        by: UI_CONCIERGE,
        open: { kind: 'page', pageKey: pk },
      });
      return `Highlighted ${anchor} on ${def?.title ?? pk}.`;
    },
  });

  useCopilotAction({
    name: 'editField',
    description:
      'Bring a field listed in the current editable-fields catalog into chat. If that catalog is empty, no inline field is available. Workflow source and input changes use the shared workflow panel or controlWorkflowRun with an exact source block ID and action review.',
    followUp: false,
    parameters: [
      {
        name: 'fieldId',
        type: 'string',
        description: 'the field id (exact id preferred; loose names are resolved)',
        required: true,
      },
      { name: 'value', type: 'string', description: 'optional value to pre-fill', required: false },
    ],
    handler: async ({ fieldId }: { fieldId: string; value?: string }) => {
      const id = resolveFieldId(fieldId);
      if (!id)
        return {
          error: `No editable field matches "${fieldId}".`,
          availableFields: buildAgentCatalog().fields.map((f) => ({
            fieldId: f.fieldId,
            label: f.label,
          })),
        };
      const ctx = getFieldContext(id)!;
      pushTrail({ text: `Brought ${ctx.label} inline`, tone: 'info' });
      return `Here is ${ctx.label} — editable right here.`;
    },
    render: ({ args }: { args: { fieldId?: string; value?: string } }) => {
      const id = args?.fieldId ? resolveFieldId(args.fieldId) : null;
      if (id) return <InlineFieldCard fieldId={id} preset={args?.value} />;
      return args?.fieldId ? (
        <div style={{ fontSize: 12.5, color: '#71717a' }}>
          No editable field matches “{args.fieldId}”.
        </div>
      ) : (
        <></>
      );
    },
  });

  useCopilotAction({
    name: 'closePage',
    description: 'Close an open page by pageKey (or the last one if omitted).',
    followUp: false,
    parameters: [
      { name: 'pageKey', type: 'string', description: 'page to close', required: false },
    ],
    handler: async ({ pageKey }: { pageKey?: string }) => {
      const target = pageKey
        ? windows.find((w) => w.pageKey === pageKey)
        : windows[windows.length - 1];
      if (!target) return 'Nothing open to close.';
      closeWindow(target.id);
      return `Closed ${target.title}.`;
    },
  });

  useCopilotAction({
    name: 'closeAll',
    description: 'Close every open page.',
    followUp: false,
    parameters: [],
    handler: async () => {
      closeAll();
      return 'Closed all pages.';
    },
  });

  useCopilotAction({
    name: 'openWorkflowBuilder',
    description:
      'Navigate to the visual workflow builder canvas. Optionally pass a workflowId from the available Tier 1 catalog (e.g. "pf-t1134", "pf-t106", "pf-eifel", or a runnable id like "fapi"). Use this when the user wants to see/open/edit an available template. Retired built-ins are unavailable.',
    followUp: false,
    parameters: [
      {
        name: 'workflowId',
        type: 'string',
        description: 'optional — a workflow or blueprint id to open on the canvas',
        required: false,
      },
    ],
    handler: async ({ workflowId }: { workflowId?: string }) => {
      if (workflowId) {
        if (!getWorkflowConfig(workflowId.replace(/^pf-/, '')))
          return `Workflow "${workflowId}" is unavailable. Choose an available template or open a saved workflow by its exact ID.`;
        openInlineBuilder(workflowId);
        return `Opening ${workflowId} in the workflow builder.`;
      }
      launchOpenPage('workflows');
      return 'Opening Workflows. Select a workflow to build or create a blank workflow.';
    },
  });

  // Non-blocking: the handler resolves the tool call the instant the run starts,
  // so the thread never carries a dangling runWorkflow tool call. The live run is
  // long-lived + human-in-the-loop (upload, categorize, elect, approve), and its
  // state/result reach the LLM through the activeRun readable + the trail — not
  // by holding the tool result open until completion (which broke follow-ups mid
  // run with "Tool result is missing for tool call …").

  useCopilotAction({
    name: 'showWorkflowElement',
    description: `Summon a specific element of a workflow INTO the chat without opening the builder — its source document or its output. Use for "show me the source / the trial balance / the biens", "show me the output / the result / the T2057". workflowId: ${workflowEnum}. element: "source" or "output".`,
    followUp: false,
    parameters: [
      { name: 'workflowId', type: 'string', description: workflowEnum, required: true },
      { name: 'element', type: 'string', description: '"source" or "output"', required: true },
    ],
    handler: async ({ workflowId, element }: { workflowId: string; element: string }) => {
      const c = getWorkflowConfig(workflowId);
      if (!c) return `Unknown workflow “${workflowId}”.`;
      const el = element === 'output' ? 'output' : 'source';
      recordWork({
        id: workIdFor('source-review', `${c.id}:${el}`),
        type: 'source-review',
        title: `${c.name} — ${el}`,
        status: 'open',
        by: UI_CONCIERGE,
        open: { kind: 'workflow', workflowId: c.id },
      });
      return `Here is the ${element} of ${c.name}.`;
    },
    render: ({ args }: { args: { workflowId?: string; element?: string } }) => {
      const c = getWorkflowConfig(args?.workflowId ?? '');
      if (!c) return <></>;
      const el = args?.element === 'output' ? 'output' : 'source';
      return (
        <div data-work-id={workIdFor('source-review', `${c.id}:${el}`)}>
          <WorkflowElementCard
            config={c}
            element={el}
            onOpenPage={(pk) => {
              const d = getPage(pk);
              if (d) openWindow({ pageKey: pk, title: d.title });
            }}
            onOpenBuilder={(blockId) => openInlineBuilder(c.id, blockId)}
          />
        </div>
      );
    },
  });

  // Generate a CUSTOM, one-off view inline in the chat (OpenUI). This is the
  // open-ended counterpart to the fixed-render actions above: the model composes
  // any layout from the registered genuiLibrary vocabulary — not a hardwired
  // component. Non-blocking (handler resolves immediately); the render owns the
  // fetch/stream lifecycle and only mounts once the tool args are complete, so we
  // never fire on a half-streamed prompt.
  useCopilotAction({
    name: 'generateUI',
    description:
      'Generate a CUSTOM, one-off view inline in the chat from a description — a quick dashboard, chart, KPI tiles, table, or a small form for ad-hoc values that are NOT a registered worksheet. Use for "generate/create/mock/show me a dashboard|chart|table|form of …" and for a "Generate this view: …" request. The prompt MUST be a complete, self-contained description INCLUDING the concrete data/numbers to display. Do NOT use for opening a real worksheet (openPage) or running a workflow (runWorkflow).',
    followUp: false,
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: 'a complete description of the UI to generate, including the data to display',
        required: true,
      },
    ],
    handler: async ({ prompt }: { prompt: string }) => {
      recordWork({
        id: workIdFor('generated-view', workKeyFromText(prompt)),
        type: 'generated-view',
        title: shortWorkTitle(prompt),
        status: 'open',
        by: UI_COMPOSER,
        open: { kind: 'genui', prompt },
      });
      return `Generated a custom view for: ${prompt}`;
    },
    // Mount as soon as a prompt begins streaming; GenUIRender debounces the fetch
    // until the prompt settles, so we don't gate on `status` (which can leave the
    // view stuck if it never reports 'complete' in this setup).
    render: ({ args }: { args: { prompt?: string } }) => {
      if (!args?.prompt)
        return (
          <div style={{ fontSize: 12.5, color: '#71717a', padding: '10px 0' }}>
            Reading your request…
          </div>
        );
      return (
        <div data-work-id={workIdFor('generated-view', workKeyFromText(args.prompt))}>
          <Suspense fallback={<div role="status">Loading generated view…</div>}>
            <GenUIRender prompt={args.prompt} />
          </Suspense>
        </div>
      );
    },
  });

  useWorkspaceRetrievalTools();
  useAgentWorkflowTools();
  useLiveDataTools();

  // ── Conversation-launch state ────────────────────────────────────────────────
  // This is the sole legacy chat hook: every instance owns an SDK reconnect
  // effect. Share its commands; passive consumers only subscribe to the agent.
  const chat = useCopilotChatInternal();
  const { appendMessage, messages: visibleMessages, stopGeneration, agent } = chat;
  // Server-side persistence: autosaves each turn + restores saved threads. Additive
  // — it observes CopilotKit, doesn't change how the chat runs. See use-chat-persistence.
  const persistence = useChatPersistence(chat);
  const [replyPending, setReplyPending] = useState(false);
  useEffect(() => {
    store.set(
      chatContextLockedAtom,
      replyPending || chat.isLoading || persistence.restoring || !!persistence.restoreError,
    );
    return () => store.set(chatContextLockedAtom, false);
  }, [replyPending, chat.isLoading, persistence.restoring, persistence.restoreError, store]);
  const mkoro = useMkoroDelegation(
    persistence.ensureThread,
    !persistence.restoring && !persistence.restoreError,
    appendMessage,
  );
  const [sent, setSent] = useState(false); // flips the hero → conversation the instant you send
  // Only explicit conversation navigation changes this identity; autosaving a new
  // thread must not reset an in-progress composer or its workflow forms.
  const [conversationKey, setConversationKey] = useState(0);
  const conversationEpoch = useRef(0);
  useEffect(
    () => () => {
      conversationEpoch.current++;
    },
    [],
  );
  const [pinnedFields, setPinnedFields] = useState<string[]>([]); // fields brought in via search
  const [pinnedElements, setPinnedElements] = useState<PinnedElement[]>([]); // workflow source/output summoned in
  const [pinnedRuns, setPinnedRuns] = useAtom(chatWorkflowIdsAtom); // workflow ids launched deterministically (no LLM routing)
  const chatSession = useAtomValue(chatSessionAtom);
  const [pinnedToolResults, setPinnedToolResults] = useState<ToolResult[]>([]); // tools run by hand from the Tools menu

  const replyPendingRef = useRef(false);
  const replySequence = useRef(0);
  const say = async (content: string) => {
    const sequence = ++replySequence.current;
    replyPendingRef.current = true;
    setReplyPending(true);
    setSent(true);
    try {
      chatContext.publish();
      await appendMessage(new TextMessage({ content, role: Role.User }));
    } finally {
      if (replySequence.current === sequence) {
        replyPendingRef.current = false;
        setReplyPending(false);
      }
    }
  };
  const threadEmpty = (visibleMessages?.length ?? 0) === 0;
  const showHero =
    threadEmpty && !sent && !chatSession && pinnedRuns.length === 0 && !persistence.activeThreadId;
  // Clear the parts of a conversation that live OUTSIDE the CopilotKit message store:
  // deterministically-pinned run cards + summoned fields/elements. These are per-chat
  // UI state, so switching chats (new or restored) must wipe them or the previous
  // chat's cards bleed into the next one (they were never part of "the same chat").
  const clearPinned = () => {
    setPinnedRuns([]);
    setPinnedElements([]);
    setPinnedFields([]);
    setPinnedToolResults([]);
  };
  // New chat: clear the store + pinned cards, and start a fresh (unsaved-until-first-
  // message) thread — genuinely blank, distinct from the one you were in.
  const newChat = async () => {
    conversationEpoch.current++;
    if (!(await persistence.startNewThread())) return;
    setConversationKey((key) => key + 1);
    clearPinned();
    setSent(false);
  };
  // Restore a saved conversation from history, then show it (not the hero). Wipe the
  // outgoing chat's pinned cards so only the restored transcript shows.
  const openThread = async (id: string) => {
    conversationEpoch.current++;
    const ok = await persistence.loadThread(id);
    if (ok) {
      setConversationKey((key) => key + 1);
      clearPinned();
      setSent(true);
    }
    return ok;
  };

  // ── Launcher handlers ────────────────────────────────────────────────────────
  const launchOpenPage = (pageKey: string) => {
    const def = getPage(pageKey);
    if (def) openWindow({ pageKey, title: def.title });
  };
  const launchPinField = (fieldId: string) =>
    setPinnedFields((prev) => (prev.includes(fieldId) ? prev : [...prev, fieldId]));
  // Pin the result of a tool run-by-hand (Tools menu → Run ▸) into the thread. Flips
  // the hero → conversation so the value card is visible. Deterministic, no LLM.
  const launchPinToolResult = (r: {
    toolName: string;
    args: Record<string, unknown>;
    result: unknown;
  }) => {
    setSent(true);
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${r.toolName}-${Date.now()}`;
    setPinnedToolResults((prev) => [...prev, { id, at: Date.now(), ...r }]);
  };
  const launchPinElement = (workflowId: string, element: 'source' | 'output') =>
    setPinnedElements((prev) =>
      prev.some((e) => e.workflowId === workflowId && e.element === element)
        ? prev
        : [...prev, { workflowId, element }],
    );
  // Start a workflow DETERMINISTICALLY — pin its run card into the thread directly,
  // bypassing the LLM. (Previously this dropped a `say("Run the X workflow")` turn
  // and relied on the model routing it to the runWorkflow action; that silently
  // failed for any workflow the instructions didn't enumerate — e.g. expense,
  // campaign — leaving the click dead. Pinning the same RunWorkflowRender the action
  // renders makes every launcher click reliable regardless of model behavior.)
  const launchStartWorkflow = (workflowId: string) => {
    if (
      chat.isLoading ||
      persistence.restoring ||
      persistence.restoreError ||
      store.get(chatContextLockedAtom)
    )
      return;
    const ref = openWorkflowSession(store, workflowId, undefined, true);
    bindChatSession(store, ref);
    recordWorkflowSelection(store, workflowId, ref);
    setSent(true);
    setPinnedRuns((prev) => (prev.includes(ref.workflowId) ? prev : [...prev, ref.workflowId]));
  };

  // Open a workflow OR a Sinaxe portfolio blueprint in the builder. Delegates to
  // openInlineBuilder → the Workflows surface's Build tab (InlineBuilder), docked
  // beside the chat. Blueprints aren't runnable, so this is how the chat surfaces
  // them: view/edit in the builder, not execute.
  const launchOpenBuilder = (workflowId: string) => openInlineBuilder(workflowId);

  // Scroll the thread to the live run when the status chip is clicked.
  const scrollToRun = () => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-run-flow]');
    nodes[nodes.length - 1]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  // ── @-command catalog ────────────────────────────────────────────────────────
  // A curated, tag-pickable list of the assistant's "build functions" so you can
  // invoke a capability without knowing the vocabulary: type "@" in the composer
  // and choose. Each command calls the most reliable path — a launcher directly
  // where one exists (deterministic, no LLM), else say() with a canned phrase the
  // LLM routes. `kind` is the family shown as a chip. GenUI commands generate a
  // custom view INLINE via the generateUI action — the "Generate this view:"
  // prefix routes the LLM straight to it (see INSTRUCTIONS). /genui-lab remains
  // the standalone lab.
  const genui = (prompt: string) => say(`Generate this view: ${prompt}`);
  const composerTools: ComposerSuggestion[] = WORKFLOWS.map((w) => ({
    key: `wf:${w.id}`,
    title: w.name,
    sub: w.sub,
    kind: 'workflow',
    dim: !w.ready,
    icon: <Workflow size={14} />,
    run: () => {
      if (w.ready) launchStartWorkflow(w.id);
    },
  }));
  const composerCommands: ComposerSuggestion[] = [
    // Reuse the canonical FAPI entry in the command palette and Workflows menu.
    ...composerTools.filter((item) => item.key === 'wf:fapi'),
    // Navigation — open a real worksheet / the builder
    {
      key: 'cmd:open-t1134',
      title: 'Open T1134 worksheet',
      sub: 'Foreign affiliate reporting',
      kind: 'open',
      icon: <Globe size={14} />,
      run: () => launchOpenPage('t1134'),
    },
    {
      key: 'cmd:open-surplus',
      title: 'Open Surplus worksheet',
      sub: 'Surplus account balances',
      kind: 'open',
      icon: <Globe size={14} />,
      run: () => launchOpenPage('surplus'),
    },
    {
      key: 'cmd:open-builder',
      title: 'Open workflow builder',
      sub: 'The visual node canvas',
      kind: 'open',
      icon: <Workflow size={14} />,
      run: () => launchOpenPage('workflows'),
    },
    // Generate UI (OpenUI) — opens the GenUI Lab with the prompt preset
    {
      key: 'cmd:gen-dashboard',
      title: 'Generate a KPI dashboard',
      sub: '3 tiles + a dividends bar chart',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () =>
        genui(
          'A dashboard: 3 KPI tiles (FAPI $1.24M +12%, Surplus $860k, Tax payable $310k) above a bar chart of dividends by year 2021–2025.',
        ),
    },
    {
      key: 'cmd:gen-table',
      title: 'Generate a data table',
      sub: 'Foreign affiliates with columns',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () =>
        genui(
          'A table of 4 foreign affiliates with columns Name, Jurisdiction, Ownership %, Surplus balance.',
        ),
    },
    {
      key: 'cmd:gen-form',
      title: 'Generate an input form',
      sub: 'FX rate + dividend amount',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () =>
        genui('A short form to enter an FX rate and a dividend amount, with a submit button.'),
    },
    {
      key: 'cmd:gen-pie',
      title: 'Generate a pie chart + callout',
      sub: 'Income by category',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () =>
        genui(
          'A pie chart breaking down income by category, and a callout summarizing the largest slice.',
        ),
    },
    // (The former "talk to an agent" @-mentions were removed — there is one unified agent, Sina.)
  ];

  // ── Composer wiring ──────────────────────────────────────────────────────────
  const composerSearch = (q: string): ComposerSuggestion[] =>
    searchWorkspace(q).map((h) => {
      const Icon = HIT_ICON[h.kind];
      const dim = h.kind === 'workflow' && !h.ready;
      return {
        key: `${h.kind}:${h.id}`,
        title: h.label,
        sub: h.sub,
        kind: h.kind,
        dim,
        icon: <Icon size={14} />,
        run: () => {
          if (h.kind === 'page') launchOpenPage(h.id);
          else if (h.kind === 'field') launchPinField(h.id);
          else if (h.kind === 'workflow') launchStartWorkflow(h.id);
          else if (h.kind === 'blueprint') launchOpenBuilder(h.id);
          else if (h.kind === 'element') launchPinElement(h.workflowId, h.element);
        },
      };
    });

  // One explicit attachment path serves Chat and Sources; never auto-load open files.
  const onAttach = async (files: File[]): Promise<string> => {
    const epoch = conversationEpoch.current;
    const notes: string[] = [];
    for (const file of files) {
      if (epoch !== conversationEpoch.current)
        throw new Error('The conversation changed. Attach the file in the intended chat.');
      notes.push(`[${await attachChatFile(store, file, selectWorkbook)}]`);
    }
    return notes.join('\n');
  };

  return {
    // conversation
    say,
    conversationKey: String(conversationKey),
    getConversationEpoch: () => conversationEpoch.current,
    replyPending,
    selectAgent: (next: ChatAgent) => {
      if (!replyPendingRef.current) persistence.selectAgent(next);
    },
    agentSelectionDisabled: replyPending || persistence.agentSelectionDisabled,
    interruptReply: () => stopChatBeforeSwitch({ stopGeneration, agent }),
    newChat,
    showHero,
    threadEmpty,
    // persistence (saved threads)
    openThread,
    activeThreadId: persistence.activeThreadId,
    saving: persistence.saving,
    saveError: persistence.saveError,
    restoring: persistence.restoring,
    restoreThreadId: persistence.restoreThreadId,
    restoreError: persistence.restoreError,
    reviewMkoroTask: mkoro.reviewMkoroTask,
    mkoroNoticeError: mkoro.mkoroNoticeError,
    // pinned inline cards
    pinnedFields,
    pinnedElements,
    setPinnedFields,
    setPinnedElements,
    pinnedRuns,
    setPinnedRuns,
    pinnedToolResults,
    setPinnedToolResults,
    // composer
    composerSearch,
    composerTools,
    composerCommands,
    onAttach,
    importDialog,
    // run
    activeRun,
    scrollToRun,
    // launcher
    launchOpenPage,
    launchPinField,
    launchPinElement,
    launchStartWorkflow,
    launchPinToolResult,
    // navigation helpers (for inline card "open in builder")
    openInlineBuilder,
    setBuilderFocus,
    router,
  };
}

// Re-export for consumers that render icons next to hits.
export { HIT_ICON };
export type { ReactNode };
