'use client';

import { useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ExternalLink, Check } from 'lucide-react';
import { fieldValuesAtom, getFieldContext } from '@/lib/resource-registry';
import { pushTrailAtom } from '@/lib/workspace-store';

const PURPLE = '#6B21A8';

// A slice of a worksheet rendered inline in the chat: the single editable field,
// bound to the same shared atom as the real page. Edit here → the page reflects
// it (and vice-versa). "Open in worksheet" expands to the full page.
export function FieldEditor({ fieldId, onOpen }: { fieldId: string; onOpen: () => void }) {
  const ctx = getFieldContext(fieldId);
  const [values, setValues] = useAtom(fieldValuesAtom);
  const pushTrail = useSetAtom(pushTrailAtom);
  const value = values[fieldId] ?? ctx?.field.default ?? '';
  const lastCommitted = useRef(value);
  const savedRef = useRef<HTMLSpanElement>(null);

  const setValue = (v: string) => setValues((prev) => ({ ...prev, [fieldId]: v }));

  if (!ctx) return null;
  const { field, label } = ctx;

  const commit = () => {
    if (value === lastCommitted.current) return;
    lastCommitted.current = value;
    // Plain manual field — writes directly. A *governed* value would instead
    // route through the approval checkpoint before committing.
    pushTrail({ text: `Set ${label} = ${value}`, tone: 'calculation' });
    if (savedRef.current) {
      savedRef.current.style.opacity = '1';
      window.setTimeout(() => { if (savedRef.current) savedRef.current.style.opacity = '0'; }, 1400);
    }
  };

  return (
    <div style={{ alignSelf: 'stretch', maxWidth: 460, background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* Header — signals it's a live slice of the page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f7f5fb', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8b5cf6' }}>FAPI worksheet · editable field</span>
        <span ref={savedRef} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#16a34a', opacity: 0, transition: 'opacity 200ms' }}>
          <Check size={12} /> Saved
        </span>
      </div>

      {/* The field row — same visual language as the worksheet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, color: PURPLE, border: `1px solid ${PURPLE}40`, background: `${PURPLE}0d`, flexShrink: 0 }}>
          {field.tag}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{label}</div>
          {field.hint && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{field.hint}</div>}
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          onFocus={(e) => e.currentTarget.select()}
          inputMode="decimal"
          style={{ width: 96, textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: '#111827', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', outline: 'none' }}
        />
        <span style={{ fontSize: 10, color: '#9CA3AF', width: 34 }}>{field.ccy}</span>
      </div>

      {/* Expand to the full page */}
      <div style={{ padding: '0 14px 12px' }}>
        <button
          onClick={onOpen}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 8, padding: '5px 11px', cursor: 'pointer' }}
        >
          <ExternalLink size={12} /> Open in FAPI worksheet
        </button>
      </div>
    </div>
  );
}
