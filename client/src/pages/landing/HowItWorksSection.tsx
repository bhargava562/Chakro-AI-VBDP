import { motion } from 'framer-motion';
import { Search, Brain, FileEdit } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const steps = [
  {
    icon: <Search className="h-5 w-5" />,
    title: 'Discover',
    description: 'Agents scan 500+ portals and surface tenders matched to your capabilities and certifications.',
    accent: 'from-brand-500/25 to-brand-500/5',
    glow: 'shadow-[0_0_0_1px_var(--border-brand)]',
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'Analyze',
    description: 'RAG + policy checks explain eligibility, risk, and compliance gaps in plain English.',
    accent: 'from-violet-500/25 to-violet-500/5',
    glow: 'shadow-[0_0_0_1px_var(--border-violet)]',
  },
  {
    icon: <FileEdit className="h-5 w-5" />,
    title: 'Respond',
    description: 'Draft a compliant proposal, review with your team, and submit with confidence.',
    accent: 'from-accent-500/25 to-accent-500/5',
    glow: 'shadow-[0_0_0_1px_var(--border-accent)]',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-[var(--text-brand)] text-sm font-semibold uppercase tracking-wider">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight">A 3-step workflow to win more tenders</h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Built like an AI command center: signal, context, and action — with government-grade reliability.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={
                'glass rounded-3xl border border-[var(--border-default)] p-8 relative overflow-hidden group ' + step.glow
              }
            >
              <div className={
                'absolute inset-0 bg-gradient-to-br opacity-60 ' + step.accent
              } />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-white mb-6 shadow-card group-hover:shadow-elevated transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
