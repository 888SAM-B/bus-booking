import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register(name, email, password, role);
      if (user.role === UserRole.ADMIN) navigate('/admin-dashboard');
      else if (user.role === UserRole.BUS_OWNER) navigate('/owner-dashboard');
      else navigate('/search-buses');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[160px] animate-pulse"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10 relative z-10 animate-fadeIn">

        {/* Right Side (Form) First for mobile, but on right for desktop */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-4xl font-black text-white mb-2">Join the Network</h3>
            <p className="text-gray-400">Be part of India's most modern bus network.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-lg text-sm animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                >
                  <option value={UserRole.PASSENGER}>Passenger</option>
                  <option value={UserRole.BUS_OWNER}>Bus Owner</option>
                  <option value={UserRole.ADMIN}>Administrator</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-white/5 text-white p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent w-full py-5 rounded-2xl text-lg font-black mt-6 shadow-xl shadow-orange-500/20 active:scale-95 transition-transform"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:text-orange-500 transition-colors">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>

        {/* Left Side (Illustration) */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-orange-600 to-orange-800 text-white relative overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-6 leading-tight">Start Your <br />Next <span className="text-gray-900">Adventure</span>.</h2>
            <p className="text-xl text-orange-100 mb-12 leading-relaxed opacity-90">
              Whether you're traveling across states or managing a fleet, the best tools are right here.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <div className="text-4xl mb-2">🛣️</div>
                <div className="text-sm font-bold uppercase tracking-widest">Global Routes</div>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-sm font-bold uppercase tracking-widest">Instant Pay</div>
              </div>
            </div>
          </div>

          {/* Decorative Map */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
