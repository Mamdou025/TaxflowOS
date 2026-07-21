'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, CSSProperties } from 'react';
import { atomWithStorage } from 'jotai/utils';
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Layers,
  FileText,
  Building2,
  Receipt,
  Files,
  LayoutGrid,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Resource registry — the single spine
//
// One entry per real thing a fiscalist can name and act on. Each Resource
// carries every facet that thing has:
//
//   • chip     — how it renders as an inline @-mention in the conversation
//   • open     — what "open it" does (pull in a page, or navigate a route)
//   • page     — if it IS a registered renderable surface (component/title/icon)
//   • anchors  — its addressable sub-pieces (scroll-to + highlight)
//   • field    — an anchor that is also inline-editable, bound to a shared atom
//
// This replaces four overlapping registries (chat-entities, workspace-registry,
// workspace-targets, fapi-model). Everything — chips, NL intent, page tabs,
// deep-links, inline edits — now resolves against this one table.
//
// To swap the keyword resolvers for a real LLM tool-call later: expose the
// resource ids / anchors as the tool's enum and keep the render/open plumbing.
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceKind =
  | 'tool'
  | 'integration'
  | 'workflow'
  | 'agent'
  | 'persona'
  | 'value'
  | 'worksheet';

export type ResourceIconProps = { size?: number; style?: CSSProperties };

/** An anchor that is also editable: a live, bound slice of a page. */
export type ResourceField = {
  id: string; // key into fieldValuesAtom; also the page row's id
  tag: string; // short badge, e.g. "FX"
  ccy: string; // unit label shown after the input
  default: string;
  hint?: string;
  editKeywords: string[]; // phrases that trigger *edit* intent (need an edit verb)
  /** Optional bridge to a workflow engine input. When set, this field READS and
   *  WRITES `runEditsAtom[workflowId].inputs[inputKey]` — the SAME value the
   *  worksheet, the chat run, and the engine use — instead of the standalone
   *  `fieldValuesAtom`. So editing the field inline in the chat actually changes
   *  the computation, and the value the assistant reports, the sheet renders, and
   *  the run computes are ONE number (no parallel stores that silently disagree). */
  binding?: { workflowId: string; inputKey: string };
};

/** A named, requestable piece of a page — matches a [data-anchor] on screen. */
export type ResourceAnchor = {
  anchor: string; // "<pageKey>:<id>"
  label: string; // human label (chat + trail + field editor)
  keywords: string[]; // phrases that resolve to a *navigate/focus* on this piece
  field?: ResourceField; // present → this anchor is inline-editable
};

/** The renderable-page facet of a resource. */
export type ResourcePage = {
  title: string;
  subtitle: string;
  icon: ComponentType<ResourceIconProps>;
  Component: ComponentType;
};

export type ResourceOpen =
  | { as: 'page'; pageKey: string }
  | { as: 'route'; href: string };

export type Resource = {
  id: string;
  kind: ResourceKind;
  /** Canonical chip label. When set, the resource renders as an inline chip. */
  token?: string;
  /** Exact lowercase forms that render as a chip (the precise @-mentions). */
  mentions?: string[];
  /** Broad lowercase phrases for natural-language open/target intent. */
  keywords?: string[];
  note?: string;
  open?: ResourceOpen;
  page?: ResourcePage;
  anchors?: ResourceAnchor[];
};

// ─── Chip presentation ──────────────────────────────────────────────────────
export const KIND_COLOR: Record<ResourceKind, string> = {
  tool: '#0891B2',
  integration: '#2563EB',
  workflow: '#6B21A8',
  agent: '#C2410C',
  persona: '#B45309',
  value: '#059669',
  worksheet: '#6B21A8',
};

export const KIND_LABEL: Record<ResourceKind, string> = {
  tool: 'Tool',
  integration: 'Integration',
  workflow: 'Workflow',
  agent: 'AI agent',
  persona: 'Persona',
  value: 'Value',
  worksheet: 'Worksheet',
};

// ─── Lazy page loading ──────────────────────────────────────────────────────
const Loading = () => (
  <div style={{ padding: 32, fontSize: 13, color: '#6B7280' }}>Loading page…</div>
);
const lazyPage = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { ssr: false, loading: Loading });

