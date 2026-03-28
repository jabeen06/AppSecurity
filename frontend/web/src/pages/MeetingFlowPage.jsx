import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  'Opening by G.O.D',
  'Role introduction',
  'Word & Idiom of the Day',
  'Prepared speeches (OR)',
  'Evaluations',
  'Table topics',
  'Role reports',
  'General evaluation',
  'Voting',
  'Closing oath (all members)'
];

export default function MeetingFlowPage() {
  return (
    <div className="container">
      <p className="section-label">Agenda</p>
      <h1 className="title">Meeting structure</h1>
      <p className="page-lead">Typical flow for a session. Your G.O.D may adjust order slightly; this is the learning map.</p>

      <div className="card card--interactive" style={{ marginBottom: 16 }}>
        <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 2, fontWeight: 700 }}>
          {STEPS.map((label, i) => (
            <li key={label} style={{ marginBottom: 4 }}>
              {i + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="card card--accent">
        <div style={{ fontWeight: 800 }}>Related</div>
        <p style={{ margin: '8px 0 0' }}>
          <Link to="/roles">Role guidelines</Link>
          {' · '}
          <Link to="/timer">Chronomaster timer</Link>
          {' · '}
          <Link to="/conduct">Conduct &amp; oaths</Link>
        </p>
      </div>
    </div>
  );
}
