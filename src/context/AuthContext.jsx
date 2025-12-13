/**
 * Authentication Context
 * Manages user authentication state across the application
 * Frontend-only version: stores auth data in sessionStorage (no backend required)
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hardcoded demo users (matches previous backend demo credentials)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@construction.com',
    role: 'admin',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh@construction.com',
    role: 'sitemanager',
    password: 'manager123'
  }
];

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (sessionStorage acts as session)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        sessionStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function (frontend-only, validates against mock users)
  const login = async (email, password) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    const { password: _, ...userData } = foundUser;
    sessionStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  };

  // Logout function (clears sessionStorage)
  const logout = async () => {
    sessionStorage.removeItem('auth_user');
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isSiteManager: user?.role === 'sitemanager'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
