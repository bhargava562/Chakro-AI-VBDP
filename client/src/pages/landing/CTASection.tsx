import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.10),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="glass rounded-3xl border border-[var(--border-default)] p-12 sm:p-16 overflow-hidden relative shadow-elevated">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-violet-500/10 to-accent-500/10" />
            <div className="relative grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                  Turn tenders into a repeatable growth engine.
                </h2>
                <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                  Start with a live demo of the AI command center — see matched tenders, explainable scoring,
                  and draft-ready responses.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button size="xl" className="glow-brand shadow-elevated hover:shadow-glow transition-all duration-300 hover:-translate-y-1" onClick={() => navigate('/login')}>
                    Live Demo
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate('/login')}
                  >
                    Request Access
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-card"
              >
                <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-semibold">What you get</div>
                <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-brand)]" />
                    Explainable match scoring
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-brand)]" />
                    Deadline & urgency signals
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-brand)]" />
                    Compliance + risk indicators
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-brand)]" />
                    Human-in-the-loop drafts
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
