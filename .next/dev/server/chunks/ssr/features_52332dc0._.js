module.exports = [
"[project]/features/worksheets/intel/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Worksheet-intelligence contract — the normalized shapes every worksheet speaks.
//
// The chat answers questions about ANY worksheet through this one interface,
// without pasting the sheet. A worksheet becomes "intelligent" by providing a
// `WorksheetIntel` (template-driven sheets get one for free via
// createTemplateIntel; bespoke sheets can implement it over their own data).
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([]);
;
}),
"[project]/features/worksheets/intel/registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listIntel",
    ()=>listIntel,
    "pickIntel",
    ()=>pickIntel,
    "registerWorksheetIntelAtom",
    ()=>registerWorksheetIntelAtom,
    "unregisterWorksheetIntelAtom",
    ()=>unregisterWorksheetIntelAtom,
    "worksheetIntelRegistryAtom",
    ()=>worksheetIntelRegistryAtom
]);
// ─────────────────────────────────────────────────────────────────────────────
// Worksheet-intel registry — the bridge between mounted worksheets and the chat.
//
// Each open worksheet registers its live `WorksheetIntel` here (keyed by id); the
// assistant's global explain/why/search actions read this registry at call time
// and dispatch to the right worksheet. This keeps action NAMES unique (registered
// once, globally) while supporting any number of worksheets open at once — the
// readable each worksheet publishes tells the model which ids exist.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-ssr] (ecmascript)");
'use client';
;
const worksheetIntelRegistryAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])({});
const registerWorksheetIntelAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, intel)=>{
    set(worksheetIntelRegistryAtom, (prev)=>({
            ...prev,
            [intel.id]: intel
        }));
});
const unregisterWorksheetIntelAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, id)=>{
    const prev = get(worksheetIntelRegistryAtom);
    if (!(id in prev)) return;
    const next = {
        ...prev
    };
    delete next[id];
    set(worksheetIntelRegistryAtom, next);
});
function pickIntel(reg, id) {
    const ids = Object.keys(reg);
    if (id) {
        const q = id.toLowerCase();
        if (reg[id]) return reg[id];
        const byId = ids.find((k)=>k.toLowerCase() === q);
        if (byId) return reg[byId];
        const byTitle = ids.find((k)=>reg[k].title.toLowerCase().includes(q));
        if (byTitle) return reg[byTitle];
        return null;
    }
    if (ids.length === 1) return reg[ids[0]];
    return null;
}
function listIntel(reg) {
    return Object.values(reg).map((i)=>({
            id: i.id,
            title: i.title
        }));
}
}),
"[project]/features/worksheets/intel/template-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTemplateIntel",
    ()=>createTemplateIntel
]);
// ─────────────────────────────────────────────────────────────────────────────
// createTemplateIntel — a GENERIC WorksheetIntel over any TemplateConfig.
//
// Every template-driven worksheet (FAPI, Roulement, and any future one) becomes
// fully answerable with ZERO per-worksheet code: this adapter runs the SAME
// runTemplateCore the sheet renders, then derives its line catalog, formulas,
// operand values, provenance, and trace from the resulting CoreResult + the
// config's calc rules.
//
// It handles BOTH rule shapes the engine produces:
//   • rules with `formulaExpression` (FAPI)  → parse identifiers from the expression
//   • rules with `operands`+`operation`     (Roulement) → use the operands list
//   • computeExtra `DerivedRow.formula` strings are the display formula for both
// so numbers + explanations match the worksheet regardless of how it computes.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/engine.ts [app-ssr] (ecmascript)");
'use client';
;
const fmt = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
const fmtRate = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
    });