// ─── The registry ───────────────────────────────────────────────────────────
export const RESOURCES: Resource[] = [
  // ── Integrations / tools / values / agents (chip-only entities) ────────────
  {
    id: 'email',
    kind: 'integration',
    token: 'EMAIL',
    mentions: ['email', 'inbox', 'outlook'],
    note: 'Email integration',
  },
  {
    id: 'workflow-builder',
    kind: 'tool',
    token: 'WORKFLOW-BUILDER',
    mentions: ['workflow-builder', 'workflow builder', 'the builder'],
    note: 'Visual workflow canvas',
    open: { as: 'route', href: '/builder' },
  },
  {
    id: 'viewer',
    kind: 'tool',
    token: 'DOCUMENTS',
    mentions: ['documents', 'document viewer', 'the viewer'],
    keywords: ['open pdf', 'open excel', 'open word', 'view document', 'view file', 'read pdf', 'read document', 'documents', 'viewer'],
    note: 'Open & view PDF / Excel / Word files',
    open: { as: 'page', pageKey: 'viewer' },
    page: {
      title: 'Documents',
      subtitle: 'Open PDF, Excel & Word files',
      icon: Files,
      Component: lazyPage(() => import('@/components/workspace/document-viewer')),
    },
  },
  {
    id: 'worksheets',
    kind: 'tool',
    token: 'WORKSHEETS',
    mentions: ['worksheets', 'the worksheets', 'all worksheets'],
    keywords: ['worksheets', 'all worksheets', 'open worksheet', 'worksheet list'],
    note: 'All worksheets — pick one to open',
    open: { as: 'page', pageKey: 'worksheets' },
    page: {
      title: 'Worksheets',
      subtitle: 'FAPI · T1134 · Surplus · Executive Overview',
      icon: LayoutGrid,
      Component: lazyPage(() => import('@/components/workspace/worksheets-hub')),
    },
  },
  {
    id: 'gross-fapi',
    kind: 'value',
    token: 'GROSS FAPI',
    mentions: ['gross fapi', 'gross-fapi'],
    note: 'Computed value',
  },
  {
    id: 'sophia',
    kind: 'agent',
    token: 'SOPHIA',
    mentions: ['sophia'],
    note: 'IRL research agent',
  },

  // ── FAPI — one resource that is a chip (FAPI-WORKFLOW), a page (fapi), and a
  //    set of addressable/editable anchors. Previously split across all four
  //    registries; now a single entry. ────────────────────────────────────────
  {
    id: 'fapi',
    kind: 'workflow',
    token: 'FAPI-WORKFLOW',
    mentions: ['fapi-workflow', 'fapi workflow'],
    keywords: ['fapi', 'foreign accrual', 'accrual property'],
    note: 'FAPI calculation workflow',
    open: { as: 'page', pageKey: 'fapi' },
    page: {
      title: 'FAPI Worksheet',
      subtitle: 'Foreign accrual property income',
      icon: Globe,
      Component: lazyPage(() => import('@/components/worksheet/fapi-worksheet')),
    },
    anchors: [
      // Order: most specific first (first keyword match wins on navigate).
      {
        anchor: 'fapi:fx',
        label: 'Annual Average FX Rate',
        keywords: ['fx rate', 'exchange rate', 'annual average', 'currency conversion', 'fx'],
        field: {
          id: 'fx', tag: 'FX', ccy: 'RATE', default: '1.35',
          hint: 'USD → CAD annual average',
          editKeywords: ['fx rate', 'exchange rate', 'fx', 'annual average'],
          // Bridge to the FAPI engine's fxRate input — one value across chat, sheet, run.
          binding: { workflowId: 'fapi', inputKey: 'fxRate' },
        },
      },
      { anchor: 'fapi:a', label: 'Property Income (A)', keywords: ['property income', 'dividend', 'component a', 'line a'] },
      {
        anchor: 'fapi:a-div',
        label: 'Property Income — Dividendes',
        keywords: [], // navigation is via 'fapi:a'; this row is reached by *edit* intent
        field: {
          id: 'a-div', tag: 'A', ccy: 'CAD', default: '0.00',
          hint: 'Manual entry',
          editKeywords: ['dividend', 'dividendes', 'property income'],
        },
      },
      { anchor: 'fapi:allowable-expenses', label: 'Allowable Expenses', keywords: ['allowable expenses', 'expenses', 'deductions'] },
      { anchor: 'fapi:b', label: 'Gains From Disposition (B)', keywords: ['component b', 'gains from disposition', 'disposition', 'gains'] },
      { anchor: 'fapi:95-2', label: 'Canadian Rules 95(2)', keywords: ['95(2)', '95-2', 'canadian rules', 'recharacterization', 'recharacterize'] },
      { anchor: 'fapi:a1', label: 'Debt Forgiveness (A.1)', keywords: ['debt forgiveness', 'a.1', 'a1'] },
      { anchor: 'fapi:a2', label: 'Prior Year G (A.2)', keywords: ['prior year', 'a.2', 'a2'] },
    ],
  },

  // ── Expense Reimbursement — a non-fiscal workflow that HAS its own worksheet.
  //    A chip (EXPENSE-WORKFLOW), a page (expense), and the run's result surface.
  {
    id: 'expense',
    kind: 'workflow',
    token: 'EXPENSE-WORKFLOW',
    mentions: ['expense-workflow', 'expense workflow', 'reimbursement workflow'],
    keywords: ['expense', 'reimbursement', 'expense report', 'receipts', 'per diem', 'per-diem'],
    note: 'Employee expense reimbursement workflow',
    open: { as: 'page', pageKey: 'expense' },
    page: {
      title: 'Expense Reimbursement',
      subtitle: 'Receipts · policy caps · net payable',
      icon: Receipt,
      Component: lazyPage(() => import('@/components/worksheet/expense-worksheet')),
    },
  },

  // ── Other registered pages ─────────────────────────────────────────────────
  {
    id: 'dashboard',
    kind: 'worksheet',
    keywords: ['dashboard', 'portfolio', 'work items', 'review queue', 'kpi', 'my work'],
    open: { as: 'page', pageKey: 'dashboard' },
    page: {
      title: 'Practitioner Dashboard',
      subtitle: 'Portfolio · work items · review queue',
      icon: LayoutDashboard,
      Component: lazyPage(() => import('@tax/pages/Dashboard')),
    },
    anchors: [
      { anchor: 'dashboard:ai-summary', label: 'AI Workspace Summary', keywords: ['ai summary', 'workspace summary'] },
      { anchor: 'dashboard:review-queue', label: 'Review Queue', keywords: ['review queue'] },
      { anchor: 'dashboard:work-items', label: 'My Work Items', keywords: ['work items', 'my work', 'sign-off', 'sign off'] },
      { anchor: 'dashboard:portfolio', label: 'Client Portfolio', keywords: ['client portfolio', 'portfolio'] },
      { anchor: 'dashboard:deadlines', label: 'Upcoming Deadlines', keywords: ['deadlines', 'upcoming deadlines'] },
      { anchor: 'dashboard:activity', label: 'Recent Activity', keywords: ['recent activity', 'activity feed'] },
      { anchor: 'dashboard:kpis', label: 'KPI metrics', keywords: ['kpi', 'key metrics', 'pending reviews', 'at risk', 'at-risk', 'completed', 'metrics'] },
    ],
  },
  {
    id: 'bu-overview',
    kind: 'worksheet',
    keywords: ['overview', 'executive', 'business unit', 'bu overview', 'executive overview'],
    open: { as: 'page', pageKey: 'bu-overview' },
    page: {
      title: 'Executive Overview',
      subtitle: 'Business-unit tax overview',
      icon: BarChart3,
      Component: lazyPage(() => import('@tax/pages/ExecutiveOverview')),
    },
    anchors: [
      { anchor: 'bu:revenue', label: 'Revenue Attainment by LOS', keywords: ['revenue attainment', 'attainment', 'revenue by los'] },
      { anchor: 'bu:lines-of-service', label: 'Lines of Service', keywords: ['lines of service', 'control tower'] },
      { anchor: 'bu:kpis', label: 'Executive KPIs', keywords: ['executive kpi', 'executive metrics', 'revenue ytd'] },
    ],
  },
  {
    id: 'surplus',
    kind: 'worksheet',
    keywords: ['surplus', 'exempt surplus', 'taxable surplus'],
    open: { as: 'page', pageKey: 'surplus' },
    page: {
      title: 'Surplus Worksheet',
      subtitle: 'Exempt / taxable surplus',
      icon: Layers,
      Component: lazyPage(() => import('@tax/pages/SurplusWorksheet')),
    },
    anchors: [
      { anchor: 'surplus:opening', label: 'Opening Balance', keywords: ['opening balance', 'opening surplus'] },
      { anchor: 'surplus:fs-income', label: 'Income per Financial Statements', keywords: ['income per financial', 'financial statements income', 'net income'] },
      { anchor: 'surplus:book-tax', label: 'Book-to-Tax Adjustments', keywords: ['book-to-tax', 'book to tax'] },
      { anchor: 'surplus:reg-5907', label: 'Reg. 5907(2) Adjustments', keywords: ['reg. 5907', 'reg 5907', '5907'] },
      { anchor: 'surplus:taxes', label: 'Income Taxes Paid / Refunded', keywords: ['income taxes', 'taxes paid', 'withholding'] },
      { anchor: 'surplus:dividends', label: 'Dividends Paid / Received', keywords: ['dividends paid', 'dividends received', 'dividends'] },
    ],
  },
  {
    id: 't1134',
    kind: 'worksheet',
    keywords: ['t1134', '1134', 'foreign affiliate', 'affiliate reporting'],
    open: { as: 'page', pageKey: 't1134' },
    page: {
      title: 'T1134 Workpaper',
      subtitle: 'Foreign affiliate reporting',
      icon: FileText,
      Component: lazyPage(() => import('@tax/pages/T1134Worksheet')),
    },
    anchors: [
      { anchor: 't1134:part1', label: 'Part I — Summary', keywords: ['part i', 'part 1', 't1134 summary', 'summary form'] },
      { anchor: 't1134:part2-s1', label: 'Part II · Section 1 — Foreign Affiliate Information', keywords: ['foreign affiliate information', 'section 1', 'fa information'] },
      { anchor: 't1134:part2-s2', label: 'Part II · Section 2 — Financial Information', keywords: ['financial information', 'section 2'] },
      { anchor: 't1134:part2-s3a', label: 'Part II · Section 3A — Surplus Accounts & Dividends', keywords: ['surplus accounts', 'section 3a'] },
      { anchor: 't1134:part3-fapi', label: 'Part III · Section 3 — FAPI / FAPL / FACL', keywords: ['facl', 'fapl', 'fapi section', 'part iii section 3'] },
      { anchor: 't1134:part4', label: 'Part IV — Disclosure', keywords: ['disclosure', 'part iv', 'part 4'] },
    ],
  },
  {
    id: 'client',
    kind: 'worksheet',
    keywords: ['client workspace', 'client file', 'northstar', 'client overview'],
    open: { as: 'page', pageKey: 'client' },
    page: {
      title: 'Client Workspace',
      subtitle: 'Client file overview',
      icon: Building2,
      Component: lazyPage(() => import('@tax/pages/ClientWorkspace')),
    },
  },
];

