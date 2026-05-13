import { useState } from 'react';
import Nav from './Nav';

export default function CertificatePage({ certificate: cert, onNew, onHome }) {
  const [copied, setCopied] = useState(false);
  const score = cert.confidence_score;
  const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  const scoreBg = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2';
  const scoreBorder = score >= 80 ? '#bbf7d0' : score >= 60 ? '#fde68a' : '#fecaca';

  const copy = () => {
    try { navigator.clipboard.writeText(cert.attribution); }
    catch { const el = document.createElement('textarea'); el.value = cert.attribution; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove(); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ background:'#fff', minHeight:'100vh' }}>
      <Nav onHome={onHome} />
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'40px 32px' }} className="fade-up">
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>✓</div>
          <div>
            <h1 style={{ margin:0, fontSize:'18px', fontWeight:500, color:'#111' }}>Certificate issued</h1>
            <p style={{ margin:0, fontSize:'13px', color:'#aaa' }}>Evidence verified and certificate generated</p>
          </div>
        </div>

        {/* Main cert card */}
        <div style={{ border:'1px solid #e5e5e5', borderRadius:'8px', overflow:'hidden', marginBottom:'14px' }}>
          <div style={{ background:scoreBg, borderBottom:`1px solid ${scoreBorder}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ width:'8px', height:'8px', background:scoreColor, borderRadius:'50%', display:'inline-block' }} />
            <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'12px', color:scoreColor, fontWeight:500 }}>{cert.reliability_label.toUpperCase()}</span>
            <span style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono', monospace", fontSize:'11px', color:scoreColor, opacity:0.7 }}>{cert.cert_id}</span>
          </div>
          <div style={{ padding:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
              {[['Issued', cert.timestamp], ['Files analysed', cert.file_count.toString()]].map(([l,v]) => (
                <div key={l}>
                  <p style={{ margin:'0 0 4px', fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'IBM Plex Mono', monospace" }}>{l}</p>
                  <p style={{ margin:0, fontFamily:"'IBM Plex Mono', monospace", fontSize:'13px', color:'#111', fontWeight:500 }}>{v}</p>
                </div>
              ))}
            </div>
            {/* Confidence */}
            <div style={{ marginBottom:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <p style={{ margin:0, fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'IBM Plex Mono', monospace" }}>Confidence score</p>
                <span style={{ background:scoreBg, color:scoreColor, fontFamily:"'IBM Plex Mono', monospace", fontWeight:500, fontSize:'12px', padding:'2px 10px', borderRadius:'4px', border:`1px solid ${scoreBorder}` }}>{score}%</span>
              </div>
              <div style={{ height:'4px', background:'#f3f3f3', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${score}%`, background:scoreColor, borderRadius:'2px' }} />
              </div>
            </div>
            {/* Hashes */}
            <div>
              <p style={{ margin:'0 0 8px', fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'IBM Plex Mono', monospace" }}>SHA-256 hashes</p>
              {cert.files.map((f, i) => (
                <div key={f.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom: i < cert.files.length-1 ? '1px solid #f3f3f3' : 'none' }}>
                  <span style={{ fontSize:'12px', color:'#555', maxWidth:'220px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>📄 {f.name}</span>
                  <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'10px', color:'#bbb' }}>{f.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div style={{ border:'1px solid #e5e5e5', borderRadius:'8px', padding:'16px', marginBottom:'14px' }}>
          <p style={{ margin:'0 0 8px', fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'IBM Plex Mono', monospace" }}>Analysis summary</p>
          <p style={{ margin:0, fontSize:'13px', color:'#555', lineHeight:1.65 }}>{cert.analysis_summary}</p>
        </div>

        {/* Attribution */}
        <div style={{ border:'1px solid #e5e5e5', borderRadius:'8px', padding:'16px', marginBottom:'24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <p style={{ margin:0, fontSize:'10px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'IBM Plex Mono', monospace" }}>Publication-ready attribution</p>
            <button onClick={copy} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color: copied ? '#16a34a' : '#888', background:'none', border:'1px solid #e5e5e5', cursor:'pointer', padding:'4px 10px', borderRadius:'4px' }}>
              {copied ? '✓ Copied!' : '⎘ Copy'}
            </button>
          </div>
          <p style={{ margin:0, fontFamily:"'Instrument Serif', serif", fontSize:'15px', lineHeight:1.75, color:'#444', fontStyle:'italic', background:'#fafafa', padding:'14px 16px', borderRadius:'6px', border:'1px solid #eee' }}>
            {cert.attribution}
          </p>
        </div>

        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={onNew} style={{ flex:1, padding:'12px', background:'#111', color:'#fff', border:'none', borderRadius:'6px', fontSize:'14px', fontWeight:500, cursor:'pointer' }}>
            + Verify more evidence
          </button>
          <button onClick={onHome} style={{ padding:'12px 20px', background:'none', border:'1px solid #e5e5e5', borderRadius:'6px', fontSize:'14px', cursor:'pointer', color:'#888' }}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}