import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient.js';
import { formatApiError } from '../api/formatApiError.js';

function chipStyle(selected) {
  return selected
    ? { background: '#e3f2fd', borderColor: '#0b6cff', color: '#0b6cff' }
    : { background: '#fff', borderColor: '#d2d9f0', color: '#14213d' };
}

export default function AdminPanelPage() {
  const [admins, setAdmins] = useState([]);
  const [guilders, setGuilders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [adminEmail, setAdminEmail] = useState('');

  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [assignMeetingId, setAssignMeetingId] = useState('');
  const [assignStudentEmail, setAssignStudentEmail] = useState('');
  const [assignRoleKey, setAssignRoleKey] = useState('');

  const [orEmail, setOrEmail] = useState('');
  const [orStage, setOrStage] = useState('1');

  const load = async () => {
    const [adminsRes, guildersRes, rolesRes, meetingsRes] = await Promise.all([
      apiClient.get('/admin/admins'),
      apiClient.get('/admin/guilders'),
      apiClient.get('/roles'),
      apiClient.get('/meetings')
    ]);
    setAdmins(adminsRes.data.admins || []);
    setGuilders(guildersRes.data.users || []);
    setRoles(rolesRes.data.roles || []);
    setMeetings(meetingsRes.data.meetings || []);
  };

  const copyMeetingSms = async (meetingId) => {
    setError('');
    setSuccess('');
    try {
      const { data } = await apiClient.get(`/admin/meetings/${meetingId}/sms-template`);
      const text = data.text || '';
      await navigator.clipboard.writeText(text);
      setError('');
      // brief success via error line is confusing; use alert for clarity
      window.alert(`Copied to clipboard:\n${text}`);
    } catch (e) {
      setError(formatApiError(e) || 'Could not load SMS text.');
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        await load();
      } catch (e) {
        if (mounted) setError(formatApiError(e) || 'Failed to load admin data.');
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

  const toggleRole = (key) => {
    setSelectedRoles((prev) => (prev.includes(key) ? prev.filter((r) => r !== key) : prev.concat([key])));
  };

  const addAdmin = async () => {
    setError('');
    setSuccess('');
    try {
      await apiClient.post('/admin/admins', { email: adminEmail });
      setAdminEmail('');
      setSuccess('Admin added.');
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to add admin.');
    }
  };

  const removeAdmin = async (email) => {
    setError('');
    setSuccess('');
    try {
      await apiClient.delete(`/admin/admins/${encodeURIComponent(email)}`);
      setSuccess('Admin removed.');
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to remove admin.');
    }
  };

  const createMeeting = async () => {
    setError('');
    setSuccess('');
    if (!meetingDate || !meetingTime || selectedRoles.length === 0) {
      setError('Provide meeting date, time, and at least one available role.');
      return;
    }
    try {
      await apiClient.post('/meetings', { date: meetingDate.trim(), time: meetingTime.trim(), availableRoles: selectedRoles });
      setSelectedRoles([]);
      setMeetingDate('');
      setMeetingTime('');
      setSuccess('Meeting created. It appears in Meeting info and role selection.');
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to create meeting.');
    }
  };

  const assignRole = async () => {
    setError('');
    setSuccess('');
    if (!assignMeetingId.trim() || !assignStudentEmail.trim() || !assignRoleKey) {
      setError('Choose a meeting, student school email (username), and role.');
      return;
    }
    try {
      await apiClient.post(`/meetings/${assignMeetingId.trim()}/assign-role`, {
        email: assignStudentEmail.trim().toLowerCase(),
        roleKey: assignRoleKey
      });
      setAssignStudentEmail('');
      setSuccess('Role assigned.');
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to assign role.');
    }
  };

  const markOrComplete = async () => {
    setError('');
    setSuccess('');
    const stage = Number(orStage);
    if (!orEmail.trim() || Number.isNaN(stage) || stage < 1 || stage > 5) {
      setError('Enter student email and OR stage 1–5.');
      return;
    }
    try {
      await apiClient.post('/admin/users/complete-or-by-email', {
        email: orEmail.trim().toLowerCase(),
        stage
      });
      setSuccess(`OR progress saved through stage ${stage} for that student.`);
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to update OR.');
    }
  };

  return (
    <div className="container">
      <div className="title">Admin panel</div>
      {loading ? <div>Loading...</div> : null}
      {success ? <div className="pill pill-ok" style={{ marginBottom: 12 }}>{success}</div> : null}
      {error ? <div className="error" style={{ marginBottom: 12 }}>{error}</div> : null}

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Guilders (registered participants)</div>
        <p className="muted" style={{ marginTop: 0 }}>
          Use phone numbers with your school SMS gateway if required. Below: copy standard meeting reminder text per session.
        </p>
        {guilders.length === 0 ? (
          <div className="muted">No students registered yet.</div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 220, border: '1px solid #d2d9f0', borderRadius: 10, padding: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #d2d9f0' }}>
                  <th style={{ padding: 6 }}>Name</th>
                  <th style={{ padding: 6 }}>Class</th>
                  <th style={{ padding: 6 }}>Email</th>
                  <th style={{ padding: 6 }}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {guilders.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eef1f8' }}>
                    <td style={{ padding: 6, fontWeight: 700 }}>{u.name}</td>
                    <td style={{ padding: 6 }}>
                      {u.classGrade}-{u.section}
                    </td>
                    <td style={{ padding: 6 }}>{u.email}</td>
                    <td style={{ padding: 6 }}>{u.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ fontWeight: 900, marginTop: 14, marginBottom: 8 }}>Meeting SMS reminder</div>
        <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
          Copies: &quot;The Oratory Guild meeting is on [date] at [time].&quot; Paste into your SMS tool and send to guilders.
        </p>
        <div className="col" style={{ gap: 8 }}>
          {meetings.length === 0 ? (
            <div className="muted">Create a meeting first.</div>
          ) : (
            meetings.map((m) => (
              <div key={m.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 800 }}>
                  {m.date} {m.time}
                </span>
                <button type="button" className="btn-ghost" onClick={() => copyMeetingSms(m.id)}>
                  Copy SMS text
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Admin list (school email = username)</div>
        <p className="muted" style={{ marginTop: 0 }}>If a user&apos;s email is in this list, they are an admin after sign-in.</p>
        <div className="row">
          <input value={adminEmail} autoCapitalize="none" placeholder="School email" onChange={(e) => setAdminEmail(e.target.value)} />
          <button className="btn" disabled={!adminEmail} onClick={addAdmin} type="button">Add</button>
        </div>

        <div style={{ marginTop: 12 }}>
          {admins.length === 0 ? (
            <div className="muted">No admins configured.</div>
          ) : (
            admins.map((a) => (
              <div key={a.id || a.email} className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 900 }}>{a.email}</div>
                <button className="btn" style={{ background: '#c1121f' }} onClick={() => removeAdmin(a.email)} type="button">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Assign role to student</div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {meetings.map((m) => (
            <button
              key={m.id}
              type="button"
              className="btn-ghost"
              style={{
                ...(chipStyle(assignMeetingId === m.id)),
                margin: 0,
                padding: '10px 12px',
                borderRadius: 10
              }}
              onClick={() => setAssignMeetingId(m.id)}
            >
              {m.date} {m.time}
            </button>
          ))}
        </div>
        <label>Meeting ID</label>
        <input value={assignMeetingId} onChange={(e) => setAssignMeetingId(e.target.value)} placeholder="UUID" autoCapitalize="none" />
        <label style={{ marginTop: 10 }}>Student school email (username)</label>
        <input value={assignStudentEmail} onChange={(e) => setAssignStudentEmail(e.target.value)} autoCapitalize="none" />
        <div style={{ marginTop: 10, fontWeight: 900 }}>Role</div>
        <div className="row" style={{ marginTop: 10 }}>
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              className="btn-ghost"
              style={{ ...(chipStyle(assignRoleKey === r.key)), margin: 0, padding: '10px 12px', borderRadius: 999 }}
              onClick={() => setAssignRoleKey(r.key)}
            >
              {r.key}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <button className="btn" onClick={assignRole} type="button">Assign role</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Mark OR stage complete</div>
        <label>Student school email</label>
        <input value={orEmail} onChange={(e) => setOrEmail(e.target.value)} autoCapitalize="none" />
        <label style={{ marginTop: 10 }}>Stage (1–5)</label>
        <input type="number" min={1} max={5} value={orStage} onChange={(e) => setOrStage(e.target.value)} />
        <p className="muted" style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
          Saving stage N also marks OR-1 … OR-N complete for that student (admin shortcut).
        </p>
        <div style={{ marginTop: 14 }}>
          <button className="btn" onClick={markOrComplete} type="button">Save OR progress</button>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Create upcoming meeting</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label htmlFor="admin-meeting-date">Date</label>
            <input
              id="admin-meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-meeting-time">Time (24h)</label>
            <input
              id="admin-meeting-time"
              type="time"
              step={60}
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>
        </div>
        <p className="muted" style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
          Pick date and time, then select one or more role chips. The Meeting tab shows the earliest session from{' '}
          <strong>today</strong> onward (server date). Set <code>TZ</code> on the API host if &quot;today&quot; should match your school timezone.
        </p>

        <div style={{ marginTop: 14, fontWeight: 900 }}>Available roles</div>
        <div className="row" style={{ marginTop: 10 }}>
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              className="btn-ghost"
              style={{ ...(chipStyle(selectedRoles.includes(r.key))), margin: 0, padding: '10px 12px', borderRadius: 999 }}
              onClick={() => toggleRole(r.key)}
            >
              {r.key}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btn" onClick={createMeeting} type="button">
            Create meeting
          </button>
        </div>
      </div>
    </div>
  );
}
