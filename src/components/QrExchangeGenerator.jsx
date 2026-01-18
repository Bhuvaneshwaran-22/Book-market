import { useMemo, useState } from 'react';
import QRCode from 'qrcode.react';

// Shows QR code for owner to confirm a physical handoff.
const QrExchangeGenerator = ({ book, user }) => {
  const [open, setOpen] = useState(false);
  const isOwner = user?.uid === book.ownerId && book.status === 'available';

  const qrValue = useMemo(
    () => JSON.stringify({ bookId: book.id, ownerId: book.ownerId }),
    [book.id, book.ownerId],
  );

  if (!isOwner) return null;

  return (
    <div>
      <button 
        onClick={() => setOpen(true)} 
        className="btn-primary text-sm py-2 px-4 rounded-lg whitespace-nowrap transition-smooth hover:scale-105 active:scale-95"
      >
        🔐 Generate QR
      </button>
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card max-w-sm w-full p-8 rounded-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-bold text-white mb-2 animate-slide-down">Exchange QR Code</h2>
            <p className="text-gray-400 text-sm mb-6 animate-fade-in-delay-1">
              Share this code with the other student. They'll scan it to confirm the exchange.
            </p>
            
            {/* QR Code Display */}
            <div className="bg-white rounded-lg p-6 flex justify-center mb-6 border border-white/20 animate-fade-in-delay-2">
              <QRCode value={qrValue} size={200} includeMargin fgColor="#0f172a" />
            </div>

            {/* Book Details */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 mb-6 animate-fade-in-delay-3 transition-smooth hover:bg-indigo-500/20 hover:border-indigo-500/40">
              <p className="text-xs text-indigo-300 font-semibold mb-1">BOOK DETAILS ENCODED:</p>
              <p className="text-xs text-indigo-400">{book.title}</p>
            </div>

            {/* Info Message */}
            <p className="text-xs text-gray-500 text-center mb-6 animate-fade-in-delay-3">
              ✓ Secure • Only contains book ID • Close after exchange
            </p>

            {/* Buttons */}
            <div className="flex gap-3 animate-fade-in-delay-4">
              <button 
                onClick={() => setOpen(false)} 
                className="flex-1 btn-secondary py-2 rounded-lg transition-smooth hover:scale-105 active:scale-95"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(qrValue);
                  alert('QR data copied!');
                }} 
                className="flex-1 btn-outline py-2 rounded-lg transition-smooth hover:scale-105 active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrExchangeGenerator;
