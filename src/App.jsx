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
  const location = useLocation();
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl">
          <p className="text-white font-semibold">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Login />
      </div>
    );
  }

  return (
    <div className="dark">
      <Navigation user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddBook user={user} />} />
        <Route path="/books" element={<BookList user={user} />} />
        <Route path="/scan" element={<QrExchangeScanner user={user} />} />
        <Route path="/impact" element={<ImpactLedger />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
