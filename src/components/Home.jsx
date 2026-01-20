import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-gradient-light text-slate-900">
    {/* Hero Section */}
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="mb-8 inline-flex items-center gap-2 animate-fade-in">
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full border border-indigo-200 transition duration-150 hover:-translate-y-0.5">
          ✨ Premium Campus Exchange
        </span>
        <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition duration-150 hover:-translate-y-0.5">
          📈 Impact-first
        </span>
      </div>

      {/* Hero Title with Gradient */}
      <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          BOOK MARKET
        </span>
      </h1>

      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
        A trust-based textbook exchange for verified students. List a book, swap via QR, and see your campus impact grow.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-delay-2">
        <Link to="/add">
          <button className="btn-primary transition-smooth hover:scale-105 active:scale-95">📚 List a Book</button>
        </Link>
        <Link to="/books">
          <button className="btn-secondary transition-smooth hover:scale-105 active:scale-95">🧭 Browse Available</button>
        </Link>
      </div>

      {/* How It Works - Guided Steps */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: '1️⃣',
            title: 'Add a Book',
            desc: 'List it with course, condition, and intent. Clear, quick, and verified.',
            cta: 'Start listing',
            href: '/add',
            tone: 'from-indigo-100 to-indigo-50'
          },
          {
            icon: '2️⃣',
            title: 'Exchange via QR',
            desc: 'Generate and scan a QR for a trust-first handoff. No extra steps.',
            cta: 'Generate QR',
            href: '/scan',
            tone: 'from-sky-100 to-cyan-50'
          },
          {
            icon: '3️⃣',
            title: 'See Your Impact',
            desc: 'Track books reused, money saved, and paper spared in the Impact Ledger.',
            cta: 'View impact',
            href: '/impact',
            tone: 'from-emerald-100 to-green-50'
          }
        ].map((item, idx) => (
          <Link key={item.title} to={item.href} className="group">
            <div className={`glass-card-lg glass-card-hover p-8 bg-gradient-to-br ${item.tone} hover:shadow-2xl hover:shadow-indigo-300/50 hover:border-indigo-300/60 animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="text-5xl mb-4 animate-float group-hover:scale-110 transition-transform" style={{ animationDelay: `${idx * 0.2}s` }}>{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition duration-150">
                {item.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Impact Preview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Books Listed', value: '1000+', color: 'from-blue-500 to-cyan-500' },
          { label: 'Money Saved', value: '₹50K+', color: 'from-green-500 to-emerald-500' },
          { label: 'Active Users', value: '500+', color: 'from-purple-500 to-pink-500' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card-lg glass-card-hover p-6 animate-scale-in hover-glow transition-smooth-lg hover:shadow-2xl" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom CTA */}
    <div className="max-w-4xl mx-auto px-6 py-8 text-center animate-fade-in-delay-3">
      <Link to="/impact">
        <button className="btn-outline transition duration-150 hover:scale-105 active:scale-95">View Impact Ledger →</button>
      </Link>
    </div>
  </div>
);

export default Home;
