import { Shield, Lock, Server, CheckCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const trustItems = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption for all data at rest and TLS 1.3 in transit.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'SSL Domain Validation',
    description: 'Every tender source is validated for SSL certificates and domain authenticity.',
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: 'Cloud Infrastructure',
    description: 'Deployed on enterprise-grade cloud (AWS/Azure) with 99.9% uptime SLA.',
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Compliance Scoring',
    description: 'Real-time compliance checks against tender requirements and regulatory standards.',
  },
];

export function TrustSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">Trust & Security</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Enterprise-Grade Security
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Your business data is protected with the highest security standards. Privacy-first architecture.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-accent-500/10 bg-[var(--bg-card)] text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-400 mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
