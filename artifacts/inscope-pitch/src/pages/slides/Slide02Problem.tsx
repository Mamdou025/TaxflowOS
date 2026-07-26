// Slide 2 — The Problem

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

export default function Slide02Problem() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 02</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>THE PROBLEM</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>PRB-02X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 2vh 0', letterSpacing: '0.04em' }}>THE PROBLEM</h2>
          <p style={{ fontSize: '2vw', opacity: 0.7, margin: '0 0 3vh 0', maxWidth: '75vw', lineHeight: 1.5, fontWeight: 300 }}>
            Tax professionals today work across a maze of spreadsheets, email threads, and disconnected tools.
          </p>

          {/* Bullet rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', marginBottom: '3vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '1.4vh 2vw', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '2vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, minWidth: '3vw' }}>01</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.3 }}>Complex calculations done manually, step by step</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '1.4vh 2vw', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '2vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, minWidth: '3vw' }}>02</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.3 }}>Client files scattered across folders and inboxes</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '1.4vh 2vw', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '2vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, minWidth: '3vw' }}>03</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.3 }}>Hours lost to repetitive procedures that never change</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '1.4vh 2vw', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '2vw' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, minWidth: '3vw' }}>04</div>
              <div style={{ fontSize: '1.9vw', fontWeight: 400, lineHeight: 1.3 }}>One wrong cell can cascade into a costly error</div>
            </div>
          </div>

          {/* Conclusion */}
          <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '1.8vh 2vw', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '2vw', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.01em' }}>
              The result: slower delivery, higher risk, and team burnout.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>IDENTIFIED</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>A.1</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>02</div>
          </div>
        </div>

      </div>
    </div>
  );
}
