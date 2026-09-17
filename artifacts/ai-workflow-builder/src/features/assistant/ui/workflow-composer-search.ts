import { Globe, FileText, Workflow, GitBranch } from 'lucide-react';
import { buildAgentCatalog } from '@/shared/stores/resource-registry';
import { WORKFLOWS } from '@/lib/agents';
import { PORTFOLIO_WORKFLOWS } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { WORKFLOW_CONFIGS } from '@/shared/workflow-engine/runtime/workflow-runs';
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

export function searchWorkspace(q: string): SearchHit[] {
  const t = q.toLowerCase().trim();
  if (!t) return [];
  const cat = buildAgentCatalog();
  const hits: SearchHit[] = [];
  for (const w of WORKFLOWS)
    if (`${w.name} ${w.sub}`.toLowerCase().includes(t))
      hits.push({ kind: 'workflow', id: w.id, label: w.name, sub: w.sub, ready: w.ready });
  // Sinaxe portfolio blueprints — openable in the builder (not runnable).
  for (const w of PORTFOLIO_WORKFLOWS)
    if (`${w.name} ${w.sub} ${w.group}`.toLowerCase().includes(t))
      hits.push({ kind: 'blueprint', id: w.id, label: w.name, sub: w.sub });
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
  for (const p of cat.pages)
    if (`${p.title} ${p.subtitle} ${p.key}`.toLowerCase().includes(t))
      hits.push({ kind: 'page', id: p.key, label: p.title, sub: p.subtitle });
  for (const f of cat.fields)
    if (`${f.label} ${f.fieldId}`.toLowerCase().includes(t))
      hits.push({ kind: 'field', id: f.fieldId, label: f.label, sub: 'Editable field' });
  return hits.slice(0, 9);
}

export const HIT_ICON = {
  page: Globe,
  field: FileText,
  workflow: Workflow,
  blueprint: Workflow,
  element: GitBranch,
} as const;
