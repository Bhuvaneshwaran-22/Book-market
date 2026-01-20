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
        // If index error, fetch without orderBy as fallback
        if (error.code === 'failed-precondition' || error.message.includes('index')) {
          const fallbackQ = query(
            collection(db, 'books'),
            where('status', '==', 'available')
          );
          const fallbackUnsub = onSnapshot(fallbackQ, (snap) => {
            const next = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            // Sort in memory
            next.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setBooks(next);
          });
          return fallbackUnsub;
        }
      }
    );
    return unsub;
  }, [user]);

  // Filter & search logic
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
      <div className="min-h-screen bg-gradient-light text-slate-900 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <div className="h-8 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-200/70 rounded mt-3 animate-pulse" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card-lg p-6 animate-pulse">
                <div className="h-5 w-2/3 bg-slate-200/80 rounded" />
                <div className="h-4 w-1/3 bg-slate-200/70 rounded mt-3" />
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="h-4 bg-slate-200/60 rounded" />
                  <div className="h-4 bg-slate-200/60 rounded" />
                </div>
                <div className="h-10 w-full bg-slate-200/70 rounded mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="min-h-screen bg-gradient-light text-slate-900 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 animate-slide-down">Browse Textbooks</h1>
          <p className="text-lg text-slate-600 mb-12 animate-fade-in-delay-1">Available books shared by your campus community.</p>

          <div className="text-center py-16 glass-card border-2 border-dashed border-indigo-100 animate-scale-in">
            <div className="text-6xl mb-4 animate-float">📚</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No books yet—let's fix that</h2>
            <p className="text-slate-600 mb-6">Share your first listing and set the tone for your campus exchange.</p>
            <Link to="/add">
              <button className="btn-primary transition duration-150 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400">+ Add the First Book</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getIntentColor = (intent, status) => {
    if (status === 'exchanged') {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }
    const colors = {
      sell: 'bg-amber-50 text-amber-800 border-amber-200',
      lend: 'bg-blue-50 text-blue-800 border-blue-200',
      donate: 'bg-green-50 text-green-800 border-green-200'
    };
    return colors[intent] || colors.sell;
  };

  return (
    <div className="min-h-screen bg-gradient-light text-slate-900 py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 animate-slide-down">Browse Textbooks</h1>
        <p className="text-base md:text-lg text-slate-600 mb-8 animate-fade-in-delay-1">Available books shared by your campus community.</p>

        {/* Scan QR CTA */}
        <Link to="/scan" className="mb-6 block animate-fade-in-delay-2">
          <button className="w-full btn-secondary text-lg py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-150 hover:scale-105 active:scale-95 hover-glow focus-visible:ring-2 focus-visible:ring-indigo-400">
            🔍 Scan a Book's QR Code
          </button>
        </Link>

        {/* Search & Filter Section */}
        <div className="glass-card-lg p-4 md:p-6 mb-8 animate-fade-in-delay-2">
          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">🔎 Search Books</label>
              <input
                type="text"
                placeholder="Search title, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input-lg w-full hover-glow text-sm transition duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Intent Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Type</label>
                <select
                  value={filterIntent}
                  onChange={(e) => setFilterIntent(e.target.value)}
                  className="glass-input-lg w-full hover-glow text-sm transition duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <option value="all">All Types</option>
                  <option value="sell">💵 For Sale</option>
                  <option value="lend">🔄 For Lending</option>
                  <option value="donate">❤️ For Donation</option>
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Condition</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="glass-input-lg w-full hover-glow transition duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <option value="all">All Conditions</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="text-xs text-slate-600 text-center pt-2">
              Showing {filteredBooks.length} of {books.length} books
              {(searchTerm || filterIntent !== 'all' || filterCondition !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterIntent('all');
                    setFilterCondition('all');
                  }}
                  className="ml-2 text-indigo-500 hover:text-indigo-600 underline transition duration-150"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
            <div className="text-center py-12 glass-card">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No books found</h3>
            <p className="text-slate-600 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-8">
            {filteredBooks.map((book, idx) => (
              <div
                key={book.id}
                className="glass-card-lg glass-card-hover p-6 hover:shadow-2xl hover:shadow-indigo-200/70 hover:border-indigo-200/70 transition duration-150 hover-lift animate-slide-up"
                style={{ animationDelay: `${(idx % 3) * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{book.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {book.subjectCode} • {book.department}
                    </p>
                  </div>
                  <span className={`badge border ${getIntentColor(book.intent, book.status)}`}>
                    {book.status === 'exchanged'
                      ? '✅ Exchanged'
                      : book.intent === 'sell' ? '💵 Sell' : book.intent === 'lend' ? '🔄 Lend' : '❤️ Donate'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200/60">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Semester</p>
                    <p className="text-sm text-slate-700">{book.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Condition</p>
                    <p className="text-sm text-slate-700">{book.condition}</p>
                  </div>
                </div>

                {/* Owner & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Posted by</p>
                    <p className="text-sm font-medium text-slate-700">{book.ownerEmail}</p>
                  </div>
                  <QrExchangeGenerator book={book} user={user} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add More Books CTA */}
        <Link to="/add" className="flex justify-center">
          <button className="btn-primary">+ Post Your Books</button>
        </Link>
      </div>
    </div>
  );
};

export default BookList;
