import { Link, useLocation } from 'react-router-dom';
import { signOutUser } from '../firebase/auth';

const Navigation = ({ user }) => {
  const { pathname } = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/add', label: 'Add Book' },
    { to: '/books', label: 'Browse' },
    { to: '/scan', label: 'Scan QR' },
    { to: '/impact', label: 'Impact' },
  ];

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  const linkBase = 'relative text-sm font-semibold px-3 py-2 rounded-full transition duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none border';
  const activeClasses = 'text-indigo-700 bg-indigo-50 shadow-md border-indigo-100';
  const inactiveClasses = 'text-slate-600 border-transparent hover:text-indigo-600 hover:bg-white/80';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/70 shadow-[0_10px_40px_rgba(15,23,42,0.08)] animate-slide-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-smooth group">
          <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
            BM
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg tracking-tight">BOOK MARKET</div>
            <div className="text-xs text-slate-500 inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live campus exchange</span>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-4 flex-1 ml-12">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkBase} ${active ? activeClasses : inactiveClasses}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative">
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300 shadow-[0_8px_20px_rgba(99,102,241,0.35)]" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4 ml-auto animate-fade-in-delay-1">
          <Link to="/impact" className="text-right hidden sm:block glass-card px-3 py-2 rounded-lg hover-glow transition-smooth">
            <div className="text-xs text-indigo-500 font-semibold">Impact Score</div>
            <div className="text-sm font-bold text-emerald-500">View</div>
          </Link>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-900">{user?.displayName}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button onClick={signOutUser} className="btn-outline text-sm transition-smooth hover:scale-105 active:scale-95">Sign out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
