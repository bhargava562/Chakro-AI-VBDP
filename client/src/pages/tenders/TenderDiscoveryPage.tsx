import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { staggerContainer, cardVariant } from '@/motion/variants';
import type { RiskLevel } from '@/types';

const mockTenders = [
  { id: '1', title: 'IT Infrastructure Upgrade for Smart City Mission', org: 'Ministry of Urban Development', value: '₹4.2 Cr', match: 94, risk: 'low' as RiskLevel, deadline: '2026-03-15', source: 'GeM', category: 'IT Services', status: 'active' as const },
  { id: '2', title: 'Cloud-Based ERP System Development', org: 'Indian Railways', value: '₹8.5 Cr', match: 89, risk: 'medium' as RiskLevel, deadline: '2026-03-20', source: 'CPPP', category: 'Software', status: 'active' as const },
  { id: '3', title: 'Cybersecurity Assessment & SOC Setup', org: 'CERT-IN', value: '₹2.1 Cr', match: 82, risk: 'low' as RiskLevel, deadline: '2026-03-25', source: 'GeM', category: 'Cybersecurity', status: 'active' as const },
  { id: '4', title: 'AI/ML Platform for Agricultural Analytics', org: 'Ministry of Agriculture', value: '₹3.7 Cr', match: 76, risk: 'medium' as RiskLevel, deadline: '2026-04-01', source: 'State Portal', category: 'AI/ML', status: 'active' as const },
  { id: '5', title: 'Digital Payment Gateway Integration', org: 'NPCI', value: '₹1.8 Cr', match: 91, risk: 'low' as RiskLevel, deadline: '2026-03-18', source: 'Private', category: 'Fintech', status: 'closing_soon' as const },
  { id: '6', title: 'Network Infrastructure Modernization', org: 'BSNL', value: '₹12.4 Cr', match: 68, risk: 'high' as RiskLevel, deadline: '2026-04-10', source: 'CPPP', category: 'Networking', status: 'active' as const },
];

const riskColors = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' } as const;

export function TenderDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockTenders.filter(
    (t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.org.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Discover Tenders</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            AI-matched opportunities from 500+ portals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Search by title, organization, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-[var(--text-secondary)]">
        Showing <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span> opportunities
      </div>

      {/* Tender Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filtered.map((tender) => (
          <motion.div key={tender.id} variants={cardVariant}>
            <Card hover className="h-full flex flex-col cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant={tender.status === 'closing_soon' ? 'danger' : 'default'} dot>
                  {tender.source}
                </Badge>
                <Badge variant={riskColors[tender.risk]}>
                  {tender.risk} risk
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 line-clamp-2">
                {tender.title}
              </h3>
              <p className="text-xs text-[var(--text-tertiary)] mb-4">{tender.org}</p>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Match Score</span>
                  <span className="font-semibold text-brand-400">{tender.match}%</span>
                </div>
                <ProgressBar value={tender.match} variant="brand" size="sm" />
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{tender.value}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    Due: {new Date(tender.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
}
