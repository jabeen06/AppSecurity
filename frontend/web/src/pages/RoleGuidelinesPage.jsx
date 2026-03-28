import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient.js';

export default function RoleGuidelinesPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get('/roles');
        if (mounted) setRoles(data.roles || []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load roles.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="title">Role Guidelines</div>
      {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 12 }}>
        {roles.map((role) => (
          <div key={role.key} className="card">
            <div style={{ fontWeight: 900 }}>{role.title}</div>
            <div className="muted" style={{ marginTop: 6 }}>
              Responsibilities: {role.responsibilities?.[0] || ''}
            </div>
            <div style={{ marginTop: 10 }}>
              <Link to={`/roles/${role.key}`} className="btn-ghost" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Full details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

