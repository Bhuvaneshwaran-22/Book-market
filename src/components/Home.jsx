import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-gradient-dark text-slate-50 py-16 md:py-24">
    {/* Hero Section */}
    <div className="max-w-4xl mx-auto px-6 text-center">
      {/* Badge Section */}
      <div className="mb-8 inline-flex items-center gap-2 animate-fade-in">
        <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/20 border border-indigo-500/30 px-4 py-1.5 rounded-full">
          ✨ Campus Exchange Platform
        </span>
        <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          🌱 Impact-First
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
        <span className="bg-gradient-to-r from-indigo-400 via-slate-50 to-indigo-400 bg-clip-text text-transparent">
          BOOK MARKET
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
        A trust-based textbook exchange for your campus. List a book, swap via QR code, and track your environmental impact in real-time.
      </p>

      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 animate-fade-in-delay-2">
        <Link to="/add">
          <button className="btn-primary hover:scale-105 active:scale-95 transition-transform">
            📚 List a Book
          </button>
        </Link>
        <Link to="/books">
          <button className="btn-secondary hover:scale-105 active:scale-95 transition-transform">
            🔍 Browse Available
          </button>
        </Link>
      </div>

      {/* Feature Cards - How It Works */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          {
            icon: '📚',
            number: '1',
            title: 'Add a Book',
            desc: 'List your textbook with course details, condition, and exchange intent.',
            href: '/add'
          },
          {
            icon: '🔐',
            number: '2',
            title: 'Exchange via QR',
            desc: 'Generate and scan secure QR codes for trusted peer-to-peer handoff.',
            href: '/scan'
          },
          {
            icon: '🌍',
            number: '3',
            title: 'Track Impact',
            desc: 'See real-time metrics: books reused, money saved, and carbon offset.',
            href: '/impact'
          }
        ].map((item, idx) => (
          <Link key={item.title} to={item.href} className="group">
            <div 
              className="glass-card-lg glass-card-hover p-8 relative h-full flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                {item.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="font-bold text-slate-50 mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-4 flex-grow">{item.desc}</p>

              {/* CTA Link */}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
                Learn more →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Impact Stats Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-50 mb-8 text-center">Campus Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Books Listed', value: '1000+', emoji: '📚' },
            { label: 'Money Saved', value: '₹50K+', emoji: '💰' },
            { label: 'Students Active', value: '500+', emoji: '👥' }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 glass-card-hover text-center animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{stat.emoji}</div>
              <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary CTA */}
      <Link to="/impact">
        <button className="btn-outline animate-fade-in-delay-3 hover:scale-105 active:scale-95 transition-transform">
          📊 View Impact Ledger →
        </button>
      </Link>
    </div>
  </div>
);

export default Home;
