import { apiFetch } from '@/platform/auth/api-fetch';

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

import { useState, useMemo } from 'react';
import { WorkflowCommandResult } from './workflow-command-result';
import {
  AgentRunReview,
  isAgentRunReviewResult,
  requestAgentWorkflowRun,
} from './agent-run-review';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { useRouter, usePathname } from '@/lib/router';
import { Globe, FileText, Workflow, Bot, GitBranch, SquarePen, Play, Sparkles } from 'lucide-react';
import { useCopilotAction, useCopilotReadable, useCopilotChat, useCopilotChatInternal } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import { workspaceWindowsAtom, activeWorkspaceWindowAtom, openWorkspaceWindowAtom, closeWorkspaceWindowAtom, closeAllWorkspaceWindowsAtom, pushTrailAtom, activeRunAtom, uploadedRowsAtom, attachedDocsAtom, type AttachedDoc, runEditsAtom } from '@/shared/stores/workspace-store';
import { pageChatSurfacesAtom } from '@/lib/page-chat-store';
import { SurfaceEmbed } from './surface-embed';
import { attachWorkflowSource } from '@/features/documents/attach-workflow-source';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { getPage, listPages, anchorToPage, getFieldContext, buildAgentCatalog, resolveFieldId, fieldValuesAtom } from '@/shared/stores/resource-registry';
import { InlineFieldCard } from '@/features/assistant/workspace/inline-field-card';
import { WorkflowRunFlow, WorkflowElementCard, RunProposalCard } from '@/features/assistant/workspace/workflow-run-flow';
import type { ComposerSuggestion } from '@/features/assistant/workspace/aside-thread';
import { getWorkflowConfig, WORKFLOW_CONFIGS, type TemplateConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { PORTFOLIO_WORKFLOWS } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { aimBuilderAtWorkflowAtom } from '@/features/workflows-hub/workflows-store';
import { WORKFLOWS } from '@/lib/agents';
import { createTemplateIntel } from '@/features/worksheets/intel';
import { GenUIRender } from '@/features/genui/genui-render';
import { recordWorkItemAtom, workIdFor, workKeyFromText, type WorkItemType } from '@/lib/work-store';
import { UI_CONCIERGE, UI_COMPOSER } from '@/lib/coworkers';
import { CoworkerAvatar } from './coworker-avatar';
import { useChatPersistence } from '@/features/assistant/runtime/chat/use-chat-persistence';
import type { ToolResult } from './tool-result-card';
import { useWorkspaceRetrievalTools } from './use-workspace-retrieval-tools';
import { useAgentWorkflowTools } from './use-agent-workflow-tools';
import { useLiveDataTools } from './use-live-data-tools';

// ── Work-item classification ────────────────────────────────────────────────────
const WORKSHEET_KEYS = new Set(['fapi', 't1134', 'surplus', 'expense']);
function pageWorkType(pageKey: string): WorkItemType {
  return WORKSHEET_KEYS.has(pageKey) ? 'worksheet' : 'page';
}
function shortWorkTitle(text: string, max = 46): string {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

// ── Composer search ────────────────────────────────────────────────────────────
export type SearchHit =
  | { kind: 'page'; id: string; label: string; sub: string }
  | { kind: 'field'; id: string; label: string; sub: string }
  | { kind: 'workflow'; id: string; label: string; sub: string; ready: boolean }
  | { kind: 'blueprint'; id: string; label: string; sub: string }
  | {
      kind: 'element';
      id: string;
      label: string;
      sub: string;
      workflowId: string;
      element: 'source' | 'output';
    };

function searchWorkspace(q: string): SearchHit[] {
  const t = q.toLowerCase().trim();
  if (!t) return [];
  const cat = buildAgentCatalog();
  const hits: SearchHit[] = [];
  for (const w of WORKFLOWS) if (`${w.name} ${w.sub}`.toLowerCase().includes(t)) hits.push({ kind: 'workflow', id: w.id, label: w.name, sub: w.sub, ready: w.ready });
  // Sinaxe portfolio blueprints — openable in the builder (not runnable).
  for (const w of PORTFOLIO_WORKFLOWS) if (`${w.name} ${w.sub} ${w.group}`.toLowerCase().includes(t)) hits.push({ kind: 'blueprint', id: w.id, label: w.name, sub: w.sub });
  // Workflow elements — summon a source/output into the chat without the builder.
  for (const c of Object.values(WORKFLOW_CONFIGS)) {
    if (`${c.name} source document ${c.documentLabel}`.toLowerCase().includes(t))
      hits.push({
        kind: 'element',
        id: `${c.id}:source`,
        label: `${c.name} — source`,
        sub: c.documentLabel,
        workflowId: c.id,
        element: 'source',
      });
    if (`${c.name} output result`.toLowerCase().includes(t))
      hits.push({
        kind: 'element',
        id: `${c.id}:output`,
        label: `${c.name} — output`,
        sub: 'Computed result',
        workflowId: c.id,
        element: 'output',
      });
  }
  for (const p of cat.pages) if (`${p.title} ${p.subtitle} ${p.key}`.toLowerCase().includes(t)) hits.push({ kind: 'page', id: p.key, label: p.title, sub: p.subtitle });
  for (const f of cat.fields) if (`${f.label} ${f.fieldId}`.toLowerCase().includes(t)) hits.push({ kind: 'field', id: f.fieldId, label: f.label, sub: 'Editable field' });
  return hits.slice(0, 9);
}

const HIT_ICON = {
  page: Globe,
  field: FileText,
  workflow: Workflow,
  blueprint: Workflow,
  element: GitBranch,
} as const;

// Portfolio template IDs open the builder; execution uses the separate runtime ID.
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
  if (pathname.startsWith('/workflows')) return { route: pathname, label: 'Saved workflow (database)' };
  return { route: pathname, label: pathname };
}

export type PinnedElement = { workflowId: string; element: 'source' | 'output' };

// Renders the (non-blocking) runWorkflow action. The tool call is resolved
// immediately by its handler; this render owns the UI lifecycle locally.
// Offer-then-accept: it first shows a PROPOSAL card (what the run will do + what
// it needs). The live run only begins when the user clicks Start — so a workflow
// is never kicked off without an explicit accept. Stop/complete handled locally.
export function RunWorkflowRender({ config, onOpenPage, onOpenBuilder }: { config: TemplateConfig; onOpenPage: (pageKey: string) => void; onOpenBuilder: (blockId: string) => void }) {
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduce = useReducedMotion();
  if (stopped) return <div style={{ fontSize: 12, color: '#71717a', padding: '4px 0' }}>Run stopped.</div>;
  // Smooth swap: the proposal fades/lifts out, the run fades/rises in (then its own
  // steps stagger via WorkflowRunFlow's intro) — one continuous motion, not a cut.
  const ease = [0.23, 1, 0.32, 1] as const;
  return (
    <AnimatePresence mode="wait" initial={false}>
      {!started ? (
        <motion.div
          key="proposal"
          // Rise in a beat AFTER the agent's reply — so the run card reads as the
          // agent presenting a plan, not an instant menu popping onto the screen.
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.985 }}
          transition={{ duration: reduce ? 0 : 0.32, ease, delay: reduce ? 0 : 0.25 }}
        >
          <RunProposalCard config={config} onStart={() => setStarted(true)} />
        </motion.div>
      ) : (
        <motion.div key="run" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease }}>
          <WorkflowRunFlow
            config={config}
            onOpenPage={onOpenPage}
            onOpenBuilder={onOpenBuilder}
            onStop={() => setStopped(true)}
            onComplete={() => {}} // the run already publishes its result via the activeRun readable + trail
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type Assistant = ReturnType<typeof useAssistant>;

export function useAssistant() {
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
  const setUploadedRows = useSetAtom(uploadedRowsAtom);
  const setAttachedDocs = useSetAtom(attachedDocsAtom);
  const attachedDocs = useAtomValue(attachedDocsAtom);
  const activeRun = useAtomValue(activeRunAtom);
  // Pages open next to the chat that opted into the Page ⇄ Chat contract. Subscribed
  // so the "commandable surfaces" readable stays live; each surface is rebuilt only
  // on its own meaningful changes (its usePageChat deps), so this stays quiet.
  const surfaces = useAtomValue(pageChatSurfacesAtom);
  // Read the worksheet-intel registry at call time (not via subscription) so these
  // handlers see the latest live intel without re-rendering this heavy hook.
  const store = useStore();

  // Live grounding data — subscribed so the readables below refresh the instant the
  // user uploads a source, edits a field/input, or re-categorizes a row. These feed
  // the GENERIC field-values + live-workflow readables (any workflow, no per-sheet code).
  const fieldValues = useAtomValue(fieldValuesAtom);
  const allRunEdits = useAtomValue(runEditsAtom);
  const uploaded = useAtomValue(uploadedRowsAtom);
  useCopilotReadable({
    description: 'Selected workflow source. For a request to run a workflow using this source, set runWorkflow sourceMode to uploaded and omit recordsJson. The handler uses these stored rows directly; never replace them with an empty array or transcribed sample.',
    value: uploaded.__unassigned__ ? { fileName: uploaded.__unassigned__.fileName, rowCount: uploaded.__unassigned__.rows.length, sourceId: uploaded.__unassigned__.sourceId } : null,
  });

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
    description: 'The page the user is currently looking at (their current location in the app). Use this to ground answers in where they are.',
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
    description: "Pages/panels open next to the chat that it can act on. For each: pageKey, title, a live context snapshot of what's on that page, and the commands you can run on it (id, label, description, parameters). To DO something to the page the user is looking at, call commandPage with its commandId. To show a page inside the conversation, call bringIntoChat with its pageKey.",
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
    description: "Run a command on a page/panel open next to the chat (see the commandable-surfaces context for each page's commandId list + parameters). Use this to ACT on the page the user is looking at — e.g. its checks, edits, or actions. pageKey is optional: it defaults to the active page, then to the only open one. argsJson is a JSON object of the command's parameters.",
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
    handler: async ({ commandId, pageKey, argsJson }: { commandId: string; pageKey?: string; argsJson?: string }) => {
      const reg = store.get(pageChatSurfacesAtom);
      const keys = Object.keys(reg);
      // Explicit pageKey must exist — never silently fall back to another page.
      if (pageKey && !reg[pageKey]) {
        return { error: `"${pageKey}" is not an open commandable page.`, commandablePages: keys };
      }
      const activeWin = store.get(activeWorkspaceWindowAtom);
      const surface = (pageKey ? reg[pageKey] : undefined) ?? (activeWin ? reg[activeWin.pageKey] : undefined) ?? (keys.length === 1 ? reg[keys[0]] : undefined);
      if (!surface) {
        return keys.length ? { error: 'More than one page is open — pass pageKey.', commandablePages: keys } : { error: 'No commandable page is open. Open one first.' };
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
    description: 'Bring a page or panel INTO the chat — render it inline in the conversation so the user can see/work with it without leaving the chat. Use for "show me X here", "bring the dashboard into the chat", "pull the workflow in". pageKey is one of the open commandable surfaces (see that context) or any registered page key. Prefer this over openPage when the user wants it "here" / "in the chat".',
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
      const title = store.get(pageChatSurfacesAtom)[pageKey]?.title ?? getPage(pageKey)?.title ?? pageKey;
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
    description: 'The workflow run currently in the chat (null if none), INCLUDING its live figures once a source is loaded. Use this to tell the user where we are and what it is waiting for, to answer questions about the run ("what is my biggest income category", "how much is net FAPI"), and to feed generateUI with the run\'s ACTUAL numbers (categories, lines, summary) — even while the run is still active/unapproved. Amounts are in `data.currency`.',
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

  // ── Attached documents (PDF / plain-text) ────────────────────────────────────
  // The user can attach a document in the composer; its extracted text lands here so
  // the assistant can ANSWER questions about it ("what is this document about?",
  // "summarize section 3") from the ACTUAL content — not just the filename. `text`
  // is the extracted text layer (no OCR); `truncated: true` means the file was longer
  // than the cap and the tail was cut, so say so rather than claiming completeness.
  useCopilotReadable({
    description: 'Documents in context — attached in the chat OR opened in the Document Viewer next to it (which auto-adds every open file here) — with their extracted text content. When the user asks about "this document", "the attachment", "the PDF", or "the file", ANSWER from the `text` here — it is the real content, not a guess. Each doc: fileName, kind, pages (for PDFs), and text. `truncated: true` means the document was cut at a length cap — answer from what is present and note the tail was not included. Empty list = no document is currently open or attached.',
    value: attachedDocs.length
      ? attachedDocs.map((d) => ({
          fileName: d.fileName,
          kind: d.kind,
          pages: d.pages,
          truncated: d.truncated,
          text: d.text,
        }))
      : 'No documents have been attached to the chat.',
  });

  // ── Editable field values (GLOBAL, always live) ──────────────────────────────
  // Every editable field + its CURRENT value, so the assistant answers value
  // questions from the real number instead of guessing. Bound fields resolve to the
  // engine input the worksheet/run/engine share; `isDefault` flags a value the user
  // hasn't set yet (still the template default) so the model can say so honestly.
  const fieldValueContext = useMemo(() => {
    return buildAgentCatalog().fields.map((f) => {
      const ctx = getFieldContext(f.fieldId);
      const binding = ctx?.field.binding;
      let value: string;
      let isDefault: boolean;
      if (binding) {
        const stored = allRunEdits[binding.workflowId]?.inputs?.[binding.inputKey];
        const engineDefault = getWorkflowConfig(binding.workflowId)?.editableInputs?.find((i) => i.key === binding.inputKey)?.default;
        isDefault = stored === undefined;
        value = String(stored ?? engineDefault ?? ctx?.field.default ?? '');
      } else {
        const stored = fieldValues[f.fieldId];
        isDefault = stored === undefined;
        value = stored ?? ctx?.field.default ?? '';
      }
      return {
        fieldId: f.fieldId,
        label: f.label,
        worksheet: f.pageKey,
        value,
        unit: ctx?.field.ccy,
        hint: ctx?.field.hint,
        isDefault,
        boundToWorkflow: binding?.workflowId,
      };
    });
  }, [fieldValues, allRunEdits]);

  useCopilotReadable({
    description: 'Every editable worksheet field and its CURRENT live value — the real number the user sees and edits (bound fields share the exact engine input the worksheet and the workflow run use). ANSWER value questions from this ("what is the FX rate?", "what inclusion rate are we using?") — do NOT guess or state a value that is not here. `isDefault: true` means the user has not set it yet (still the template default), so say it is unset rather than asserting it as chosen. To change one, call editField with the exact `fieldId` shown here.',
    value: fieldValueContext,
  });

  // ── Live workflow data (GENERIC across every registered workflow) ────────────
  // For any workflow the user is actually working on — uploaded a source, edited an
  // input/override, or has an active run — publish the SAME computed snapshot the
  // worksheet renders (lines, summary+CAD, FX, classification). So the assistant knows
  // the real numbers even with no worksheet page open. Zero per-workflow code: adding
  // a TemplateConfig to WORKFLOW_CONFIGS makes it grounded here automatically.
  const liveWorkflowContext = useMemo(() => {
    const activeId = activeRun?.workflowId;
    return Object.values(WORKFLOW_CONFIGS).flatMap((cfg) => {
      const up = uploaded[cfg.id];
      const edits = allRunEdits[cfg.id];
      const hasData = Boolean(up?.rows?.length) || (edits && (Object.keys(edits.inputs).length > 0 || Object.keys(edits.overrides).length > 0)) || cfg.id === activeId;
      if (!hasData) return [];
      let snapshot: unknown = null;
      try {
        snapshot = createTemplateIntel(cfg, {
          rows: up?.rows,
          inputs: edits?.inputs,
          overrides: edits?.overrides,
        }).describe();
      } catch {
        snapshot = null;
      }
      return [
        {
          workflowId: cfg.id,
          name: cfg.name,
          isActiveRun: cfg.id === activeId,
          source: up ? { fileName: up.fileName, rowCount: up.rows.length } : 'sample data (nothing uploaded yet)',
          snapshot,
        },
      ];
    });
  }, [uploaded, allRunEdits, activeRun?.workflowId]);

  useCopilotReadable({
    description: 'The workflows you are actually working on and their REAL current data — any workflow with an uploaded source, an edited input/override, or an active run. Each `snapshot` is computed by the same engine the worksheet renders (lines, summary with CAD, FX rate, classification buckets), so these ARE the on-screen numbers even when no worksheet page is open. Answer figure questions from here; for a formula or operand breakdown call whyWorksheetValue / explainWorksheetLine with the workflowId. Workflows NOT listed have no live data yet (they would run on sample data).',
    value: liveWorkflowContext.length ? liveWorkflowContext : 'No workflow has live data yet — nothing has been uploaded, edited, or run.',
  });

  // Sinaxe portfolio blueprints — the assistant knows these exist so it can list
  // them and offer to open them, WITHOUT treating them as runnable.
  useCopilotReadable({
    description: 'Built-in portfolio templates, independent of saved workspace drafts. workflowId opens the template; runWorkflowId is the exact execution ID, or null when no runtime is available. Discover executable templates with listAvailableWorkflows. Use supplied records and required columns; do not claim a workpaper prepares or files a complete statutory return. Never invent missing records, rates or applicability decisions.',
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
    parameters: [{ name: 'pageKey', type: 'string', description: 'one of: ' + pageEnum, required: true }],
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
    description: 'Open a page and scroll to + highlight one specific part of it (an anchor id like "fapi:fx").',
    followUp: false,
    parameters: [{ name: 'anchor', type: 'string', description: 'the anchor id', required: true }],
    handler: async ({ anchor }: { anchor: string }) => {
      const pk = anchorToPage(anchor);
      if (!pk) return `No anchor "${anchor}".`;
      const def = getPage(pk);
      openWindow({ pageKey: pk, title: def?.title ?? pk });
      window.dispatchEvent(new CustomEvent('cwp-focus-anchor', { detail: { pageKey: pk, anchor } }));
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
    description: 'Bring an editable worksheet field INTO the chat so the user can view/modify it inline (it syncs to the worksheet AND the workflow run — one shared value). Use for "show me the FX rate", "let me change the dividend", etc. Do NOT open the worksheet. Prefer the exact fieldId from the editable-fields context (e.g. "fx"), but a loose reference ("fx rate", the line key) is resolved too.',
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
      return args?.fieldId ? <div style={{ fontSize: 12.5, color: '#71717a' }}>No editable field matches “{args.fieldId}”.</div> : <></>;
    },
  });

  useCopilotAction({
    name: 'closePage',
    description: 'Close an open page by pageKey (or the last one if omitted).',
    followUp: false,
    parameters: [{ name: 'pageKey', type: 'string', description: 'page to close', required: false }],
    handler: async ({ pageKey }: { pageKey?: string }) => {
      const target = pageKey ? windows.find((w) => w.pageKey === pageKey) : windows[windows.length - 1];
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
    description: 'Navigate to the visual workflow builder canvas. Optionally pass a workflowId to open a specific workflow OR a Sinaxe portfolio blueprint onto the canvas (e.g. "pf-t1134", "pf-scope-service", "pf-eifel", or a runnable id like "fapi"). Use this when the user wants to see/open/edit a blueprint.',
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
      if (workflowId && (getWorkflowConfig(workflowId) || PORTFOLIO_WORKFLOWS.some((w) => w.id === workflowId))) {
        openInlineBuilder(workflowId);
        return `Opening ${workflowId} in the workflow builder.`;
      }
      launchOpenPage('workflows');
      return 'Opening the workflow builder.';
    },
  });

  // Non-blocking: the handler resolves the tool call the instant the run starts,
  // so the thread never carries a dangling runWorkflow tool call. The live run is
  // long-lived + human-in-the-loop (upload, categorize, elect, approve), and its
  // state/result reach the LLM through the activeRun readable + the trail — not
  // by holding the tool result open until completion (which broke follow-ups mid
  // run with "Tool result is missing for tool call …").
  useCopilotAction({
    name: 'runWorkflow',
    description: `Request execution of a workflow from an explicit chat command. Valid ids: ${workflowEnum}. Set sourceMode to uploaded to use the selected source or previously uploaded records; do not transcribe the file into recordsJson. Set sourceMode to records only for actual records supplied in the user's message. Set sourceMode to sample ONLY when explicitly requested. The action freezes the selected records and asks for scoped approval. Missing data requires a source selection, never fabricated records. Report actual errors and findings; execution never implies result approval or filing.`,
    followUp: false,
    parameters: [
      { name: 'workflowId', type: 'string', description: workflowEnum, required: true },
      { name: 'sourceMode', type: 'string', enum: ['uploaded', 'records', 'sample'], description: 'uploaded: use selected/attached source directly; records: use inline recordsJson; sample: only when explicitly requested.', required: true },
      {
        name: 'recordsJson',
        type: 'string',
        description: 'JSON array of supplied source records, preserving business columns',
        required: false,
      },
      {
        name: 'inputsJson',
        type: 'string',
        description: 'JSON object of supplied numeric parameter overrides',
        required: false,
      },
      {
        name: 'useSample',
        type: 'boolean',
        description: 'Only true for an explicit request to run sample data',
        required: false,
      },
    ],
    handler: async (args: import('../runtime/workflow-run-input').AgentTemplateRunArgs) => {
      const config = getWorkflowConfig(args.workflowId.replace(/^pf-/, ''));
      if (!config) return { status: 'error', errors: [`Workflow '${args.workflowId}' is unavailable.`] };
      return requestAgentWorkflowRun(store, args, config.name);
    },
    render: ({ result, status }) => {
      if (status !== 'complete') return <div role="status">Preparing workflow run…</div>;
      if (isAgentRunReviewResult(result)) return <AgentRunReview review={result} />;
      return <WorkflowCommandResult result={result} />;
    },
  });

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
    description: 'Generate a CUSTOM, one-off view inline in the chat from a description — a quick dashboard, chart, KPI tiles, table, or a small form for ad-hoc values that are NOT a registered worksheet. Use for "generate/create/mock/show me a dashboard|chart|table|form of …" and for a "Generate this view: …" request. The prompt MUST be a complete, self-contained description INCLUDING the concrete data/numbers to display. Do NOT use for opening a real worksheet (openPage) or running a workflow (runWorkflow).',
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
      if (!args?.prompt) return <div style={{ fontSize: 12.5, color: '#71717a', padding: '10px 0' }}>Reading your request…</div>;
      return (
        <div data-work-id={workIdFor('generated-view', workKeyFromText(args.prompt))}>
          <GenUIRender prompt={args.prompt} />
        </div>
      );
    },
  });

  useWorkspaceRetrievalTools();
  useAgentWorkflowTools();
  useLiveDataTools();

  // ── Conversation-launch state ────────────────────────────────────────────────
  const { appendMessage } = useCopilotChat();
  // Read the live messages from the AG-UI store (CopilotKit 1.63). The legacy
  // useCopilotChat().visibleMessages is undefined here — see use-chat-persistence.
  const { messages: visibleMessages } = useCopilotChatInternal() as unknown as {
    messages: unknown[];
  };
  // Server-side persistence: autosaves each turn + restores saved threads. Additive
  // — it observes CopilotKit, doesn't change how the chat runs. See use-chat-persistence.
  const persistence = useChatPersistence();
  const [sent, setSent] = useState(false); // flips the hero → conversation the instant you send
  const [pinnedFields, setPinnedFields] = useState<string[]>([]); // fields brought in via search
  const [pinnedElements, setPinnedElements] = useState<PinnedElement[]>([]); // workflow source/output summoned in
  const [pinnedRuns, setPinnedRuns] = useState<string[]>([]); // workflow ids launched deterministically (no LLM routing)
  const [pinnedToolResults, setPinnedToolResults] = useState<ToolResult[]>([]); // tools run by hand from the Tools menu

  const say = (content: string) => {
    appendMessage(new TextMessage({ content, role: Role.User }));
    setSent(true);
  };
  const threadEmpty = (visibleMessages?.length ?? 0) === 0;
  const showHero = threadEmpty && !sent; // centered composer until the first message
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
  const newChat = () => {
    persistence.startNewThread();
    clearPinned();
    setSent(false);
  };
  // Restore a saved conversation from history, then show it (not the hero). Wipe the
  // outgoing chat's pinned cards so only the restored transcript shows.
  const openThread = async (id: string) => {
    const ok = await persistence.loadThread(id);
    if (ok) {
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
  const launchPinField = (fieldId: string) => setPinnedFields((prev) => (prev.includes(fieldId) ? prev : [...prev, fieldId]));
  // Pin the result of a tool run-by-hand (Tools menu → Run ▸) into the thread. Flips
  // the hero → conversation so the value card is visible. Deterministic, no LLM.
  const launchPinToolResult = (r: { toolName: string; args: Record<string, unknown>; result: unknown }) => {
    setSent(true);
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${r.toolName}-${Date.now()}`;
    setPinnedToolResults((prev) => [...prev, { id, at: Date.now(), ...r }]);
  };
  const launchPinElement = (workflowId: string, element: 'source' | 'output') => setPinnedElements((prev) => (prev.some((e) => e.workflowId === workflowId && e.element === element) ? prev : [...prev, { workflowId, element }]));
  // Start a workflow DETERMINISTICALLY — pin its run card into the thread directly,
  // bypassing the LLM. (Previously this dropped a `say("Run the X workflow")` turn
  // and relied on the model routing it to the runWorkflow action; that silently
  // failed for any workflow the instructions didn't enumerate — e.g. expense,
  // campaign — leaving the click dead. Pinning the same RunWorkflowRender the action
  // renders makes every launcher click reliable regardless of model behavior.)
  const launchStartWorkflow = (workflowId: string) => {
    const config = getWorkflowConfig(workflowId);
    if (!config) return;
    setSent(true); // flip hero → conversation so the pinned run card is visible
    setPinnedRuns((prev) => (prev.includes(config.id) ? prev : [...prev, config.id]));
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
  const composerCommands: ComposerSuggestion[] = [
    // Navigation — open a real worksheet / the builder
    {
      key: 'cmd:open-fapi',
      title: 'Open FAPI worksheet',
      sub: 'Foreign Accrual Property Income',
      kind: 'open',
      icon: <Globe size={14} />,
      run: () => launchOpenPage('fapi'),
    },
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
    // Bring a live element into the chat (synced to the worksheet)
    {
      key: 'cmd:edit-fx',
      title: 'Edit the FX rate inline',
      sub: 'Live field, synced to the worksheet',
      kind: 'inline',
      icon: <SquarePen size={14} />,
      run: () => launchPinField('fx'),
    },
    {
      key: 'cmd:fapi-source',
      title: 'Show FAPI source document',
      sub: 'The trial balance feeding the run',
      kind: 'inline',
      icon: <GitBranch size={14} />,
      run: () => launchPinElement('fapi', 'source'),
    },
    {
      key: 'cmd:fapi-output',
      title: 'Show FAPI output',
      sub: 'The computed result',
      kind: 'inline',
      icon: <GitBranch size={14} />,
      run: () => launchPinElement('fapi', 'output'),
    },
    // Run a workflow live in the chat
    {
      key: 'cmd:run-fapi',
      title: 'Run the FAPI workflow',
      sub: 'Live, step-by-step run in the chat',
      kind: 'run',
      icon: <Play size={14} />,
      run: () => launchStartWorkflow('fapi'),
    },
    // Generate UI (OpenUI) — opens the GenUI Lab with the prompt preset
    {
      key: 'cmd:gen-dashboard',
      title: 'Generate a KPI dashboard',
      sub: '3 tiles + a dividends bar chart',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () => genui('A dashboard: 3 KPI tiles (FAPI $1.24M +12%, Surplus $860k, Tax payable $310k) above a bar chart of dividends by year 2021–2025.'),
    },
    {
      key: 'cmd:gen-table',
      title: 'Generate a data table',
      sub: 'Foreign affiliates with columns',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () => genui('A table of 4 foreign affiliates with columns Name, Jurisdiction, Ownership %, Surplus balance.'),
    },
    {
      key: 'cmd:gen-form',
      title: 'Generate an input form',
      sub: 'FX rate + dividend amount',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () => genui('A short form to enter an FX rate and a dividend amount, with a submit button.'),
    },
    {
      key: 'cmd:gen-pie',
      title: 'Generate a pie chart + callout',
      sub: 'Income by category',
      kind: 'genui',
      icon: <Sparkles size={14} />,
      run: () => genui('A pie chart breaking down income by category, and a callout summarizing the largest slice.'),
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

  const composerTools: ComposerSuggestion[] = [
    ...WORKFLOWS.map((w) => ({
      key: `wf:${w.id}`,
      title: w.name,
      sub: w.sub,
      kind: 'workflow',
      dim: !w.ready,
      icon: <Workflow size={14} />,
      run: () => {
        if (w.ready) launchStartWorkflow(w.id);
      },
    })),
  ];

  // File attach. Two paths, both make the file's CONTENT available to the assistant
  // (never just the filename): workbooks parse into the shared upload store as rows
  // (the exact rows the engine + builder use); other documents (PDF, plain-text) get
  // their text extracted server-side and stored as readable context so the model can
  // answer questions about them. The returned string is a SHORT note appended to the
  // message — the full text rides in the attachedDocs readable, not the chat bubble.
  const onAttach = async (files: File[]): Promise<string> => {
    const notes: string[] = [];
    for (const f of files) {
      if (/\.(xlsx|xls|json)$/i.test(f.name)) {
        try {
          const { source, notice } = await attachWorkflowSource(f, selectWorkbook);
          setUploadedRows((prev) => ({ ...prev, __unassigned__: source }));
          notes.push(`[Attached ${source.fileName} — ${source.rows.length} source records. ${notice}]`);
        } catch (error) {
          throw new Error(`Could not attach ${f.name}: ${error instanceof Error ? error.message : 'Unreadable workbook'}`);
        }
        continue;
      }

      // PDF / plain-text → extract text via the server route and publish as context.
      try {
        const body = new FormData();
        body.append('file', f);
        const res = await apiFetch('/api/assistant/extract', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) {
          notes.push(`[Attached ${f.name} — couldn't read it: ${data?.error ?? res.statusText}]`);
          continue;
        }
        const doc: AttachedDoc = {
          id: `${f.name}-${f.size}`,
          fileName: data.fileName ?? f.name,
          kind: data.kind,
          text: data.text,
          chars: data.chars,
          pages: data.pages,
          truncated: !!data.truncated,
          at: Date.now(),
        };
        // Replace any prior attachment of the same file; newest last.
        setAttachedDocs((prev) => [...prev.filter((d) => d.id !== doc.id), doc]);
        const size = doc.pages ? `${doc.pages} pages` : `${doc.chars.toLocaleString()} chars`;
        notes.push(`[Attached ${doc.fileName} — ${size} of text extracted${doc.truncated ? ' (truncated)' : ''}; full text available to the assistant]`);
      } catch (err) {
        notes.push(`[Attached ${f.name} — couldn't read it: ${err instanceof Error ? err.message : 'extraction failed'}]`);
      }
    }
    return notes.join('\n');
  };

  return {
    // conversation
    say,
    newChat,
    showHero,
    threadEmpty,
    // persistence (saved threads)
    openThread,
    activeThreadId: persistence.activeThreadId,
    saving: persistence.saving,
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