const isRateKey = (key, label)=>/_RATE$|^FX/i.test(key) || /\brate\b|taux/i.test(label);
const RESERVED = new Set([
    'max',
    'min',
    'abs'
]);
function identifiers(expr) {
    const found = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];
    const out = [];
    const seen = new Set();
    for (const id of found){
        if (RESERVED.has(id) || seen.has(id)) continue;
        seen.add(id);
        out.push(id);
    }
    return out;
}
function createTemplateIntel(config, state = {}) {
    const rows = state.rows?.length ? state.rows : config.sampleRows;
    // Editable-input defaults merged with live values — resolves operands that are
    // user inputs (fxRate, pCoefficient, jvm_total, taux_inclusion, …).
    const inputs = {};
    for (const inp of config.editableInputs ?? [])inputs[inp.key] = inp.default;
    Object.assign(inputs, state.inputs ?? {});
    // Honor the shared category overrides (from runEditsAtom) so the assistant's
    // answers ABOUT the worksheet match what the sheet renders after a re-categorization.
    let core;
    try {
        core = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runTemplateCore"])(config, {
            rows,
            overrides: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildOverrideRules"])(config, rows, state.overrides ?? {}),
            inputs
        });
    } catch  {
        core = null;
    }
    const rules = [
        ...config.linesRules ?? [],
        ...config.summaryRules ?? []
    ];
    const ruleByKey = (key)=>rules.find((r)=>r.resultKey === key);
    // Every derived row (works for both the rules path and computeExtra) — the
    // unified {key,label,value,formula-string} source for values + display formula.
    const derivedByKey = new Map();
    if (core) {
        for (const d of [
            ...core.detail.lines,
            ...core.detail.summary
        ])derivedByKey.set(d.key, d);
    }
    const bucketMap = {};
    if (core) for (const b of core.detail.buckets)bucketMap[b.key] = b.value;
    const params = config.params ?? {};
    // Resolve any operand identifier to its current value. Precedence mirrors the
    // engine: computed results win over buckets, which win over inputs/params.
    function resolve(name) {
        if (!core) return null;
        if (name in core.summaryValues) return {
            value: core.summaryValues[name],
            source: 'summary'
        };
        if (name in core.lineValues) return {
            value: core.lineValues[name],
            source: 'line'
        };
        if (name in bucketMap) return {
            value: bucketMap[name],
            source: 'classified'
        };
        if (name in inputs) return {
            value: inputs[name],
            source: 'input'
        };
        if (name in params) return {
            value: params[name],
            source: 'param'
        };
        return null;
    }
    // Which identifiers to break a rule down by: the expression's identifiers, else
    // the operands list (string operands only), else the display-formula's tokens.
    function tokensOf(rule, displayFormula) {
        if (rule?.formulaExpression) return identifiers(rule.formulaExpression);
        if (rule?.operands?.length) return rule.operands.filter((o)=>typeof o === 'string');
        return displayFormula ? identifiers(displayFormula) : [];
    }
    // ── Line catalog, derived from the run (no hand-authored per-sheet mapping) ──
    const catalog = [];
    const pushEntry = (key, label, kind)=>{
        if (catalog.some((e)=>e.key === key)) return;
        catalog.push({
            code: key,
            key,
            label,
            kind,
            isRate: isRateKey(key, label)
        });
    };
    if (core) {
        for (const d of core.detail.lines)pushEntry(d.key, d.label, 'line');
        for (const d of core.detail.summary){
            if (d.key.endsWith('_CAD')) continue; // shown as the CAD column, not a separate line
            pushEntry(d.key, d.label, isRateKey(d.key, d.label) ? 'line' : 'summary');
        }
    }
    const valueOf = (key)=>core ? core.lineValues[key] ?? core.summaryValues[key] ?? derivedByKey.get(key)?.value ?? 0 : 0;
    function resolveLine(query) {
        const q = query.trim().toLowerCase();
        if (!q) return null;
        const norm = q.replace(/^line\s+|^ligne\s+/, '').trim();
        const strip = (s)=>s.toLowerCase().replace(/[^a-z0-9]/g, '');
        let hit = catalog.find((e)=>e.code.toLowerCase() === norm || e.key.toLowerCase() === norm);
        if (hit) return hit;
        hit = catalog.find((e)=>strip(e.code) === strip(norm) || strip(e.key) === strip(norm));
        if (hit) return hit;
        hit = catalog.find((e)=>e.label.toLowerCase().includes(norm));
        if (hit) return hit;
        hit = catalog.find((e)=>e.code.length > 1 && norm.includes(e.code.toLowerCase()));
        if (hit) return hit;
        const toks = norm.split(/\s+/).filter((t)=>t.length > 2);
        let best = null;
        for (const e of catalog){
            const lab = e.label.toLowerCase();
            const score = toks.reduce((s, t)=>s + (lab.includes(t) ? 1 : 0), 0);
            if (score > 0 && (!best || score > best.score)) best = {
                e,
                score
            };
        }
        return best?.e ?? null;
    }
    const fmtVal = (v, isRate)=>isRate ? fmtRate(v) : fmt(v);
    // ── Interface implementation ───────────────────────────────────────────────
    function describe() {
        if (!core) return {
            id: config.id,
            title: config.name,
            status: 'error',
            message: `${config.name} could not be computed right now.`
        };
        const fx = core.summaryValues.FX_RATE;
        const lines = catalog.filter((e)=>e.kind === 'line').map((e)=>({
                code: e.code,
                label: e.label,
                value: fmtVal(valueOf(e.key), e.isRate),
                raw: valueOf(e.key),
                isRate: e.isRate || undefined
            }));
        const summary = catalog.filter((e)=>e.kind === 'summary').map((e)=>{
            const v = valueOf(e.key);
            const cadRaw = core.summaryValues[`${e.key}_CAD`];
            return {
                key: e.key,
                label: e.label,
                usd: fmt(v),
                cad: cadRaw != null ? fmt(cadRaw) : undefined
            };
        });
        return {
            id: config.id,
            title: config.name,
            status: core.status === 'error' ? 'error' : core.status,
            currency: config.currency,
            fxRate: fx != null ? fmtRate(fx) : undefined,
            source: {
                fileRows: rows.length,
                usingSample: !state.rows?.length
            },
            lines,
            summary,
            classification: {
                classifiedRows: core.detail.mapped.length,
                unmatchedRows: core.detail.unmatched.length,
                buckets: core.detail.buckets.map((b)=>({
                        key: b.key,
                        value: fmt(b.value)
                    }))
            },
            hint: 'These are the live on-screen numbers. For the exact formula, the operand values behind a line, or the source rows mapped into it, call explainWorksheetLine or whyWorksheetValue.'
        };
    }
    function explainLine(query) {
        const entry = resolveLine(query);
        if (!entry) return {
            found: false,
            message: `No line matches "${query}" on ${config.name}.`,
            availableLines: catalog.map((e)=>`${e.code} — ${e.label}`)
        };
        if (!core) return {
            found: false,
            message: `${config.name} could not be computed right now.`
        };
        const rule = ruleByKey(entry.key);
        const derived = derivedByKey.get(entry.key);
        const raw = valueOf(entry.key);
        const expression = rule?.formulaExpression ?? rule?.description ?? derived?.formula ?? null;
        const displayFormula = rule?.description ?? derived?.formula ?? '(direct input — no derived formula)';
        const breakdown = [];
        for (const tok of tokensOf(rule, expression)){
            const r = resolve(tok);
            if (r) breakdown.push({
                name: tok,
                value: r.value,
                display: fmt(r.value),
                source: r.source
            });
        }
        const out = {
            found: true,
            id: config.id,
            code: entry.code,
            key: entry.key,
            label: entry.label,
            value: raw,
            display: fmtVal(raw, entry.isRate),
            unit: entry.isRate ? 'rate' : config.currency,
            formula: displayFormula,
            expression,
            operation: rule?.operation ?? null,
            breakdown
        };
        const cadRaw = core.summaryValues[`${entry.key}_CAD`];
        if (cadRaw != null) out.cad = fmt(cadRaw);
        const prov = config.worksheetProvenance?.({
            lineKey: entry.key,
            core
        });
        if (prov && prov.length) {
            out.contributingRows = prov;
            out.note = 'This line is produced by classifying source rows (the AI keyword mapper).';
        }
        return out;
    }
    function traceKey(key, depth, seen) {
        const rule = ruleByKey(key);
        const derived = derivedByKey.get(key);
        const value = valueOf(key) || resolve(key)?.value || 0;
        const node = {
            key,
            label: derived?.label ?? rule?.label ?? key,
            value,
            display: fmt(value),
            formula: rule?.description ?? derived?.formula ?? null,
            operation: rule?.operation ?? null
        };
        if (rule && depth > 0 && !seen.has(key)) {
            seen.add(key);
            const children = [];
            for (const tok of tokensOf(rule, node.formula)){
                if (ruleByKey(tok)) {
                    children.push(traceKey(tok, depth - 1, seen));
                } else {
                    const r = resolve(tok);
                    if (r) children.push({
                        name: tok,
                        value: r.value,
                        display: fmt(r.value),
                        source: r.source
                    });
                }
            }
            if (children.length) node.inputs = children;
        }
        return node;
    }
    function why(query) {
        const entry = resolveLine(query);
        if (!entry) return {
            found: false,
            message: `No line matches "${query}" on ${config.name}.`
        };
        if (!core) return {
            found: false,
            message: `${config.name} could not be computed right now.`
        };
        return {
            found: true,
            id: config.id,
            trace: traceKey(entry.key, 2, new Set())
        };
    }
    function search(query) {
        const q = query.trim().toLowerCase();
        if (!q) return {
            matches: []
        };
        const toks = q.split(/\s+/).filter(Boolean);
        const score = (text)=>toks.reduce((s, t)=>s + (text.toLowerCase().includes(t) ? 1 : 0), 0);
        const matches = catalog.map((e)=>{
            const rule = ruleByKey(e.key);
            const derived = derivedByKey.get(e.key);
            const formula = rule?.description ?? derived?.formula ?? null;
            const text = `${e.code} ${e.label} ${formula ?? ''} ${rule?.formulaExpression ?? ''}`;
            return {
                code: e.code,
                key: e.key,
                label: e.label,
                formula,
                score: score(text)
            };
        }).filter((m)=>m.score > 0).sort((a, b)=>b.score - a.score).slice(0, 6).map(({ score: _s, ...rest })=>rest);
        return {
            matches
        };
    }
    return {
        id: config.id,
        title: config.name,
        live: state.live ?? false,
        describe,
        explainLine,
        why,
        search
    };
}
}),
"[project]/features/worksheets/intel/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Worksheet-intelligence — one contract, a generic TemplateConfig adapter, and a
// registry the chat's global actions dispatch through. See ./types for the shape.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/intel/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/intel/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$template$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/intel/template-adapter.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/features/genui/library.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "genuiLibrary",
    ()=>genuiLibrary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$lang$40$0$2e$2$2e$8_react$40$19$2e$2$2e$1_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$openuidev$2f$react$2d$lang$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@openuidev+react-lang@0.2.8_react@19.2.1_zod@4.1.12/node_modules/@openuidev/react-lang/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$ui$40$0$2e$12$2e$1_$5f$8f0bf6d0257476769269690411691880$2f$node_modules$2f40$openuidev$2f$react$2d$ui$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@openuidev+react-ui@0.12.1__8f0bf6d0257476769269690411691880/node_modules/@openuidev/react-ui/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/index.js [app-ssr] (ecmascript)");
