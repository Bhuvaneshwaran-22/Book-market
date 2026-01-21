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

  const linkBase = 'relative text-sm font-semibold px-3 py-2 rounded-lg transition duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus:outline-none';
  const activeClasses = 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30';
  const inactiveClasses = 'text-slate-300 border border-transparent hover:text-slate-50 hover:bg-white/5 hover:border-white/10';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/8 shadow-xl animate-slide-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity group">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-slate-50 font-bold text-lg group-hover:scale-110 transition-transform shadow-lg">
            BM
          </div>
          <div>
            <div className="font-bold text-slate-50 text-lg tracking-tight">BOOK MARKET</div>
            <div className="text-xs text-slate-400 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Exchange</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2 flex-1 ml-12">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkBase} ${active ? activeClasses : inactiveClasses}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 shadow-lg"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4 ml-auto animate-fade-in-delay-1">
          {/* Impact Badge */}
          <Link to="/impact" className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-lg hover:border-indigo-500/50 transition-all">
            <div>
              <div className="text-xs text-indigo-400 font-semibold">Impact</div>
              <div className="text-xs font-bold text-emerald-400">View →</div>
            </div>
          </Link>

          {/* User Info */}
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-50">{user?.displayName}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>

          {/* Sign Out Button */}
          <button 
            onClick={signOutUser} 
            className="btn-outline text-sm hover:scale-105 active:scale-95 transition-transform"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
