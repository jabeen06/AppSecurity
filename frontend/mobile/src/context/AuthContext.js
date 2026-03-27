import React, { createContext, useContext, useMemo, useState } from 'react';
import { apiClient, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: '', user: null });

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    setAuthToken(data.token);
    setAuth({ token: data.token, user: data.user });
  };

  const register = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    setAuthToken(data.token);
    setAuth({ token: data.token, user: data.user });
  };

  const logout = () => {
    setAuthToken('');
    setAuth({ token: '', user: null });
  };

  const value = useMemo(() => ({ ...auth, login, register, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
