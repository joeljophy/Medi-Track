import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar, TopBar } from './components/Layout';
import { LoginScreen } from './screens/LoginScreen';
import { UserProvider } from './context/UserContext';

// Lazy load screens
const DashboardScreen = lazy(() => import('./screens/DashboardScreen').then(m => ({ default: m.DashboardScreen })));
const UserManagementScreen = lazy(() => import('./screens/UserManagementScreen').then(m => ({ default: m.UserManagementScreen })));
const RolesPermissionsScreen = lazy(() => import('./screens/RolesPermissionsScreen').then(m => ({ default: m.RolesPermissionsScreen })));
const BackupRestoreScreen = lazy(() => import('./screens/BackupRestoreScreen').then(m => ({ default: m.BackupRestoreScreen })));
const AuditLogsScreen = lazy(() => import('./screens/AuditLogsScreen').then(m => ({ default: m.AuditLogsScreen })));
const SystemSettingsScreen = lazy(() => import('./screens/SystemSettingsScreen').then(m => ({ default: m.SystemSettingsScreen })));
const SystemMonitoringScreen = lazy(() => import('./screens/SystemMonitoringScreen').then(m => ({ default: m.SystemMonitoringScreen })));
const ReportsScreen = lazy(() => import('./screens/ReportsScreen').then(m => ({ default: m.ReportsScreen })));
const UserProfileScreen = lazy(() => import('./screens/UserProfileScreen').then(m => ({ default: m.UserProfileScreen })));

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <Toaster position="top-right" richColors />
      <TopBar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<LoadingScreen />}>
                {children}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/users" element={<UserManagementScreen />} />
              <Route path="/users/:userId" element={<UserProfileScreen />} />
              <Route path="/roles" element={<RolesPermissionsScreen />} />
              <Route path="/reports" element={<ReportsScreen />} />
              <Route path="/backup" element={<BackupRestoreScreen />} />
              <Route path="/audit" element={<AuditLogsScreen />} />
              <Route path="/settings" element={<SystemSettingsScreen />} />
              <Route path="/monitoring" element={<SystemMonitoringScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}
