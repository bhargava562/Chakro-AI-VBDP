
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, UserPlus, FileText, RefreshCw, Download, Save, X,
  CheckCircle2, Clock, Tag, Building2, TrendingUp, ChevronRight,
  Loader2, ScanSearch, FileSearch, Sparkles, Bell, Trash2,
  BookOpen, Eye,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#050D1A',
  card: 'rgba(10,22,40,0.75)',
  cardSolid: '#081426',
  border: 'rgba(255,255,255,0.06)',
  teal: '#00C2A8',
  blue: '#0078FF',
  gold: '#F5A623',
  text: '#F0F4FF',
  muted: '#8A9BB8',
  dim: '#3D5070',
  green: '#22C55E',
  red: '#EF4444',
  purple: '#A855F7',
};

const AVATAR_COLORS = ['#00C2A8', '#0078FF', '#F5A623', '#A855F7', '#22C55E', '#EF4444'];

// ─── Types ────────────────────────────────────────────────────────────────────
export type WorkspaceMember = {
  id: string; name: string; email: string;
  initials: string; color: string; role: 'Owner' | 'Member';
};

export type WorkspaceData = {
  id: number; name: string; desc: string; industry: string;
  size: string; goal: string; location: string; createdAt: string;
  members: WorkspaceMember[]; activity: string;
};

type TenderTag = { label: string; color: string };

type Tender = {
  id: number;
  title: string;
  source: string;
  summary: string;
  tags: TenderTag[];
  deadline: string;
  budget: string;
  eligibility: string;
  highlighted?: boolean;
};

type ReportSection = { title: string; content: string };
type Report = {
  tender: Tender;
  summary: string;
  sections: ReportSection[];
};

type SavedReport = {
  id: string;
  report: Report;
  savedAt: string;
};

// ─── PDF Generator ────────────────────────────────────────────────────────────
function downloadReportAsPdf(report: Report) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Background ──
  doc.setFillColor(5, 13, 26);
  doc.rect(0, 0, pageW, pageH, 'F');

  // ── Header bar ──
  doc.setFillColor(8, 20, 38);
  doc.roundedRect(margin - 8, y - 10, contentW + 16, 72, 8, 8, 'F');
  doc.setDrawColor(0, 194, 168);
  doc.setLineWidth(0.5);
  doc.line(margin - 8, y - 10, margin - 8 + contentW + 16, y - 10);

  // Badge
  doc.setFillColor(0, 194, 168, 0.15);
  doc.setFillColor(12, 40, 60);
  doc.roundedRect(margin, y, 130, 16, 4, 4, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 194, 168);
  doc.text('AI GENERATED REPORT  •  VBDP', margin + 8, y + 11);

  y += 24;
  doc.setFontSize(15);
  doc.setTextColor(240, 244, 255);
  const titleLines = doc.splitTextToSize(report.tender.title, contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20 + 6;

  doc.setFontSize(9);
  doc.setTextColor(138, 155, 184);
  doc.text(`Source: ${report.tender.source}`, margin, y);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`Generated: ${dateStr}`, pageW - margin, y, { align: 'right' });
  y += 32;

  // ── Key metrics row ──
  const metricW = (contentW - 16) / 3;
  [
    { label: 'Deadline', value: report.tender.deadline },
    { label: 'Budget', value: report.tender.budget },
    { label: 'Win Probability', value: '82%' },
  ].forEach((m, idx) => {
    const mx = margin + idx * (metricW + 8);
    doc.setFillColor(10, 22, 40);
    doc.roundedRect(mx, y, metricW, 44, 6, 6, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(61, 80, 112);
    doc.text(m.label.toUpperCase(), mx + 10, y + 14);
    doc.setFontSize(12);
    doc.setTextColor(240, 244, 255);
    doc.text(m.value, mx + 10, y + 32);
  });
  y += 60;

  // ── Tags ──
  doc.setFontSize(8.5);
  let tx = margin;
  report.tender.tags.forEach(tag => {
    const tw = doc.getTextWidth(tag.label) + 18;
    doc.setFillColor(10, 22, 40);
    doc.roundedRect(tx, y, tw, 18, 4, 4, 'F');
    doc.setTextColor(138, 155, 184);
    doc.text(tag.label, tx + 9, y + 12.5);
    tx += tw + 8;
  });
  y += 36;

  // ── Divider ──
  doc.setDrawColor(255, 255, 255, 0.06);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // ── AI Summary box ──
  checkPage(80);
  doc.setFillColor(8, 20, 38);
  doc.roundedRect(margin - 8, y - 8, contentW + 16, 14, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(0, 194, 168);
  doc.text('✦  AI SUMMARY', margin, y + 3);
  y += 20;

  doc.setFillColor(6, 16, 30);
  const summaryLines = doc.splitTextToSize(report.summary, contentW - 16);
  const summaryH = summaryLines.length * 14 + 24;
  checkPage(summaryH);
  doc.roundedRect(margin - 8, y - 8, contentW + 16, summaryH, 6, 6, 'F');
  doc.setDrawColor(0, 194, 168, 0.15);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin - 8, y - 8, contentW + 16, summaryH, 6, 6, 'S');
  doc.setFontSize(9.5);
  doc.setTextColor(138, 155, 184);
  doc.text(summaryLines, margin, y + 10, { lineHeightFactor: 1.55 });
  y += summaryH + 16;

  // ── Sections ──
  report.sections.forEach((section) => {
    const lines = doc.splitTextToSize(section.content, contentW - 16);
    const blockH = lines.length * 14 + 56;
    checkPage(blockH);

    // Section heading
    doc.setFillColor(8, 20, 38);
    doc.roundedRect(margin - 8, y - 4, contentW + 16, 22, 4, 4, 'F');
    // teal dot
    doc.setFillColor(0, 194, 168);
    doc.circle(margin + 2, y + 7, 2.5, 'F');
    doc.setFontSize(10.5);
    doc.setTextColor(240, 244, 255);
    doc.text(section.title, margin + 12, y + 12);
    y += 28;

    // Content
    doc.setFontSize(9.5);
    doc.setTextColor(138, 155, 184);
    doc.text(lines, margin, y, { lineHeightFactor: 1.55 });
    y += lines.length * 14 + 6;

    // Divider
    doc.setDrawColor(255, 255, 255, 0.05);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 6, pageW - margin, y + 6);
    y += 24;
  });

  // ── Footer ──
  // @ts-expect-error internal is not part of the public API
  const totalPages = (doc as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(5, 13, 26);
    doc.rect(0, pageH - 32, pageW, 32, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(61, 80, 112);
    doc.text('VBDP  •  Confidential AI Report', margin, pageH - 14);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 14, { align: 'right' });
  }

  const safeTitle = report.tender.title.replace(/[^a-z0-9]/gi, '_').slice(0, 60);
  doc.save(`VBDP_Report_${safeTitle}.pdf`);
}

