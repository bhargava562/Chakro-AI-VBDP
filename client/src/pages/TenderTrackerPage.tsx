import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const pipeline = [
  { id: '1', title: 'IT Infrastructure Upgrade — MoF', stage: 'Proposal Submitted', progress: 75, status: 'submitted' as const, value: '₹2.4 Cr' },
  { id: '2', title: 'Cloud Migration — RBI', stage: 'AI Drafting', progress: 40, status: 'draft' as const, value: '₹5.1 Cr' },
  { id: '3', title: 'Cybersecurity Audit — UIDAI', stage: 'Under Review', progress: 90, status: 'approved' as const, value: '₹1.8 Cr' },
  { id: '4', title: 'Data Analytics — NITI Aayog', stage: 'Discovery', progress: 15, status: 'draft' as const, value: '₹3.2 Cr' },
];

const stageConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  submitted: { label: 'Submitted', variant: 'info' as const },
  approved: { label: 'Under Review', variant: 'success' as const },
};

export function TenderTrackerPage() {
  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tender Tracker</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Track your tender pipeline end-to-end</p>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
        {pipeline.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-brand-500/30 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.stage}</div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <ProgressBar value={item.progress} variant="brand" size="sm" className="w-32 hidden sm:block" />
              <Badge variant={stageConfig[item.status].variant}>{stageConfig[item.status].label}</Badge>
              <span className="text-sm font-semibold text-[var(--text-primary)] w-20 text-right">{item.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
}
