// Slide 4 — Introducing InScope

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

export default function Slide04Introducing() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 04</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>INTRODUCING INSCOPE</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>PRD-04X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 0.5vh 0', letterSpacing: '0.04em' }}>INTRODUCING INSCOPE</h2>
          <p style={{ fontSize: '2.1vw', opacity: 0.55, margin: '0 0 3vh 0', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            One workspace. Every fiscal task.
          </p>

          {/* 4 feature rows — 2 left, 2 right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vh 3vw' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2vh 2vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.8vh' }}>SINA — AI ASSISTANT</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Understands tax context and guides users through procedures</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2vh 2vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.8vh' }}>WORKFLOW ENGINE</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Turns complex regulations into repeatable, auditable steps</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2vh 2vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.8vh' }}>DOCUMENT HUB</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Upload, search, and reference client files in one place</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2vh 2vw', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.8vh' }}>DESIGNED FOR FISCALISTS</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>By client, by engagement, by deadline — the way they actually work</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>IN DEVELOPMENT</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>B.2</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>04</div>
          </div>
        </div>

      </div>
    </div>
  );
}
