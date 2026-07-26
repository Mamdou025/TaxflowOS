// Slide 3 — The Opportunity

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

export default function Slide03Opportunity() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 03</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>THE OPPORTUNITY</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>OPP-03X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 2vh 0', letterSpacing: '0.04em' }}>THE OPPORTUNITY</h2>
          <p style={{ fontSize: '2vw', opacity: 0.7, margin: '0 0 4vh 0', maxWidth: '75vw', lineHeight: 1.5, fontWeight: 300 }}>
            Fiscal work is high-stakes, high-volume, and underserved by software.
          </p>

          {/* 3 insight rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', marginBottom: '4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw', borderLeft: '2px solid rgba(255,255,255,0.35)', paddingLeft: '2vw' }}>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4, maxWidth: '70vw' }}>Tax departments are growing faster than headcount</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw', borderLeft: '2px solid rgba(255,255,255,0.35)', paddingLeft: '2vw' }}>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4, maxWidth: '70vw' }}>Firms compete on speed and accuracy of delivery</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw', borderLeft: '2px solid rgba(255,255,255,0.35)', paddingLeft: '2vw' }}>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4, maxWidth: '70vw' }}>No purpose-built workspace exists for the fiscalist's day-to-day</div>
            </div>
          </div>

          {/* Positioning statement */}
          <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 2.5vw', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '2vw' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, whiteSpace: 'nowrap' }}>&gt;_</div>
            <div style={{ fontSize: '2.1vw', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.01em' }}>
              InScope is the first platform designed end-to-end for this professional.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>OPEN</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>A.1</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>03</div>
          </div>
        </div>

      </div>
    </div>
  );
}
