export default function Nav({ onHome }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 32px', borderBottom:'1px solid #e5e5e5', background:'#fff', position:'sticky', top:0, zIndex:10 }}>
      <button onClick={onHome} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <span style={{ fontWeight:500, fontSize:'16px', color:'#111', letterSpacing:'-0.01em' }}>Objection</span>
      </button>
      <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'11px', color:'#aaa', letterSpacing:'0.05em' }}>EVIDENCE VERIFICATION</span>
    </nav>
  );
}