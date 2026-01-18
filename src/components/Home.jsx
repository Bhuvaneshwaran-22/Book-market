import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-gradient-dark">
    {/* Hero Section */}
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="mb-8 inline-block animate-fade-in">
        <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 transition-smooth hover:bg-indigo-500/20">
          ✨ Premium Campus Exchange
        </span>
      </div>

      {/* Hero Title with Gradient */}
      <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          BOOK MARKET
        </span>
      </h1>

      <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
        A trust-based textbook exchange platform for verified students. Sell, lend, or donate. All exchanges verified with QR codes.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-delay-2">
        <Link to="/add">
          <button className="btn-primary transition-smooth hover:scale-105 active:scale-95">+ List a Book</button>
        </Link>
        <Link to="/books">
          <button className="btn-secondary transition-smooth hover:scale-105 active:scale-95">Browse Available</button>
        </Link>
      </div>

      {/* How It Works - Glossy Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: '📚',
            title: 'Add a Book',
            desc: 'Post textbooks you want to sell, lend, or donate with details.'
          },
          {
            icon: '🔐',
            title: 'Exchange Securely',
            desc: 'Generate a QR code. The other student scans to confirm.'
          },
          {
            icon: '🌱',
            title: 'See Impact Grow',
            desc: 'Watch metrics: books reused, money saved, paper saved.'
          }
        ].map((item, idx) => (
          <div key={idx} className={`glass-card-lg glass-card-hover p-8 hover:shadow-2xl hover:shadow-indigo-500/40 hover:border-indigo-400/40 animate-slide-up group`} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="text-5xl mb-4 animate-float group-hover:scale-110 transition-transform" style={{ animationDelay: `${idx * 0.2}s` }}>{item.icon}</div>
            <h3 className="font-bold text-white mb-2 text-lg">{item.title}</h3>
            <p className="text-sm text-gray-300">{item.desc}</p>
          </div>
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
            <div className="text-sm text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom CTA */}
    <div className="max-w-4xl mx-auto px-6 py-8 text-center animate-fade-in-delay-3">
      <Link to="/impact">
        <button className="btn-outline">View Impact Ledger →</button>
      </Link>
    </div>
  </div>
);

export default Home;
