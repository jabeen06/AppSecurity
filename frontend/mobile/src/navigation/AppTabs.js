import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import RoleGuidelinesScreen from '../screens/RoleGuidelinesScreen';
import MeetingInfoScreen from '../screens/MeetingInfoScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import ORTrackerScreen from '../screens/ORTrackerScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import ConductAndOathsScreen from '../screens/ConductAndOathsScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meeting" component={MeetingInfoScreen} />
      <Tab.Screen name="Roles pick" component={RoleSelectionScreen} />
      <Tab.Screen name="OR Tracker" component={ORTrackerScreen} />
      <Tab.Screen name="Roles" component={RoleGuidelinesScreen} />
      <Tab.Screen name="Conduct" component={ConductAndOathsScreen} />
      {user?.role === 'admin' ? <Tab.Screen name="Admin" component={AdminPanelScreen} /> : null}
    </Tab.Navigator>
  );
}
