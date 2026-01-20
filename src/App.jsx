import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AddBook from './components/AddBook';
import BookList from './components/BookList';
import ImpactLedger from './components/ImpactLedger';
import Home from './components/Home';
import Login from './components/Login';
import Navigation from './components/Navigation';
import QrExchangeScanner from './components/QrExchangeScanner';
import { subscribeToAuth } from './firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    const unsub = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user && !loading && location.pathname !== '/') {
      navigate('/');
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center">
          <p className="text-slate-700 font-semibold">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-light text-slate-900">
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light text-slate-900">
      <Navigation user={user} />
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border transition-opacity duration-200 ${
            toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddBook user={user} showToast={showToast} />} />
        <Route path="/books" element={<BookList user={user} />} />
        <Route path="/scan" element={<QrExchangeScanner user={user} showToast={showToast} />} />
        <Route path="/impact" element={<ImpactLedger />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
