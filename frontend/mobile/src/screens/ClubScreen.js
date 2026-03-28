import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';

export default function ClubScreen() {
  const navigation = useNavigation();
  return (
    <ScreenContainer title="The Oratory Guild">
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.lead}>A structured student-led public speaking club for confident, articulate leaders.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Members</Text>
        <Text style={styles.body}>We call ourselves Guilders: students who learn by doing through roles, speeches, and feedback.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vision</Text>
        <Text style={styles.body}>To nurture confident, articulate, and responsible student leaders.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objectives</Text>
        <Text style={styles.body}>
          {'\u2022'} Build confidence{'\n'}
          {'\u2022'} Improve communication{'\n'}
          {'\u2022'} Develop leadership{'\n'}
          {'\u2022'} Encourage structured thinking{'\n'}
          {'\u2022'} Promote discipline and respect
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { color: '#0b6cff', fontWeight: '800' },
  lead: { color: '#6c757d', marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#d2d9f0' },
  cardTitle: { fontWeight: '900', color: '#14213d', marginBottom: 8 },
  body: { color: '#14213d', lineHeight: 22 }
});
