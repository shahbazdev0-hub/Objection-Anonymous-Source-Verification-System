import Nav from './Nav';

const steps = [
  { n:'01', title:'Upload evidence', desc:'PDFs, images, text, audio. Each file is SHA-256 hashed on arrival — never stored raw.' },
  { n:'02', title:'AI cross-analysis', desc:'GPT-4o checks internal consistency, corroboration, and plausibility across all files.' },
  { n:'03', title:'Get certificate', desc:'Receive a tamper-proof certificate with confidence score and publication-ready attribution.' },
];

export default function HomePage({ onStart }) {
  return (
    <div style={{ background:'#fff', minHeight:'100vh' }}>
      <Nav onHome={() => {}} />
      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'64px 32px' }}>
        <div className="fade-up">
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'#fefce8', border:'1px solid #fde68a', color:'#92400e', padding:'4px 12px', borderRadius:'4px', fontSize:'11px', fontFamily:"'IBM Plex Mono', monospace", letterSpacing:'0.08em', marginBottom:'32px' }}>
            ◈ ANONYMOUS SOURCE VERIFICATION
          </div>
          <h1 style={{ fontSize:'clamp(2rem, 5vw, 3.2rem)', fontFamily:"'Instrument Serif', serif", fontWeight:400, lineHeight:1.1, marginBottom:'20px', color:'#111' }}>
            Verify the evidence.<br />
            <span style={{ color:'#aaa' }}>Protect the source.</span>
          </h1>
          <p style={{ fontSize:'1.05rem', color:'#666', lineHeight:1.75, marginBottom:'36px', maxWidth:'520px' }}>
            Objection lets journalists cryptographically verify evidence from anonymous sources. Upload documents, get a tamper-proof certificate, and publish with confidence — without revealing who provided it.
          </p>
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'80px' }}>
            <button onClick={onStart} style={{ background:'#111', color:'#fff', border:'none', borderRadius:'6px', padding:'12px 28px', fontSize:'14px', fontWeight:500, cursor:'pointer' }}>
              Verify evidence →
            </button>
            <span style={{ fontSize:'12px', color:'#bbb', fontFamily:"'IBM Plex Mono', monospace" }}>No account needed</span>
          </div>
        </div>

        <h2 style={{ fontSize:'11px', fontFamily:"'IBM Plex Mono', monospace", letterSpacing:'0.1em', color:'#bbb', marginBottom:'20px' }}>HOW IT WORKS</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'72px' }}>
          {steps.map(s => (
            <div key={s.n} style={{ background:'#f9f9f9', border:'1px solid #eee', borderRadius:'8px', padding:'20px' }}>
              <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'11px', color:'#b8860b', display:'block', marginBottom:'12px' }}>{s.n}</span>
              <p style={{ fontWeight:500, fontSize:'14px', color:'#111', marginBottom:'8px' }}>{s.title}</p>
              <p style={{ fontSize:'13px', color:'#888', lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:'11px', fontFamily:"'IBM Plex Mono', monospace", letterSpacing:'0.1em', color:'#bbb', marginBottom:'20px' }}>SAMPLE CERTIFICATE</h2>
        <div style={{ border:'1px solid #e5e5e5', borderRadius:'8px', overflow:'hidden', marginBottom:'64px' }}>
          <div style={{ background:'#f0fdf4', borderBottom:'1px solid #bbf7d0', padding:'12px 20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ width:'8px', height:'8px', background:'#16a34a', borderRadius:'50%', display:'inline-block' }} />
            <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'12px', color:'#15803d', fontWeight:500 }}>VERIFIED</span>
            <span style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono', monospace", fontSize:'11px', color:'#15803d', opacity:0.7 }}>OBJ-A7X9F2K</span>
          </div>
          <div style={{ padding:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {[['Issued','2025-03-19 14:32 UTC'],['Confidence','87%'],['Files','5 analysed'],['Status','Verified ✓']].map(([l,v]) => (
              <div key={l}>
                <p style={{ fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px', fontFamily:"'IBM Plex Mono', monospace" }}>{l}</p>
                <p style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'14px', color:'#111', fontWeight:500 }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'0 20px 20px' }}>
            <p style={{ fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'8px', fontFamily:"'IBM Plex Mono', monospace" }}>Attribution</p>
            <p style={{ fontFamily:"'Instrument Serif', serif", fontSize:'15px', lineHeight:1.7, color:'#555', fontStyle:'italic', background:'#f9f9f9', padding:'14px 16px', borderRadius:'6px', border:'1px solid #eee' }}>
              "The internal review process was bypassed entirely," said a source verified via Objection's independent certification process (Certificate OBJ-A7X9F2K).
            </p>
          </div>
        </div>

        <div style={{ textAlign:'center', paddingTop:'32px', borderTop:'1px solid #eee' }}>
          <button onClick={onStart} style={{ background:'#111', color:'#fff', border:'none', borderRadius:'6px', padding:'14px 40px', fontSize:'15px', fontWeight:500, cursor:'pointer' }}>
            Start verifying →
          </button>
        </div>
      </div>
    </div>
  );
}