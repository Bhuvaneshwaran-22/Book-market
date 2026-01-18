import { Link } from 'react-router-dom';
import { signOutUser } from '../firebase/auth';

const Navigation = ({ user }) => (
  <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg animate-slide-down">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-smooth group">
        <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
          BM
        </div>
        <div>
          <div className="font-bold text-white text-lg">BOOK MARKET</div>
          <div className="text-xs text-gray-400">Campus Exchange</div>
        </div>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 flex-1 ml-12">
        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-smooth hover:scale-110 inline-block">Home</Link>
        <Link to="/add" className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-smooth hover:scale-110 inline-block">Add Book</Link>
        <Link to="/books" className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-smooth hover:scale-110 inline-block">Browse</Link>
        <Link to="/scan" className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-smooth hover:scale-110 inline-block">Scan QR</Link>
        <Link to="/impact" className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-smooth hover:scale-110 inline-block">Impact</Link>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4 ml-auto animate-fade-in-delay-1">
        <Link to="/impact" className="text-right hidden sm:block glass-card px-3 py-2 rounded-lg hover-glow transition-smooth">
          <div className="text-xs text-indigo-400 font-semibold">Impact Score</div>
          <div className="text-sm font-bold text-green-400">View</div>
        </Link>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-white">{user?.displayName}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <button onClick={signOutUser} className="btn-outline text-sm transition-smooth hover:scale-105 active:scale-95">Sign out</button>
      </div>
    </div>
  </nav>
);

export default Navigation;