// ─── Indexes ─────────────────────────────────────────────────────────────────
const BY_ID = new Map<string, Resource>();
const BY_FIELD_ID = new Map<string, { pageKey: string; anchor: ResourceAnchor; field: ResourceField }>();
const ANCHOR_TO_PAGE = new Map<string, string>();
for (const r of RESOURCES) {
  BY_ID.set(r.id, r);
  for (const a of r.anchors ?? []) {
    ANCHOR_TO_PAGE.set(a.anchor, r.id);
    if (a.field) BY_FIELD_ID.set(a.field.id, { pageKey: r.id, anchor: a, field: a.field });
  }
}

export function getResource(id: string): Resource | null {
  return BY_ID.get(id) ?? null;
}

/** The page a "<page>:<id>" anchor belongs to, or null. */
export function anchorToPage(anchor: string): string | null {
  return ANCHOR_TO_PAGE.get(anchor) ?? null;
}

// ─── Page facet ──────────────────────────────────────────────────────────────
export type PageView = {
  key: string;
  title: string;
  subtitle: string;
  icon: ComponentType<ResourceIconProps>;
  Component: ComponentType;
};

function toPageView(r: Resource): PageView | null {
  if (!r.page) return null;
  return { key: r.id, title: r.page.title, subtitle: r.page.subtitle, icon: r.page.icon, Component: r.page.Component };
}

