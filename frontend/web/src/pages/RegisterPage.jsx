import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatApiError } from '../api/formatApiError.js';

const CLASSES = ['6', '7', '8'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('6');
  const [section, setSection] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => name && section && phoneNumber && email && password && confirm, [
    name,
    section,
    phoneNumber,
    email,
    password,
    confirm
  ]);

  const onSubmit = async () => {
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!canSubmit) return;
    setLoading(true);
    try {
      await register({ name, studentClass, section, phoneNumber, email, password });
      navigate('/login', { state: { registered: true } });
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner auth-card--wide">
        <div className="auth-brand">
          <BrandLogo variant="auth" />
          <h1 className="auth-brand__title">Join the Guild</h1>
          <p className="auth-brand__tagline">Register with your school details</p>
        </div>
        <div className="auth-card">
          <div className="col">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} autoCapitalize="words" />

          <label>Class</label>
          <div className="row">
            {CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn-ghost${studentClass === c ? ' btn-ghost--selected' : ''}`}
                onClick={() => setStudentClass(c)}
              >
                Class {c}
              </button>
            ))}
          </div>

          <label>Section</label>
          <input value={section} onChange={(e) => setSection(e.target.value)} />

          <label>Phone Number (required)</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <p className="muted" style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>
            Optional SMS verification may be enabled by your school later; for now, your number helps admins send meeting reminders.
          </p>

          <label>School email (username — used to sign in and for admin access)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" />

          <label>Password (min 8)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <label>Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

          {error ? <div className="error">{error}</div> : null}

          <button className="btn" style={{ width: '100%' }} disabled={loading || !canSubmit} onClick={onSubmit} type="button">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          </div>
        </div>
        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

