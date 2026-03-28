import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const orProgress = user?.orProgress || [];

  const isAdmin = user?.role === 'admin';

  return (
    <ScreenContainer title="Dashboard">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.welcome}>Welcome, {user?.name}</Text>
          <Text style={styles.meta}>
            Class {user?.classGrade}-{user?.section}
          </Text>
          <Text style={styles.meta}>Current OR Level: {user?.orLevel}</Text>
          <Text style={styles.meta}>
            Account: {isAdmin ? 'Admin (can edit)' : 'Member (read-only)'}
          </Text>
          {!isAdmin ? (
            <Text style={styles.hintSmall}>
              Admins manage meetings, assign roles, and update OR progress using your school email.
            </Text>
          ) : null}
        </View>

        <Text style={styles.header}>OR Progress</Text>
        {orProgress.map((stage) => (
          <View key={stage.key} style={[styles.card, stage.status === 'Completed' ? styles.completed : stage.status === 'Pending' ? styles.pending : styles.locked]}>
            <Text style={styles.cardTitle}>{stage.title}</Text>
            <Text>Status: {stage.status}</Text>
          </View>
        ))}

        <View style={styles.quickLinks}>
          <Pressable style={styles.linkChip} onPress={() => navigation.getParent()?.navigate('Club')}>
            <Text style={styles.linkChipText}>Club info</Text>
          </Pressable>
          <Pressable style={styles.linkChip} onPress={() => navigation.getParent()?.navigate('MeetingFlow')}>
            <Text style={styles.linkChipText}>Meeting flow</Text>
          </Pressable>
          <Pressable style={styles.linkChip} onPress={() => navigation.getParent()?.navigate('Timer')}>
            <Text style={styles.linkChipText}>Timer</Text>
          </Pressable>
        </View>

        <Text style={styles.header}>Next meeting role</Text>
        {user?.upcomingMeetingRole ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{user.upcomingMeetingRole.roleKey}</Text>
            <Text style={styles.meta}>
              {user.upcomingMeetingRole.date} at {user.upcomingMeetingRole.time}
            </Text>
            <Text style={styles.hintSmall}>Your signup for the upcoming session. Change it under Roles pick if still open.</Text>
          </View>
        ) : (
          <Text style={styles.muted}>No role reserved yet. Pick a role after the admin posts the meeting.</Text>
        )}

        <Text style={styles.header}>Roles performed</Text>
        <Text style={styles.hintSmall}>Past club meetings only.</Text>
        {(user?.rolesPerformed || []).length === 0 ? (
          <Text style={styles.muted}>No past roles yet. After a meeting date passes, your roles show here.</Text>
        ) : (
          (user?.rolesPerformed || []).map((h, idx) => (
            <View key={`${h.meetingId}-${idx}`} style={styles.card}>
              <Text style={styles.cardTitle}>{h.roleKey}</Text>
              <Text>
                {h.meetingDate} at {h.meetingTime}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: { gap: 6, marginBottom: 14 },
  welcome: { fontWeight: '800', fontSize: 18, color: '#14213d' },
  meta: { color: '#14213d' },
  hintSmall: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  header: { marginTop: 10, marginBottom: 6, fontWeight: '800', color: '#14213d', fontSize: 16 },
  muted: { color: '#6c757d' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#d2d9f0' },
  cardTitle: { fontWeight: '800', color: '#14213d' },
  completed: { backgroundColor: '#e8f5e9', borderColor: '#1b5e20' },
  pending: { backgroundColor: '#e3f2fd', borderColor: '#0b6cff' },
  locked: { backgroundColor: '#f1f2f6', borderColor: '#bdbdbd' },
  quickLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  linkChip: { backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#0b6cff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  linkChipText: { color: '#0b6cff', fontWeight: '800' }
});
