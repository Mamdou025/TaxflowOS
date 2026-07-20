// ─────────────────────────────────────────────────────────────────────────────
// GenUI library — the vocabulary the LLM is allowed to compose UI from.
//
// This is the heart of "generate any UI from a prompt". The model does NOT write
// React; it emits OpenUI Lang that references ONLY the components registered here.
// We start from OpenUI's 54 built-ins (charts, tables, cards, forms, tabs, …) so
// free-form UI works with ZERO custom code, then register our own tax-domain
// components with defineComponent so the AI can also summon *our* look.
//
// Both sides import this one module so the system prompt (server) and the
// Renderer (client) always agree on the vocabulary:
//   • app/api/genui/route.ts  → genuiLibrary.prompt()  (system prompt for the LLM)
//   • app/genui-lab/page.tsx  → <Renderer library={genuiLibrary} …>
// ─────────────────────────────────────────────────────────────────────────────

import { createLibrary, defineComponent } from '@openuidev/react-lang';
import { openuiLibrary } from '@openuidev/react-ui';
import { z } from 'zod/v4';

// ── Custom component #1: a tax-domain KPI tile ───────────────────────────────
// Demonstrates the "register your own component" path. The AI can now emit a
// TaxMetric node and it renders with OUR styling, alongside the built-ins.
const TaxMetric = defineComponent({
  name: 'TaxMetric',
  description:
    'A tax/finance KPI tile. Use for a single headline number with a label (e.g. "FAPI", "Surplus balance", "Total dividends"). Optional delta shows a change, tone colours it.',
  props: z.object({
    label: z.string().describe('what the number is, e.g. "Foreign Accrual Property Income"'),
    value: z.string().describe('the formatted value, e.g. "$1,240,500"'),
    delta: z.string().optional().describe('optional change, e.g. "+12% vs 2024"'),
    tone: z.enum(['neutral', 'positive', 'negative']).optional(),
  }),
  component: ({ props }: { props: { label: string; value: string; delta?: string; tone?: 'neutral' | 'positive' | 'negative' } }) => {
    const toneColor = props.tone === 'positive' ? '#16a34a' : props.tone === 'negative' ? '#dc2626' : '#71717a';
    return (
      <div style={{ border: '1px solid #e4e4e7', borderRadius: 12, padding: '14px 16px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', background: '#fff' }}>
        <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>{props.label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#18181b', marginTop: 2, letterSpacing: '-0.02em' }}>{props.value}</div>
        {props.delta ? <div style={{ fontSize: 12, color: toneColor, marginTop: 4 }}>{props.delta}</div> : null}
      </div>
    );
  },
});

// ── The assembled library: built-ins + our components ────────────────────────
export const genuiLibrary = createLibrary({
  root: openuiLibrary.root, // "Stack" — a vertical container the model wraps output in
  components: [...Object.values(openuiLibrary.components), TaxMetric],
});
