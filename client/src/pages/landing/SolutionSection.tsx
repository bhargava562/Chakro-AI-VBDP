import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Search, Shield, Brain, FileText, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const agents = [
  {
    id: 'ceo',
    icon: <Bot className="h-6 w-6" />,
    label: 'CEO Agent',
    subtitle: 'Orchestrator',
    color: '#6366f1',
    description: 'The central intelligence that coordinates all agents, prioritizes opportunities, and makes strategic recommendations based on your business profile.',
    capabilities: ['Strategic prioritization', 'Agent coordination', 'Risk assessment'],
  },
  {
    id: 'discovery',
    icon: <Search className="h-6 w-6" />,
    label: 'Discovery Agent',
    subtitle: 'Tender Scanner',
    color: '#3b82f6',
    description: 'Continuously scans 500+ government and private tender portals to find opportunities that match your capabilities and certifications.',
    capabilities: ['Multi-portal scanning', 'Smart matching', 'Deadline tracking'],
  },
  {
    id: 'security',
    icon: <Shield className="h-6 w-6" />,
    label: 'Security Agent',
    subtitle: 'Fraud & Compliance',
    color: '#10b981',
    description: 'Validates tender authenticity, checks domain security, verifies publishing organizations, and flags potential fraud or compliance risks.',
    capabilities: ['SSL validation', 'Domain verification', 'Fraud detection'],
  },
  {
    id: 'analysis',
    icon: <Brain className="h-6 w-6" />,
    label: 'Analysis Agent',
    subtitle: 'Document Intelligence',
    color: '#f59e0b',
    description: 'Uses RAG-based AI to deconstruct complex tender documents into plain-English summaries with eligibility scoring and requirement mapping.',
    capabilities: ['Document parsing', 'Eligibility scoring', 'Clause extraction'],
  },
  {
    id: 'response',
    icon: <FileText className="h-6 w-6" />,
    label: 'Response Agent',
    subtitle: 'Proposal Drafter',
    color: '#8b5cf6',
    description: 'Drafts compliant proposals based on tender requirements and your company profile. Always requires human approval before submission.',
    capabilities: ['Auto-drafting', 'Compliance check', 'Human-in-the-loop'],
  },
];

export function SolutionSection() {
  const [activeAgent, setActiveAgent] = useState(agents[0]);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">The Solution</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              5 AI Agents Working For You
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              A hierarchical multi-agent system that operates like a virtual business development team.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 items-start">
          {/* Agent List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-2"
          >
            {agents.map((agent) => (
              <motion.button
                key={agent.id}
                variants={fadeInUp}
                onClick={() => setActiveAgent(agent)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all cursor-pointer ${
                  activeAgent.id === agent.id
                    ? 'glass border border-brand-500/25'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
                >
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--text-primary)] text-sm">{agent.label}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{agent.subtitle}</div>
                </div>
                {activeAgent.id === agent.id && (
                  <ArrowRight className="h-4 w-4 text-brand-400 flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Agent Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAgent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass p-8 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${activeAgent.color}15`, color: activeAgent.color }}
                >
                  {activeAgent.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{activeAgent.label}</h3>
                  <p className="text-sm text-[var(--text-tertiary)]">{activeAgent.subtitle}</p>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {activeAgent.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Capabilities</h4>
                {activeAgent.capabilities.map((cap, i) => (
                  <motion.div
                    key={cap}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activeAgent.color }}
                    />
                    {cap}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
