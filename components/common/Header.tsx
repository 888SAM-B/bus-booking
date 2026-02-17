import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show header on landing, login, and register pages
  const hideHeader = ['/', '/login', '/register'].includes(location.pathname);

  if (hideHeader) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.ADMIN:
        return { to: '/admin-dashboard', label: 'Admin Dashboard', icon: '⚙️' };
      case UserRole.BUS_OWNER:
        return { to: '/owner-dashboard', label: 'Owner Dashboard', icon: '🚌' };
      case UserRole.PASSENGER:
        return { to: '/search-buses', label: 'Search Buses', icon: '🔍' };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
      ? 'bg-white text-blue-900 shadow-md'
      : 'text-white hover:bg-white/10'
    }`;

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-xl sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to={isAuthenticated ? (dashboardLink?.to || '/') : '/'} className="flex items-center space-x-3 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🚌</div>
            <div>
              <div className="text-white text-xl font-bold">BusBooking</div>
              <div className="text-blue-200 text-xs">Travel Made Easy</div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {dashboardLink && (
                  <NavLink to={dashboardLink.to} className={navLinkClasses}>
                    <span className="mr-2">{dashboardLink.icon}</span>
                    {dashboardLink.label}
                  </NavLink>
                )}

                {/* User Info */}
                <div className="flex items-center ml-4 px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-right mr-3">
                    <div className="text-white font-semibold text-sm">{user?.name}</div>
                    <div className="text-blue-200 text-xs capitalize">{user?.role.toLowerCase().replace('_', ' ')}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded-lg font-semibold transition-all">
                  Login
                </NavLink>
                <NavLink to="/register" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all shadow-md">
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-600 animate-fadeIn">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-white/10 rounded-lg mb-3">
                  <div className="text-white font-semibold">{user?.name}</div>
                  <div className="text-blue-200 text-sm capitalize">{user?.role.toLowerCase().replace('_', ' ')}</div>
                </div>

                {dashboardLink && (
                  <NavLink
                    to={dashboardLink.to}
                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{dashboardLink.icon}</span>
                    {dashboardLink.label}
                  </NavLink>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink
                  to="/login"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;