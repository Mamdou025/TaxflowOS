// Slide 10 — Why Now

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

export default function Slide10WhyNow() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 10</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>WHY NOW</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>TMG-10X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 1vh 0', letterSpacing: '0.04em' }}>WHY NOW</h2>
          <p style={{ fontSize: '2vw', opacity: 0.65, margin: '0 0 4vh 0', fontWeight: 300 }}>
            Three forces converging in our favour:
          </p>

          {/* 3 force rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', marginBottom: '4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3vw', border: '1px solid rgba(255,255,255,0.15)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '3.5vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.3, lineHeight: 1, minWidth: '5vw' }}>01</div>
              <div>
                <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.6vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Regulatory Complexity</div>
                <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4 }}>Increasing year over year — more procedures, more risk</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3vw', border: '1px solid rgba(255,255,255,0.25)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '3.5vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.4, lineHeight: 1, minWidth: '5vw' }}>02</div>
              <div>
                <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.65, marginBottom: '0.6vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Knowledge Transfer</div>
                <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4 }}>Senior fiscalists are retiring, taking institutional knowledge with them</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3vw', border: '1px solid rgba(255,255,255,0.15)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '3.5vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.3, lineHeight: 1, minWidth: '5vw' }}>03</div>
              <div>
                <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.6vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Reliability</div>
                <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4 }}>AI-assisted tools have crossed the threshold of professional reliability</div>
              </div>
            </div>
          </div>

          {/* Closer */}
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '2vh' }}>
            <div style={{ fontSize: '2vw', fontWeight: 500, opacity: 0.85, fontStyle: 'italic', lineHeight: 1.45 }}>
              Firms that digitize their fiscal procedures today will out-execute those that don't.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>CURRENT</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>A.1</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>10</div>
          </div>
        </div>

      </div>
    </div>
  );
}
