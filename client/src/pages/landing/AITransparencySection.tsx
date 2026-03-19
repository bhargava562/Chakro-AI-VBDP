import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { staggerContainer, fadeInUp } from '@/motion/variants';

export function AITransparencySection() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">AI Transparency</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              See Why This Tender Matches You
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Every AI decision is explainable. No black boxes. Full visibility into match scoring,
              risk analysis, and eligibility criteria.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Mock Tender Analysis Card */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    IT Infrastructure Upgrade — Ministry of Finance
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    GeM Portal • Estimated Value: ₹2.4 Crore • Deadline: 15 Mar 2026
                  </p>
                </div>
                <Badge variant="success" dot>92% Match</Badge>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left — Scores */}
              <motion.div variants={fadeInUp} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Eligibility Score</span>
                    <span className="text-sm font-semibold text-accent-400">87%</span>
                  </div>
                  <ProgressBar value={87} variant="success" size="md" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Technical Fit</span>
                    <span className="text-sm font-semibold text-brand-400">94%</span>
                  </div>
                  <ProgressBar value={94} variant="brand" size="md" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Financial Risk</span>
                    <span className="text-sm font-semibold text-warning-400">Low</span>
                  </div>
                  <ProgressBar value={25} variant="warning" size="md" />
                </div>
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--text-secondary)]">AI Confidence:</span>
                    <span className="font-semibold text-brand-400">High (91%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-[var(--text-secondary)]">Estimated Effort:</span>
                    <span className="font-medium text-[var(--text-primary)]">3-4 weeks</span>
                  </div>
                </div>
              </motion.div>

              {/* Right — AI Explanation */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Why This Matches</h4>
                <div className="space-y-3">
                  {[
                    'Your ISO 27001 certification meets the security requirement',
                    'Past experience with government IT projects (3 completed)',
                    'Team size meets minimum staffing criteria (15+ engineers)',
                    'geographic presence in required regions (Delhi NCR)',
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-accent-400 mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <h4 className="text-sm font-semibold text-[var(--text-primary)] pt-2">Missing Criteria</h4>
                <div className="space-y-2">
                  {[
                    'CMMI Level 3 certification (you have Level 2)',
                    'EMD of ₹5L required — confirm availability',
                  ].map((missing, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-warning-400 mt-0.5">⚠</span>
                      <span>{missing}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
