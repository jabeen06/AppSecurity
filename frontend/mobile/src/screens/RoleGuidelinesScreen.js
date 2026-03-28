import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { apiClient } from '../services/apiClient';

export default function RoleGuidelinesScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get('/roles');
        if (mounted) setRoles(data.roles || []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load roles.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenContainer title="Role Guidelines">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator /> : error ? <Text style={styles.error}>{error}</Text> : null}
        {roles.map((role) => (
          <Pressable
            key={role.key}
            onPress={() => navigation.navigate('RoleDetail', { roleKey: role.key })}
            style={styles.roleCard}
          >
            <Text style={styles.title}>{role.title}</Text>
            <Text style={styles.sub}>Responsibilities: {role.responsibilities?.[0] || ''}</Text>
            <Text style={styles.link}>Tap for full details</Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 12 },
  error: { color: '#c1121f', fontWeight: '700' },
  roleCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d2d9f0' },
  title: { fontWeight: '900', color: '#14213d' },
  sub: { marginTop: 6, color: '#14213d' },
  link: { marginTop: 6, fontWeight: '800', color: '#0b6cff' }
});
