import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Bell, Activity, Moon, Sun, User, Shield, LogOut, Building2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';
import { cn, getInitials } from '@/lib/utils';

export function TopNavbar() {
  const navigate = useNavigate();

  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearTenant = useTenantStore((s) => s.clearTenant);
  const tenantName = useTenantStore((s) => s.tenantName);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    clearTenant();
    navigate('/', { replace: true });
  };

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {tenantName && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <Building2 className="h-4 w-4 text-[var(--text-tertiary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)] truncate max-w-[200px]">
                {tenantName}
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search tenders, proposals..."
              className="w-full h-9 pl-10 pr-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-1.5 text-[10px] text-[var(--text-tertiary)] font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI Activity Indicator */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20"
          >
            <Activity className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-xs font-medium text-brand-400">AI Active</span>
          </motion.div>

          {/* Secure Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20">
            <Shield className="h-3.5 w-3.5 text-accent-400" />
            <span className="text-xs font-medium text-accent-400">Secure</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Profile"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                  'bg-gradient-to-br from-brand-500 to-accent-500 text-white'
                )}
              >
                {user ? getInitials(user.name) : <User className="h-4 w-4" />}
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-lg overflow-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-[var(--border-subtle)]">
                    <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] truncate">{user?.email || ''}</div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