/** The registered renderable page for a page key, or null. */
export function getPage(key: string): PageView | null {
  const r = BY_ID.get(key);
  return r ? toPageView(r) : null;
}

export function listPages(): PageView[] {
  return RESOURCES.map(toPageView).filter((p): p is PageView => p !== null);
}

// ─── Chip rendering (was chat-entities.splitEntities) ────────────────────────
const MENTION_TO_RESOURCE = new Map<string, Resource>();
for (const r of RESOURCES) {
  if (!r.token) continue;
  for (const m of r.mentions ?? []) MENTION_TO_RESOURCE.set(m.toLowerCase(), r);
  MENTION_TO_RESOURCE.set(r.token.toLowerCase(), r);
}
// Longest mentions first so "fapi workflow" wins over "fapi".
const MENTIONS = [...MENTION_TO_RESOURCE.keys()].sort((a, b) => b.length - a.length);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MENTION_RE = new RegExp(`(${MENTIONS.map(escapeRe).join('|')})`, 'gi');

export type MentionSegment =
  | { type: 'text'; value: string }
  | { type: 'chip'; resource: Resource; matched: string };

/** Split a string into plain-text and chip segments for inline rendering. */
export function splitMentions(text: string): MentionSegment[] {
  const parts: MentionSegment[] = [];
  let last = 0;
  MENTION_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MENTION_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    const resource = MENTION_TO_RESOURCE.get(m[0].toLowerCase());
    if (resource) parts.push({ type: 'chip', resource, matched: m[0] });
    else parts.push({ type: 'text', value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

// ─── Natural-language intent (was workspace-registry.resolveWorkspaceIntent) ──
export type WorkspaceIntent =
  | { type: 'open'; pageKey: string }
  | { type: 'close'; pageKey: string | null }
  | { type: 'closeAll' }
  | { type: 'none' };

const OPEN_VERB = /\b(open|show|bring|pull up|go to|navigate|launch|display|view)\b/;
const CLOSE_VERB = /\b(close|dismiss|hide|exit|leave)\b/;
const ALL_WORD = /\b(all|everything|them)\b/;
const SURFACE_WORD = /\b(page|window|tab|workspace|it|this|that)\b/;

export function resolveIntent(raw: string): WorkspaceIntent {
  const t = raw.toLowerCase().trim();
  if (!t) return { type: 'none' };

  const match = listPages().find((p) => {
    const r = BY_ID.get(p.key)!;
    return (r.keywords ?? []).some((k) => t.includes(k)) || t.includes(p.title.toLowerCase()) || t.includes(p.key);
  });

  const wantsClose = CLOSE_VERB.test(t);
  const wantsOpen = OPEN_VERB.test(t);

  if (wantsClose && ALL_WORD.test(t)) return { type: 'closeAll' };
  if (wantsClose && (match || SURFACE_WORD.test(t))) {
    return { type: 'close', pageKey: match ? match.key : null };
  }
  if (match && (wantsOpen || !wantsClose)) return { type: 'open', pageKey: match.key };
  return { type: 'none' };
}

// ─── Anchor targeting (was workspace-targets.resolvePageTarget) ───────────────
export type PageTargetHit = { pageKey: string; anchor: string; label: string };

/** Resolve free text to a specific navigable anchor on a page, or null. */
export function resolveTarget(text: string): PageTargetHit | null {
  const t = text.toLowerCase();
  for (const r of RESOURCES) {
    for (const a of r.anchors ?? []) {
      if (a.keywords.some((k) => t.includes(k))) {
        return { pageKey: r.id, anchor: a.anchor, label: a.label };
      }
    }
  }
  return null;
}

// ─── Inline field edits (was fapi-model) ──────────────────────────────────────

/** Shared, persisted field overrides keyed by field id. Both the full page and
 *  the inline chat field editor read/write this atom (storage key unchanged so
 *  existing values survive the registry merge). */
export const fieldValuesAtom = atomWithStorage<Record<string, string>>('inscope.fapi.values', {});

export type FieldContext = { pageKey: string; anchor: string; field: ResourceField; label: string };

export function getFieldContext(fieldId: string): FieldContext | null {
  const hit = BY_FIELD_ID.get(fieldId);
  if (!hit) return null;
  return { pageKey: hit.pageKey, anchor: hit.anchor.anchor, field: hit.field, label: hit.anchor.label };
}

/** Resolve a loose field reference from the model to a real field id. The LLM
 *  often guesses ids ("FX_RATE", "fx rate", the worksheet's line key) instead of
 *  copying the exact registry id ("fx"); this maps those to the real one so an
 *  edit lands instead of failing. Tries, in order: exact id, case-insensitive id,
 *  normalized id / tag / bound input-key, exact label, label/keyword contains. */
export function resolveFieldId(query: string): string | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const qs = strip(query);
  if (BY_FIELD_ID.has(query)) return query;
  for (const [id] of BY_FIELD_ID) if (id.toLowerCase() === q) return id;
  for (const [id, ctx] of BY_FIELD_ID) {
    if (strip(id) === qs) return id;
    if (strip(ctx.field.tag) === qs) return id;
    if (ctx.field.binding && strip(ctx.field.binding.inputKey) === qs) return id;
    if (ctx.anchor.label.toLowerCase() === q) return id;
  }
  for (const [id, ctx] of BY_FIELD_ID) {
    if (ctx.anchor.label.toLowerCase().includes(q)) return id;
    if (ctx.field.editKeywords.some((k) => q.includes(k) || k.includes(q))) return id;
  }
  return null;
}

/** True when a page row id maps to an inline-editable field. */
export function isEditableField(id: string): boolean {
  return BY_FIELD_ID.has(id);
}

const EDIT_VERB = /\b(edit|change|set|update|modify|add|enter|input|put|adjust)\b/;

export type FieldEditHit = { pageKey: string; anchor: string; fieldId: string; preset?: string };

/** Detect an intent to *edit* a field (vs navigate to it). Optionally parses a
 *  preset value from phrasing like "set the FX rate to 1.4821". */
export function resolveFieldEdit(text: string): FieldEditHit | null {
  const t = text.toLowerCase();
  if (!EDIT_VERB.test(t)) return null;
  for (const [, ctx] of BY_FIELD_ID) {
    if (ctx.field.editKeywords.some((k) => t.includes(k))) {
      const m = t.match(/(-?\d[\d,]*\.?\d*)/);
      return {
        pageKey: ctx.pageKey,
        anchor: ctx.anchor.anchor,
        fieldId: ctx.field.id,
        preset: m ? m[1].replace(/,/g, '') : undefined,
      };
    }
  }
  return null;
}

// ─── Agent catalog (the LLM's tool surface, derived from the registry) ────────
// The chat sends this to the server route, which turns each list into a tool /
// enum. Keeping it derived means the model's available actions never drift from
// what actually exists — the whole reason the four registries were unified.

export type AgentCatalog = {
  pages: { key: string; title: string; subtitle: string }[];
  anchors: { anchor: string; pageKey: string; label: string }[];
  fields: { fieldId: string; pageKey: string; anchor: string; label: string }[];
  routes: { id: string; label: string; href: string }[];
};

export function buildAgentCatalog(): AgentCatalog {
  const pages: AgentCatalog['pages'] = [];
  const anchors: AgentCatalog['anchors'] = [];
  const fields: AgentCatalog['fields'] = [];
  const routes: AgentCatalog['routes'] = [];
  for (const r of RESOURCES) {
    if (r.page) pages.push({ key: r.id, title: r.page.title, subtitle: r.page.subtitle });
    if (r.open?.as === 'route') routes.push({ id: r.id, label: r.token ?? r.id, href: r.open.href });
    for (const a of r.anchors ?? []) {
      anchors.push({ anchor: a.anchor, pageKey: r.id, label: a.label });
      if (a.field) fields.push({ fieldId: a.field.id, pageKey: r.id, anchor: a.anchor, label: a.label });
    }
  }
  return { pages, anchors, fields, routes };
}
