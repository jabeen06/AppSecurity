import React from 'react';
import { Link } from 'react-router-dom';
import { VOTING_RULES } from '../constants/policies.js';

export default function ConductAndOathsPage() {
  const code = ['Respect all speakers.', 'No interruptions.', 'Constructive feedback only.', 'Maintain discipline.'];
  const openingOath =
    'Opening Oath (G.O.D): I pledge to conduct this meeting fairly, maintain discipline, and guide every speaker with respect.';
  const closingOath =
    'Closing Oath (All members): We pledge to listen attentively, speak with courage, and give constructive feedback that helps us grow.';

  return (
    <div className="container">
      <div className="title">Code of Conduct & Oaths</div>
      <div className="card">
        <div style={{ fontWeight: 900 }}>Code of Conduct</div>
        <div style={{ marginTop: 8 }}>
          {code.map((line) => (
            <div key={line}>• {line}</div>
          ))}
        </div>

        <div style={{ fontWeight: 900, marginTop: 14 }}>Voting rules (recognition)</div>
        <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
          No in-app voting—Ballot Steward runs this live. Eligibility for awards:
        </p>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Awards</div>
          {VOTING_RULES.awards.map((a) => (
            <div key={a}>• {a}</div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          {VOTING_RULES.rules.map((r) => (
            <div key={r} className="muted" style={{ fontSize: 14 }}>
              • {r}
            </div>
          ))}
        </div>

        <div style={{ fontWeight: 900, marginTop: 14 }}>Oaths</div>
        <div style={{ marginTop: 8 }}>{openingOath}</div>
        <div style={{ marginTop: 8 }}>{closingOath}</div>

        <p className="muted" style={{ marginTop: 14, marginBottom: 0, fontSize: 13 }}>
          Use the <Link to="/timer">Chronomaster timer</Link> for Green/Yellow/Red signals during speeches.
        </p>
      </div>
    </div>
  );
}

