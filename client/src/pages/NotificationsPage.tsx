import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { CheckCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/motion/variants';
import type { AlertLevel } from '@/types';

const notifications = [
  { id: '1', title: 'New tender match: IT Infra — MoF', message: '92% match score. Deadline in 3 days.', level: 'info' as AlertLevel, time: '5 min ago', read: false },
  { id: '2', title: 'Security validation complete', message: 'GeM portal ID verified. No fraud indicators found.', level: 'success' as AlertLevel, time: '1 hour ago', read: false },
  { id: '3', title: 'Deadline approaching: Cloud Migration — RBI', message: 'Only 5 days remaining. Proposal is at 40% completion.', level: 'warning' as AlertLevel, time: '2 hours ago', read: false },
  { id: '4', title: 'Fraud alert: Suspicious portal detected', message: 'Domain tender-gov-india.xyz flagged as fraudulent.', level: 'error' as AlertLevel, time: '4 hours ago', read: true },
  { id: '5', title: 'Proposal approved by manager', message: 'IT Infrastructure proposal ready for submission.', level: 'success' as AlertLevel, time: '1 day ago', read: true },
];

const levelIcons = {
  info: <Info className="h-5 w-5 text-blue-400" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  error: <ShieldAlert className="h-5 w-5 text-red-400" />,
  urgent: <ShieldAlert className="h-5 w-5 text-red-500" />,
};

export function NotificationsPage() {
  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Stay updated on AI activity and alerts</p>
        </div>
        <Button variant="ghost" size="sm">Mark all read</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            variants={fadeInUp}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
              notif.read
                ? 'border-[var(--border-subtle)] bg-transparent opacity-60'
                : 'border-[var(--border-default)] bg-[var(--bg-card)]'
            }`}
          >
            {levelIcons[notif.level]}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)]">{notif.title}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">{notif.message}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[var(--text-tertiary)]">{notif.time}</span>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-500" />}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
}
