import { motion } from 'framer-motion';
import { Clock, AlertTriangle, FileWarning, ShieldAlert } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const painPoints = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Manual Tracking',
    description: 'MSMEs waste 15+ hours/week manually checking 500+ portals for relevant tenders.',
    stat: '500+',
    statLabel: 'Portals to track',
  },
  {
    icon: <FileWarning className="h-6 w-6" />,
    title: 'Legal Complexity',
    description: 'Tender documents are 50–200 pages of dense legal language. Most MSMEs miss critical clauses.',
    stat: '73%',
    statLabel: 'Miss key clauses',
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: 'Missed Deadlines',
    description: 'Opportunities worth crores expire daily because businesses discover them too late.',
    stat: '₹2.4L Cr',
    statLabel: 'Annual market size',
  },
  {
    icon: <ShieldAlert className="h-6 w-6" />,
    title: 'Fraud Risk',
    description: 'Fake tender portals and fraudulent listings put businesses at financial and legal risk.',
    stat: '12%',
    statLabel: 'Fraudulent listings',
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-danger-400 text-sm font-semibold uppercase tracking-wider">The Problem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Why MSMEs Lose Contracts
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              India's public procurement ecosystem is broken for small businesses.
              The barriers aren't capability — they're information and process.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative p-6 rounded-xl border border-danger-500/10 bg-[var(--bg-card)] hover:border-danger-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-danger-500/10 flex items-center justify-center text-danger-400 mb-4">
                {point.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                {point.description}
              </p>
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-2xl font-bold text-danger-400">{point.stat}</span>
                <span className="text-xs text-[var(--text-tertiary)] ml-2">{point.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
