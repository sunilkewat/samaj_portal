import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('samaj_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('samaj_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    if (!isAuthLoading) {
      setAuthModalOpen(false);
    }
  };

  const login = async (mobileNumber, password) => {
    setIsAuthLoading(true);
    try {
      const res = await loginUser(mobileNumber, password);
      if (res && res.data) {
        const userObj = {
          id: res.data.user.id,
          mobileNumber: res.data.user.mobileNumber,
          name: res.data.user.profile
            ? `${res.data.user.profile.firstName || ''} ${res.data.user.profile.lastName || ''}`.trim()
            : 'सदस्य',
          gotra: res.data.user.profile?.samajGotra || 'कश्यप',
          city: res.data.user.profile?.city || 'Indore',
          photo: res.data.user.profile?.profilePhoto || null,
        };
        localStorage.setItem('samaj_token', res.data.accessToken);
        localStorage.setItem('samaj_user', JSON.stringify(userObj));
        setAuthToken(res.data.accessToken);
        setCurrentUser(userObj);
        closeAuth();
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setIsAuthLoading(true);
    try {
      const res = await registerUser(userData);
      if (res && res.data) {
        const userObj = {
          id: res.data.user.id,
          mobileNumber: res.data.user.mobileNumber,
          name: `${userData.firstName} ${userData.lastName || ''}`.trim(),
          gotra: userData.samajGotra || 'कश्यप',
          city: userData.city || 'Indore',
          photo: null,
        };
        localStorage.setItem('samaj_token', res.data.accessToken);
        localStorage.setItem('samaj_user', JSON.stringify(userObj));
        setAuthToken(res.data.accessToken);
        setCurrentUser(userObj);
        closeAuth();
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('samaj_token');
    localStorage.removeItem('samaj_user');
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isLoggedIn: Boolean(currentUser),
        authModalOpen,
        authMode,
        isAuthLoading,
        openAuth,
        closeAuth,
        setAuthMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
