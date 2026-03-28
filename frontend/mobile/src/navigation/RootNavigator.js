import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppTabs from './AppTabs';
import RoleDetailScreen from '../screens/RoleDetailScreen';
import ClubScreen from '../screens/ClubScreen';
import MeetingFlowScreen from '../screens/MeetingFlowScreen';
import TimerScreen from '../screens/TimerScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="App" component={AppTabs} />
          <Stack.Screen name="RoleDetail" component={RoleDetailScreen} />
          <Stack.Screen name="Club" component={ClubScreen} />
          <Stack.Screen name="MeetingFlow" component={MeetingFlowScreen} />
          <Stack.Screen name="Timer" component={TimerScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
