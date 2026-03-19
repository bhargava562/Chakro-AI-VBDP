import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Brain, FileText, AlertTriangle, Activity, Bot, Search, Shield, FileEdit } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { staggerContainer, cardVariant } from '@/motion/variants';
import { agentPulse } from '@/motion/agentAnimations';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

// ============================================
// MOCK DATA
// ============================================
const kpiData = [
  { label: 'SME Strength Score', value: '87', suffix: '/100', icon: <TrendingUp className="h-5 w-5" />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  { label: 'Active Opportunities', value: '24', icon: <Target className="h-5 w-5" />, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { label: 'Deadlines This Week', value: '5', icon: <Clock className="h-5 w-5" />, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  { label: 'AI Confidence Index', value: '91%', icon: <Brain className="h-5 w-5" />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
];

const tenderAlerts = [
  { id: '1', title: 'IT Infrastructure Upgrade — MoF', org: 'Ministry of Finance', value: '₹2.4 Cr', match: 92, risk: 'low' as const, deadline: '3d left', source: 'GeM' },
  { id: '2', title: 'Cloud Migration Services — RBI', org: 'Reserve Bank of India', value: '₹5.1 Cr', match: 87, risk: 'medium' as const, deadline: '5d left', source: 'CPPP' },
  { id: '3', title: 'Cybersecurity Audit — UIDAI', org: 'UIDAI', value: '₹1.8 Cr', match: 78, risk: 'low' as const, deadline: '7d left', source: 'GeM' },
  { id: '4', title: 'Data Analytics Platform — NITI', org: 'NITI Aayog', value: '₹3.2 Cr', match: 85, risk: 'low' as const, deadline: '10d left', source: 'State Portal' },
];

const agentStatuses = [
  { type: 'discovery' as const, label: 'Discovery Agent', status: 'Scanning 34 portals...', icon: <Search className="h-5 w-5" />, color: '#3b82f6', active: true },
  { type: 'security' as const, label: 'Security Agent', status: 'Validating 3 domains', icon: <Shield className="h-5 w-5" />, color: '#10b981', active: true },
  { type: 'analysis' as const, label: 'Analysis Agent', status: 'Processing 2 documents', icon: <Brain className="h-5 w-5" />, color: '#f59e0b', active: true },
  { type: 'response' as const, label: 'Response Agent', status: 'Idle — awaiting task', icon: <FileEdit className="h-5 w-5" />, color: '#8b5cf6', active: false },
  { type: 'ceo' as const, label: 'CEO Orchestrator', status: 'Coordinating agents', icon: <Bot className="h-5 w-5" />, color: '#6366f1', active: true },
];

const industryData = [
  { industry: 'IT Services', count: 45, value: 120 },
  { industry: 'Consulting', count: 32, value: 85 },
  { industry: 'Infrastructure', count: 28, value: 200 },
  { industry: 'Healthcare', count: 18, value: 65 },
  { industry: 'Education', count: 12, value: 40 },
];

const winTrendData = [
  { month: 'Sep', probability: 45, submitted: 8 },
  { month: 'Oct', probability: 52, submitted: 12 },
  { month: 'Nov', probability: 48, submitted: 10 },
  { month: 'Dec', probability: 61, submitted: 15 },
  { month: 'Jan', probability: 58, submitted: 14 },
  { month: 'Feb', probability: 72, submitted: 18 },
];

const recentProposals = [
  { id: '1', title: 'Cloud Migration Proposal — RBI', status: 'pending_approval' as const, confidence: 88, date: '28 Feb 2026' },
  { id: '2', title: 'Security Audit Response — UIDAI', status: 'draft' as const, confidence: 76, date: '27 Feb 2026' },
  { id: '3', title: 'IT Infra Proposal — MoF', status: 'approved' as const, confidence: 94, date: '25 Feb 2026' },
];

const complianceWarnings = [
  { id: '1', message: 'CMMI Level 3 certification expiring in 30 days', level: 'warning' as const },
  { id: '2', message: 'EMD bank guarantee for RBI tender needs renewal', level: 'urgent' as const },
  { id: '3', message: 'GST compliance certificate uploaded successfully', level: 'info' as const },
];

// ============================================
// RISK COLOR MAP
// ============================================
const riskColors = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' } as const;

const proposalStatusConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  pending_approval: { label: 'Pending Approval', variant: 'warning' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  ai_review: { label: 'AI Review', variant: 'brand' as const },
  submitted: { label: 'Submitted', variant: 'info' as const },
  rejected: { label: 'Rejected', variant: 'danger' as const },
};

// ============================================
// DASHBOARD COMPONENT
// ============================================
export function DashboardPage() {
  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Command Center</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back. Your AI agents have been busy — here's what they found.
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiData.map((kpi, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', kpi.bg, kpi.color)}>
                {kpi.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[var(--text-primary)]">{kpi.value}</span>
              {kpi.suffix && <span className="text-sm text-[var(--text-tertiary)]">{kpi.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Tender Alerts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tender Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand-400" />
                Real-Time Tender Alerts
              </CardTitle>
              <Badge variant="brand" dot>Live</Badge>
            </CardHeader>
            <div className="space-y-3">
              {tenderAlerts.map((tender, i) => (
                <motion.div
                  key={tender.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-subtle)] hover:border-brand-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[var(--text-primary)] truncate">{tender.title}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{tender.org} • {tender.source}</div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{tender.value}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={riskColors[tender.risk]}>{tender.match}% match</Badge>
                      <span className="text-xs text-[var(--text-tertiary)]">{tender.deadline}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-700)" />
                    <XAxis dataKey="industry" tick={{ fontSize: 11, fill: 'var(--color-surface-400)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-surface-400)' }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--color-surface-800)', border: '1px solid var(--color-surface-700)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win Probability Trend</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={winTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-700)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-surface-400)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-surface-400)' }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--color-surface-800)', border: '1px solid var(--color-surface-700)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="probability" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                    <Line type="monotone" dataKey="submitted" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* Right — Agent Activity + Recent */}
        <div className="space-y-6">
          {/* Agent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-400" />
                Agent Activity
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {agentStatuses.map((agent) => (
                <motion.div
                  key={agent.type}
                  variants={agentPulse}
                  animate={agent.active ? 'active' : 'idle'}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)]"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)]">{agent.label}</div>
                    <div className="text-xs text-[var(--text-tertiary)] truncate">{agent.status}</div>
                  </div>
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', agent.active ? 'bg-accent-400' : 'bg-surface-500')} />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent Proposals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-400" />
                Recent Proposals
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="p-3 rounded-lg border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">{proposal.title}</span>
                    <Badge variant={proposalStatusConfig[proposal.status].variant}>
                      {proposalStatusConfig[proposal.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-tertiary)]">{proposal.date}</span>
                    <ProgressBar value={proposal.confidence} variant="brand" size="sm" className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Compliance Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-400" />
                Compliance
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {complianceWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className={cn(
                    'p-3 rounded-lg text-sm flex items-start gap-2',
                    warning.level === 'urgent' && 'bg-danger-500/10 text-danger-400',
                    warning.level === 'warning' && 'bg-warning-500/10 text-warning-400',
                    warning.level === 'info' && 'bg-blue-500/10 text-blue-400',
                  )}
                >
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{warning.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
