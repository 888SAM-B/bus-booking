
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

// Safe JWT parse for client-side token payload extraction
function parseJwt(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(b64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Try to restore user from stored token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // parse token payload (safe decode)
        const payload = parseJwt(token);
        if (payload && payload.id) {
          setUser({ id: payload.id, name: payload.name || '', email: payload.email || '', role: payload.role || 'PASSENGER' });
        }
      }
    } catch (e) {
      // ignore parse errors and keep user null
    }
    finally {
      setInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<User> => {
    setLoading(true);
    try {
      const res: any = await api.login(email, password, role);
      // api.login returns { token, user }
      if (res && res.token) {
        try { localStorage.setItem('token', res.token); } catch (e) { /* ignore */ }
      }
      const loggedInUser = res && res.user ? res.user : res;
      setUser(loggedInUser as User);
      return loggedInUser as User;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    setLoading(true);
    try {
      const res: any = await api.register(name, email, role, password);
      const newUser = res && res.user ? res.user : res;
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try { localStorage.removeItem('token'); } catch (e) { }
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, initialized, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
