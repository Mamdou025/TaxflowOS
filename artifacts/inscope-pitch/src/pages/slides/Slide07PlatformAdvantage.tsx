// Slide 7 — The Platform Advantage

const BG: React.CSSProperties = {
  width: '100vw', height: '100vh', overflow: 'hidden',
  background: '#1B3A5C', fontFamily: "'Inter', sans-serif",
  position: 'relative', color: '#FFFFFF',
};
const FINE_GRID: React.CSSProperties = {
  position: 'absolute', inset: 0,
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
  backgroundSize: '2vw 2vh', pointerEvents: 'none',
};
const COARSE_GRID: React.CSSProperties = {
  position: 'absolute', inset: 0,
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
  backgroundSize: '10vw 10vh', pointerEvents: 'none',
};

export default function Slide07PlatformAdvantage() {
  return (
    <div style={BG}>
      <div style={FINE_GRID} />
      <div style={COARSE_GRID} />
      <div style={{ position: 'absolute', top: '3vh', left: '3vw', right: '3vw', bottom: '3vh', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', right: '5vw', bottom: '5vh', border: '0.5px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

      <div style={{ padding: '7vh 7vw', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'relative', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 07</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>PLATFORM ADVANTAGE</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>PLT-07X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 1vh 0', letterSpacing: '0.04em' }}>THE PLATFORM ADVANTAGE</h2>
          <p style={{ fontSize: '2vw', opacity: 0.65, margin: '0 0 4vh 0', fontWeight: 300 }}>
            InScope is not a single tool. It is a flexible foundation.
          </p>

          {/* Spec-table style rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '2.2vh 0', gap: '3vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.4, minWidth: '18vw', whiteSpace: 'nowrap' }}>EXTENSIBILITY</div>
              <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.2)', height: '1px', position: 'relative', top: '0.1em' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, maxWidth: '45vw', textAlign: 'right', lineHeight: 1.35 }}>Firms build or import their own workflows</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '2.2vh 0', gap: '3vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.4, minWidth: '18vw', whiteSpace: 'nowrap' }}>AUDIT TRAIL</div>
              <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.2)', height: '1px', position: 'relative', top: '0.1em' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, maxWidth: '45vw', textAlign: 'right', lineHeight: 1.35 }}>Every engagement is versioned and auditable</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '2.2vh 0', gap: '3vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.4, minWidth: '18vw', whiteSpace: 'nowrap' }}>INTEGRATION</div>
              <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.2)', height: '1px', position: 'relative', top: '0.1em' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, maxWidth: '45vw', textAlign: 'right', lineHeight: 1.35 }}>Works alongside existing systems — no rip-and-replace</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '2.2vh 0', gap: '3vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.4, minWidth: '18vw', whiteSpace: 'nowrap' }}>SCALE</div>
              <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.2)', height: '1px', position: 'relative', top: '0.1em' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, maxWidth: '45vw', textAlign: 'right', lineHeight: 1.35 }}>Solo practitioner to 200-person tax group</div>
            </div>
          </div>

          {/* Closer */}
          <div style={{ marginTop: '3.5vh', display: 'flex', gap: '2vw', alignItems: 'center' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.4 }}>&gt;_</div>
            <div style={{ fontSize: '2vw', fontWeight: 500, opacity: 0.85, fontStyle: 'italic' }}>
              The more a firm uses InScope, the more valuable it becomes.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>VERIFIED</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>B.1</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>07</div>
          </div>
        </div>

      </div>
    </div>
  );
}
