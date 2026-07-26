// Slide 9 — Business Model

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

export default function Slide09BusinessModel() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 09</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>BUSINESS MODEL</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>BIZ-09X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 1vh 0', letterSpacing: '0.04em' }}>BUSINESS MODEL</h2>
          <p style={{ fontSize: '2vw', opacity: 0.65, margin: '0 0 3.5vh 0', fontWeight: 300 }}>
            Simple, predictable SaaS pricing.
          </p>

          {/* 4 pricing tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5vw', marginBottom: '3.5vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 1.5vw', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SOLO</div>
              <div style={{ width: '2.5vw', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.4 }}>Per-seat subscription for individual practitioners</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.35)', padding: '2.5vh 1.5vw', background: 'rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>TEAM</div>
              <div style={{ width: '2.5vw', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.4 }}>Firm-wide licenses for teams and departments</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.35)', padding: '2.5vh 1.5vw', background: 'rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ENTERPRISE</div>
              <div style={{ width: '2.5vw', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.4 }}>Custom contracts for large practices</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2.5vh 1.5vw', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '1.2vh', opacity: 0.75 }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>MARKETPLACE</div>
              <div style={{ width: '2.5vw', height: '1px', background: 'rgba(255,255,255,0.25)' }} />
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.4, fontStyle: 'italic' }}>Firms publish and monetize their own procedures</div>
            </div>
          </div>

          {/* Churn note */}
          <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 2.5vw', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '2vw', alignItems: 'center' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5 }}>RETENTION</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4 }}>Low churn by design: workflows become institutional knowledge stored inside InScope.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>CONFIRMED</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>B.2</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>09</div>
          </div>
        </div>

      </div>
    </div>
  );
}
