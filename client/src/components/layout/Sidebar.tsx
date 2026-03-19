import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard,
  Search,
  Brain,
  FileEdit,
  ListChecks,
  Bell,
  ScrollText,
  Settings,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
  { label: 'Discover Tenders', icon: <Search className="h-5 w-5" />, path: '/tenders' },
  { label: 'AI Insights', icon: <Brain className="h-5 w-5" />, path: '/insights' },
  { label: 'Proposal Workspace', icon: <FileEdit className="h-5 w-5" />, path: '/proposals' },
  { label: 'Tender Tracker', icon: <ListChecks className="h-5 w-5" />, path: '/tracker' },
  { label: 'Notifications', icon: <Bell className="h-5 w-5" />, path: '/notifications' },
  { label: 'Audit Logs', icon: <ScrollText className="h-5 w-5" />, path: '/audit' },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
];

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = '/dashboard', onNavigate }: SidebarProps) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col',
        'bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)]',
        'hidden lg:flex'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-[var(--border-subtle)]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-[var(--text-primary)] whitespace-nowrap overflow-hidden"
            >
              Chakro AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-brand-600/10 text-brand-500 dark:bg-brand-500/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              <span className={cn('flex-shrink-0', isActive && 'text-brand-500')}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="ml-auto bg-danger-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
