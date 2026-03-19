import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const insights = [
  { title: 'Strongest Sector', value: 'IT Services', detail: '45 opportunities matched in last 30 days', icon: <Target className="h-5 w-5" />, color: 'text-brand-400' },
  { title: 'Win Probability', value: '72%', detail: 'Up 14% from last month', icon: <TrendingUp className="h-5 w-5" />, color: 'text-accent-400' },
  { title: 'Avg. Response Time', value: '2.3 days', detail: '40% faster with AI drafting', icon: <Zap className="h-5 w-5" />, color: 'text-warning-400' },
];

export function AIInsightsPage() {
  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Insights</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Strategic intelligence from your AI agents</p>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center ${insight.color}`}>
                  {insight.icon}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">{insight.title}</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{insight.value}</div>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{insight.detail}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card>
        <CardHeader><CardTitle>Eligibility Analysis — Recent Tenders</CardTitle></CardHeader>
        <div className="space-y-4">
          {[
            { name: 'IT Infrastructure — MoF', eligibility: 87, financial: 'low', technical: 'qualified' },
            { name: 'Cloud Migration — RBI', eligibility: 72, financial: 'medium', technical: 'partially_qualified' },
            { name: 'Security Audit — CERT-IN', eligibility: 94, financial: 'low', technical: 'qualified' },
          ].map((tender, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-subtle)]">
              <Brain className="h-5 w-5 text-brand-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)]">{tender.name}</div>
                <div className="flex items-center gap-3 mt-1">
                  <ProgressBar value={tender.eligibility} variant="brand" size="sm" className="w-24" />
                  <span className="text-xs text-brand-400">{tender.eligibility}%</span>
                  <Badge variant={tender.financial === 'low' ? 'success' : 'warning'}>{tender.financial} risk</Badge>
                  <Badge variant={tender.technical === 'qualified' ? 'success' : 'warning'}>{tender.technical.replace('_', ' ')}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AnimatedPage>
  );
}
