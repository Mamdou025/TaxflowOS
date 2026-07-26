// Slide 5 — How It Works

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

export default function Slide05HowItWorks() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 05</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>HOW IT WORKS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>WRK-05X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 1vh 0', letterSpacing: '0.04em' }}>HOW IT WORKS</h2>
          <p style={{ fontSize: '2vw', opacity: 0.6, margin: '0 0 4vh 0', fontWeight: 300 }}>
            Three steps from question to deliverable:
          </p>

          {/* 3 step boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw', marginBottom: '3vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.25)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '4vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.35, lineHeight: 1 }}>01</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Open</div>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>A client workspace — all context in one place</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '4vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.45, lineHeight: 1 }}>02</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Run</div>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>Sina guides each step, checks inputs, and flags issues</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.25)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '4vw', fontWeight: 300, fontFamily: 'monospace', opacity: 0.35, lineHeight: 1 }}>03</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Export</div>
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>Clean calculations, ready to sign off</div>
            </div>
          </div>

          {/* Note */}
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '2vh', display: 'flex', gap: '2vw', alignItems: 'center' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.45 }}>&gt;</div>
            <div style={{ fontSize: '1.9vw', opacity: 0.65, fontWeight: 300 }}>No training required. No switching tabs. No manual re-entry.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>PROCESS</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>A.2</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>05</div>
          </div>
        </div>

      </div>
    </div>
  );
}
