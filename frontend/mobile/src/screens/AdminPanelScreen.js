import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

export default function AdminPanelScreen() {
  return (
    <ScreenContainer title="Admin Panel">
      <Text>Manage meetings, approve OR stages, and trigger SMS meeting notifications.</Text>
      <Text>This screen is visible only for admin users from allowed school emails.</Text>
    </ScreenContainer>
  );
}
