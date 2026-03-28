import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';

const statusColor = {
  Completed: { bg: '#e8f5e9', border: '#1b5e20', text: '#1b5e20' },
  Pending: { bg: '#e3f2fd', border: '#0b6cff', text: '#0b6cff' },
  Locked: { bg: '#f1f2f6', border: '#bdbdbd', text: '#6c757d' }
};

export default function ORTrackerScreen() {
  const { user } = useAuth();
  const stages = user?.orProgress || [];

  return (
    <ScreenContainer title="OR Tracker">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.meta}>Current OR Level: {user?.orLevel}</Text>

        {stages.map((s) => {
          const c = statusColor[s.status] || statusColor.Locked;
          return (
            <View key={s.key} style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
              <Text style={[styles.title, { color: c.text }]}>{s.title}</Text>
              <Text style={{ fontWeight: '700' }}>Status: {s.status}</Text>

              {s.status === 'Locked' ? <Text style={styles.muted}>Complete earlier OR stages to unlock this stage.</Text> : null}

              <Text style={styles.sectionHeader}>Objective</Text>
              <Text style={styles.text}>{s.objective}</Text>

              <Text style={styles.sectionHeader}>Structure</Text>
              <Text style={styles.text}>Intro: {s.structure.intro}</Text>
              <Text style={styles.text}>Body: {s.structure.body}</Text>
              <Text style={styles.text}>Conclusion: {s.structure.conclusion}</Text>

              <Text style={styles.sectionHeader}>Time Limit (Prepared Speech)</Text>
              <Text style={styles.text}>Green: {s.timeLimit.preparedSpeech.green}</Text>
              <Text style={styles.text}>Yellow: {s.timeLimit.preparedSpeech.yellow}</Text>
              <Text style={styles.text}>Red: {s.timeLimit.preparedSpeech.red}</Text>
              <Text style={styles.text}>Grace: {s.timeLimit.preparedSpeech.grace}</Text>

              <Text style={styles.sectionHeader}>Evaluation Time Limit</Text>
              <Text style={styles.text}>Green: {s.timeLimit.evaluation.green}</Text>
              <Text style={styles.text}>Yellow: {s.timeLimit.evaluation.yellow}</Text>
              <Text style={styles.text}>Red: {s.timeLimit.evaluation.red}</Text>
              <Text style={styles.text}>Grace: {s.timeLimit.evaluation.grace}</Text>

              <Text style={styles.sectionHeader}>Evaluation Focus</Text>
              {s.evaluationFocus.map((f) => (
                <Text key={f} style={styles.text}>
                  • {f}
                </Text>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18, gap: 12 },
  meta: { color: '#14213d', fontWeight: '800', marginBottom: 6 },
  card: { borderRadius: 12, padding: 14, borderWidth: 1 },
  title: { fontWeight: '900', fontSize: 16, marginBottom: 6 },
  sectionHeader: { marginTop: 10, marginBottom: 6, fontWeight: '900', color: '#14213d' },
  text: { color: '#14213d' },
  muted: { color: '#6c757d', marginBottom: 6 },
});

