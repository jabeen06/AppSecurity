import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireUser from './layout/RequireUser.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MeetingInfoPage from './pages/MeetingInfoPage.jsx';
import RoleSelectionPage from './pages/RoleSelectionPage.jsx';
import ORTrackerPage from './pages/ORTrackerPage.jsx';
import RoleGuidelinesPage from './pages/RoleGuidelinesPage.jsx';
import RoleDetailPage from './pages/RoleDetailPage.jsx';
import ConductAndOathsPage from './pages/ConductAndOathsPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import ClubPage from './pages/ClubPage.jsx';
import MeetingFlowPage from './pages/MeetingFlowPage.jsx';
import TimerPage from './pages/TimerPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function AdminRoute() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminPanelPage /> : <Navigate to="/dashboard" replace />;
}

/**
 * Public: login/register. Authenticated: all app routes under `/` + RequireUser → AppShell (top nav + Outlet).
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<RequireUser />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="club" element={<ClubPage />} />
        <Route path="meeting-flow" element={<MeetingFlowPage />} />
        <Route path="timer" element={<TimerPage />} />
        <Route path="meeting" element={<MeetingInfoPage />} />
        <Route path="select-role" element={<RoleSelectionPage />} />
        <Route path="or-tracker" element={<ORTrackerPage />} />
        <Route path="roles" element={<RoleGuidelinesPage />} />
        <Route path="roles/:roleKey" element={<RoleDetailPage />} />
        <Route path="conduct" element={<ConductAndOathsPage />} />
        <Route path="admin" element={<AdminRoute />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
