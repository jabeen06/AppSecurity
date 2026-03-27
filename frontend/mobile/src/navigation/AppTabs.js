import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import RoleGuidelinesScreen from '../screens/RoleGuidelinesScreen';
import TimerScreen from '../screens/TimerScreen';
import VotingScreen from '../screens/VotingScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import ConductAndOathsScreen from '../screens/ConductAndOathsScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Roles" component={RoleGuidelinesScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Voting" component={VotingScreen} />
      <Tab.Screen name="Conduct" component={ConductAndOathsScreen} />
      {user?.isAdmin ? <Tab.Screen name="Admin" component={AdminPanelScreen} /> : null}
    </Tab.Navigator>
  );
}