;
;
;
;
// ── Custom component #1: a tax-domain KPI tile ───────────────────────────────
// Demonstrates the "register your own component" path. The AI can now emit a
// TaxMetric node and it renders with OUR styling, alongside the built-ins.
const TaxMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$lang$40$0$2e$2$2e$8_react$40$19$2e$2$2e$1_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$openuidev$2f$react$2d$lang$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["defineComponent"])({
    name: 'TaxMetric',
    description: 'A tax/finance KPI tile. Use for a single headline number with a label (e.g. "FAPI", "Surplus balance", "Total dividends"). Optional delta shows a change, tone colours it.',
    props: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["z"].object({
        label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["z"].string().describe('what the number is, e.g. "Foreign Accrual Property Income"'),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["z"].string().describe('the formatted value, e.g. "$1,240,500"'),
        delta: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["z"].string().optional().describe('optional change, e.g. "+12% vs 2024"'),
        tone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["z"].enum([
            'neutral',
            'positive',
            'negative'
        ]).optional()
    }),
    component: ({ props })=>{
        const toneColor = props.tone === 'positive' ? '#16a34a' : props.tone === 'negative' ? '#dc2626' : '#71717a';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                border: '1px solid #e4e4e7',
                borderRadius: 12,
                padding: '14px 16px',
                minWidth: 0,
                maxWidth: '100%',
                boxSizing: 'border-box',
                background: '#fff'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 12,
                        color: '#71717a',
                        fontWeight: 500
                    },
                    children: props.label
                }, void 0, false, {
                    fileName: "[project]/features/genui/library.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 26,
                        fontWeight: 700,
                        color: '#18181b',
                        marginTop: 2,
                        letterSpacing: '-0.02em'
                    },
                    children: props.value
                }, void 0, false, {
                    fileName: "[project]/features/genui/library.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                props.delta ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 12,
                        color: toneColor,
                        marginTop: 4
                    },
                    children: props.delta
                }, void 0, false, {
                    fileName: "[project]/features/genui/library.tsx",
                    lineNumber: 39,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)) : null
            ]
        }, void 0, true, {
            fileName: "[project]/features/genui/library.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
});
const genuiLibrary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$lang$40$0$2e$2$2e$8_react$40$19$2e$2$2e$1_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$openuidev$2f$react$2d$lang$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createLibrary"])({
    root: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$ui$40$0$2e$12$2e$1_$5f$8f0bf6d0257476769269690411691880$2f$node_modules$2f40$openuidev$2f$react$2d$ui$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["openuiLibrary"].root,
    components: [
        ...Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$ui$40$0$2e$12$2e$1_$5f$8f0bf6d0257476769269690411691880$2f$node_modules$2f40$openuidev$2f$react$2d$ui$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["openuiLibrary"].components),
        TaxMetric
    ]
});
}),
"[project]/features/genui/genui-render.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenUIRender",
    ()=>GenUIRender
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// GenUIRender — OpenUI generation mounted INSIDE the chat.
//
// This is the "renderUI bridge" (step 2): the CopilotKit `generateUI` action's
// render mounts this, so free-form "prompt → live UI" happens in the conversation
// instead of the standalone /genui-lab. On mount it POSTs the prompt to
// /api/genui (same endpoint as the lab — gpt-4.1 + prose-retry), streams the
// OpenUI Lang, and feeds it to <Renderer library={genuiLibrary}> which mounts
// real components as tokens arrive.
//
// Imported (statically) only from use-assistant, which is a 'use client' module,
// so @openuidev/react-lang's import-time React.createContext runs in the normal
// client/SSR React build — never the RSC react-server build that lacks it (that
// constraint only bites route handlers / server components, e.g. /api/genui).
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$lang$40$0$2e$2$2e$8_react$40$19$2e$2$2e$1_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$openuidev$2f$react$2d$lang$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@openuidev+react-lang@0.2.8_react@19.2.1_zod@4.1.12/node_modules/@openuidev/react-lang/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$ui$40$0$2e$12$2e$1_$5f$8f0bf6d0257476769269690411691880$2f$node_modules$2f40$openuidev$2f$react$2d$ui$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@openuidev+react-ui@0.12.1__8f0bf6d0257476769269690411691880/node_modules/@openuidev/react-ui/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$genui$2f$library$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/genui/library.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
// Belt-and-suspenders: strip any markdown fences the model adds, so the Renderer
// only ever sees raw OpenUI Lang (mirrors the lab + the route's own guard).
function stripFences(s) {
    return s.replace(/^\s*```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
}
// Light card so the generated UI reads as one consistent "artifact surface" on
// the dark chat — same treatment the run-flow gets via `.aside-thread
// [data-run-flow]`. OpenUI itself is forced to light (ThemeProvider mode="light")
// below so its cards blend in instead of rendering dark. overflowX lets a layout
// wider than the column scroll inside the card rather than break the page.
const CARD = {
    background: '#f7f7f8',
    border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 14,
    padding: '14px 16px',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto'
};
function GenUIRender({ prompt }) {
    const [response, setResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [streaming, setStreaming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchedFor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // The prompt arrives token-by-token as the tool args stream, so debounce: wait
    // ~300ms for it to settle, then fetch ONCE for the final prompt (guarded by
    // fetchedFor so a re-render with the same prompt doesn't re-fetch).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const text = prompt?.trim();
        if (!text) return;
        const timer = setTimeout(()=>{
            if (fetchedFor.current === text) return;
            fetchedFor.current = text;
            setError(null);
            setResponse('');
            setStreaming(true);
            (async ()=>{
                try {
                    const res = await fetch('/api/genui', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            messages: [
                                {
                                    role: 'user',
                                    content: text
                                }
                            ]
                        })
                    });
                    if (!res.ok || !res.body) {
                        const detail = await res.text().catch(()=>'');
                        setError(`Request failed (${res.status})${detail ? ` — ${detail.slice(0, 200)}` : ''}`);
                        setStreaming(false);
                        return;
                    }
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let acc = '';
                    for(;;){
                        const { done, value } = await reader.read();
                        if (done) break;
                        acc += decoder.decode(value, {
                            stream: true
                        });
                        setResponse(acc);
                    }
                } catch (e) {
                    setError(String(e));
                } finally{
                    setStreaming(false);
                }
            })();
        }, 300);
        return ()=>clearTimeout(timer);
    }, [
        prompt
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                ...CARD,
                fontSize: 12.5,
                color: '#b91c1c'
            },
            children: [
                "Couldn’t generate that view — ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/features/genui/genui-render.tsx",
            lineNumber: 98,
            columnNumber: 12
        }, this);
    }
    if (!response) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                ...CARD,
                fontSize: 12.5,
                color: '#71717a'
            },
            children: "Composing the view…"
        }, void 0, false, {
            fileName: "[project]/features/genui/genui-render.tsx",
            lineNumber: 101,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-genui": true,
        style: CARD,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$ui$40$0$2e$12$2e$1_$5f$8f0bf6d0257476769269690411691880$2f$node_modules$2f40$openuidev$2f$react$2d$ui$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ThemeProvider"], {
            mode: "light",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$openuidev$2b$react$2d$lang$40$0$2e$2$2e$8_react$40$19$2e$2$2e$1_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$openuidev$2f$react$2d$lang$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Renderer"], {
                library: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$genui$2f$library$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["genuiLibrary"],
                response: stripFences(response),
                isStreaming: streaming,
                onError: (errs)=>{
                    if (errs?.length) console.error('[GenUI Renderer]', errs);
                }
            }, void 0, false, {
                fileName: "[project]/features/genui/genui-render.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/genui/genui-render.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/genui/genui-render.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_52332dc0._.js.map