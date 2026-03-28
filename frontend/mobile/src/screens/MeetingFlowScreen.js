import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';

const STEPS = [
  'Opening by G.O.D',
  'Role introduction',
  'Word and Idiom of the Day',
  'Prepared speeches (OR)',
  'Evaluations',
  'Table topics',
  'Role reports',
  'General evaluation',
  'Voting',
  'Closing oath (all members)'
];

export default function MeetingFlowScreen() {
  const navigation = useNavigation();
  return (
    <ScreenContainer title="Meeting structure">
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.muted}>Typical flow for a session.</Text>
      <View style={styles.card}>
        {STEPS.map((label, i) => (
          <Text key={label} style={styles.step}>
            {i + 1}. {label}
          </Text>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { color: '#0b6cff', fontWeight: '800' },
  muted: { color: '#6c757d', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d2d9f0', gap: 10 },
  step: { fontWeight: '700', color: '#14213d', lineHeight: 24 }
});
