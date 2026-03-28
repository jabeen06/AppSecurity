import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

function isGodRole(roleKey) {
  return roleKey === 'god';
}

/** Student picks one open role; G.O.D only if ORLevel >= 3. */
export default function RoleSelectionScreen() {
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [submittingRole, setSubmittingRole] = useState('');

  const loadUpcoming = async () => {
    const { data } = await apiClient.get('/meetings/upcoming');
    setMeeting(data.meeting);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        if (!mounted) return;
        await loadUpcoming();
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
  }, []);

  const onSelectRole = async (roleKey) => {
    if (!meeting) return;
    setSubmittingRole(roleKey);
    setError('');
    try {
      await apiClient.post(`/meetings/${meeting.id}/select-role`, { roleKey });
      await refreshMe();
      await loadUpcoming();
    } catch (e) {
      setError(e?.response?.data?.message || 'Role selection failed.');
    } finally {
      setSubmittingRole('');
    }
  };

  const myRoleKey = meeting?.myRoleKey || null;
  const openRoles = meeting?.openRoles || [];

  return (
    <ScreenContainer title="Role selection">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          Choose one open role for the next meeting. G.O.D is available only when your OR level is at least 3.
        </Text>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : !meeting ? (
          <Text style={styles.muted}>No upcoming meeting scheduled.</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>Next meeting</Text>
              <Text>Date: {meeting.date}</Text>
              <Text>Time: {meeting.time}</Text>
              {myRoleKey ? (
                <Text style={styles.ok}>Your role: {myRoleKey}</Text>
              ) : (
                <Text style={styles.muted}>Tap an open role below to select it.</Text>
              )}
            </View>

            <Text style={styles.header}>Open roles</Text>
            {openRoles.length === 0 ? (
              <Text style={styles.muted}>No roles are left open.</Text>
            ) : (
              openRoles.map((rk) => {
                const lockedForGod = isGodRole(rk) && (user?.orLevel || 1) < 3;
                const disabled = !!myRoleKey || lockedForGod || (!!submittingRole && submittingRole !== rk);
                return (
                  <Pressable
                    key={rk}
                    onPress={() => onSelectRole(rk)}
                    disabled={disabled}
                    style={[styles.roleRow, disabled ? styles.roleRowDisabled : null]}
                  >
                    <View>
                      <Text style={styles.roleText}>{rk}</Text>
                      {lockedForGod ? (
                        <Text style={styles.locked}>OR level must be ≥ 3 for G.O.D</Text>
                      ) : (
                        <Text style={styles.hintSm}>Tap to select</Text>
                      )}
                    </View>
                    <Text style={[styles.pill, lockedForGod ? styles.lockedPill : styles.openPill]}>
                      {lockedForGod ? 'Locked' : 'Open'}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 12 },
  hint: { fontSize: 13, color: '#14213d', backgroundColor: '#e3f2fd', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#d2d9f0' },
  hintSm: { color: '#6c757d', marginTop: 4, fontSize: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d2d9f0' },
  title: { fontWeight: '800', fontSize: 16, color: '#14213d' },
  header: { fontWeight: '800', marginTop: 8, color: '#14213d' },
  roleRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d2d9f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  roleRowDisabled: { opacity: 0.55 },
  roleText: { fontWeight: '800', color: '#14213d' },
  ok: { color: '#1b5e20', fontWeight: '800', marginTop: 6 },
  muted: { color: '#6c757d' },
  error: { color: '#c1121f', fontWeight: '700' },
  pill: { fontWeight: '800' },
  openPill: { color: '#0b6cff' },
  lockedPill: { color: '#b00020' },
  locked: { color: '#b00020', fontWeight: '700', marginTop: 4 }
});
