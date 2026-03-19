import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/motion/variants';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/month',
    description: 'For individual MSMEs exploring tender opportunities.',
    features: [
      'Up to 50 tender matches/month',
      'Basic AI analysis',
      '1 user seat',
      'Email alerts',
      'Standard support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹9,999',
    period: '/month',
    description: 'For growing businesses with serious ambitions.',
    features: [
      'Unlimited tender matches',
      'Advanced AI analysis & scoring',
      'Proposal workspace',
      '5 user seats',
      'Real-time WebSocket alerts',
      'Audit logs',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom requirements.',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Custom AI models',
      'API access',
      'Dedicated account manager',
      'SSO & advanced security',
      'SLA guarantee',
      'On-premises deployment option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Pricing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Plans Built for MSMEs
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Start free. Scale when you're ready. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className={cn(
                'rounded-2xl border p-8 relative',
                plan.popular
                  ? 'border-brand-500/50 bg-[var(--bg-card)] shadow-[var(--shadow-glow)]'
                  : 'border-[var(--border-default)] bg-[var(--bg-card)]'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                <span className="text-[var(--text-tertiary)]">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-accent-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
