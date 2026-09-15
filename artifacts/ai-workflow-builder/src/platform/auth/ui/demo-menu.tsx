import { useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { apiJSON } from '../api-fetch';
import { forgetSession } from '../workspace-context';

export function DemoMenu({ collapsed = false }: { collapsed?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function exit() {
    setBusy(true);
    setError('');
    try {
      await apiJSON('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      forgetSession('/');
    } catch {
      setError('Could not exit the demo. Please try again.');
      setBusy(false);
    }
  }
  if (collapsed) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => void exit()}
        title={error || 'Exit demo'}
        aria-label="Exit demo"
        className="neu-row"
        style={{
          width: 40,
          height: 36,
          margin: '4px auto 0',
          display: 'grid',
          placeItems: 'center',
          border: 'none',
          borderRadius: 12,
          background: 'transparent',
          color: error ? '#b91c1c' : NEU.muted,
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <LogOut size={14} />
      </button>
    );
  }
  return (
    <section
      aria-label="Demo session"
      style={{
        marginTop: 4,
        padding: '6px 9px',
        color: NEU.muted,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span
          style={{
            width: 20,
            height: 20,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            color: NEU.muted,
          }}
        >
          <UserRound size={13} />
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 500 }}>Demo session</span>
          <span style={{ display: 'block', fontSize: 10.5, color: NEU.muted }}>
            Private to this browser
          </span>
        </span>
      </div>
      {error && (
        <p role="alert" style={{ margin: '0 0 8px', fontSize: 10.5, color: '#b91c1c' }}>
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => void exit()}
        className="neu-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 4,
          marginLeft: 23,
          gap: 6,
          padding: '5px 6px',
          border: 'none',
          borderRadius: 9,
          background: 'transparent',
          color: NEU.muted,
          fontSize: 10.5,
          fontWeight: 500,
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <LogOut size={12} />
        {busy ? 'Exiting…' : 'Exit demo'}
      </button>
    </section>
  );
}
