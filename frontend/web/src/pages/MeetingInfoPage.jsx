import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MeetingInfoPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get('/meetings/upcoming');
        if (mounted) setMeeting(data.meeting);
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
  }, [user?.id]);

  return (
    <div className="container">
      <div className="title">Meeting Info</div>
      <p className="muted" style={{ marginTop: 0 }}>
        <Link to="/meeting-flow">Meeting flow (order of segments)</Link>
        {' · '}
        <Link to="/timer">Chronomaster timer</Link>
      </p>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !meeting ? (
        <div className="muted">No upcoming meeting scheduled.</div>
      ) : (
        <div className="col">
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 900 }}>Next Meeting</div>
            <div style={{ marginTop: 6 }}>Date: {meeting.date}</div>
            <div style={{ marginTop: 6 }}>Time: {meeting.time}</div>
            {meeting.myRoleKey ? <div className="pill pill-ok" style={{ marginTop: 10 }}>Your role: {meeting.myRoleKey}</div> : <div className="muted" style={{ marginTop: 10 }}>You have not selected a role yet.</div>}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Open Roles</div>
            {meeting.openRoles.length === 0 ? (
              <div className="muted">No roles are left open.</div>
            ) : (
              <div className="row">
                {meeting.openRoles.map((rk) => (
                  <div key={rk} className="pill" style={{ borderColor: '#0b6cff' }}>
                    {rk}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Assigned Roles</div>
            {meeting.assignedRoles.length === 0 ? (
              <div className="muted">No roles assigned yet.</div>
            ) : (
              <div className="col">
                {meeting.assignedRoles.map((a) => (
                  <div key={`${a.roleKey}-${a.userId}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontWeight: 900 }}>{a.roleKey}</div>
                    <div className="pill">{a.userEmail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

