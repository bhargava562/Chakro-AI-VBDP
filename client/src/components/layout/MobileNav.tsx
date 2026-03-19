import {
  LayoutDashboard,
  Search,
  Brain,
  FileEdit,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const mobileNavItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
  { label: 'Tenders', icon: <Search className="h-5 w-5" />, path: '/tenders' },
  { label: 'AI', icon: <Brain className="h-5 w-5" />, path: '/insights' },
  { label: 'Proposals', icon: <FileEdit className="h-5 w-5" />, path: '/proposals' },
  { label: 'Alerts', icon: <Bell className="h-5 w-5" />, path: '/notifications' },
];

export function MobileNav({ currentPath = '/dashboard', onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-xl px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors cursor-pointer',
                isActive
                  ? 'text-brand-500'
                  : 'text-[var(--text-tertiary)] active:text-[var(--text-primary)]'
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
