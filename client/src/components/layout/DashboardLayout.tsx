import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

function PageLoader() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

export function DashboardLayout() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath={location.pathname} onNavigate={(path) => navigate(path)} />
      <MobileNav currentPath={location.pathname} onNavigate={(path) => navigate(path)} />

      <div
        className={cn(
          'transition-[margin] duration-300 ease-out',
          'lg:ml-[260px]',
          collapsed && 'lg:ml-[72px]'
        )}
      >
        <TopNavbar />

        <main className="min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
