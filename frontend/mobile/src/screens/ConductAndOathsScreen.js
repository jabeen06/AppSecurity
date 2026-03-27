import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { codeOfConduct, oaths } from '../constants/roleGuidelines';

export default function ConductAndOathsScreen() {
  return (
    <ScreenContainer title="Code of Conduct & Oaths">
      <Text style={{ fontWeight: '700' }}>Code of Conduct</Text>
      {codeOfConduct.map((line) => <Text key={line}>• {line}</Text>)}
      <Text style={{ fontWeight: '700', marginTop: 10 }}>Oaths</Text>
      <Text>Member Oath: {oaths.member}</Text>
      <Text>Leadership Oath: {oaths.leadership}</Text>
    </ScreenContainer>
  );
}
