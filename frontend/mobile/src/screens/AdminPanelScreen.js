import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { apiClient } from '../services/apiClient';

function formatApiError(e) {
  const d = e?.response?.data;
  if (!d) return e?.message || 'Request failed.';
  if (typeof d.message === 'string' && d.message.trim()) return d.message.trim();
  const fe = d.errors?.fieldErrors;
  if (fe && typeof fe === 'object') {
    const parts = [];
    Object.values(fe).forEach((vals) => {
      if (Array.isArray(vals)) parts.push(...vals.filter(Boolean));
    });
    if (parts.length) return parts.join(' ');
  }
  return 'Request failed.';
}

function ToggleChip({ selected, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{label}</Text>
    </Pressable>
  );
}

export default function AdminPanelScreen() {
  const [admins, setAdmins] = useState([]);
  const [guilders, setGuilders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const shareMeetingSms = async (meetingId) => {
    setError('');
    try {
      const { data } = await apiClient.get(`/admin/meetings/${meetingId}/sms-template`);
      const message = data.text || '';
      await Share.share({ message });
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
  }, []);

  const toggleRole = (roleKey) => {
    setSelectedRoles((prev) => (prev.includes(roleKey) ? prev.filter((r) => r !== roleKey) : prev.concat([roleKey])));
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
      await apiClient.post('/meetings', {
        date: meetingDate.trim(),
        time: meetingTime.trim(),
        availableRoles: selectedRoles
      });
      setSelectedRoles([]);
      setMeetingDate('');
      setMeetingTime('');
      setSuccess('Meeting created.');
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
      setSuccess(`OR saved through stage ${stage}.`);
      await load();
    } catch (e) {
      setError(formatApiError(e) || 'Failed to update OR.');
    }
  };

  return (
    <ScreenContainer title="Admin Panel">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator /> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.header}>Guilders (participants)</Text>
        <Text style={styles.subMuted}>Registered students with phone for reminders.</Text>
        {guilders.length === 0 ? (
          <Text style={styles.muted}>No students yet.</Text>
        ) : (
          guilders.slice(0, 40).map((u) => (
            <View key={u.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listText}>{u.name}</Text>
                <Text style={styles.subMuted}>
                  {u.classGrade}-{u.section} · {u.email}
                </Text>
                <Text style={styles.subMuted}>{u.phoneNumber}</Text>
              </View>
            </View>
          ))
        )}
        {guilders.length > 40 ? <Text style={styles.muted}>Showing first 40. Use web admin for full list.</Text> : null}

        <Text style={styles.header}>Meeting SMS reminder</Text>
        <Text style={styles.subMuted}>Share text to Messages or SMS app.</Text>
        {meetings.map((m) => (
          <Pressable key={m.id} style={styles.meetingPick} onPress={() => shareMeetingSms(m.id)}>
            <Text style={styles.meetingPickText}>
              Share: {m.date} {m.time}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.header}>Admin list (by school email)</Text>
        <Text style={styles.subMuted}>If a user&apos;s email is listed here, they sign in as Admin.</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="School email (username)" value={adminEmail} autoCapitalize="none" onChangeText={setAdminEmail} />
          <View style={{ width: 120 }}>
            <Pressable style={styles.button} onPress={addAdmin}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.list}>
          {admins.length === 0 ? (
            <Text style={styles.muted}>No admins configured.</Text>
          ) : (
            admins.map((a) => (
              <View key={a.id || a.email} style={styles.listRow}>
                <Text style={styles.listText}>{a.email}</Text>
                <Pressable style={styles.dangerButton} onPress={() => removeAdmin(a.email)}>
                  <Text style={styles.dangerButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <Text style={styles.header}>Assign role to student</Text>
        <Text style={styles.subMuted}>Tap a meeting to set its ID, then enter the student&apos;s school email.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {meetings.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => setAssignMeetingId(m.id)}
                style={[styles.meetingPick, assignMeetingId === m.id ? styles.meetingPickOn : null]}
              >
                <Text style={styles.meetingPickText}>
                  {m.date} {m.time}
                </Text>
                <Text style={styles.meetingPickId} numberOfLines={1}>
                  {m.id.slice(0, 8)}…
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Meeting ID (UUID)"
          value={assignMeetingId}
          onChangeText={setAssignMeetingId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Student school email (username)"
          value={assignStudentEmail}
          onChangeText={setAssignStudentEmail}
          autoCapitalize="none"
        />
        <Text style={styles.subHeader}>Role</Text>
        <View style={styles.chipsWrap}>
          {roles.map((r) => (
            <ToggleChip key={r.key} selected={assignRoleKey === r.key} label={r.key} onPress={() => setAssignRoleKey(r.key)} />
          ))}
        </View>
        <Pressable style={[styles.button, { marginTop: 10 }]} onPress={assignRole}>
          <Text style={styles.buttonText}>Assign role</Text>
        </Pressable>

        <Text style={styles.header}>Mark OR stage complete</Text>
        <Text style={styles.subMuted}>Saving stage N marks OR-1 through OR-N complete.</Text>
        <TextInput style={styles.input} placeholder="Student school email" value={orEmail} onChangeText={setOrEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Stage 1–5" value={orStage} onChangeText={setOrStage} keyboardType="number-pad" />
        <Pressable style={[styles.button, { marginTop: 10 }]} onPress={markOrComplete}>
          <Text style={styles.buttonText}>Save OR progress</Text>
        </Pressable>

        <Text style={styles.header}>Create upcoming meeting</Text>
        <Text style={styles.subHeader}>Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={meetingDate} onChangeText={setMeetingDate} placeholder="2026-04-15" autoCapitalize="none" />
        <Text style={styles.subHeader}>Time (24h, HH:mm or HH:mm:ss)</Text>
        <TextInput style={styles.input} value={meetingTime} onChangeText={setMeetingTime} placeholder="16:30" autoCapitalize="none" />
        <Text style={styles.subMuted}>Meeting must be in the future to show as upcoming.</Text>

        <Text style={styles.subHeader}>Available roles</Text>
        <View style={styles.chipsWrap}>
          {roles.map((r) => (
            <ToggleChip key={r.key} selected={selectedRoles.includes(r.key)} label={r.key} onPress={() => toggleRole(r.key)} />
          ))}
        </View>

        <Pressable style={[styles.button, { marginTop: 10 }]} onPress={createMeeting}>
          <Text style={styles.buttonText}>Create meeting</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 12 },
  header: { fontWeight: '900', color: '#14213d', marginTop: 8 },
  subHeader: { fontWeight: '800', color: '#14213d', marginTop: 6 },
  subMuted: { fontSize: 12, color: '#6c757d' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#d2d9f0', padding: 12 },
  error: { color: '#c1121f', fontWeight: '700' },
  success: { color: '#047857', fontWeight: '700', backgroundColor: '#ecfdf5', padding: 10, borderRadius: 8 },
  list: { gap: 10, marginTop: 6 },
  listRow: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#d2d9f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listText: { fontWeight: '900', color: '#14213d' },
  muted: { color: '#6c757d' },
  button: { backgroundColor: '#0b6cff', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '900' },
  dangerButton: { backgroundColor: '#c1121f', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 },
  dangerButtonText: { color: '#fff', fontWeight: '900' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { borderWidth: 1, borderColor: '#d2d9f0', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  chipSelected: { backgroundColor: '#e3f2fd', borderColor: '#0b6cff' },
  chipText: { color: '#14213d', fontWeight: '800' },
  chipTextSelected: { color: '#0b6cff' },
  meetingPick: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#d2d9f0', backgroundColor: '#fff', minWidth: 120 },
  meetingPickOn: { borderColor: '#0b6cff', backgroundColor: '#e3f2fd' },
  meetingPickText: { fontWeight: '800', color: '#14213d' },
  meetingPickId: { fontSize: 11, color: '#6c757d', marginTop: 4 }
});
