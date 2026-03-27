import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { roleGuidelines } from '../constants/roleGuidelines';

export default function RoleGuidelinesScreen() {
  return (
    <ScreenContainer title="Role Guidelines">
      {roleGuidelines.map((role) => (
        <View key={role.key} style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}>
          <Text style={{ fontWeight: '700' }}>{role.title}</Text>
          <Text>Responsibilities:</Text>
          {role.responsibilities.map((line) => <Text key={line}>• {line}</Text>)}
          <Text>Skills: {role.skills.join(', ')}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
}
