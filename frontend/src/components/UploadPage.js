import { useState, useRef } from 'react';
import Nav from './Nav';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function UploadPage({ onCertificate, onBack }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles);
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...arr.filter(f => !existing.has(f.name))];
    });
    setError('');
  };

  const getIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.startsWith('audio/')) return '🎵';
    return '📝';
  };

  const handleSubmit = async () => {
    if (files.length === 0) { setError('Please upload at least one file.'); return; }
    setLoading(true); setError('');
    const msgs = ['Hashing files...', 'Extracting content...', 'Running AI analysis...', 'Generating certificate...'];
    let i = 0; setLoadMsg(msgs[0]);
    const iv = setInterval(() => { i++; if (i < msgs.length) setLoadMsg(msgs[i]); }, 800);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await fetch(`${API_BASE}/api/verify`, { method: 'POST', body: fd });
      clearInterval(iv);
      if (!res.ok) throw new Error(await res.text());
      const cert = await res.json();
      onCertificate(cert);
    } catch (e) {
      clearInterval(iv);
      setError('API error: ' + e.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background:'#fff', minHeight:'100vh' }}>
      <Nav onHome={onBack} />
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'40px 32px' }} className="fade-up">
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'13px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'6px', padding:0 }}>
          ← Back
        </button>
        <h1 style={{ fontSize:'1.6rem', fontFamily:"'Instrument Serif', serif", fontWeight:400, marginBottom:'8px', color:'#111' }}>Upload evidence</h1>
        <p style={{ color:'#888', fontSize:'14px', marginBottom:'28px', lineHeight:1.6 }}>
          Files are SHA-256 hashed on arrival and never stored in raw form. Only the hash and timestamp are kept.
        </p>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current.click()}
          style={{ border:`2px dashed ${dragging ? '#b8860b' : '#e5e5e5'}`, borderRadius:'8px', padding:'36px 24px', textAlign:'center', cursor:'pointer', background: dragging ? '#fefce8' : '#fafafa', marginBottom:'16px', transition:'all 0.15s' }}
        >
          <div style={{ fontSize:'32px', marginBottom:'10px' }}>⬆</div>
          <p style={{ fontWeight:500, fontSize:'14px', color:'#111', marginBottom:'4px' }}>Drop files here or click to browse</p>
          <p style={{ fontSize:'12px', color:'#aaa', fontFamily:"'IBM Plex Mono', monospace" }}>PDF · Images · Text · Audio</p>
          <input ref={inputRef} type="file" multiple onChange={e => addFiles(e.target.files)} style={{ display:'none' }} accept=".pdf,.jpg,.jpeg,.png,.txt,.mp3,.mp4,.webp,.wav" />
        </div>

        {files.length > 0 && (
          <div style={{ marginBottom:'16px' }}>
            {files.map(file => (
              <div key={file.name} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', marginBottom:'6px', background:'#f9f9f9', borderRadius:'6px', border:'1px solid #eee' }}>
                <span style={{ fontSize:'16px' }}>{getIcon(file)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:'13px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#111' }}>{file.name}</p>
                  <p style={{ margin:0, fontSize:'11px', color:'#aaa', fontFamily:"'IBM Plex Mono', monospace" }}>{(file.size/1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setFiles(f => f.filter(x => x.name !== file.name))} style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:'16px', padding:'2px 6px' }}>×</button>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ background:'#f9f9f9', border:'1px solid #eee', borderRadius:'6px', padding:'12px 16px', marginBottom:'12px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ display:'inline-block', width:'14px', height:'14px', border:'2px solid #b8860b', borderTopColor:'transparent', borderRadius:'50%' }} className="spin" />
            <span style={{ fontSize:'13px', color:'#888', fontFamily:"'IBM Plex Mono', monospace" }}>{loadMsg}</span>
          </div>
        )}
        {error && <p style={{ color:'#dc2626', fontSize:'13px', marginBottom:'12px' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading || files.length === 0} style={{ width:'100%', padding:'13px', background: files.length === 0 ? '#f3f3f3' : '#111', color: files.length === 0 ? '#bbb' : '#fff', border:'none', borderRadius:'6px', fontSize:'14px', fontWeight:500, cursor: loading || files.length === 0 ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Analysing...' : `Verify ${files.length > 0 ? files.length + ' file' + (files.length > 1 ? 's' : '') : 'evidence'} →`}
        </button>
        <p style={{ textAlign:'center', fontSize:'11px', color:'#ccc', marginTop:'10px', fontFamily:"'IBM Plex Mono', monospace" }}>
          🔒 Raw content never stored or transmitted
        </p>
      </div>
    </div>
  );
}