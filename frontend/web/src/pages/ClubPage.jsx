import React from 'react';

export default function ClubPage() {
  return (
    <div className="container">
      <p className="section-label">About us</p>
      <h1 className="title">The Oratory Guild</h1>
      <p className="page-lead">A structured student-led public speaking club for confident, articulate leaders.</p>

      <div className="card card--accent card--interactive" style={{ marginBottom: 16 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.05rem', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Members</h2>
        <p style={{ margin: 0, color: 'var(--ink-muted)' }}>
          We call ourselves <strong style={{ color: 'var(--ink)' }}>Guilders</strong>: students who learn by doing through roles, speeches, and feedback.
        </p>
      </div>

      <div className="card card--interactive" style={{ marginBottom: 16 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.05rem', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Vision</h2>
        <p style={{ margin: 0, color: 'var(--ink-muted)' }}>To nurture confident, articulate, and responsible student leaders.</p>
      </div>

      <div className="card card--interactive">
        <h2 style={{ fontWeight: 800, fontSize: '1.05rem', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Objectives</h2>
        <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75, color: 'var(--ink-muted)' }}>
          <li>Build confidence</li>
          <li>Improve communication</li>
          <li>Develop leadership</li>
          <li>Encourage structured thinking</li>
          <li>Promote discipline and respect</li>
        </ul>
      </div>
    </div>
  );
}
