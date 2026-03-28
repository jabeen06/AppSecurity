import React from 'react';
import { Navigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AppShell from './AppShell.jsx';

/** Ensures JWT + /users/me loaded before rendering the main app chrome. */
export default function RequireUser() {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!user) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <BrandLogo variant="inline" />
        <div className="app-loading__spinner" aria-hidden />
        Loading your profile…
      </div>
    );
  }

  return <AppShell />;
}
