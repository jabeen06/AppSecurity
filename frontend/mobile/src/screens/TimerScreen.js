import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

const signals = [
  { phase: 'Green', at: '03:00' },
  { phase: 'Yellow', at: '04:00' },
  { phase: 'Red', at: '05:00' }
];

export default function TimerScreen() {
  return (
    <ScreenContainer title="Chronomaster Timer">
      <Text>Use this screen to guide prepared speeches with visual signal checkpoints.</Text>
      {signals.map((signal) => (
        <View key={signal.phase}><Text>{signal.phase}: {signal.at}</Text></View>
      ))}
    </ScreenContainer>
  );
}
