import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';

// Scans exchange QR and marks the book as handed over.
const QrExchangeScanner = ({ user }) => {
  const [status, setStatus] = useState('Point your camera at the QR to confirm exchange.');
  const [severity, setSeverity] = useState('info');
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (severity === 'success') {
      const timer = setTimeout(() => navigate('/books'), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [severity, navigate]);

  const handleDecode = async (value) => {
    if (busy || paused) return;
    setBusy(true);
    setSeverity('info');
    setStatus('Processing scan...');
    try {
      const payload = JSON.parse(value || '{}');
      const { bookId, ownerId } = payload;
      if (!bookId || !ownerId) {
        throw new Error('QR is missing book info.');
      }
      const ref = doc(db, 'books', bookId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        throw new Error('Book not found for this QR.');
      }
      const data = snap.data();
      if (data.ownerId !== ownerId) {
        throw new Error('Owner mismatch. Ask for a fresh QR from the owner.');
      }
      if (data.status === 'exchanged') {
        throw new Error('This book is already exchanged.');
      }
      await updateDoc(ref, {
        status: 'exchanged',
        exchangedAt: serverTimestamp(),
        exchangedWith: user?.uid || 'unknown',
      });
      setSeverity('success');
      setStatus('✓ Exchange verified successfully!');
      setPaused(true);
    } catch (err) {
      setSeverity('error');
      setStatus(err.message || 'Could not process QR.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-6 text-center animate-slide-down">
          <h1 className="text-3xl font-bold text-white mb-2">Scan Exchange QR</h1>
          <p className="text-gray-400">Point your camera at the QR code to confirm the book handoff.</p>
        </div>

        {/* Scanner */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 border-indigo-500/50 animate-scale-in">
          <Scanner
            onScan={(results) => {
              const first = results?.[0]?.rawValue;
              if (first) handleDecode(first);
            }}
            onError={(error) => {
              setSeverity('error');
              const message = error?.message || 'Camera error.';
              if (message.toLowerCase().includes('permission')) {
                setStatus('📷 Camera access required to scan QR codes. Please allow camera permissions in your browser settings.');
              } else {
                setStatus(message);
              }
            }}
            constraints={{ facingMode: 'environment' }}
            paused={paused}
            containerStyle={{ width: '100%' }}
            videoStyle={{ width: '100%' }}
          />
        </div>

        {/* Status Message */}
        <div className={`rounded-lg p-4 mb-6 text-center text-sm font-semibold transition-smooth ${
          severity === 'success'
            ? 'bg-green-500/10 text-green-300 border border-green-500/20 animate-slide-down' 
            : severity === 'error'
              ? 'bg-red-500/10 text-red-300 border border-red-500/20 animate-slide-down'
              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
        }`}>
          {status}
        </div>

        {/* Loading Indicator */}
        {busy && (
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="text-gray-400 text-sm mt-2">Verifying...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 animate-fade-in-delay-1">
          <button 
            onClick={() => navigate('/books')}
            className="w-full btn-secondary text-white bg-white/5 hover:bg-white/10 py-3 rounded-lg font-semibold transition-smooth hover:scale-105 active:scale-95"
          >
            ← Back to Books
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center animate-fade-in-delay-2">
          <p className="text-xs text-gray-500">
            💡 Tip: Make sure the QR code is well-lit and fully visible in the frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrExchangeScanner;
