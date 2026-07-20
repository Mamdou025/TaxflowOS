// Generates the GenUI system prompt to lib/genui/system-prompt.txt.
//
// Why a build step: OpenUI's packages (@openuidev/react-lang) call
// React.createContext at import, so they CANNOT be imported inside a Next App
// Router route handler (RSC react-server build has no createContext). Plain Node
// has the full React, so we generate the prompt here and the route reads the txt.
//
// The component vocabulary here MUST stay in sync with lib/genui/library.tsx
// (same names + prop schemas). Run: `node scripts/gen-genui-prompt.cjs`
// (wired as `pnpm genui:prompt`). Re-run whenever the library changes.

const fs = require('fs');
const path = require('path');
const { createLibrary, defineComponent } = require('@openuidev/react-lang');
const { openuiLibrary } = require('@openuidev/react-ui');
const { z } = require('zod/v4');

// Mirror of the custom component in library.tsx — render is irrelevant to the
// prompt (only name/description/props matter), so we use a no-op here.
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
  component: () => null,
});

const library = createLibrary({
  root: openuiLibrary.root,
  components: [...Object.values(openuiLibrary.components), TaxMetric],
});

// ── InScope guardrails ────────────────────────────────────────────────────────
// The OpenUI library's own prompt ends with "generate realistic/plausible data"
// and exposes decorative components (images, carousels, radar/scatter) that don't
// belong in a fiscalist's workspace. We APPEND a domain policy that countermands
// those, so a generated view (a) never invents figures, (b) uses only fitting
// components, (c) stays on-topic. Appended here (not hand-edited into the .txt) so
// it survives every regeneration. The route's STEER reinforces this at request time.
const GUARDRAILS = `
## InScope domain policy (OVERRIDES any earlier rule)

This tool renders views inside InScope, a fiscalist's tax workspace. The two rules below OVERRIDE anything above them, including "generate realistic/plausible data".

### Data fidelity — never invent or compute
- Use ONLY the exact figures given in the request. Do NOT invent, estimate, round, or fabricate numbers, labels, dates, or categories.
- Do NOT do arithmetic or derive values (no totals, %s, growth). Every number is pre-computed and passed to you already formatted — display it verbatim.
- If the request does not contain a number you'd need, OMIT that element — do not fill it with a placeholder figure. If it contains no real data at all, render a single Callout("info", "No data yet", "…") explaining what's needed, and nothing else.

### Component discipline — the simplest view that fits
- Pick the SIMPLEST component for the data. Do NOT add charts, tiles, tabs, or sections that weren't asked for.
- A few labeled amounts → TaxMetric tiles or a Table, NOT a chart.
- A chart only when there's a real comparison/trend across multiple values: BarChart / HorizontalBarChart (compare categories), LineChart / AreaChart (trend over time).
- Use PieChart ONLY when the request is explicitly about parts-of-a-whole proportions of 3–6 categories. Never add a pie chart "to decorate".

### On-topic only — allowed palette
- Allowed: Stack, Card, CardHeader, TextContent, MarkDownRenderer, TaxMetric, Table, Col, BarChart, HorizontalBarChart, LineChart, AreaChart, PieChart (proportions only), Series, Callout, TextCallout, Tag, TagBlock, Separator, Form, FormControl, Input, TextArea, Select, SelectItem, Slider, RadioGroup, CheckBoxGroup, Buttons, Button, Steps, Tabs, TabItem, Accordion.
- FORBIDDEN (never emit): Image, ImageBlock, ImageGallery, Carousel, RadarChart, ScatterChart, RadialChart, Modal, and any decorative, marketing, or illustrative content. This is a tax/finance tool, not a landing page.`;

const out = path.join(__dirname, '..', 'lib', 'genui', 'system-prompt.txt');
const full = library.prompt().trimEnd() + '\n' + GUARDRAILS + '\n';
fs.writeFileSync(out, full, 'utf8');
console.log('Wrote', out, '(' + full.length + ' chars)');
