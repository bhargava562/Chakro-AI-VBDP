import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import { DashboardLayout } from '@/components/layout/DashboardLayout';

function RouteLoader() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="glass rounded-2xl px-6 py-4">
        <div className="h-4 w-48 rounded bg-white/5 animate-shimmer" />
      </div>
    </div>
  );
}

// Public pages
const LandingPage = lazy(() => import('@/pages/landing/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const OTPPage = lazy(() => import('@/pages/auth/OTPPage').then((m) => ({ default: m.OTPPage })));

// Dashboard pages
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TenderDiscoveryPage = lazy(() => import('@/pages/tenders/TenderDiscoveryPage').then((m) => ({ default: m.TenderDiscoveryPage })));
const ProposalWorkspacePage = lazy(() => import('@/pages/proposals/ProposalWorkspacePage').then((m) => ({ default: m.ProposalWorkspacePage })));
const AIInsightsPage = lazy(() => import('@/pages/AIInsightsPage').then((m) => ({ default: m.AIInsightsPage })));
const TenderTrackerPage = lazy(() => import('@/pages/TenderTrackerPage').then((m) => ({ default: m.TenderTrackerPage })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

// Shared
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired);

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Suspense fallback={<RouteLoader />}><LandingPage /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<RouteLoader />}><LoginPage /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<RouteLoader />}><RegisterPage /></Suspense>} />
          <Route path="/verify" element={<Suspense fallback={<RouteLoader />}><OTPPage /></Suspense>} />

          <Route
            element={(
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            )}
          >
            <Route path="/dashboard" element={<Suspense fallback={<RouteLoader />}><DashboardPage /></Suspense>} />
            <Route path="/tenders" element={<Suspense fallback={<RouteLoader />}><TenderDiscoveryPage /></Suspense>} />
            <Route path="/proposals" element={<Suspense fallback={<RouteLoader />}><ProposalWorkspacePage /></Suspense>} />
            <Route path="/insights" element={<Suspense fallback={<RouteLoader />}><AIInsightsPage /></Suspense>} />
            <Route path="/tracker" element={<Suspense fallback={<RouteLoader />}><TenderTrackerPage /></Suspense>} />
            <Route path="/notifications" element={<Suspense fallback={<RouteLoader />}><NotificationsPage /></Suspense>} />
            <Route path="/audit" element={<Suspense fallback={<RouteLoader />}><AuditLogsPage /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<RouteLoader />}><SettingsPage /></Suspense>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
