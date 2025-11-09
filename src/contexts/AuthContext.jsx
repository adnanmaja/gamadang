import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const login = useCallback((userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  // Listen for storage changes 
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
      setCurrentUser(authService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = useMemo(() => ({
    isLoggedIn,
    currentUser,
    login,
    logout
  }), [isLoggedIn, currentUser, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};