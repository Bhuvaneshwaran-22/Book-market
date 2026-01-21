import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';
import QrExchangeGenerator from './QrExchangeGenerator';

const BookList = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntent, setFilterIntent] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'books'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBooks(next);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore error:', error);
        setLoading(false);
        if (error.code === 'failed-precondition' || error.message.includes('index')) {
          const fallbackQ = query(
            collection(db, 'books'),
            where('status', '==', 'available')
          );
          const fallbackUnsub = onSnapshot(fallbackQ, (snap) => {
            const next = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            next.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setBooks(next);
          });
          return fallbackUnsub;
        }
      }
    );
    return unsub;
  }, [user]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIntent = filterIntent === 'all' || book.intent === filterIntent;
    const matchesCondition = filterCondition === 'all' || book.condition === filterCondition;
    
    return matchesSearch && matchesIntent && matchesCondition;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark text-slate-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
            <div className="h-4 w-64 bg-white/5 rounded" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-5 w-2/3 bg-white/10 rounded mb-4" />
                <div className="h-4 w-1/3 bg-white/5 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-white/5 rounded" />
                  <div className="h-4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="min-h-screen bg-gradient-dark text-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-50 mb-2 animate-slide-down">Browse Textbooks</h1>
          <p className="text-lg text-slate-300 mb-12 animate-fade-in-delay-1">Available books shared by your campus community.</p>

          <div className="text-center py-16 glass-card-lg border-2 border-dashed border-indigo-500/30 animate-scale-in">
            <div className="text-6xl mb-4 animate-float">📚</div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">No books listed yet</h2>
            <p className="text-slate-300 mb-6">Be the first to share a textbook with your campus!</p>
            <Link to="/add">
              <button className="btn-primary hover:scale-105 active:scale-95 transition-transform">
                + Add the First Book
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getIntentBadgeColor = (intent) => {
    const colors = {
      sell: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      lend: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      donate: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
    };
    return colors[intent] || colors.sell;
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-slate-50 py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2 animate-slide-down">Browse Textbooks</h1>
        <p className="text-base md:text-lg text-slate-300 mb-8 animate-fade-in-delay-1">Available books from your campus community.</p>

        {/* Scan QR CTA */}
        <Link to="/scan" className="mb-6 block animate-fade-in-delay-2">
          <button className="w-full btn-secondary text-lg py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform">
            🔐 Scan a Book's QR Code
          </button>
        </Link>

        {/* Search & Filter Section */}
        <div className="glass-card-lg p-4 md:p-6 mb-8 animate-fade-in-delay-2 space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-50 mb-2">🔎 Search Books</label>
            <input
              type="text"
              placeholder="Search title, code, or department…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full text-sm"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-50 mb-2">Exchange Type</label>
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="glass-input w-full text-sm"
              >
                <option value="all">All Types</option>
                <option value="sell">💵 For Sale</option>
                <option value="lend">🔄 For Lending</option>
                <option value="donate">❤️ For Donation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-50 mb-2">Condition</label>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="glass-input w-full text-sm"
              >
                <option value="all">All Conditions</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Results Counter & Clear Filters */}
          <div className="text-xs text-slate-400 text-center pt-2 flex items-center justify-between">
            <span>Showing {filteredBooks.length} of {books.length} books</span>
            {(searchTerm || filterIntent !== 'all' || filterCondition !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterIntent('all');
                  setFilterCondition('all');
                }}
                className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 glass-card-lg">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-50 mb-2">No books found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-8">
            {filteredBooks.map((book, idx) => (
              <div
                key={book.id}
                className="glass-card glass-card-hover p-6 animate-slide-up"
                style={{ animationDelay: `${(idx % 3) * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-50">{book.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {book.subjectCode} • {book.department}
                    </p>
                  </div>
                  <span className={`badge border text-xs px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap ${getIntentBadgeColor(book.intent)}`}>
                    {book.intent === 'sell' ? '💵 Sell' : book.intent === 'lend' ? '🔄 Lend' : '❤️ Donate'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/8">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Semester</p>
                    <p className="text-sm text-slate-300">{book.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Condition</p>
                    <p className="text-sm text-slate-300">{book.condition}</p>
                  </div>
                </div>

                {/* Owner & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Posted by</p>
                    <p className="text-sm font-medium text-slate-300">{book.ownerEmail}</p>
                  </div>
                  <QrExchangeGenerator book={book} user={user} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add More Books CTA */}
        <Link to="/add" className="flex justify-center">
          <button className="btn-primary hover:scale-105 active:scale-95 transition-transform">
            + Post Your Books
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookList;
