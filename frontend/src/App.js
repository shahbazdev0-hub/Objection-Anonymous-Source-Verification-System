import { useState } from 'react';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import CertificatePage from './components/CertificatePage';

export default function App() {
  const [page, setPage] = useState('home');
  const [certificate, setCertificate] = useState(null);

  if (page === 'upload') return (
    <UploadPage
      onCertificate={(cert) => { setCertificate(cert); setPage('certificate'); }}
      onBack={() => setPage('home')}
    />
  );
  if (page === 'certificate') return (
    <CertificatePage
      certificate={certificate}
      onNew={() => setPage('upload')}
      onHome={() => setPage('home')}
    />
  );
  return <HomePage onStart={() => setPage('upload')} />;
}
