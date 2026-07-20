'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getFieldContext, fieldValuesAtom } from '@/lib/resource-registry';
import { runEditsAtom, setRunInputAtom } from '@/lib/workspace-store';
import { getWorkflowConfig } from '@/lib/workflow-runs';

const INK = '#18181b', FAINT = '#a1a1aa', LINE = 'rgba(24,24,27,0.12)', MUTED = '#71717a';

// A slice of a worksheet brought into the chat: one editable field.
//
// If the field declares a `binding`, it reads/writes the SAME engine input the
// worksheet + chat run + engine use (runEditsAtom[wf].inputs[key]) — so an edit
// here actually changes the computation and stays in lock-step with the sheet.
// Unbound fields fall back to the standalone fieldValuesAtom (legacy behavior).
export function InlineFieldCard({ fieldId, preset }: { fieldId: string; preset?: string }) {
  const ctx = getFieldContext(fieldId);
  const binding = ctx?.field.binding;

  const [fieldValues, setFieldValues] = useAtom(fieldValuesAtom);
  const runEdits = useAtomValue(runEditsAtom);
  const setRunInput = useSetAtom(setRunInputAtom);
  const applied = useRef(false);
  const editing = useRef(false);

  // The authoritative current value. Bound → the engine input (stored override,
  // else the workflow's input default, else the field default). Unbound → the
  // field store, else the field default.
  const engineDefault = binding
    ? getWorkflowConfig(binding.workflowId)?.editableInputs?.find((i) => i.key === binding.inputKey)?.default
    : undefined;
  const resolved = binding
    ? String(runEdits[binding.workflowId]?.inputs?.[binding.inputKey] ?? engineDefault ?? ctx?.field.default ?? '')
    : (fieldValues[fieldId] ?? ctx?.field.default ?? '');

  // Local text buffer so mid-typing states ("1." , "") don't get clobbered by the
  // parsed-number round-trip; re-syncs from the store when not actively editing.
  const [text, setText] = useState(resolved);
  useEffect(() => { if (!editing.current) setText(resolved); }, [resolved]);

  const commit = (raw: string) => {
    setText(raw);
    if (binding) {
      const n = Number(raw.replace(/,/g, ''));
      if (raw.trim() !== '' && Number.isFinite(n)) setRunInput({ id: binding.workflowId, key: binding.inputKey, value: n });
    } else {
      setFieldValues((v) => ({ ...v, [fieldId]: raw }));
    }
  };

  // Apply a preset value once (e.g. "set the FX rate to 1.4821").
  useEffect(() => {
    if (!applied.current && preset && preset !== '' && ctx) {
      applied.current = true;
      commit(preset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, ctx]);

  if (!ctx) return <div style={{ fontSize: 12.5, color: MUTED }}>No editable field “{fieldId}”.</div>;

  return (
    <div style={{ maxWidth: 420, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, overflow: 'hidden', margin: '2px 0' }}>
      <div style={{ padding: '7px 12px', borderBottom: `1px solid ${LINE}`, fontSize: 10.5, fontWeight: 650, letterSpacing: '0.03em', textTransform: 'uppercase', color: FAINT }}>Editable field · syncs to worksheet</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, color: INK, border: `1px solid ${LINE}` }}>{ctx.field.tag}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 550, color: INK }}>{ctx.label}</div>
          {ctx.field.hint && <div style={{ fontSize: 11, color: FAINT }}>{ctx.field.hint}</div>}
        </div>
        <input
          value={text}
          onChange={(e) => commit(e.target.value)}
          onFocus={(e) => { editing.current = true; e.currentTarget.select(); }}
          onBlur={() => { editing.current = false; }}
          inputMode="decimal"
          style={{ width: 100, textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: INK, border: `1px solid ${LINE}`, borderRadius: 7, padding: '6px 9px', outline: 'none' }}
        />
        <span style={{ fontSize: 10, color: FAINT, width: 34 }}>{ctx.field.ccy}</span>
      </div>
    </div>
  );
}
