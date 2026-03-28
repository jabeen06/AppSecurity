import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const statusStyles = {
  Completed: { bg: '#e8f5e9', border: '#1b5e20', color: '#1b5e20' },
  Pending: { bg: '#e3f2fd', border: '#0b6cff', color: '#0b6cff' },
  Locked: { bg: '#f1f2f6', border: '#bdbdbd', color: '#6c757d' }
};

export default function ORTrackerPage() {
  const { user } = useAuth();
  const stages = user?.orProgress || [];

  return (
    <div className="container">
      <div className="title">OR Tracker</div>
      <div className="muted" style={{ fontWeight: 900, marginBottom: 12 }}>
        Current OR Level: {user?.orLevel}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {stages.map((s) => {
          const c = statusStyles[s.status] || statusStyles.Locked;
          return (
            <div key={s.key} className="card" style={{ background: c.bg, borderColor: c.border }}>
              <div style={{ fontWeight: 900, color: c.color, fontSize: 16 }}>{s.title}</div>
              <div style={{ fontWeight: 800, marginTop: 6 }}>Status: {s.status}</div>
              {s.status === 'Locked' ? (
                <div className="muted" style={{ marginTop: 6 }}>Complete earlier OR stages to unlock this stage.</div>
              ) : null}

              <div style={{ fontWeight: 900, marginTop: 12 }}>Objective</div>
              <div>{s.objective}</div>

              <div style={{ fontWeight: 900, marginTop: 12 }}>Structure</div>
              <div style={{ marginTop: 6 }}>Intro: {s.structure.intro}</div>
              <div style={{ marginTop: 6 }}>Body: {s.structure.body}</div>
              <div style={{ marginTop: 6 }}>Conclusion: {s.structure.conclusion}</div>

              <div style={{ fontWeight: 900, marginTop: 12 }}>Time Limit (Prepared Speech)</div>
              <div style={{ marginTop: 6 }}>Green: {s.timeLimit.preparedSpeech.green}</div>
              <div style={{ marginTop: 6 }}>Yellow: {s.timeLimit.preparedSpeech.yellow}</div>
              <div style={{ marginTop: 6 }}>Red: {s.timeLimit.preparedSpeech.red}</div>
              <div style={{ marginTop: 6 }}>Grace: {s.timeLimit.preparedSpeech.grace}</div>

              <div style={{ fontWeight: 900, marginTop: 12 }}>Evaluation Time Limit</div>
              <div style={{ marginTop: 6 }}>Green: {s.timeLimit.evaluation.green}</div>
              <div style={{ marginTop: 6 }}>Yellow: {s.timeLimit.evaluation.yellow}</div>
              <div style={{ marginTop: 6 }}>Red: {s.timeLimit.evaluation.red}</div>
              <div style={{ marginTop: 6 }}>Grace: {s.timeLimit.evaluation.grace}</div>

              <div style={{ fontWeight: 900, marginTop: 12 }}>Evaluation Focus</div>
              <div style={{ marginTop: 6 }}>
                {s.evaluationFocus.map((f) => (
                  <div key={f}>• {f}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
