// Slide 6 — Ready-to-Run Fiscal Procedures

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

export default function Slide06Procedures() {
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
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Section 06</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 600, fontFamily: 'monospace', marginTop: '0.3vh' }}>FISCAL PROCEDURES</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.45 }}>Ref No.</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.3vh' }}>WFL-06X</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '1.5vh', marginBottom: '1.5vh' }}>
          <h2 style={{ fontSize: '2.6vw', fontWeight: 300, margin: '0 0 0.8vh 0', letterSpacing: '0.04em' }}>READY-TO-RUN FISCAL PROCEDURES</h2>
          <p style={{ fontSize: '1.9vw', opacity: 0.65, margin: '0 0 3vh 0', fontWeight: 300 }}>
            Battle-tested workflows for the most demanding engagements:
          </p>

          {/* 2x2 workflow cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vh 2.5vw', marginBottom: '2.5vh' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '1vh', letterSpacing: '0.08em' }}>WFL-001 / FAPI</div>
              <div style={{ fontSize: '2vw', fontWeight: 500, marginBottom: '0.8vh' }}>Foreign Accrual Property Income</div>
              <div style={{ fontSize: '1.8vw', opacity: 0.6, fontWeight: 300 }}>Calculations for foreign-affiliate income classification</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '1vh', letterSpacing: '0.08em' }}>WFL-002 / S85</div>
              <div style={{ fontSize: '2vw', fontWeight: 500, marginBottom: '0.8vh' }}>Section 85 Rollover</div>
              <div style={{ fontSize: '1.8vw', opacity: 0.6, fontWeight: 300 }}>Election preparation and T2057 generation</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '1vh', letterSpacing: '0.08em' }}>WFL-003 / EXP</div>
              <div style={{ fontSize: '2vw', fontWeight: 500, marginBottom: '0.8vh' }}>Expense Reimbursement</div>
              <div style={{ fontSize: '1.8vw', opacity: 0.6, fontWeight: 300 }}>Receipts to policy caps to net payable</div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '2.5vh 2.5vw', background: 'rgba(255,255,255,0.02)', opacity: 0.7 }}>
              <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', opacity: 0.5, marginBottom: '1vh', letterSpacing: '0.08em' }}>WFL-004 / T1134</div>
              <div style={{ fontSize: '2vw', fontWeight: 500, marginBottom: '0.8vh' }}>Surplus and T1134</div>
              <div style={{ fontSize: '1.8vw', opacity: 0.6, fontWeight: 300, fontStyle: 'italic' }}>Foreign-affiliate reporting — coming soon</div>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
            <div style={{ fontSize: '1.8vw', opacity: 0.6, fontWeight: 300 }}>
              Each workflow is configurable — firms can adapt steps to their own methodology.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid rgba(255,255,255,0.2)', paddingTop: '1.5vh' }}>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>LIVE</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>C.1</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5vw', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: '1.6vw', fontFamily: 'monospace', marginTop: '0.2vh' }}>06</div>
          </div>
        </div>

      </div>
    </div>
  );
}
