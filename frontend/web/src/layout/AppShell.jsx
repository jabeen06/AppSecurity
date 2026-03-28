import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Logged-in shell: persistent nav so every spec screen (Dashboard, Meeting, Role selection, OR, Guidelines, Conduct, Admin) is one click away.
 */
export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => `app-nav-link${isActive ? ' app-nav-link--active' : ''}`;

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/dashboard" className="app-brand">
            <BrandLogo variant="header" />
            <span className="app-brand__text">The Oratory Guild</span>
          </NavLink>
          <nav className="app-nav" aria-label="Main">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/club" className={linkClass}>
              Club
            </NavLink>
            <NavLink to="/meeting" className={linkClass}>
              Meeting
            </NavLink>
            <NavLink to="/meeting-flow" className={linkClass}>
              Flow
            </NavLink>
            <NavLink to="/timer" className={linkClass}>
              Timer
            </NavLink>
            <NavLink to="/select-role" className={linkClass}>
              Role selection
            </NavLink>
            <NavLink to="/or-tracker" className={linkClass}>
              OR tracker
            </NavLink>
            <NavLink to="/roles" className={linkClass}>
              Role guidelines
            </NavLink>
            <NavLink to="/conduct" className={linkClass}>
              Conduct &amp; oaths
            </NavLink>
            {user?.role === 'admin' ? (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            ) : null}
            <span className="app-user-pill" title={user?.email || ''}>
              <span className="app-user-pill__name">{user?.name || 'Guilder'}</span>
            </span>
            <button type="button" className="btn-ghost app-logout" onClick={onLogout}>
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
      <footer className="app-footer">The Oratory Guild · Public speaking &amp; leadership · Classes 6–8</footer>
    </div>
  );
}
