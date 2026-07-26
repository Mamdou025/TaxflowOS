// Slide 11 — The Ask

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

export default function Slide11TheAsk() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 11</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>THE ASK</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>ASK-11X</div>
          </div>
        </div>

        {/* Centered content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh', textAlign: 'center' }}>

          {/* Terminal icon */}
          <div style={{ width: '9vw', height: '9vw', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4vh', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-1vw', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '50%' }} />
            <div style={{ width: '5vw', height: '5vw', border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '2.2vw', fontWeight: 300 }}>&gt;_</div>
            </div>
          </div>

          <h1 style={{ fontSize: '4.5vw', fontWeight: 300, margin: '0 0 1.5vh 0', letterSpacing: '0.08em' }}>SEED ROUND</h1>
          <p style={{ fontSize: '2vw', opacity: 0.65, margin: '0 0 4vh 0', fontWeight: 300 }}>We are raising to:</p>

          {/* 3 ask items */}
          <div style={{ display: 'flex', gap: '2vw', marginBottom: '5vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 2vw', background: 'rgba(255,255,255,0.04)', maxWidth: '22vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.45, marginBottom: '1vh' }}>01</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Grow the workflow library with the 20 most common fiscal procedures</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2.5vh 2vw', background: 'rgba(255,255,255,0.07)', maxWidth: '22vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.6, marginBottom: '1vh' }}>02</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Onboard the first 10 enterprise firm customers</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 2vw', background: 'rgba(255,255,255,0.04)', maxWidth: '22vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.45, marginBottom: '1vh' }}>03</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.45 }}>Expand the platform team to accelerate product velocity</div>
            </div>
          </div>

          <div style={{ width: '10vw', height: '1px', background: 'rgba(255,255,255,0.4)', marginBottom: '3vh' }} />
          <p style={{ fontSize: '2.1vw', fontWeight: 500, opacity: 0.9, margin: '0 0 3vh 0', maxWidth: '55vw', lineHeight: 1.5 }}>
            Join us in building the operating system for the modern fiscalist.
          </p>

          {/* Contact */}
          <div style={{ border: '1px solid rgba(255,255,255,0.25)', padding: '1.5vh 3vw', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '0.3vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Contact</div>
            <div style={{ fontSize: '2vw', fontFamily: 'monospace' }}>contact@inscope.io</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>FINAL</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Authorization</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>REQUIRED</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>11</div>
          </div>
        </div>

      </div>
    </div>
  );
}
