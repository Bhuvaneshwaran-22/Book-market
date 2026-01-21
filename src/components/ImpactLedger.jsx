import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';
import AchievementBadges from './AchievementBadges';

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
    const moneySaved = total * 500;
    const paperSavedKg = total * 2;
    return { total, moneySaved, paperSavedKg };
  }, [exchanged.length]);

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
    <div className="min-h-screen bg-gradient-dark text-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
            <span className="text-sm font-semibold text-indigo-300">📊 Real-Time Impact</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-50 mb-4 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-slate-50 to-emerald-400 bg-clip-text text-transparent">
              Impact Ledger
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Live metrics from verified book exchanges. Every exchange saves money, reduces waste, and helps your campus.
          </p>
        </div>

        {/* Achievements Section */}
        <AchievementBadges metrics={displayMetrics} />

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Books Reused */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-300">📚</div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg group-hover:scale-125 transition-transform duration-300">
                  +
                </div>
              </div>
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 tabular-nums">
                {displayMetrics.total}
              </div>
              <p className="text-sm md:text-base text-slate-50 font-semibold">Books Reused</p>
              <p className="text-xs text-slate-400 mt-2">Kept out of landfills across campus</p>
            </div>
          </div>

          {/* Money Saved */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>💰</div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:scale-125 transition-transform duration-300">
                  ✓
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-emerald-400 to-green-400 bg-clip-text text-transparent mb-3">
                ₹{displayMetrics.moneySaved.toLocaleString('en-IN')}
              </div>
              <p className="text-sm md:text-base text-slate-50 font-semibold">Student Savings</p>
              <p className="text-xs text-slate-400 mt-2">Combined value recouped by students</p>
            </div>
          </div>

          {/* Paper Saved */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>🌱</div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg group-hover:scale-125 transition-transform duration-300">
                  ≈
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-3 tabular-nums">
                {displayMetrics.paperSavedKg}
                <span className="text-2xl md:text-3xl">kg</span>
              </div>
              <p className="text-sm md:text-base text-slate-50 font-semibold">Paper Saved</p>
              <p className="text-xs text-slate-400 mt-2">Positive environmental impact</p>
            </div>
          </div>
        </div>

        {/* Context Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Why It Matters */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌍</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50">Why This Matters</h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  This platform reduces academic waste and enables textbook reuse across your campus community.
                </p>
                <p>
                  Each exchange represents a book that won't end up in landfill—and real money returned to students' pockets.
                </p>
                <p className="text-sm text-slate-400 italic">
                  Together, we're building a sustainable, peer-driven alternative to overconsumption.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-xs text-slate-400">🎯 Every exchange counts toward a greener campus</div>
              </div>
            </div>
          </div>

          {/* Impact Assumptions */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative glass-card-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl" style={{ animationDelay: '0.1s' }}>📊</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50">Impact Assumptions</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/5 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-slate-300">Average textbook cost</span>
                  <span className="font-bold text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text">₹500</span>
                </div>
                <div className="flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/5 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-slate-300">Paper per textbook</span>
                  <span className="font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">2 kg</span>
                </div>
                <div className="flex justify-between items-center pb-4 px-4 border-b border-white/10 hover:bg-white/5 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-slate-300">Carbon offset per book</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-semibold border border-amber-500/30">~4 kg CO₂</span>
                </div>
                <div className="flex justify-between items-center px-4 pt-2 hover:bg-white/5 rounded transition-all duration-200">
                  <span className="text-sm md:text-base text-slate-300">Data freshness</span>
                  <span className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm md:text-base">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
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
            <div className="relative glass-card-lg p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📜</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-50">Recent Exchanges</h2>
                </div>
                <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                  <span className="text-xs font-semibold text-indigo-300">{exchanged.length} total</span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-72 overflow-y-auto pr-3">
                {exchanged.slice(0, 15).map((book, idx) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-3.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-400">#{idx + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-50 truncate">{book.title}</p>
                        <p className="text-xs text-slate-400 truncate">{book.ownerEmail || 'Campus Member'}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        book.intent === 'sell' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        book.intent === 'lend' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {book.intent?.charAt(0).toUpperCase() + book.intent?.slice(1) || 'Exchange'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">✨ Showing {Math.min(15, exchanged.length)} of {exchanged.length} total exchanges</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {exchanged.length === 0 && (
          <div className="glass-card-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-slate-50 mb-2">No Exchanges Yet</h3>
            <p className="text-slate-300">Start exchanging books to see your impact grow in real-time!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactLedger;
