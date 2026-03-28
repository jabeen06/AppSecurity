import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const statusStyles = {
  Completed: { bg: '#e8f5e9', border: '#1b5e20', color: '#1b5e20' },
  Pending: { bg: '#e3f2fd', border: '#0b6cff', color: '#0b6cff' },
  Locked: { bg: '#f1f2f6', border: '#bdbdbd', color: '#6c757d' }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const orProgress = user?.orProgress || [];
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container">
      <p className="section-label">Your home</p>
      <h1 className="title">Dashboard</h1>
      <p className="page-lead">Track your OR journey, next meeting role, and roles you have performed in past sessions.</p>

      <div className="card card--accent card--interactive" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>Welcome, {user?.name}</div>
        <div style={{ marginTop: 6 }}>Class {user?.classGrade}-{user?.section}</div>
        <div style={{ marginTop: 6 }}>Current OR Level: {user?.orLevel}</div>
        <div style={{ marginTop: 6, fontWeight: 800 }}>
          Account: {isAdmin ? 'Admin (can edit)' : 'Member (read-only)'}
        </div>
        {!isAdmin ? (
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            Admins manage meetings, assign roles, and update OR progress. Your username is your school email.
          </div>
        ) : null}
      </div>

      <p className="section-label">Official Oration</p>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 12px', letterSpacing: '-0.02em' }}>OR progress</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {orProgress.map((stage) => {
          const c = statusStyles[stage.status];
          return (
            <div
              key={stage.key}
              className="card card--interactive"
              style={{
                background: c.bg,
                borderColor: c.border
              }}
            >
              <div style={{ fontWeight: 900, color: c.color }}>{stage.title}</div>
              <div style={{ fontWeight: 800, marginTop: 6 }}>Status: {stage.status}</div>
            </div>
          );
        })}
      </div>

      <p className="section-label" style={{ marginTop: 28 }}>
        Next session
      </p>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Your role for the next meeting</h2>
      <div className="card card--interactive" style={{ marginBottom: 20 }}>
        {user?.upcomingMeetingRole ? (
          <>
            <div style={{ fontWeight: 900 }}>{user.upcomingMeetingRole.roleKey}</div>
            <div className="muted" style={{ marginTop: 6 }}>
              {user.upcomingMeetingRole.date} at {user.upcomingMeetingRole.time}
            </div>
            <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 13 }}>
              This is your signup for the upcoming club session. Use <Link to="/select-role">Role selection</Link> to change it if roles are still open.
            </p>
          </>
        ) : (
          <div className="muted">
            No role reserved for the next meeting yet. Open <Link to="/select-role">Role selection</Link> after your admin posts the agenda.
          </div>
        )}
      </div>

      <p className="section-label">History</p>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Roles performed</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
        Past meetings only—your track record as a Guilder (not the same as your next signup).
      </p>
      <div>
        {(user?.rolesPerformed || []).length === 0 ? (
          <div className="muted">No past club roles yet. After a meeting date passes, roles you took will appear here.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {user.rolesPerformed.map((h, idx) => (
              <div key={`${h.meetingId}-${idx}`} className="card card--interactive">
                <div style={{ fontWeight: 900 }}>{h.roleKey}</div>
                <div style={{ marginTop: 6, color: '#6c757d' }}>
                  {h.meetingDate} at {h.meetingTime}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

