'use client';

// Standalone run surface — the SAME interactive run loop the assistant shows
// (upload → categorize → [elect] → approve), but reachable by a plain route with
// NO AI in the loop. This is what makes the app usable without the chat: the
// homepage's workflow launchers point here. WorkflowRunFlow is self-contained
// (plain callbacks, no CopilotChat), so it renders directly.

import { useParams, useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { getWorkflowConfig } from '@/lib/workflow-runs';
import { getAgent } from '@/lib/agents';
import { WorkflowRunFlow } from '@/components/workspace/workflow-run-flow';
import { builderFocusTargetAtom } from '@/lib/workflow-store';
import { pageRoute } from '@/lib/page-routes';

export default function RunPage() {
  const params = useParams();
  const router = useRouter();
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const workflowId = String(params?.workflowId ?? '');
  const config = getWorkflowConfig(workflowId);

  if (!config) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#6b7280', fontSize: 14 }}>
        Unknown workflow “{workflowId}”. <button onClick={() => router.push('/home')} style={{ marginLeft: 8, color: '#6B21A8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Back home</button>
      </div>
    );
  }

  const agent = config.agentId ? getAgent(config.agentId) ?? undefined : undefined;

  return (
    <div style={{ height: '100%', overflowY: 'auto', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4vh 24px 48px' }}>
        <button
          onClick={() => router.push('/home')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13, fontWeight: 550, padding: 0, marginBottom: 14 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1c2130')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
        >
          <ArrowLeft size={15} /> Home
        </button>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1c2130', letterSpacing: '-0.02em' }}>{config.name}</h1>
          {agent && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#6b7280' }}>Run by {agent.name} · {agent.role}</p>}
        </div>
        <div style={{ background: '#F4F5F8', borderRadius: 18, boxShadow: '8px 8px 18px rgba(158,158,178,0.38), -8px -8px 18px rgba(255,255,255,0.85)', padding: '18px 18px 14px' }}>
          <WorkflowRunFlow
            config={config}
            agent={agent}
            surface="light"
            onComplete={() => { /* run stays on screen showing the result */ }}
            onOpenPage={(pk) => router.push(pageRoute(pk))}
            onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: config.id, blockId }); router.push('/builder'); }}
            onStop={() => router.push('/home')}
          />
        </div>
      </div>
    </div>
  );
}
