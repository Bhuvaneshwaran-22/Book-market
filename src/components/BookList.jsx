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

  useEffect(() => {
    const q = query(
      collection(db, 'books'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(next);
    });
    return unsub;
  }, []);

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

  if (!books.length) {
    return (
      <div className="min-h-screen bg-gradient-dark py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-down">Browse Textbooks</h1>
          <p className="text-lg text-gray-400 mb-12 animate-fade-in-delay-1">Available books shared by your campus community.</p>

          <div className="text-center py-20 glass-card border-2 border-dashed border-white/20 animate-scale-in">
            <div className="text-6xl mb-6 animate-float">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">No books available yet</h2>
            <p className="text-gray-400 mb-8">Be the first to share! Post a book you want to exchange.</p>
            <Link to="/add">
              <button className="btn-primary transition-smooth hover:scale-105 active:scale-95">+ Add the First Book</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getIntentColor = (intent) => {
    const colors = {
      sell: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      lend: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      donate: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[intent] || colors.sell;
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-slide-down">Browse Textbooks</h1>
        <p className="text-base md:text-lg text-gray-400 mb-8 animate-fade-in-delay-1">Available books shared by your campus community.</p>

        {/* Scan QR CTA */}
        <Link to="/scan" className="mb-6 block animate-fade-in-delay-2">
          <button className="w-full btn-secondary text-lg py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-smooth hover:scale-105 active:scale-95 hover-glow">
            🔍 Scan a Book's QR Code
          </button>
        </Link>

        {/* Search & Filter Section */}
        <div className="glass-card-lg p-4 md:p-6 mb-8 animate-fade-in-delay-2">
          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">🔎 Search Books</label>
              <input
                type="text"
                placeholder="Search title, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input-lg w-full hover-glow text-sm"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Intent Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Type</label>
                <select
                  value={filterIntent}
                  onChange={(e) => setFilterIntent(e.target.value)}
                  className="glass-input-lg w-full hover-glow text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="sell">💵 For Sale</option>
                  <option value="lend">🔄 For Lending</option>
                  <option value="donate">❤️ For Donation</option>
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Condition</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="glass-input-lg w-full hover-glow"
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
            <div className="text-xs text-gray-400 text-center pt-2">
              Showing {filteredBooks.length} of {books.length} books
              {(searchTerm || filterIntent !== 'all' || filterCondition !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterIntent('all');
                    setFilterCondition('all');
                  }}
                  className="ml-2 text-indigo-400 hover:text-indigo-300 underline"
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
            <h3 className="text-lg font-bold text-white mb-2">No books found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-8">
            {filteredBooks.map((book, idx) => (
              <div
                key={book.id}
                className="glass-card-lg glass-card-hover p-6 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-indigo-400/30 transition-smooth-lg hover-lift animate-slide-up"
                style={{ animationDelay: `${(idx % 3) * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{book.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {book.subjectCode} • {book.department}
                    </p>
                  </div>
                  <span className={`badge border ${getIntentColor(book.intent)}`}>
                    {book.intent === 'sell' ? '💵 Sell' : book.intent === 'lend' ? '🔄 Lend' : '❤️ Donate'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Semester</p>
                    <p className="text-sm text-gray-300">{book.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Condition</p>
                    <p className="text-sm text-gray-300">{book.condition}</p>
                  </div>
                </div>

                {/* Owner & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Posted by</p>
                    <p className="text-sm font-medium text-gray-300">{book.ownerEmail}</p>
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
