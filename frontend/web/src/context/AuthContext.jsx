import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient, setAuthToken } from '../api/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  const refreshMe = async () => {
    const { data } = await apiClient.get('/users/me');
    setUser(data.user);
  };

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    refreshMe().catch(() => {
      setToken('');
      localStorage.removeItem('token');
      setUser(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    await refreshMe();
  };

  /** Register only — no session until login. */
  const register = async (payload) => {
    await apiClient.post('/auth/register', payload);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setAuthToken('');
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout, refreshMe }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

