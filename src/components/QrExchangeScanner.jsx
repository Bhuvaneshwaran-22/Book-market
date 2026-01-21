import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, runTransaction, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';

const QrExchangeScanner = ({ user, showToast }) => {
  const [status, setStatus] = useState('Point your camera at the QR code to confirm exchange.');
  const [severity, setSeverity] = useState('info');
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [payload, setPayload] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccessful) {
      const timer = setTimeout(() => navigate('/books'), 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSuccessful, navigate]);

  const handleDecode = async (value) => {
    if (busy || paused) return;
    setBusy(true);
    setSeverity('info');
    setStatus('Processing scan...');
    try {
      const scannedPayload = JSON.parse(value || '{}');
      const { bookId, ownerId } = scannedPayload;
      if (!bookId || !ownerId) {
        throw new Error('QR is missing book information.');
      }
      if (user?.uid === ownerId) {
        throw new Error('Owners cannot scan their own QR code.');
      }

      // Fetch book details for display only
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);
      
      if (!bookSnap.exists()) {
        throw new Error('Book not found for this QR code.');
      }
      
      const bookData = bookSnap.data();
      if (bookData.ownerId !== ownerId) {
        throw new Error('Owner mismatch. Request a fresh QR from the owner.');
      }
      if (bookData.status !== 'available') {
        throw new Error('This book has already been exchanged.');
      }

      // Store book details and payload for confirmation
      setBookDetails({
        title: bookData.title,
        subjectCode: bookData.subjectCode,
        department: bookData.department,
        intent: bookData.intent,
        ownerEmail: bookData.ownerEmail,
      });
      setPayload(scannedPayload);
      setShowConfirm(true);
      setSeverity('success');
      setStatus('✓ Book found! Review details below and confirm exchange.');
      setBusy(false);
    } catch (err) {
      setSeverity('error');
      setStatus(err.message || 'Could not process QR code.');
      showToast?.('Scan failed. Please try again.', 'error');
      setBusy(false);
    }
  };

  const confirmExchange = async () => {
    if (!payload || !bookDetails) return;
    setBusy(true);
    setSeverity('info');
    setStatus('Confirming exchange...');
    
    try {
      const { bookId, ownerId } = payload;
      const ref = doc(db, 'books', bookId);
      
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) {
          throw new Error('Book not found for this QR code.');
        }
        const data = snap.data();
        if (data.ownerId !== ownerId) {
          throw new Error('Owner mismatch. Request a fresh QR from the owner.');
        }
        if (data.status !== 'available') {
          throw new Error('This book has already been exchanged.');
        }
        tx.update(ref, {
          status: 'exchanged',
          exchangedAt: serverTimestamp(),
          exchangedWith: user?.uid || 'unknown',
        });
      });

      setSeverity('success');
      setStatus('✓ Exchange verified successfully. Redirecting…');
      setPaused(true);
      showToast?.('Exchange verified. Great job!');
      setIsSuccessful(true);
    } catch (err) {
      setSeverity('error');
      setStatus(err.message || 'Could not process QR code.');
      showToast?.('Exchange failed. Please try again.', 'error');
      setShowConfirm(false);
      setBookDetails(null);
      setPayload(null);
      setBusy(false);
    }
  };

  const cancelScan = () => {
    setShowConfirm(false);
    setBookDetails(null);
    setPayload(null);
    setSeverity('info');
    setStatus('Point your camera at the QR code to confirm exchange.');
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-slate-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-6 text-center animate-slide-down">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">🔐 Scan Exchange QR</h1>
          <p className="text-slate-300">{showConfirm ? 'Confirm the exchange details' : 'Point your camera at the QR code to confirm the book handoff.'}</p>
        </div>

        {!showConfirm ? (
          <>
            {/* Scanner */}
            <div className="glass-card-lg rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 border-indigo-500/40 animate-scale-in">
              <Scanner
                onScan={(results) => {
                  const first = results?.[0]?.rawValue;
                  if (first) handleDecode(first);
                }}
                onError={(error) => {
                  setSeverity('error');
                  const message = error?.message || 'Camera error.';
                  if (message.toLowerCase().includes('permission')) {
                    setStatus('📷 Camera access required. Please allow camera permissions in your browser settings.');
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
          </>
        ) : (
          <>
            {/* Book Details Card */}
            <div className="glass-card-lg p-6 mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 animate-slide-up">
              <h2 className="text-lg font-bold text-emerald-300 mb-4">📚 Book Details</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide text-xs font-semibold mb-1">Title</p>
                  <p className="text-slate-50 font-medium">{bookDetails.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-400 uppercase tracking-wide text-xs font-semibold mb-1">Subject Code</p>
                    <p className="text-slate-50 font-medium">{bookDetails.subjectCode}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase tracking-wide text-xs font-semibold mb-1">Department</p>
                    <p className="text-slate-50 font-medium">{bookDetails.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-400 uppercase tracking-wide text-xs font-semibold mb-1">Intent</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      bookDetails.intent === 'Sell' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' :
                      bookDetails.intent === 'Lend' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                    }`}>
                      {bookDetails.intent}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase tracking-wide text-xs font-semibold mb-1">Owner</p>
                    <p className="text-slate-50 font-medium text-xs truncate">{bookDetails.ownerEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 mb-6 text-center text-sm font-semibold text-emerald-300 animate-fade-in">
              Ready to confirm this exchange?
            </div>
          </>
        )}

        {/* Status Message */}
        <div className={`rounded-lg p-4 mb-6 text-center text-sm font-semibold transition duration-200 border ${
          severity === 'success'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-slide-down'
            : severity === 'error'
              ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-slide-down'
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        }`}>
          {status}
        </div>

        {/* Loading Indicator */}
        {busy && (
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="text-slate-400 text-sm mt-2">{showConfirm ? 'Confirming…' : 'Processing…'}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 animate-fade-in-delay-1">
          {showConfirm && !isSuccessful ? (
            <>
              <button
                onClick={confirmExchange}
                disabled={busy}
                className="w-full btn-primary py-3 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Confirm Exchange
              </button>
              <button
                onClick={cancelScan}
                disabled={busy}
                className="w-full btn-secondary py-3 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Scan Again
              </button>
            </>
          ) : isSuccessful ? (
            <button
              onClick={() => navigate('/books')}
              className="w-full btn-primary py-3 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            >
              → Back to Books
            </button>
          ) : (
            <button
              onClick={() => navigate('/books')}
              className="w-full btn-secondary py-3 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            >
              ← Back to Books
            </button>
          )}
        </div>

        {/* Info Footer */}
        {!showConfirm && (
          <div className="mt-8 text-center animate-fade-in-delay-2">
            <p className="text-xs text-slate-400">
              💡 Tip: Ensure the QR code is well-lit and fully visible in the frame for quick scanning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrExchangeScanner;
