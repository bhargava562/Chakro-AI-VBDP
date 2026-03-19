import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const logs = [
  { id: '1', action: 'Proposal submitted', user: 'Rahul Sharma', role: 'Owner', target: 'IT Infra Proposal — MoF', time: '1 Mar 2026, 7:45 PM' },
  { id: '2', action: 'AI draft generated', user: 'Response Agent', role: 'AI', target: 'Cloud Migration — RBI', time: '1 Mar 2026, 5:30 PM' },
  { id: '3', action: 'Fraud alert dismissed', user: 'Priya Patel', role: 'Manager', target: 'Suspicious portal alert', time: '1 Mar 2026, 3:15 PM' },
  { id: '4', action: 'Tender matched', user: 'Discovery Agent', role: 'AI', target: 'Data Analytics — NITI Aayog', time: '1 Mar 2026, 1:00 PM' },
  { id: '5', action: 'User login', user: 'Rahul Sharma', role: 'Owner', target: 'Dashboard access', time: '1 Mar 2026, 10:00 AM' },
  { id: '6', action: 'Compliance check passed', user: 'Security Agent', role: 'AI', target: 'GeM Certificate Validation', time: '28 Feb 2026, 6:00 PM' },
];

export function AuditLogsPage() {
  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Complete trail of all system and user actions</p>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            variants={fadeInUp}
            className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-subtle)]"
          >
            <ScrollText className="h-4 w-4 text-[var(--text-tertiary)] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-[var(--text-primary)] font-medium">{log.action}</span>
              <span className="text-sm text-[var(--text-tertiary)]"> on </span>
              <span className="text-sm text-[var(--text-primary)]">{log.target}</span>
            </div>
            <Badge variant={log.role === 'AI' ? 'brand' : 'default'}>{log.user}</Badge>
            <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0 hidden sm:block">{log.time}</span>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
}
