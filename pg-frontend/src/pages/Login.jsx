import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { darkMode, login, user } = useApp();
  const navigate = useNavigate();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPass] = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/redirect');
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  const bg   = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const txt  = darkMode ? 'text-white' : 'text-gray-900';
  const sub  = darkMode ? 'text-gray-300' : 'text-gray-600';
  const inp  = darkMode
    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
    : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 ${bg}`}>
      <div className="max-w-md w-full mx-auto px-4">
        <div className={`rounded-2xl border p-8 shadow-lg ${card}`}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600
              flex items-center justify-center mx-auto mb-4">
              <Home className="w-7 h-7 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${txt}`}>Welcome Back</h1>
            <p className={`text-sm mt-1 ${sub}`}>Sign in to your ComfortPG account</p>
          </div>

          {/* Demo credentials hint */}
          <div className={`mb-6 p-3 rounded-xl text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
            <p className="font-medium mb-1">Demo accounts:</p>
            <p>Student: student@comfortpg.com / student123</p>
            <p>Owner: owner@comfortpg.com / owner123</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email" required
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-500 ${inp}`} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-500 ${inp}`} />
                <button type="button" onClick={() => setShowPass(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className={`text-sm ${sub}`}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-500 font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;