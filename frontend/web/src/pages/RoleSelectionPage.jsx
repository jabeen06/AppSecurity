import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

function isGodRole(roleKey) {
  return roleKey === 'god';
}

/** Students choose one open role; G.O.D locked until ORLevel >= 3. */
export default function RoleSelectionPage() {
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [submittingRole, setSubmittingRole] = useState('');

  const loadUpcoming = async () => {
    const { data } = await apiClient.get('/meetings/upcoming');
    setMeeting(data.meeting);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        await loadUpcoming();
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load meeting.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectRole = async (roleKey) => {
    if (!meeting) return;
    setSubmittingRole(roleKey);
    setError('');
    try {
      await apiClient.post(`/meetings/${meeting.id}/select-role`, { roleKey });
      await refreshMe();
      await loadUpcoming();
    } catch (e) {
      setError(e?.response?.data?.message || 'Role selection failed.');
    } finally {
      setSubmittingRole('');
    }
  };

  const myRoleKey = meeting?.myRoleKey || null;
  const openRoles = meeting?.openRoles || [];

  return (
    <div className="container">
      <div className="title">Role selection</div>
      <p className="muted" style={{ marginTop: 0 }}>
        Pick one open role for the upcoming meeting. G.O.D requires OR level ≥ 3.
      </p>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !meeting ? (
        <div className="muted">No upcoming meeting scheduled.</div>
      ) : (
        <div className="col">
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Next meeting</div>
            <div style={{ marginTop: 6 }}>Date: {meeting.date}</div>
            <div style={{ marginTop: 6 }}>Time: {meeting.time}</div>
            {myRoleKey ? (
              <div className="pill pill-ok" style={{ marginTop: 10 }}>
                Your role: {myRoleKey}
              </div>
            ) : (
              <div className="muted" style={{ marginTop: 10 }}>
                Choose one open role below.
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Open roles</div>
            {openRoles.length === 0 ? (
              <div className="muted">No roles left open.</div>
            ) : (
              <div className="row">
                {openRoles.map((rk) => {
                  const lockedForGod = isGodRole(rk) && (user?.orLevel || 1) < 3;
                  const disabled = !!myRoleKey || lockedForGod || (!!submittingRole && submittingRole !== rk);
                  return (
                    <div key={rk} className="card" style={{ padding: 12, minWidth: 240, flex: '1 1 240px', opacity: disabled ? 0.65 : 1 }}>
                      <div style={{ fontWeight: 900 }}>{rk}</div>
                      {lockedForGod ? (
                        <div className="error" style={{ marginTop: 6 }}>Locked until OR level ≥ 3</div>
                      ) : (
                        <div className="muted" style={{ marginTop: 6 }}>Available</div>
                      )}
                      <div style={{ marginTop: 12 }}>
                        <button className="btn" type="button" disabled={disabled} onClick={() => onSelectRole(rk)}>
                          {submittingRole === rk ? 'Selecting…' : lockedForGod ? 'Locked' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
