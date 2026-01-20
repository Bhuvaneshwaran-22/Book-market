import { useState } from 'react';
import { signInWithGoogle } from '../firebase/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light text-slate-900 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-sm w-full">
        {/* Logo Section */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 animate-float">
            BM
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 animate-slide-up">
            BOOK MARKET
          </h1>
          <p className="text-slate-600 text-lg animate-fade-in-delay-1">Campus-only, trust-first textbook exchange</p>
        </div>

        {/* Glass Card */}
        <div className="glass-card p-12 rounded-2xl mb-6 animate-slide-up">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center animate-fade-in-delay-2">Sign in to your campus</h2>
          
          {/* Info Box */}
          <div className="bg-indigo-500/10 border border-indigo-200 rounded-lg p-4 mb-8 animate-fade-in-delay-3 transition-smooth hover:bg-indigo-500/20 hover:border-indigo-300">
            <p className="text-sm text-indigo-700">
              ✓ Campus verified sign-in<br/>
              ✓ Only .edu, .com, and gmail.com emails<br/>
              ✓ Your data is secure
            </p>
          </div>

          {/* Google Sign In Button */}
          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-semibold mb-4 transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-delay-3"
          >
            {loading ? '🔄 Checking email…' : '👤 Continue with Google'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-slide-down">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-xs animate-fade-in-delay-4">
          <p>By signing in, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
