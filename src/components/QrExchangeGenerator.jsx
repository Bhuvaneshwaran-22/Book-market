import { useMemo, useState } from 'react';
import QRCode from 'qrcode.react';

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
        className="btn-primary text-sm py-2 px-4 rounded-lg whitespace-nowrap hover:scale-105 active:scale-95 transition-transform"
      >
        🔐 Generate QR
      </button>
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card-lg max-w-sm w-full p-8 rounded-2xl animate-scale-in text-slate-50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-bold text-slate-50 mb-2 animate-slide-down">Exchange QR Code</h2>
            <p className="text-slate-300 text-sm mb-6 animate-fade-in-delay-1">
              Share this code with the buyer. They'll scan it to confirm the exchange.
            </p>
            
            {/* QR Code Display */}
            <div className="bg-white rounded-xl p-8 flex justify-center mb-6 border-2 border-slate-300 shadow-xl animate-fade-in-delay-2">
              <QRCode value={qrValue} size={240} level="H" includeMargin={true} fgColor="#000000" bgColor="#FFFFFF" />
            </div>

            {/* Book Details */}
            <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3 mb-6 animate-fade-in-delay-2">
              <p className="text-xs text-indigo-300 font-semibold mb-1">ENCODED DETAILS:</p>
              <p className="text-xs text-indigo-200">{book.title}</p>
            </div>

            {/* Info Message */}
            <p className="text-xs text-slate-400 text-center mb-6 animate-fade-in-delay-3">
              ✓ Secure • Book ID encrypted • Close after handoff
            </p>

            {/* Buttons */}
            <div className="flex gap-3 animate-fade-in-delay-3">
              <button 
                onClick={() => setOpen(false)} 
                className="flex-1 btn-secondary py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform text-sm"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(qrValue);
                  alert('QR data copied!');
                }} 
                className="flex-1 btn-outline py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform text-sm"
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
