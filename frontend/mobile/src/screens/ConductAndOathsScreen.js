import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { VOTING_RULES } from '../constants/policies';

export default function ConductAndOathsScreen() {
  const code = [
    'Respect all speakers.',
    'No interruptions.',
    'Constructive feedback only.',
    'Maintain discipline.'
  ];

  const openingOath = 'Opening Oath (G.O.D): I pledge to conduct this meeting fairly, maintain discipline, and guide every speaker with respect.';
  const closingOath =
    'Closing Oath (All members): We pledge to listen attentively, speak with courage, and give constructive feedback that helps us grow.';

  return (
    <ScreenContainer title="Code of Conduct & Oaths">
      <Text style={{ fontWeight: '800' }}>Code of Conduct</Text>
      <View style={{ marginTop: 6 }}>
        {code.map((line) => (
          <Text key={line}>• {line}</Text>
        ))}
      </View>

      <Text style={{ fontWeight: '800', marginTop: 12 }}>Voting rules</Text>
      <Text style={{ marginTop: 4, color: '#6c757d', fontSize: 12 }}>Ballot Steward runs voting live. Awards:</Text>
      {VOTING_RULES.awards.map((a) => (
        <Text key={a} style={{ marginTop: 2 }}>
          • {a}
        </Text>
      ))}
      {VOTING_RULES.rules.map((r) => (
        <Text key={r} style={{ marginTop: 4, color: '#6c757d', fontSize: 12 }}>
          • {r}
        </Text>
      ))}

      <Text style={{ fontWeight: '800', marginTop: 12 }}>Oaths</Text>
      <Text style={{ marginTop: 6 }}>{openingOath}</Text>
      <Text style={{ marginTop: 6 }}>{closingOath}</Text>
    </ScreenContainer>
  );
}
