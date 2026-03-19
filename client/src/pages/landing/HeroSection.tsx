import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Brain, Shield, Search, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { staggerContainer, fadeInUp } from '@/motion/variants';

const agentNodes = [
  { icon: <Search className="h-5 w-5" />, label: 'Discovery', color: '#3b82f6', x: -120, y: -80 },
  { icon: <Shield className="h-5 w-5" />, label: 'Security', color: '#10b981', x: 120, y: -80 },
  { icon: <Brain className="h-5 w-5" />, label: 'Analysis', color: '#f59e0b', x: -120, y: 80 },
  { icon: <FileText className="h-5 w-5" />, label: 'Response', color: '#8b5cf6', x: 120, y: 80 },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-brand-950 to-surface-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_50%)]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-brand)] bg-[var(--bg-brand-subtle)] text-[var(--text-brand)] text-sm font-semibold transition-all duration-300 hover:bg-[var(--bg-brand)] hover:scale-105">
              <Bot className="h-4 w-4" />
              AI-Powered Business Intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[var(--text-primary)] tracking-tight"
          >
            Win More Government & Private Contracts{' '}
            <span className="gradient-text bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">with AI</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed"
          >
            India's tender ecosystem is fragmented across 500+ portals. Chakro AI deploys
            5 intelligent agents to discover, analyze, and help you win contracts — automatically.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
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
              <Play className="h-5 w-5" />
              Sign In
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]"
          >
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent)]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent)]" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent)]" />
              MSME focused
            </span>
          </motion.div>
        </motion.div>

        {/* Right — AI Orchestration Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative hidden lg:flex items-center justify-center"
        >
          <div className="relative w-[400px] h-[400px]">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-200 -200 400 400">
              {agentNodes.map((node, i) => (
                <motion.line
                  key={i}
                  x1="0" y1="0"
                  x2={node.x} y2={node.y}
                  stroke={node.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                />
              ))}
            </svg>

            {/* CEO Agent — Center */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(99, 102, 241, 0.4)',
                  '0 0 0 20px rgba(99, 102, 241, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center z-10 border border-[var(--border-brand)] shadow-elevated"
            >
              <Bot className="h-8 w-8 text-white" />
            </motion.div>

            {/* Manager Agents */}
            {agentNodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2"
                style={{
                  transform: `translate(calc(-50% + ${node.x}px), calc(-50% + ${node.y}px))`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--border-default)] backdrop-blur-sm shadow-card"
                  style={{ backgroundColor: `${node.color}20`, color: node.color }}
                >
                  {node.icon}
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
