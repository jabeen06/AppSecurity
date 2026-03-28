import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TIMER_MODES, currentPhase, formatElapsed } from '../constants/timerPresets.js';

export default function TimerPage() {
  const [modeId, setModeId] = useState(TIMER_MODES[0].id);
  const mode = useMemo(() => TIMER_MODES.find((m) => m.id === modeId) || TIMER_MODES[0], [modeId]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  const { phase, index } = currentPhase(mode, elapsed);
  const lastEnd = mode.phases[mode.phases.length - 1].endSec;
  const progress = Math.min(1, elapsed / lastEnd);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <div className="container">
      <p className="section-label">Meeting tool</p>
      <h1 className="title">Chronomaster timer</h1>
      <p className="page-lead">Count-up timer with Green, Yellow, Red, and Grace. Pause anytime during club meetings.</p>

      <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {TIMER_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`btn-ghost${modeId === m.id ? ' btn-ghost--selected' : ''}`}
            onClick={() => {
              reset();
              setModeId(m.id);
            }}
          >
            {m.title}
          </button>
        ))}
      </div>

      <div
        className="card card--interactive"
        style={{
          textAlign: 'center',
          padding: '28px 20px',
          borderColor: phase.color,
          borderWidth: 3,
          background: `${phase.color}14`
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: phase.color, letterSpacing: 1 }}>{phase.name.toUpperCase()}</div>
        <div style={{ fontSize: 56, fontWeight: 900, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{formatElapsed(elapsed)}</div>
        <div style={{ marginTop: 12, height: 12, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: phase.color, transition: 'width 0.3s ease' }} />
        </div>
        <div className="muted" style={{ marginTop: 14, fontSize: 13 }}>
          Phase {index + 1} of {mode.phases.length}
          {elapsed >= lastEnd ? ' · Past grace — wrap up' : ` · Next signal at ${formatElapsed(phase.endSec)}`}
        </div>
      </div>

      <div className="row" style={{ marginTop: 16, gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="card card--flat" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Signals for this mode</div>
        <div className="col" style={{ gap: 6 }}>
          {mode.phases.map((p) => (
            <div key={p.name} className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, color: p.color }}>{p.name}</span>
              <span className="muted">until {formatElapsed(p.endSec)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
