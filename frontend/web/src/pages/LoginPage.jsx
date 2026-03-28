import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatApiError } from '../api/formatApiError.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    if (location.state?.registered) {
      setBanner('Account created. Please sign in with your school email (username) and password.');
    }
  }, [location.state]);

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-brand">
          <BrandLogo variant="auth" />
          <h1 className="auth-brand__title">The Oratory Guild</h1>
          <p className="auth-brand__tagline">Sign in with your school email</p>
        </div>
        <div className="auth-card">
          <div className="col">
            {banner ? <div className="pill pill-ok">{banner}</div> : null}
            <label htmlFor="login-email">School email (username)</label>
            <input id="login-email" value={email} autoCapitalize="none" autoComplete="username" onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
            {error ? <div className="error">{error}</div> : null}
            <button type="button" className="btn" style={{ width: '100%' }} disabled={loading || !email || !password} onClick={onSubmit}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </div>
        <p className="auth-footer">
          New guilder? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

