import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';
import AchievementBadges from './AchievementBadges';

// Impact Ledger: transparent, real-time impact reporting based on exchanged books.
const ImpactLedger = () => {
  const [exchanged, setExchanged] = useState([]);
  const [displayMetrics, setDisplayMetrics] = useState({ total: 0, moneySaved: 0, paperSavedKg: 0 });

  useEffect(() => {
    const q = query(collection(db, 'books'), where('status', '==', 'exchanged'));
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExchanged(next);
    });
    return unsub;
  }, []);

  const metrics = useMemo(() => {
    const total = exchanged.length;
    const moneySaved = total * 500; // ₹500 assumed per textbook
    const paperSavedKg = total * 2; // 2 kg paper per textbook
    return { total, moneySaved, paperSavedKg };
  }, [exchanged.length]);

  // Animate metric counters on change
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startMetrics = displayMetrics;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setDisplayMetrics({
        total: Math.floor(startMetrics.total + (metrics.total - startMetrics.total) * progress),
        moneySaved: Math.floor(startMetrics.moneySaved + (metrics.moneySaved - startMetrics.moneySaved) * progress),
        paperSavedKg: Math.floor(startMetrics.paperSavedKg + (metrics.paperSavedKg - startMetrics.paperSavedKg) * progress),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gradient-dark py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
            <span className="text-sm font-semibold text-indigo-300">📊 Community Impact</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Impact Ledger</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real-time metrics from confirmed book exchanges. Every exchange is a win for sustainability, your wallet, and your community.
          </p>
        </div>

        {/* Achievements Section */}
        <AchievementBadges metrics={displayMetrics} />

        {/* Metrics Grid - Enhanced */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Books Reused */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:shadow-2xl hover:shadow-blue-500/40 hover-glow transition-smooth-lg hover-lift">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl animate-float">📚</div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/40 to-cyan-500/30 border border-blue-300/60 flex items-center justify-center text-blue-100 font-bold text-2xl group-hover:scale-125 group-hover:animate-heartbeat transition-transform duration-300">
                  +
                </div>
              </div>
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 tabular-nums">
                {displayMetrics.total}
              </div>
              <p className="text-sm md:text-base text-gray-300 font-semibold">Books Reused</p>
              <p className="text-xs text-gray-400 mt-2">Preventing waste across campus</p>
            </div>
          </div>

          {/* Money Saved */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:shadow-2xl hover:shadow-green-500/40 hover-glow transition-smooth-lg hover-lift">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl animate-float" style={{ animationDelay: '0.1s' }}>💰</div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-500/30 border border-green-300/60 flex items-center justify-center text-green-100 font-bold text-2xl group-hover:scale-125 group-hover:animate-heartbeat transition-transform duration-300">
                  ✓
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                ₹{displayMetrics.moneySaved.toLocaleString('en-IN')}
              </div>
              <p className="text-sm md:text-base text-gray-300 font-semibold">Student Savings</p>
              <p className="text-xs text-gray-400 mt-2">Combined value recouped</p>
            </div>
          </div>

          {/* Paper Saved */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:shadow-2xl hover:shadow-emerald-500/40 hover-glow transition-smooth-lg hover-lift">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl animate-float" style={{ animationDelay: '0.2s' }}>🌱</div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/30 border border-emerald-300/60 flex items-center justify-center text-emerald-100 font-bold text-xl group-hover:scale-125 group-hover:animate-heartbeat transition-transform duration-300">
                  ≈
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 tabular-nums">
                {displayMetrics.paperSavedKg}
                <span className="text-2xl md:text-3xl">kg</span>
              </div>
              <p className="text-sm md:text-base text-gray-400 font-semibold">Paper Saved</p>
              <p className="text-xs text-gray-500 mt-2">Environmental impact</p>
            </div>
          </div>
        </div>

        {/* Why It Matters Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Impact Story */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 md:p-10 hover:shadow-2xl hover:shadow-indigo-500/30 hover-glow transition-smooth-lg hover-lift h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl animate-float">🌍</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Why This Matters</h2>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    This platform reduces academic waste and promotes textbook reuse across your campus.
                  </p>
                  <p>
                    Each exchange represents a book that won't end up in a landfill—and real money saved for students.
                  </p>
                  <p className="text-sm text-gray-400 italic">
                    Together, we're building a sustainable, community-driven alternative to overconsumption.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-xs text-gray-500">🎯 Every exchange counts toward a greener campus</div>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 md:p-10 hover:shadow-2xl hover:shadow-purple-500/30 hover-glow transition-smooth-lg hover-lift">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl animate-float" style={{ animationDelay: '0.1s' }}>📊</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Impact Assumptions</h2>
              </div>
              <div className="space-y-4">
                <div className="group/item flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/10 hover:border-indigo-400/30 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-gray-300">Average textbook price</span>
                  <span className="font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">₹500</span>
                </div>
                <div className="group/item flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/10 hover:border-indigo-400/30 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-gray-300">Paper per book</span>
                  <span className="font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">2 kg</span>
                </div>
                <div className="flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/10 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-gray-300">Emission offset</span>
                  <span className="text-xs bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full font-semibold border border-amber-400/30">~4 kg CO₂</span>
                </div>
                <div className="flex justify-between items-center px-4 pt-2 hover:bg-white/5 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-gray-300">Real-time status</span>
                  <span className="inline-flex items-center gap-2 text-green-300 font-bold text-sm md:text-base animate-glow-border">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {exchanged.length > 0 && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card p-8 md:p-10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📜</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Exchanges</h2>
                </div>
                <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                  <span className="text-xs font-semibold text-indigo-300">{exchanged.length} total</span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
                {exchanged.slice(0, 15).map((book, idx) => (
                  <div
                    key={book.id}
                    className="group/item flex items-center justify-between p-3.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-300">#{idx + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-200 truncate group-hover/item:text-indigo-300 transition-colors">{book.title}</p>
                        <p className="text-xs text-gray-500 truncate">{book.seller || 'Campus Member'}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        book.intent === 'sell' ? 'bg-amber-500/20 text-amber-300' :
                        book.intent === 'lend' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {book.intent?.charAt(0).toUpperCase() + book.intent?.slice(1) || 'Exchange'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">✨ Showing {Math.min(15, exchanged.length)} of {exchanged.length} exchanges</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {exchanged.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Exchanges Yet</h3>
            <p className="text-gray-400">Start exchanging books to see your impact grow in real-time!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactLedger;
