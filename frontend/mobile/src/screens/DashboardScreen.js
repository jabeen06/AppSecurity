import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <ScreenContainer title="Dashboard">
      <View>
        <Text>Welcome, {user?.name}</Text>
        <Text>Class {user?.studentClass}-{user?.section}</Text>
        <Text>Track OR levels, role participation, timer performance, and voting outcomes.</Text>
      </View>
    </ScreenContainer>
  );
}
