'use client';

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { getFieldContext, fieldValuesAtom } from '@/lib/resource-registry';

const INK = '#18181b', FAINT = '#a1a1aa', LINE = 'rgba(24,24,27,0.12)', MUTED = '#71717a';

// A slice of a worksheet brought into the chat: one editable field bound to the
// same shared atom as the real page, so edits sync both ways.
export function InlineFieldCard({ fieldId, preset }: { fieldId: string; preset?: string }) {
  const ctx = getFieldContext(fieldId);
  const [values, setValues] = useAtom(fieldValuesAtom);
  const applied = useRef(false);

  useEffect(() => {
    if (!applied.current && preset && preset !== '' && ctx) {
      applied.current = true;
      setValues((v) => ({ ...v, [fieldId]: preset }));
    }
  }, [preset, ctx, fieldId, setValues]);

  if (!ctx) return <div style={{ fontSize: 12.5, color: MUTED }}>No editable field “{fieldId}”.</div>;
  const value = values[fieldId] ?? ctx.field.default;

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
          value={value}
          onChange={(e) => setValues((v) => ({ ...v, [fieldId]: e.target.value }))}
          onFocus={(e) => e.currentTarget.select()}
          inputMode="decimal"
          style={{ width: 100, textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: INK, border: `1px solid ${LINE}`, borderRadius: 7, padding: '6px 9px', outline: 'none' }}
        />
        <span style={{ fontSize: 10, color: FAINT, width: 34 }}>{ctx.field.ccy}</span>
      </div>
    </div>
  );
}
