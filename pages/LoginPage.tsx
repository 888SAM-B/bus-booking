import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password, role);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin-dashboard');
      } else if (user.role === UserRole.BUS_OWNER) {
        navigate('/owner-dashboard');
      } else {
        navigate('/search-buses');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10 relative z-10 animate-fadeIn">
        {/* Left Side: Illustration & Welcome */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-6 leading-tight">Welcome Back to <br /><span className="text-orange-400">Premium</span> Travel.</h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed opacity-80">
              Log in to access your bookings, manage your fleet, or find your next destination.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-transform hover:scale-105">
                <div className="text-3xl">🎫</div>
                <div>
                  <div className="font-bold">Instant Tickets</div>
                  <div className="text-sm opacity-60">Book and board in under 2 minutes.</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-transform hover:scale-105">
                <div className="text-3xl">🛡️</div>
                <div>
                  <div className="font-bold">Verified Operators</div>
                  <div className="text-sm opacity-60">Every bus is inspected for safety & comfort.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Bus */}
          <div className="absolute -bottom-20 -right-20 text-[15rem] opacity-10 rotate-12">🚌</div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-white mb-2">Member Login</h3>
            <p className="text-gray-400">Enter your credentials to continue your journey.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-lg animate-fadeIn text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none adjust "
              >
                <option value={UserRole.PASSENGER}>👤 Passenger</option>
                <option value={UserRole.BUS_OWNER}>🚌 Bus Owner</option>
                <option value={UserRole.ADMIN}>⚙️ Administrator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent w-full py-5 rounded-2xl text-lg font-black mt-8 shadow-xl shadow-orange-500/20 active:scale-95 transition-transform"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2 w-5 h-5 border-2"></div>
                  Securely Logging in...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500">
              New traveler?{' '}
              <Link to="/register" className="text-white font-bold hover:text-blue-500 transition-colors">
                Create a Free Account
              </Link>
            </p>
          </div>

          {/* Debug Accounts Link (only for development) */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="p-4 bg-white/5 rounded-xl text-xs text-gray-500 italic">
              <strong>Test Credentials:</strong> admin@bus.com / owner@bus.com / user@bus.com (pass: Password123!)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