// ─── Mock tender data ─────────────────────────────────────────────────────────
const MOCK_TENDERS: Tender[] = [
  {
    id: 1,
    title: 'Smart Cities Mission — IoT Infrastructure Deployment',
    source: 'MeitY / Government Portal',
    summary:
      'The Ministry of Electronics & IT is inviting bids for large-scale IoT sensor deployment across Tier-2 smart cities. Includes edge computing setup and real-time data dashboards for municipal governance.',
    tags: [
      { label: 'Open to MSMEs', color: C.green },
      { label: 'Deadline: Apr 10', color: C.gold },
      { label: '₹4.2 Cr Budget', color: C.blue },
    ],
    deadline: 'Apr 10, 2026',
    budget: '₹4.2 Cr',
    eligibility: 'MSMEs with ISO 9001 certification and 3+ years of IoT project experience.',
    highlighted: true,
  },
  {
    id: 2,
    title: 'NPMASS — MSME Digital Transformation Grant',
    source: 'NPMASS / MSME Ministry',
    summary:
      'National Program for MSME Sector Support is offering grants for digital transformation initiatives. Focus areas include ERP adoption, cybersecurity upgrades, and e-commerce enablement.',
    tags: [
      { label: 'Grant (Non-repayable)', color: C.purple },
      { label: 'Deadline: Apr 18', color: C.gold },
      { label: '₹50L – ₹2Cr', color: C.blue },
    ],
    deadline: 'Apr 18, 2026',
    budget: '₹50L – ₹2Cr',
    eligibility: 'Registered MSMEs with Udyam certificate, turnover < ₹250Cr.',
  },
  {
    id: 3,
    title: 'Defence R&D Vendor Empanelment — Electronics',
    source: 'DRDO / Raksha Mantralaya',
    summary:
      'DRDO seeks empanelment of domestic electronics vendors for prototype development of communication modules. Long-term contracts with technology transfer provisions included.',
    tags: [
      { label: 'High Opportunity', color: C.teal },
      { label: 'Deadline: May 1', color: C.gold },
      { label: 'Classified Budget', color: C.dim },
    ],
    deadline: 'May 1, 2026',
    budget: 'Classified',
    eligibility: 'Indian entities with DIPP registration and security clearance.',
  },
  {
    id: 4,
    title: 'National Health Mission — Diagnostic Equipment Supply',
    source: 'NHM / Health Ministry',
    summary:
      'Procurement of diagnostic equipment for primary health centres across rural districts. Includes installation, 5-year AMC, and staff training requirements.',
    tags: [
      { label: 'Open Bid', color: C.green },
      { label: 'Deadline: Apr 25', color: C.gold },
      { label: '₹8.7 Cr Budget', color: C.blue },
    ],
    deadline: 'Apr 25, 2026',
    budget: '₹8.7 Cr',
    eligibility: 'FDA-registered medical device manufacturers or authorised distributors.',
  },
];

