import React, { createContext, useContext, useMemo, useState } from 'react';
import { apiClient, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: '', user: null });

  const refreshMe = async () => {
    const { data } = await apiClient.get('/users/me');
    setAuth((prev) => ({ ...prev, user: data.user }));
  };

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    setAuthToken(data.token);
    setAuth({ token: data.token, user: null });
    await refreshMe();
  };

  /** Register only — no session. User must sign in on the login screen. */
  const register = async (payload) => {
    await apiClient.post('/auth/register', payload);
  };

  const logout = () => {
    setAuthToken('');
    setAuth({ token: '', user: null });
  };

  const value = useMemo(() => ({ ...auth, login, register, logout, refreshMe }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
