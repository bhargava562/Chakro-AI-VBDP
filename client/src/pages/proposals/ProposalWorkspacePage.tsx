import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Sparkles, Save, Download, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { cn } from '@/lib/utils';

type SuggestionStatus = 'pending' | 'accepted' | 'rejected';

interface Suggestion {
  id: string;
  type: 'compliance' | 'improvement' | 'risk' | 'missing';
  clause: string;
  suggestion: string;
  confidence: number;
  status: SuggestionStatus;
}

const mockSuggestions: Suggestion[] = [
  { id: '1', type: 'compliance' as const, clause: 'Section 4.2 — Financial Qualification', suggestion: 'Add your audited balance sheet for FY 2024-25. The tender requires net worth > ₹1 Cr.', confidence: 92, status: 'pending' as const },
  { id: '2', type: 'improvement' as const, clause: 'Section 6.1 — Technical Approach', suggestion: 'Include specific AWS/Azure certifications. Your team\'s cloud experience strengthens this section.', confidence: 87, status: 'pending' as const },
  { id: '3', type: 'risk' as const, clause: 'Section 8.3 — Penalty Clause', suggestion: 'This clause has a 2% per week delay penalty. Propose milestone-based delivery to mitigate risk.', confidence: 78, status: 'pending' as const },
  { id: '4', type: 'missing' as const, clause: 'Section 3.1 — Experience Certificates', suggestion: 'Upload at least 3 completion certificates for similar government IT projects.', confidence: 95, status: 'pending' as const },
];

const typeConfig = {
  compliance: { icon: <Shield className="h-4 w-4" />, label: 'Compliance', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  improvement: { icon: <Sparkles className="h-4 w-4" />, label: 'Improvement', color: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  risk: { icon: <AlertTriangle className="h-4 w-4" />, label: 'Risk', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  missing: { icon: <XCircle className="h-4 w-4" />, label: 'Missing', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export function ProposalWorkspacePage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'suggestions' | 'versions'>('editor');
  const [complianceMode, setComplianceMode] = useState(false);
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const handleAccept = (id: string) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'accepted' as const } : s)));
  };

  const handleReject = (id: string) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s)));
  };

  const tabs = [
    { id: 'editor', label: 'Editor' },
    { id: 'suggestions', label: `AI Suggestions (${suggestions.filter((s) => s.status === 'pending').length})` },
    { id: 'versions', label: 'Versions' },
  ] as const;

  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Proposal Workspace</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            IT Infrastructure Upgrade — Ministry of Finance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setComplianceMode(!complianceMode)}>
            {complianceMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {complianceMode ? 'Hide Compliance' : 'Compliance Mode'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Compliance Score:</span>
          <ProgressBar value={78} variant="success" size="sm" className="w-24" />
          <span className="text-sm font-semibold text-accent-400">78%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Status:</span>
          <Badge variant="warning">Draft</Badge>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1.5 text-xs text-accent-400"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
          Auto-saved
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-default)]">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid lg:grid-cols-[1fr,360px] gap-6"
          >
            {/* Editor */}
            <Card className="min-h-[500px]">
              <div className="prose prose-invert max-w-none">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[400px] p-2 focus:outline-none text-sm text-[var(--text-primary)] leading-relaxed"
                >
                  <h2 className="text-lg font-bold mb-4">Technical Proposal — IT Infrastructure Upgrade</h2>
                  <h3 className="text-base font-semibold mb-2">1. Executive Summary</h3>
                  <p className="mb-4 text-[var(--text-secondary)]">
                    We propose a comprehensive IT infrastructure modernization plan for the Ministry of Finance, leveraging our 8+ years of experience in government IT projects. Our approach combines cloud-native architecture with enterprise-grade security to deliver a scalable, resilient, and cost-effective solution.
                  </p>
                  <h3 className="text-base font-semibold mb-2">2. Technical Approach</h3>
                  <p className="mb-4 text-[var(--text-secondary)]">
                    The proposed solution architecture follows a microservices-based approach deployed on a hybrid cloud infrastructure. Key components include automated CI/CD pipelines, zero-trust security model, and comprehensive monitoring with 99.9% uptime SLA compliance.
                  </p>
                  <h3 className="text-base font-semibold mb-2">3. Team Composition</h3>
                  <p className="text-[var(--text-secondary)]">
                    Our dedicated team of 15+ certified engineers includes AWS Solutions Architects, Kubernetes specialists, and cybersecurity professionals with active government security clearances.
                  </p>
                </div>
              </div>
            </Card>

            {/* Sidebar — Quick Suggestions */}
            {complianceMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Compliance Issues</h3>
                {suggestions.filter((s) => s.status === 'pending').map((s) => (
                  <div
                    key={s.id}
                    className={cn('p-3 rounded-lg border text-sm', typeConfig[s.type].color)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {typeConfig[s.type].icon}
                      <span className="font-medium">{s.clause}</span>
                    </div>
                    <p className="text-xs opacity-80">{s.suggestion}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                layout
                className={cn(
                  'p-5 rounded-xl border',
                  suggestion.status === 'accepted' && 'border-accent-500/30 bg-accent-500/5',
                  suggestion.status === 'rejected' && 'border-surface-600 opacity-50',
                  suggestion.status === 'pending' && 'border-[var(--border-default)] bg-[var(--bg-card)]'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium', typeConfig[suggestion.type].color)}>
                        {typeConfig[suggestion.type].icon}
                        {typeConfig[suggestion.type].label}
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        Confidence: {suggestion.confidence}%
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">{suggestion.clause}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{suggestion.suggestion}</p>
                  </div>

                  {suggestion.status === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAccept(suggestion.id)}
                        className="p-2 rounded-lg bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReject(suggestion.id)}
                        className="p-2 rounded-lg bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 transition-colors cursor-pointer"
                      >
                        <XCircle className="h-5 w-5" />
                      </motion.button>
                    </div>
                  )}

                  {suggestion.status === 'accepted' && (
                    <Badge variant="success">Accepted</Badge>
                  )}
                  {suggestion.status === 'rejected' && (
                    <Badge variant="default">Dismissed</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'versions' && (
          <motion.div
            key="versions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {[
              { version: 3, date: '1 Mar 2026, 7:30 PM', author: 'AI Draft + Manual Edits', changes: 'Added team composition section' },
              { version: 2, date: '28 Feb 2026, 2:15 PM', author: 'AI Draft', changes: 'Initial technical approach generated by Analysis Agent' },
              { version: 1, date: '27 Feb 2026, 10:00 AM', author: 'System', changes: 'Auto-generated from tender requirements' },
            ].map((v) => (
              <div key={v.version} className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                  v{v.version}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{v.changes}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{v.author} • {v.date}</div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