function generateReport(tender: Tender): Report {
  return {
    tender,
    summary: `This tender presents a strong opportunity for your workspace profile. Based on AI analysis, the ${tender.title} aligns well with your industry focus and business size. Key success factors include compliance documentation and a competitive pricing strategy.`,
    sections: [
      {
        title: 'Overview',
        content: `The ${tender.title} is issued by ${tender.source}. The total budget is ${tender.budget} with a submission deadline of ${tender.deadline}. This is a ${tender.highlighted ? 'high-priority' : 'standard'} opportunity in your sector.`,
      },
      {
        title: 'Eligibility Criteria',
        content: tender.eligibility,
      },
      {
        title: 'Required Documents',
        content:
          'Registration certificates (GST, PAN, Udyam), audited financials (last 3 years), technical capability statement, project portfolio (similar work), ISO/quality certifications, EMD/bid security deposit.',
      },
      {
        title: 'Opportunity Analysis',
        content:
          'AI Win Probability: 82%. Competitive landscape shows 4–6 likely bidders. Recommended strategy: focus on technical superiority and local presence documentation. Ensure all compliance documents are current before submission.',
      },
    ],
  };
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function Avatar({ member, size = 32 }: { member: WorkspaceMember; size?: number }) {
  return (
    <div
      title={member.name}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `${member.color}22`, border: `2px solid ${member.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: size * 0.38, color: member.color, flexShrink: 0,
      }}
    >
      {member.initials}
    </div>
  );
}

function TagBadge({ label, color }: TenderTag) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: '6px', padding: '3px 9px',
      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
      color, letterSpacing: '0.3px', whiteSpace: 'nowrap' as const,
    }}>
      {label}
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({
  report, onClose, onSave, onDownload, alreadySaved,
}: {
  report: Report;
  onClose: () => void;
  onSave: () => void;
  onDownload: () => void;
  alreadySaved: boolean;
}) {
  const [justSaved, setJustSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSave = () => {
    if (alreadySaved || justSaved) return;
    onSave();
    setJustSaved(true);
  };

  const handleDownload = async () => {
    setDownloading(true);
    // small delay so spinner is visible
    await new Promise(r => setTimeout(r, 300));
    onDownload();
    setDownloading(false);
  };

  const isSaved = alreadySaved || justSaved;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.8)', backdropFilter: 'blur(12px)', zIndex: 400 }}
      />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 401, padding: '20px', pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '640px', maxHeight: '88vh',
            overflowY: 'auto', borderRadius: '20px',
            background: '#081426', border: `1px solid ${C.border}`,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            pointerEvents: 'all',
          }}
        >
          {/* Header */}
          <div style={{ padding: '28px 32px 20px', position: 'sticky', top: 0, background: '#081426', zIndex: 1, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,194,168,0.12)', border: '1px solid rgba(0,194,168,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} color={C.teal} />
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.teal, letterSpacing: '1px', textTransform: 'uppercase' }}>AI Generated Report</div>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: C.text, lineHeight: 1.3, maxWidth: '460px' }}>
                  {report.tender.title}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.dim }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI Summary */}
            <div style={{ background: 'linear-gradient(135deg, rgba(0,194,168,0.06) 0%, rgba(0,120,255,0.04) 100%)', border: '1px solid rgba(0,194,168,0.15)', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                <Sparkles size={13} color={C.teal} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.teal, letterSpacing: '1px', textTransform: 'uppercase' }}>AI Summary</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted, lineHeight: 1.7, margin: 0 }}>
                {report.summary}
              </p>
            </div>

            {/* Sections */}
            {report.sections.map((s, i) => (
              <div key={`section-${i}`} style={{ borderBottom: i < report.sections.length - 1 ? `1px solid ${C.border}` : 'none', paddingBottom: i < report.sections.length - 1 ? '20px' : 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: C.text, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                  {s.title}
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.7, margin: 0 }}>
                  {s.content}
                </p>
              </div>
            ))}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              {/* Download PDF */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,194,168,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={downloading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)', border: 'none', borderRadius: '11px', padding: '12px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.8 : 1, transition: 'opacity 0.2s' }}
              >
                {downloading
                  ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating PDF…</>
                  : <><Download size={15} /> Download PDF</>}
              </motion.button>

              {/* Save to workspace */}
              <motion.button
                whileHover={!isSaved ? { scale: 1.02, borderColor: `${C.teal}50` } : {}}
                whileTap={!isSaved ? { scale: 0.97 } : {}}
                onClick={handleSave}
                disabled={isSaved}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  background: isSaved ? 'rgba(34,197,94,0.08)' : 'rgba(0,0,0,0)',
                  border: `1px solid ${isSaved ? C.green + '40' : C.border}`,
                  borderRadius: '11px', padding: '12px',
                  color: isSaved ? C.green : C.muted,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                  cursor: isSaved ? 'default' : 'pointer', transition: 'all 0.2s',
                }}
              >
                {isSaved
                  ? <><CheckCircle2 size={15} /> Saved to Workspace</>
                  : <><Save size={15} /> Save to Workspace</>}
              </motion.button>
            </div>

            {/* Save hint */}
            {!isSaved && (
              <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: C.dim, textAlign: 'center' }}>
                Saving adds this report to the Saved Reports section of this workspace
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Tender Card ──────────────────────────────────────────────────────────────
function TenderCard({ tender, i, onGenerate, onViewDetails }: {
  tender: Tender;
  i: number;
  onGenerate: (t: Tender) => void;
  onViewDetails: (t: Tender) => void;
}) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setGenerating(false);
    onGenerate(tender);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{
        background: C.card, backdropFilter: 'blur(16px)',
        border: `1px solid ${tender.highlighted ? 'rgba(0,194,168,0.2)' : C.border}`,
        borderRadius: '16px', padding: '22px 24px',
        display: 'flex', flexDirection: 'column', gap: '14px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {tender.highlighted && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #00C2A8, #0078FF)', borderRadius: '16px 16px 0 0' }} />
      )}

      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px', height: '40px', flexShrink: 0, borderRadius: '11px',
          background: tender.highlighted ? 'rgba(0,194,168,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${tender.highlighted ? 'rgba(0,194,168,0.25)' : C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tender.highlighted ? C.teal : C.muted,
        }}>
          <FileSearch size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: C.text, lineHeight: 1.3 }}>
              {tender.title}
            </div>
            {tender.highlighted && (
              <div style={{ flexShrink: 0, background: 'rgba(0,194,168,0.12)', border: '1px solid rgba(0,194,168,0.25)', borderRadius: '5px', padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: C.teal, letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                TOP MATCH
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.dim }}>
            <Building2 size={11} /> {tender.source}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.65, margin: 0 }}>
        {tender.summary}
      </p>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tender.tags.map((tag, tagIdx) => <TagBadge key={`${tender.id}-tag-${tagIdx}`} {...tag} />)}
      </div>

      <div style={{ display: 'flex', gap: '8px', paddingTop: '2px' }}>
        <motion.button
          whileHover={{ borderColor: 'rgba(255,255,255,0.15)', color: C.text }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onViewDetails(tender)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(0,0,0,0)', border: `1px solid ${C.border}`, borderRadius: '9px', padding: '9px', color: C.muted, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
        >
          <ChevronRight size={13} /> View Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 16px rgba(0,194,168,0.18)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          disabled={generating}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(90deg, #00C2A8, #0078FF)', border: 'none', borderRadius: '9px', padding: '9px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.8 : 1 }}
        >
          {generating
            ? <><Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating…</>
            : <><FileText size={13} /> Generate Report</>}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Tender Detail Side Panel ─────────────────────────────────────────────────
function TenderDetailPanel({ tender, onClose, onGenerate }: { tender: Tender; onClose: () => void; onGenerate: (t: Tender) => void }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setGenerating(false);
    onGenerate(tender);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.6)', backdropFilter: 'blur(6px)', zIndex: 350 }}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '420px', maxWidth: '90vw',
          background: '#081426', borderLeft: `1px solid ${C.border}`,
          zIndex: 351, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', position: 'sticky', top: 0, background: '#081426', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.teal, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Tender Details</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: C.text, lineHeight: 1.3 }}>{tender.title}</div>
          </div>
          <button onClick={onClose} style={{ flexShrink: 0, width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.dim }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted }}>
            <Building2 size={14} color={C.dim} /> {tender.source}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tender.tags.map((tag, tagIdx) => <TagBadge key={`detail-${tender.id}-tag-${tagIdx}`} {...tag} />)}
          </div>

          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.teal, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>AI Summary</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.7, margin: 0 }}>{tender.summary}</p>
          </div>

          {[
            { label: 'Deadline', value: tender.deadline, icon: <Clock size={13} /> },
            { label: 'Budget', value: tender.budget, icon: <TrendingUp size={13} /> },
            { label: 'Eligibility', value: tender.eligibility, icon: <Tag size={13} color={C.dim} /> },
          ].map(item => (
            <div key={item.label} style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.text }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px 24px', borderTop: `1px solid ${C.border}` }}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,194,168,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={generating}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)', border: 'none', borderRadius: '11px', padding: '13px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.8 : 1 }}
          >
            {generating
              ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating Report…</>
              : <><FileText size={15} /> Generate Report</>}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onScan }: { onScan: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '72px 32px', textAlign: 'center',
        background: C.card, backdropFilter: 'blur(16px)',
        border: `1px solid ${C.border}`, borderRadius: '20px',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(0,194,168,0.06)', border: '1.5px dashed rgba(0,194,168,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
        }}>
          <ScanSearch size={32} color="rgba(0,194,168,0.45)" />
        </div>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7 }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,194,168,0.2)' }}
          />
        ))}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: C.text, marginBottom: '8px' }}>
        No tenders found yet
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted, maxWidth: '300px', lineHeight: 1.65, marginBottom: '28px' }}>
        Click below to start discovering relevant tenders for this workspace
      </div>
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(0,194,168,0.25)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onScan}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
          border: 'none', borderRadius: '12px',
          color: '#fff', fontFamily: 'DM Sans, sans-serif',
          fontWeight: 600, fontSize: '15px', padding: '13px 28px', cursor: 'pointer',
        }}
      >
        <ScanSearch size={17} /> Scan for Tenders
      </motion.button>
    </motion.div>
  );
}

// ─── Saved Reports Section ────────────────────────────────────────────────────
const REPORT_ACCENT_COLORS = [C.teal, C.blue, C.purple, C.gold, C.green];

function SavedReportsSection({
  savedReports,
  onView,
  onDelete,
}: {
  savedReports: SavedReport[];
  onView: (sr: SavedReport) => void;
  onDelete: (id: string) => void;
}) {
  if (savedReports.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: C.gold, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Saved Reports
          </div>
          <div style={{
            background: `${C.gold}18`, border: `1px solid ${C.gold}30`,
            borderRadius: '99px', padding: '2px 9px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.gold,
          }}>
            {savedReports.length}
          </div>
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.dim }}>
          Saved in this workspace
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        <AnimatePresence>
          {savedReports.map((sr, idx) => {
            const accent = REPORT_ACCENT_COLORS[idx % REPORT_ACCENT_COLORS.length];
            return (
              <motion.div
                key={sr.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                style={{
                  background: C.card, backdropFilter: 'blur(16px)',
                  border: `1px solid ${C.border}`,
                  borderRadius: '16px', padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${accent}, ${accent}44)`, borderRadius: '16px 16px 0 0' }} />

                {/* Icon + title row */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px',
                    background: `${accent}15`, border: `1px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
                  }}>
                    <BookOpen size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: C.text, lineHeight: 1.35, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {sr.report.tender.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: C.dim }}>
                      <Building2 size={10} /> {sr.report.tender.source}
                    </div>
                  </div>
                </div>

                {/* Tags (max 2) */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {sr.report.tender.tags.slice(0, 2).map((tag, ti) => (
                    <TagBadge key={`saved-${sr.id}-tag-${ti}`} {...tag} />
                  ))}
                  {sr.report.tender.tags.length > 2 && (
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim, padding: '3px 6px' }}>
                      +{sr.report.tender.tags.length - 2}
                    </div>
                  )}
                </div>

                {/* Saved timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>
                  <Clock size={10} /> Saved {sr.savedAt}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '2px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 0 14px ${accent}22` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onView(sr)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      background: `${accent}12`, border: `1px solid ${accent}30`,
                      borderRadius: '8px', padding: '8px',
                      color: accent, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                    }}
                  >
                    <Eye size={12} /> View Report
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)', color: C.red }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(sr.id)}
                    style={{
                      width: '34px', height: '34px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                      borderRadius: '8px', cursor: 'pointer', color: C.dim,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────
function InviteModal({ open, onClose, onInvite }: { open: boolean; onClose: () => void; onInvite: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite(email.trim());
    setEmail(''); onClose();
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.7)', backdropFilter: 'blur(8px)', zIndex: 500 }} />
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 501, padding: '20px', pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '400px', background: '#081426', border: `1px solid ${C.border}`, borderRadius: '18px', padding: '28px 30px', boxShadow: '0 24px 72px rgba(0,0,0,0.6)', pointerEvents: 'all' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: C.text }}>Invite Members</div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.dim, display: 'flex' }}><X size={16} /></button>
              </div>
              <form onSubmit={submit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com" required
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15,30,53,0.8)', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '14px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,194,168,0.4)'}
                  onBlur={e => e.target.style.borderColor = C.border} />
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', background: 'linear-gradient(90deg, #00C2A8, #0078FF)', border: 'none', borderRadius: '10px', padding: '12px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Send Invite
                </motion.button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main WorkspaceDetail ─────────────────────────────────────────────────────
export function WorkspaceDetail({
  workspace, onBack,
}: {
  workspace: WorkspaceData;
  onBack: () => void;
}) {
  const [ws, setWs] = useState(workspace);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailTender, setDetailTender] = useState<Tender | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'info' } | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setTenders(MOCK_TENDERS);
    setScanning(false);
    showToast('4 new tenders found');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
    showToast('Data refreshed successfully');
  };

  const handleGenerateAll = async () => {
    if (tenders.length === 0) { handleScan(); return; }
    showToast('Generating insights for all tenders…', 'info');
  };

  const handleGenerateReport = (tender: Tender) => {
    setSelectedReport(generateReport(tender));
  };

  // Save report to workspace
  const handleSaveReport = () => {
    if (!selectedReport) return;
    const alreadyExists = savedReports.some(
      sr => sr.report.tender.id === selectedReport.tender.id
    );
    if (alreadyExists) return;
    const now = new Date();
    const savedAt = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) +
      ', ' + now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    setSavedReports(prev => [
      { id: `sr-${Date.now()}`, report: selectedReport, savedAt },
      ...prev,
    ]);
    showToast('Report saved to workspace');
  };

  // Download report as PDF
  const handleDownloadReport = () => {
    if (!selectedReport) return;
    downloadReportAsPdf(selectedReport);
    showToast('PDF downloaded to your machine');
  };

  // View a previously saved report
  const handleViewSaved = (sr: SavedReport) => {
    setSelectedReport(sr.report);
  };

  // Delete a saved report
  const handleDeleteSaved = (id: string) => {
    setSavedReports(prev => prev.filter(sr => sr.id !== id));
    showToast('Report removed from workspace');
  };

  const handleInvite = (email: string) => {
    const color = AVATAR_COLORS[ws.members.length % AVATAR_COLORS.length];
    setWs(prev => ({
      ...prev,
      members: [...prev.members, { id: String(Date.now()), name: email, email, initials: email.slice(0, 2).toUpperCase(), color, role: 'Member' }],
    }));
    showToast(`Invite sent to ${email}`);
  };

  const WS_COLORS = [C.teal, C.blue, C.gold, C.purple, C.green];
  const accentColor = WS_COLORS[ws.id % WS_COLORS.length];

  // Check if the currently viewed report is already saved
  const isCurrentReportSaved = selectedReport
    ? savedReports.some(sr => sr.report.tender.id === selectedReport.tender.id)
    : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Back ──────────────────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
        onClick={onBack}
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: 0, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
      >
        <ArrowLeft size={16} /> Back to Workspaces
      </motion.button>

      {/* ── Header Card ───────────────────────────────────────────────────── */}
      <div style={{ background: C.card, backdropFilter: 'blur(16px)', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '48px', height: '48px', flexShrink: 0, background: `${accentColor}18`, border: `1px solid ${accentColor}35`, borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
            <Building2 size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: C.text, marginBottom: '4px', letterSpacing: '-0.3px' }}>{ws.name}</div>
            {ws.desc && <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>{ws.desc}</div>}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              {ws.industry && (
                <div style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25`, borderRadius: '5px', padding: '2px 9px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accentColor }}>
                  {ws.industry}
                </div>
              )}
              {ws.size && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: '5px', padding: '2px 9px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>
                  {ws.size}
                </div>
              )}
              {ws.goal && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: '5px', padding: '2px 9px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>
                  {ws.goal}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {ws.members.slice(0, 4).map((m, i) => (
                <div key={m.id} style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: 10 - i }}>
                  <Avatar member={m} size={30} />
                </div>
              ))}
              {ws.members.length > 4 && (
                <div style={{ marginLeft: '-8px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: C.muted }}>
                  +{ws.members.length - 4}
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: `${accentColor}50` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setInviteOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${accentColor}10`, border: `1px solid ${accentColor}28`, borderRadius: '8px', padding: '7px 12px', color: accentColor, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <UserPlus size={13} /> Invite
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Quick Action Bar ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          {
            icon: scanning ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <ScanSearch size={15} />,
            label: scanning ? 'Scanning…' : 'Scan for New Tenders',
            color: C.teal, onClick: handleScan, disabled: scanning, gradient: true,
          },
          {
            icon: <Sparkles size={15} />,
            label: 'Generate All Insights',
            color: C.purple, onClick: handleGenerateAll, disabled: false, gradient: false,
          },
          {
            icon: refreshing ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <RefreshCw size={15} />,
            label: refreshing ? 'Refreshing…' : 'Refresh Data',
            color: C.blue, onClick: handleRefresh, disabled: refreshing, gradient: false,
          },
        ].map(action => (
          <motion.button
            key={action.label}
            whileHover={!action.disabled ? { scale: 1.02 } : {}}
            whileTap={!action.disabled ? { scale: 0.97 } : {}}
            onClick={action.onClick}
            disabled={action.disabled}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: action.gradient ? 'linear-gradient(90deg, #00C2A8, #0078FF)' : `${action.color}10`,
              border: action.gradient ? 'none' : `1px solid ${action.color}28`,
              borderRadius: '9px', padding: '9px 16px',
              color: action.gradient ? '#fff' : action.color,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
              cursor: action.disabled ? 'not-allowed' : 'pointer',
              opacity: action.disabled ? 0.7 : 1, transition: 'opacity 0.2s',
            }}
          >
            {action.icon} {action.label}
          </motion.button>
        ))}
      </div>

      {/* ── Tender Feed ───────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: C.teal, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Tender Insights Feed
          </div>
          {tenders.length > 0 && (
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.dim }}>
              {tenders.length} tender{tenders.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {tenders.length === 0 ? (
          <EmptyState onScan={handleScan} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tenders.map((tender, i) => (
              <TenderCard
                key={tender.id}
                tender={tender}
                i={i}
                onGenerate={handleGenerateReport}
                onViewDetails={setDetailTender}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Saved Reports Column ──────────────────────────────────────────── */}
      {savedReports.length > 0 && (
        <>
          {/* Divider */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}30, transparent)` }} />
          <SavedReportsSection
            savedReports={savedReports}
            onView={handleViewSaved}
            onDelete={handleDeleteSaved}
          />
        </>
      )}

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.msg}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
              background: '#0A1628', border: `1px solid ${toast.type === 'info' ? C.blue + '40' : 'rgba(0,194,168,0.25)'}`,
              borderRadius: '10px', padding: '11px 20px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.text,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <Bell size={13} color={toast.type === 'info' ? C.blue : C.teal} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Report Modal ──────────────────────────────────────────────────── */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSave={handleSaveReport}
          onDownload={handleDownloadReport}
          alreadySaved={isCurrentReportSaved}
        />
      )}

      {/* ── Detail Panel ──────────────────────────────────────────────────── */}
      {detailTender && (
        <TenderDetailPanel
          tender={detailTender}
          onClose={() => setDetailTender(null)}
          onGenerate={(t) => { setDetailTender(null); handleGenerateReport(t); }}
        />
      )}

      {/* ── Invite Modal ──────────────────────────────────────────────────── */}
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
