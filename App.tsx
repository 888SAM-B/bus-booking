
import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchBusesPage from './pages/SearchBusesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search-buses" element={
                  <ProtectedRoute roles={['PASSENGER']}>
                    <SearchBusesPage />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/book/:busId" element={
                  <ProtectedRoute roles={['PASSENGER']}>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/confirmation" element={
                  <ProtectedRoute roles={['PASSENGER']}>
                    <ConfirmationPage />
                  </ProtectedRoute>
                } />
                <Route path="/owner-dashboard" element={
                  <ProtectedRoute roles={['BUS_OWNER']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};


interface ProtectedRouteProps {
  children: React.ReactElement;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const { initialized } = useAuth();

  // while auth is initializing (restoring token), don't redirect — render nothing
  if (!initialized) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default App;
