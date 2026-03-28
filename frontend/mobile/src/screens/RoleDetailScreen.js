import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { apiClient } from '../services/apiClient';
import { TIMING_RULES, VOTING_RULES } from '../constants/policies';

export default function RoleDetailScreen() {
  const route = useRoute();
  const { roleKey } = route.params || {};

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
    <ScreenContainer title="Role Details">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : !role ? (
          <Text style={styles.muted}>Role not found.</Text>
        ) : (
          <>
            <Text style={styles.title}>{role.title}</Text>

            <Text style={styles.section}>Responsibilities</Text>
            {role.responsibilities?.map((r) => (
              <Text key={r} style={styles.bullet}>
                • {r}
              </Text>
            ))}

            <Text style={styles.section}>Skills Developed</Text>
            {role.skills?.map((s) => (
              <Text key={s} style={styles.bullet}>
                • {s}
              </Text>
            ))}

            {roleKey === 'chronomaster' ? (
              <>
                <Text style={styles.section}>Timing Rules (Display Only)</Text>
                <Text style={styles.subSection}>Prepared Speeches</Text>
                <Text style={styles.text}>Green: {TIMING_RULES.preparedSpeech.green}</Text>
                <Text style={styles.text}>Yellow: {TIMING_RULES.preparedSpeech.yellow}</Text>
                <Text style={styles.text}>Red: {TIMING_RULES.preparedSpeech.red}</Text>
                <Text style={styles.text}>Grace: {TIMING_RULES.preparedSpeech.grace}</Text>
                <Text style={styles.subSection}>Evaluations</Text>
                <Text style={styles.text}>Green: {TIMING_RULES.evaluation.green}</Text>
                <Text style={styles.text}>Yellow: {TIMING_RULES.evaluation.yellow}</Text>
                <Text style={styles.text}>Red: {TIMING_RULES.evaluation.red}</Text>
                <Text style={styles.text}>Grace: {TIMING_RULES.evaluation.grace}</Text>
              </>
            ) : null}

            {roleKey === 'ttm' ? (
              <>
                <Text style={styles.section}>Table Topics Timing (Display Only)</Text>
                <Text style={styles.text}>Green: {TIMING_RULES.tableTopics.green}</Text>
                <Text style={styles.text}>Yellow: {TIMING_RULES.tableTopics.yellow}</Text>
                <Text style={styles.text}>Red: {TIMING_RULES.tableTopics.red}</Text>
                <Text style={styles.text}>Grace: {TIMING_RULES.tableTopics.grace}</Text>
              </>
            ) : null}

            {roleKey === 'ballot-steward' ? (
              <>
                <Text style={styles.section}>Voting Rules (Display Only)</Text>
                <Text style={styles.subSection}>Awards</Text>
                {VOTING_RULES.awards.map((a) => (
                  <Text key={a} style={styles.bullet}>
                    • {a}
                  </Text>
                ))}
                <Text style={styles.subSection}>Rules</Text>
                {VOTING_RULES.rules.map((r) => (
                  <Text key={r} style={styles.bullet}>
                    • {r}
                  </Text>
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 10 },
  title: { fontWeight: '900', fontSize: 18, color: '#14213d' },
  section: { marginTop: 8, fontWeight: '900', color: '#14213d' },
  subSection: { marginTop: 6, fontWeight: '800', color: '#14213d' },
  bullet: { color: '#14213d' },
  text: { color: '#14213d' },
  muted: { color: '#6c757d' },
  error: { color: '#c1121f', fontWeight: '700' }
});

