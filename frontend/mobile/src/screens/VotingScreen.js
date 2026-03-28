import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

export default function VotingScreen() {
  return (
    <ScreenContainer title="Voting System">
      <Text>Cast votes for Best Speaker, Best Evaluator, Best Roleplayer, and Best TTM Speaker.</Text>
      <Text>Ballot Steward verifies fairness before announcing winners.</Text>
    </ScreenContainer>
  );
}
