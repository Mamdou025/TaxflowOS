// Slide 8 — Market Sizing

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

export default function Slide08MarketSizing() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 08</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>MARKET SIZING</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>MKT-08X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
          <h2 style={{ fontSize: '3vw', fontWeight: 300, margin: '0 0 1vh 0', letterSpacing: '0.04em' }}>MARKET SIZING</h2>
          <p style={{ fontSize: '2vw', opacity: 0.65, margin: '0 0 4vh 0', fontWeight: 300 }}>
            A large, under-digitized professional services segment.
          </p>

          {/* 3 market segments */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw', marginBottom: '4vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.25)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>North America</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>Tens of thousands of tax and accounting firms</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Per Engagement</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>Hundreds of billable hours — each one a potential InScope workflow</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.25)', padding: '3vh 2vw', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Expansion</div>
              <div style={{ width: '3vw', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.45 }}>Audit, transfer pricing, and cross-border compliance</div>
            </div>
          </div>

          {/* Target statement */}
          <div style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2vh 2.5vw', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '2vw', alignItems: 'center' }}>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, whiteSpace: 'nowrap' }}>TARGET</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontSize: '2vw', fontWeight: 400, lineHeight: 1.4 }}>Mid-market and enterprise fiscal departments as the beachhead.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>ANALYSIS</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>A.3</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>08</div>
          </div>
        </div>

      </div>
    </div>
  );
}
