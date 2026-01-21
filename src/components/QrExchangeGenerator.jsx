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
            className="glass-card-lg max-w-xs w-full p-6 rounded-2xl animate-scale-in text-slate-50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-xl font-bold text-slate-50 mb-1 animate-slide-down">Exchange QR</h2>
            <p className="text-slate-400 text-xs mb-4 animate-fade-in-delay-1">
              Share with buyer to confirm exchange
            </p>
            
            {/* QR Code Display */}
            <div className="bg-white rounded-lg p-4 flex justify-center mb-4 border border-slate-300 shadow-lg animate-fade-in-delay-2">
              <QRCode value={qrValue} size={160} level="M" includeMargin={true} fgColor="#000000" bgColor="#FFFFFF" />
            </div>

            {/* Book Details */}
            <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-2 mb-4 animate-fade-in-delay-2">
              <p className="text-xs text-indigo-300 font-semibold mb-0.5">BOOK:</p>
              <p className="text-xs text-indigo-200 line-clamp-2">{book.title}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 animate-fade-in-delay-3">
              <button 
                onClick={() => setOpen(false)} 
                className="flex-1 btn-secondary py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform text-xs"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(qrValue);
                  alert('QR copied!');
                }} 
                className="flex-1 btn-outline py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform text-xs"
              >
                Copy QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrExchangeGenerator;
