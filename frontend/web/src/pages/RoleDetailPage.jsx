import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/apiClient.js';
import { TIMING_RULES, VOTING_RULES } from '../constants/policies.js';

export default function RoleDetailPage() {
  const { roleKey } = useParams();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get(`/roles/${roleKey}`);
        if (mounted) setRole(data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load role.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [roleKey]);

  return (
    <div className="container">
      <div className="title">Role Details</div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !role ? (
        <div className="muted">Role not found.</div>
      ) : (
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 20 }}>{role.title}</div>

          <div style={{ fontWeight: 900, marginTop: 14 }}>Responsibilities</div>
          <div style={{ marginTop: 6 }}>
            {role.responsibilities?.map((r) => (
              <div key={r}>• {r}</div>
            ))}
          </div>

          <div style={{ fontWeight: 900, marginTop: 14 }}>Skills Developed</div>
          <div style={{ marginTop: 6 }}>
            {role.skills?.map((s) => (
              <div key={s}>• {s}</div>
            ))}
          </div>

          {roleKey === 'chronomaster' ? (
            <>
              <div style={{ fontWeight: 900, marginTop: 16 }}>Timing Rules (Display Only)</div>
              <div style={{ marginTop: 8, fontWeight: 800 }}>Prepared Speeches</div>
              <div style={{ marginTop: 6 }}>Green: {TIMING_RULES.preparedSpeech.green}</div>
              <div>Yellow: {TIMING_RULES.preparedSpeech.yellow}</div>
              <div>Red: {TIMING_RULES.preparedSpeech.red}</div>
              <div>Grace: {TIMING_RULES.preparedSpeech.grace}</div>
              <div style={{ marginTop: 10, fontWeight: 800 }}>Evaluations</div>
              <div style={{ marginTop: 6 }}>Green: {TIMING_RULES.evaluation.green}</div>
              <div>Yellow: {TIMING_RULES.evaluation.yellow}</div>
              <div>Red: {TIMING_RULES.evaluation.red}</div>
              <div>Grace: {TIMING_RULES.evaluation.grace}</div>
            </>
          ) : null}

          {roleKey === 'ttm' ? (
            <>
              <div style={{ fontWeight: 900, marginTop: 16 }}>Table Topics Timing (Display Only)</div>
              <div style={{ marginTop: 6 }}>Green: {TIMING_RULES.tableTopics.green}</div>
              <div>Yellow: {TIMING_RULES.tableTopics.yellow}</div>
              <div>Red: {TIMING_RULES.tableTopics.red}</div>
              <div>Grace: {TIMING_RULES.tableTopics.grace}</div>
            </>
          ) : null}

          {roleKey === 'ballot-steward' ? (
            <>
              <div style={{ fontWeight: 900, marginTop: 16 }}>Voting Rules (Display Only)</div>
              <div style={{ fontWeight: 800, marginTop: 8 }}>Awards</div>
              {VOTING_RULES.awards.map((a) => (
                <div key={a} style={{ marginTop: 4 }}>
                  • {a}
                </div>
              ))}
              <div style={{ fontWeight: 800, marginTop: 12 }}>Rules</div>
              {VOTING_RULES.rules.map((r) => (
                <div key={r} style={{ marginTop: 4 }}>
                  • {r}
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

