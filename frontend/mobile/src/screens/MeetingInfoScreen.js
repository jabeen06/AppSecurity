import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function MeetingInfoScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get('/meetings/upcoming');
        if (mounted) setMeeting(data.meeting);
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
  }, [user?.id]);

  return (
    <ScreenContainer title="Meeting Info">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.linkRow}>
          <Pressable style={styles.linkChip} onPress={() => navigation.getParent()?.navigate('MeetingFlow')}>
            <Text style={styles.linkChipText}>Meeting flow</Text>
          </Pressable>
          <Pressable style={styles.linkChip} onPress={() => navigation.getParent()?.navigate('Timer')}>
            <Text style={styles.linkChipText}>Timer</Text>
          </Pressable>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : !meeting ? (
          <Text style={styles.muted}>No upcoming meeting scheduled.</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>Next Meeting</Text>
              <Text>Date: {meeting.date}</Text>
              <Text>Time: {meeting.time}</Text>
              {meeting.myRoleKey ? <Text style={styles.ok}>Your role: {meeting.myRoleKey}</Text> : <Text style={styles.muted}>You have not selected a role yet.</Text>}
            </View>

            <Text style={styles.header}>Open Roles</Text>
            {meeting.openRoles.length === 0 ? (
              <Text style={styles.muted}>No roles are left open.</Text>
            ) : (
              meeting.openRoles.map((rk) => (
                <View key={rk} style={styles.roleRow}>
                  <Text style={styles.roleText}>{rk}</Text>
                  <Text style={styles.pill}>Open</Text>
                </View>
              ))
            )}

            <Text style={styles.header}>Assigned Roles</Text>
            {meeting.assignedRoles.length === 0 ? (
              <Text style={styles.muted}>No roles assigned yet.</Text>
            ) : (
              meeting.assignedRoles.map((a) => (
                <View key={`${a.roleKey}-${a.userId}`} style={styles.roleRow}>
                  <Text style={styles.roleText}>{a.roleKey}</Text>
                  <Text style={styles.pill}>{a.userEmail}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 12 },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linkChip: { backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#0b6cff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  linkChipText: { color: '#0b6cff', fontWeight: '800' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d2d9f0' },
  title: { fontWeight: '800', fontSize: 16, color: '#14213d' },
  header: { fontWeight: '800', marginTop: 8, color: '#14213d' },
  roleRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#d2d9f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleText: { fontWeight: '800', color: '#14213d' },
  pill: { color: '#14213d', fontWeight: '700' },
  muted: { color: '#6c757d' },
  error: { color: '#c1121f', fontWeight: '700' },
  ok: { color: '#1b5e20', fontWeight: '800', marginTop: 6 }
});

