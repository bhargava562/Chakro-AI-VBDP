import { useState, useRef } from 'react';
import { motion, AnimatePresence, type TargetAndTransition } from 'motion/react';
import {
  LayoutDashboard, Briefcase, FileBarChart2, BookOpen,
  Bell, Settings, Search, Plus, TrendingUp, AlertTriangle,
  Zap, ChevronUp, ChevronDown, FileText, Upload, Brain,
  BarChart2, Shield, CheckCircle2, FileSearch,
  Lock, Microscope, LogOut, User, X, ChevronRight,
  Camera, Edit2, Save, Phone, MapPin, Mail, Globe,
  Moon, Sun, Star, ExternalLink, ChevronDown as ChevDown,
  Layers, Users, Building2, Clock,
} from 'lucide-react';
import { WorkspaceDetail, type WorkspaceData, type WorkspaceMember } from './WorkspaceDetail';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#050D1A',
  sidebar: '#070F1E',
  card: 'rgba(10,22,40,0.7)',
  cardSolid: '#0A1628',
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

// ─── Nav items (AI Agents removed) ───────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',      icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { id: 'workspaces',     icon: <Briefcase size={18} />,       label: 'Workspaces' },
  { id: 'reports',        icon: <FileBarChart2 size={18} />,   label: 'Reports' },
  { id: 'knowledge',      icon: <BookOpen size={18} />,        label: 'Knowledge Base' },
  { id: 'notifications',  icon: <Bell size={18} />,            label: 'Notifications' },
  { id: 'settings',       icon: <Settings size={18} />,        label: 'Settings' },
];

// ─── Static insight / activity data ──────────────────────────────────────────
const INSIGHTS = [
  { id: 1, icon: <TrendingUp size={16} />,   title: 'Market Opportunity Detected', desc: 'MeitY has released 3 new tenders matching your profile in the last 24 hours.', time: '5 min ago',  color: C.green },
  { id: 2, icon: <AlertTriangle size={16} />, title: 'Deadline Alert',              desc: 'NPMASS Tender #2024-MSME-0318 closes in 48 hours. Review and submit.',            time: '30 min ago', color: C.gold  },
  { id: 3, icon: <Shield size={16} />,        title: 'Compliance Gap Found',        desc: 'Your ISO 9001 certificate expires in 14 days. Renewal required for upcoming bids.', time: '2 hrs ago',  color: C.red   },
  { id: 4, icon: <Zap size={16} />,           title: 'AI Analysis Complete',        desc: 'Smart Cities tender analysis ready. Score: 87/100 — High win probability.',       time: '3 hrs ago',  color: C.teal  },
];

const KPIS = [
  { id: 1, icon: <BarChart2 size={20} />,    label: 'Digital Readiness',   value: '84',   unit: '%',    trend: '+6%',   up: true,  color: C.teal  },
  { id: 2, icon: <TrendingUp size={20} />,   label: 'Market Opportunity',  value: '₹2.4', unit: 'Cr',   trend: '+12%',  up: true,  color: C.blue  },
  { id: 3, icon: <Shield size={20} />,       label: 'Cyber Risk Score',    value: '23',   unit: '/100', trend: '-5pts', up: false, color: C.gold  },
  { id: 4, icon: <CheckCircle2 size={20} />, label: 'Compliance Status',   value: '91',   unit: '%',    trend: '+2%',   up: true,  color: C.green },
];

const QUICK_ACTIONS = [
  { id: 1, icon: <BarChart2 size={20} />,  label: 'Run Market Analysis', color: C.teal   },
  { id: 2, icon: <FileText size={20} />,   label: 'Generate Report',     color: C.blue   },
  { id: 3, icon: <Lock size={20} />,       label: 'Check Policies',      color: C.gold   },
  { id: 4, icon: <Shield size={20} />,     label: 'Scan Cyber Risks',    color: C.red    },
  { id: 5, icon: <Microscope size={20} />, label: 'Start Research',      color: C.purple },
];

const ACTIVITY = [
  { id: 1, icon: <FileText size={16} />,   desc: 'Report generated — Smart Cities Bid Analysis Q1 2026',    time: '10 min ago', color: C.teal  },
  { id: 2, icon: <Upload size={16} />,     desc: 'File uploaded — GovTech_Compliance_Docs_v3.pdf',          time: '1 hr ago',   color: C.blue  },
  { id: 3, icon: <Brain size={16} />,      desc: 'AI analysis completed — Defence Contracts Opportunity',    time: '3 hrs ago',  color: C.gold  },
  { id: 4, icon: <FileSearch size={16} />, desc: 'Tender discovered — NPMASS #2024-MSME-0318',               time: '5 hrs ago',  color: C.green },
  { id: 5, icon: <FileText size={16} />,   desc: 'Report generated — Cyber Risk Assessment Feb 2026',        time: 'Yesterday',  color: C.teal  },
];

const LANGUAGES = ['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी'];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
      color: C.teal, letterSpacing: '1.5px', marginBottom: '16px',
      textTransform: 'uppercase' as const,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card, backdropFilter: 'blur(16px)',
      border: `1px solid ${C.border}`, borderRadius: '16px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ kpi, i }: { kpi: typeof KPIS[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, borderColor: `${kpi.color}40` } as TargetAndTransition}
      style={{
        flex: 1, minWidth: '180px', background: C.card, backdropFilter: 'blur(16px)',
        border: `1px solid ${C.border}`, borderRadius: '16px',
        padding: '24px 20px', cursor: 'default', transition: 'border-color 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '40px', height: '40px', background: `${kpi.color}15`,
          border: `1px solid ${kpi.color}30`, borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color,
        }}>
          {kpi.icon}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          color: kpi.up ? C.green : C.red,
          fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600,
        }}>
          {kpi.up ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {kpi.trend}
        </div>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '28px', color: C.text, lineHeight: 1, marginBottom: '6px' }}>
        {kpi.value}<span style={{ fontSize: '14px', color: C.muted, marginLeft: '2px' }}>{kpi.unit}</span>
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted }}>{kpi.label}</div>
    </motion.div>
  );
}

// ─── Workspace Card ───────────────────────────────────────────────────────────
const WS_COLORS = [C.teal, C.blue, C.gold, C.purple, C.green];

function WorkspaceCard({ ws, i, onOpen }: { ws: WorkspaceData; i: number; onOpen: () => void }) {
  const color = WS_COLORS[ws.id % WS_COLORS.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, borderColor: `${color}35` } as TargetAndTransition}
      style={{
        background: C.card, backdropFilter: 'blur(16px)',
        border: `1px solid ${C.border}`, borderRadius: '16px',
        padding: '24px', cursor: 'default', transition: 'border-color 0.25s',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}
    >
      <div style={{
        width: '36px', height: '36px', background: `${color}18`,
        border: `1px solid ${color}35`, borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        <Building2 size={16} />
      </div>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: C.text, marginBottom: '4px' }}>{ws.name}</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>{ws.desc || ws.goal}</div>
      </div>
      {/* Industry + size tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {ws.industry && (
          <div style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: '5px', padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color, letterSpacing: '0.3px' }}>{ws.industry}</div>
        )}
        {ws.size && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: '5px', padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.muted }}>{ws.size}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: C.dim, fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
          <Users size={12} /> {ws.members.length} member{ws.members.length !== 1 ? 's' : ''}
        </div>
        <div style={{ color: C.dim, fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{ws.activity}</div>
      </div>
      <motion.button
        whileHover={{ backgroundColor: `${color}25`, borderColor: `${color}60` } as TargetAndTransition}
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
        style={{
          background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '8px',
          color, fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
          fontSize: '13px', padding: '8px 0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        Open <ChevronRight size={14} />
      </motion.button>
    </motion.div>
  );
}

// ─── Empty Workspace State ────────────────────────────────────────────────────
function EmptyWorkspaces({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '64px 32px', textAlign: 'center',
        background: C.card, backdropFilter: 'blur(16px)',
        border: `1px solid ${C.border}`, borderRadius: '20px',
      }}
    >
      {/* Illustration */}
      <div style={{ marginBottom: '28px', position: 'relative' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(0,194,168,0.08)',
          border: '1.5px dashed rgba(0,194,168,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto',
        }}>
          <Layers size={32} color="rgba(0,194,168,0.5)" />
        </div>
        <div style={{
          position: 'absolute', top: '-8px', right: '-8px',
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'rgba(0,194,168,0.12)', border: '1px solid rgba(0,194,168,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={14} color={C.teal} />
        </div>
      </div>

      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: C.text, marginBottom: '8px' }}>
        No workspaces yet
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted, maxWidth: '300px', lineHeight: 1.6, marginBottom: '28px' }}>
        Create your first workspace to get started
      </div>

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(0,194,168,0.25)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreate}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
          border: 'none', borderRadius: '12px',
          color: '#fff', fontFamily: 'DM Sans, sans-serif',
          fontWeight: 600, fontSize: '15px',
          padding: '13px 28px', cursor: 'pointer',
        }}
      >
        <Plus size={18} /> Create Workspace
      </motion.button>
    </motion.div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(15,30,53,0.8)', border: `1px solid rgba(255,255,255,0.06)`,
  borderRadius: '10px', color: '#F0F4FF',
  fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
  padding: '11px 14px', outline: 'none',
};

function CwField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A9BB8', marginBottom: '6px' }}>
        {label}{required && <span style={{ color: '#00C2A8', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function CwSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ ...INPUT_STYLE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: open ? 'rgba(0,194,168,0.4)' : 'rgba(255,255,255,0.06)', textAlign: 'left' }}>
        <span style={{ color: value ? '#F0F4FF' : '#3D5070' }}>{value || placeholder || 'Select…'}</span>
        <ChevDown size={14} color="#3D5070" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.14 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#0A1628', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', zIndex: 50, overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
            {options.map(opt => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: opt === value ? 'rgba(0,194,168,0.1)' : 'transparent', border: 'none', color: opt === value ? '#00C2A8' : '#8A9BB8', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}>
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Create Workspace Modal ───────────────────────────────────────────────────
function CreateWorkspaceModal({
  open, onClose, onCreate, currentUser,
}: { open: boolean; onClose: () => void; onCreate: (ws: WorkspaceData) => void; currentUser: WorkspaceMember }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [goal, setGoal] = useState('');
  const [location, setLocation] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberChips, setMemberChips] = useState<WorkspaceMember[]>([]);

  const AVATAR_COLORS = ['#00C2A8', '#0078FF', '#F5A623', '#A855F7', '#22C55E', '#EF4444'];

  const addMember = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && memberEmail.trim()) {
      e.preventDefault();
      const email = memberEmail.trim().replace(/,$/, '');
      if (!memberChips.find(m => m.email === email)) {
        const color = AVATAR_COLORS[(memberChips.length + 1) % AVATAR_COLORS.length];
        setMemberChips(prev => [...prev, { id: String(Date.now()), name: email, email, initials: email.slice(0, 2).toUpperCase(), color, role: 'Member' }]);
      }
      setMemberEmail('');
    }
  };

  const removeMember = (id: string) => setMemberChips(prev => prev.filter(m => m.id !== id));

  const reset = () => { setName(''); setDesc(''); setIndustry(''); setSize(''); setGoal(''); setLocation(''); setMemberEmail(''); setMemberChips([]); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const ws: WorkspaceData = {
      id: Date.now(),
      name: name.trim(), desc: desc.trim(),
      industry, size, goal, location,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      members: [currentUser, ...memberChips],
      activity: 'Just now',
    };
    onCreate(ws);
    reset(); onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="cw-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.75)', backdropFilter: 'blur(10px)', zIndex: 200 }} />
          <motion.div key="cw-wrapper" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 201, padding: '16px', pointerEvents: 'none' }}>
          <motion.div key="cw-modal" initial={{ opacity: 0, scale: 0.95, y: -24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{ width: '100%', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '22px', pointerEvents: 'all' }}>
            <div style={{ background: '#081426', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '22px', padding: '36px 40px', boxShadow: '0 28px 80px rgba(0,0,0,0.7)' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: '#F0F4FF', marginBottom: '5px' }}>Create New Workspace</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A9BB8', lineHeight: 1.5 }}>Set up your workspace to start collaborating and generating insights</div>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3D5070', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Name */}
                <CwField label="Workspace Name" required>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter workspace name" required
                    style={INPUT_STYLE}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,194,168,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                </CwField>

                {/* Description */}
                <CwField label="Description">
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the purpose of this workspace" rows={3}
                    style={{ ...INPUT_STYLE, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,194,168,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                </CwField>

                {/* Industry + Size in 2 cols */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <CwField label="Industry Type">
                    <CwSelect value={industry} onChange={setIndustry} placeholder="Select industry"
                      options={['Manufacturing', 'Retail', 'Textile', 'Agriculture', 'Services', 'Other']} />
                  </CwField>
                  <CwField label="Business Size">
                    <CwSelect value={size} onChange={setSize} placeholder="Select size"
                      options={['Micro', 'Small', 'Medium']} />
                  </CwField>
                </div>

                {/* Goal */}
                <CwField label="Objective / Goal">
                  <CwSelect value={goal} onChange={setGoal} placeholder="Select objective"
                    options={['Digital Transformation', 'Market Analysis', 'Competitor Research', 'Cybersecurity Improvement', 'Policy Compliance', 'Custom']} />
                </CwField>

                {/* Team Members */}
                <CwField label="Team Members (Optional)">
                  <div style={{ ...INPUT_STYLE, padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', minHeight: '44px', cursor: 'text' }}
                    onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                    {memberChips.map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${m.color}18`, border: `1px solid ${m.color}35`, borderRadius: '6px', padding: '3px 8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '8px', color: '#fff' }}>{m.initials}</div>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: m.color, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</span>
                        <button type="button" onClick={() => removeMember(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: m.color, display: 'flex', padding: 0, lineHeight: 1 }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} onKeyDown={addMember}
                      placeholder={memberChips.length === 0 ? 'Enter email, press Enter to add…' : ''}
                      style={{ flex: 1, minWidth: '160px', background: 'transparent', border: 'none', outline: 'none', color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: '3px 2px' }} />
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3D5070', marginTop: '5px' }}>Press Enter or comma to add each member</div>
                </CwField>

                {/* Location */}
                <CwField label="Region / Location (Optional)">
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location"
                    style={INPUT_STYLE}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,194,168,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'} />
                </CwField>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <button type="button" onClick={() => { reset(); onClose(); }}
                    style={{ flex: 1, padding: '13px', borderRadius: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#8A9BB8', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                    Cancel
                  </button>
                  <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(0,194,168,0.25)' }} whileTap={{ scale: 0.98 }}
                    style={{ flex: 2, padding: '13px', borderRadius: '11px', background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)', border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                    Create Workspace
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ profile, onSave }: {
  profile: { name: string; email: string; phone: string; address: string; photo: string | null };
  onSave: (p: typeof profile) => void;
}) {
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, photo: url }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({
    icon, label, value, onChange, type = 'text', placeholder,
  }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => {
    const [focused, setFocused] = useState(false);
    return (
      <div>
        <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, marginBottom: '7px' }}>
          {label}
        </label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(15,30,53,0.8)',
          border: `1px solid ${focused ? 'rgba(0,194,168,0.4)' : C.border}`,
          borderRadius: '12px', padding: '12px 16px',
          transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(0,194,168,0.08)' : 'none',
        }}>
          <span style={{ color: focused ? C.teal : C.dim, flexShrink: 0, transition: 'color 0.2s' }}>{icon}</span>
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.text, fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
            }}
          />
          <Edit2 size={14} color={C.dim} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '6px' }}>
          My Profile
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>
          Manage your personal information
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Avatar */}
        <Card style={{ padding: '32px', marginBottom: '24px' }}>
          <SectionLabel>Profile Photo</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,194,168,0.25) 0%, rgba(0,120,255,0.15) 100%)',
                border: '2.5px solid rgba(0,194,168,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {form.photo ? (
                  <img src={form.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', color: C.teal }}>
                    {form.name ? form.name[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              {/* Upload icon */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C2A8, #0078FF)',
                  border: '2px solid #0A1628',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Camera size={13} color="#fff" />
              </motion.button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '16px', color: C.text, marginBottom: '4px' }}>
                {form.name || 'Your Name'}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, marginBottom: '12px' }}>
                {form.email || 'your@email.com'}
              </div>
              <motion.button
                type="button"
                whileHover={{ borderColor: 'rgba(0,194,168,0.5)', color: C.teal }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fileRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: `1px solid ${C.border}`,
                  borderRadius: '8px', padding: '7px 14px',
                  color: C.muted, fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <Upload size={13} /> Upload Photo
              </motion.button>
            </div>
          </div>
        </Card>

        {/* Fields */}
        <Card style={{ padding: '32px', marginBottom: '24px' }}>
          <SectionLabel>Personal Information</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Field
              icon={<User size={16} />} label="Full Name"
              value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))}
              placeholder="Enter your full name"
            />
            <Field
              icon={<Mail size={16} />} label="Email Address" type="email"
              value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}
              placeholder="your@email.com"
            />
            <Field
              icon={<Phone size={16} />} label="Contact Number" type="tel"
              value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))}
              placeholder="+91 9XXXXXXXXX"
            />
            <Field
              icon={<MapPin size={16} />} label="Address"
              value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))}
              placeholder="City, State, Country"
            />
          </div>
        </Card>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(0,194,168,0.25)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
              border: 'none', borderRadius: '12px', padding: '13px 32px',
              color: '#fff', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: '15px', cursor: 'pointer',
            }}
          >
            <Save size={16} /> Save Changes
          </motion.button>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.green, fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
              >
                <CheckCircle2 size={16} /> Changes saved!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}

// ─── SettingRow (shared helper) ──────────────────────────────────────────────
function SettingRow({ children, noBorder = false }: { children: React.ReactNode; noBorder?: boolean }) {
  const C_border = '#0F1E35';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: noBorder ? 'none' : `1px solid ${C_border}`,
    }}>
      {children}
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({
  profile, onEditProfile, onLogout,
}: {
  profile: { name: string; email: string; photo: string | null };
  onEditProfile: () => void;
  onLogout: () => void;
}) {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '6px' }}>Settings</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>Manage your account preferences</div>
      </div>

      {/* Profile Preview */}
      <Card style={{ padding: '24px', marginBottom: '16px' }}>
        <SectionLabel>Profile</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(0,194,168,0.25) 0%, rgba(0,120,255,0.15) 100%)',
            border: '2px solid rgba(0,194,168,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            {profile.photo ? (
              <img src={profile.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: C.teal }}>
                {profile.name ? profile.name[0].toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: C.text }}>{profile.name || 'Your Name'}</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted }}>{profile.email || 'your@email.com'}</div>
          </div>
          <motion.button
            whileHover={{ borderColor: 'rgba(0,194,168,0.4)', color: C.teal }}
            whileTap={{ scale: 0.97 }}
            onClick={onEditProfile}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '8px 14px',
              color: C.muted, fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            <Edit2 size={13} /> Edit Profile
          </motion.button>
        </div>
      </Card>

      {/* Preferences */}
      <Card style={{ padding: '24px', marginBottom: '16px' }}>
        <SectionLabel>Preferences</SectionLabel>

        {/* Dark Mode */}
        <SettingRow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {darkMode ? <Moon size={18} color={C.teal} /> : <Sun size={18} color={C.gold} />}
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: C.text }}>Dark Mode</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.muted }}>Toggle between light and dark theme</div>
            </div>
          </div>
          <motion.button
            type="button"
            onClick={() => setDarkMode(d => !d)}
            style={{
              width: '48px', height: '26px', borderRadius: '999px',
              background: darkMode ? 'linear-gradient(90deg, #00C2A8, #0078FF)' : 'rgba(255,255,255,0.12)',
              border: 'none', cursor: 'pointer',
              position: 'relative', flexShrink: 0,
              transition: 'background 0.3s',
            }}
          >
            <motion.div
              animate={{ x: darkMode ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{
                position: 'absolute', top: '3px', left: '0',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }}
            />
          </motion.button>
        </SettingRow>

        {/* Language */}
        <SettingRow noBorder>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={18} color={C.blue} />
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: C.text }}>Language</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.muted }}>Select your preferred language</div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <motion.button
              type="button"
              onClick={() => setLangOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '8px 14px',
                color: C.text, fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px', cursor: 'pointer',
              }}
            >
              {language} <ChevDown size={14} color={C.dim} />
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                    background: '#0A1628', border: `1px solid ${C.border}`,
                    borderRadius: '12px', overflow: 'hidden', zIndex: 50,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    minWidth: '140px',
                  }}
                >
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px', background: lang === language ? 'rgba(0,194,168,0.1)' : 'transparent',
                        border: 'none', color: lang === language ? C.teal : C.muted,
                        fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (lang !== language) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (lang !== language) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SettingRow>
      </Card>

      {/* Account */}
      <Card style={{ padding: '24px', marginBottom: '16px' }}>
        <SectionLabel>Account</SectionLabel>

        {[
          { icon: <FileText size={16} color={C.muted} />, label: 'Terms of Use', sub: 'Read our terms and conditions' },
          { icon: <Lock size={16} color={C.muted} />, label: 'Privacy Policy', sub: 'How we handle your data' },
        ].map((item, i) => (
          <SettingRow key={item.label} noBorder={i === 1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.icon}
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: C.text }}>{item.label}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.muted }}>{item.sub}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ color: C.teal }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.dim, display: 'flex', alignItems: 'center' }}
            >
              <ExternalLink size={15} />
            </motion.button>
          </SettingRow>
        ))}

        <div style={{ paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
          <motion.button
            whileHover={{ borderColor: 'rgba(0,194,168,0.35)', color: C.teal }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: '10px', padding: '11px 20px',
              color: C.muted, fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500, fontSize: '14px', cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            <LogOut size={16} /> Log Out
          </motion.button>
        </div>
      </Card>

      {/* Upgrade */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,194,168,0.08) 0%, rgba(0,120,255,0.08) 50%, rgba(168,85,247,0.08) 100%)',
        border: '1px solid rgba(0,194,168,0.2)',
        borderRadius: '16px', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Star size={16} color={C.gold} fill={C.gold} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: C.text }}>Upgrade to Premium</span>
            <div style={{
              background: 'linear-gradient(90deg, #F5A623, #FFD580)',
              borderRadius: '4px', padding: '2px 8px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
              color: '#050D1A', fontWeight: 700, letterSpacing: '0.5px',
            }}>
              PRO
            </div>
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted }}>
            Unlock advanced AI insights, unlimited workspaces & priority support
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(245,166,35,0.3)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            flexShrink: 0,
            background: 'linear-gradient(90deg, #F5A623 0%, #FFD580 100%)',
            border: 'none', borderRadius: '10px', padding: '11px 22px',
            color: '#050D1A', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          Upgrade Now
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Content Router ──────────────────────────────────────────────────────
function MainContent({
  activeNav, workspaces, onCreateWorkspace, onNavChange,
  profile, onSaveProfile, onLogout, onOpenWorkspace,
}: {
  activeNav: string;
  workspaces: WorkspaceData[];
  onCreateWorkspace: () => void;
  onNavChange: (id: string) => void;
  profile: { name: string; email: string; phone: string; address: string; photo: string | null };
  onSaveProfile: (p: typeof profile) => void;
  onLogout: () => void;
  onOpenWorkspace: (ws: WorkspaceData) => void;
}) {
  if (activeNav === 'profile') {
    return <ProfilePage profile={profile} onSave={onSaveProfile} />;
  }

  if (activeNav === 'settings') {
    return (
      <SettingsPage
        profile={profile}
        onEditProfile={() => onNavChange('profile')}
        onLogout={onLogout}
      />
    );
  }

  if (activeNav === 'workspaces') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '4px' }}>Workspaces</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>
              {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
            </div>
          </div>
          {workspaces.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,194,168,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateWorkspace}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                border: 'none', borderRadius: '10px', padding: '11px 20px',
                color: '#fff', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}
            >
              <Plus size={16} /> New Workspace
            </motion.button>
          )}
        </div>
        {workspaces.length === 0 ? (
          <EmptyWorkspaces onCreate={onCreateWorkspace} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {workspaces.map((ws, i) => <WorkspaceCard key={`ws-card-${ws.id}`} ws={ws} i={i} onOpen={() => onOpenWorkspace(ws)} />)}
          </div>
        )}
      </div>
    );
  }

  // ── Notifications ───────────────────────────────────────────────────────────
  if (activeNav === 'notifications') {
    return (
      <div style={{ maxWidth: '680px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '6px' }}>Notifications</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>Stay updated with your latest alerts</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0,194,168,0.06) 0%, rgba(0,120,255,0.04) 100%)',
            border: '1px solid rgba(0,194,168,0.18)',
            borderRadius: '16px', padding: '20px 22px',
            display: 'flex', gap: '16px', alignItems: 'flex-start',
          }}
        >
          <div style={{
            width: '44px', height: '44px', flexShrink: 0, borderRadius: '12px',
            background: 'rgba(0,194,168,0.12)', border: '1px solid rgba(0,194,168,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.teal,
          }}>
            <Bell size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: C.text }}>Welcome to VBDP</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> Just now
              </div>
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.muted, lineHeight: 1.6 }}>
              Welcome to the platform. Start by creating a workspace to explore AI-powered insights.
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Reports ──────────────────────────────────────────────────────────────────
  if (activeNav === 'reports') {
    return (
      <div>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '6px' }}>Reports</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>AI-generated reports and analysis</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: C.card, backdropFilter: 'blur(16px)',
            border: `1px solid ${C.border}`, borderRadius: '20px',
            padding: '64px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', gap: '16px',
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(0,120,255,0.07)', border: '1.5px dashed rgba(0,120,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
          }}>
            <FileBarChart2 size={32} color="rgba(0,120,255,0.45)" />
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: C.text }}>No reports yet</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted, maxWidth: '340px', lineHeight: 1.6 }}>
            You haven't generated any reports. Start by creating a workspace and running analysis.
          </div>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(0,120,255,0.25)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: '15px', padding: '13px 28px', cursor: 'pointer',
            }}
          >
            <FileText size={16} /> Generate Report
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Knowledge Base ───────────────────────────────────────────────────────────
  if (activeNav === 'knowledge') {
    return (
      <div>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: C.text, marginBottom: '6px' }}>Knowledge Base</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted }}>Documents and insights powering your AI</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: C.card, backdropFilter: 'blur(16px)',
            border: `1px solid ${C.border}`, borderRadius: '20px',
            padding: '64px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', gap: '16px',
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(168,85,247,0.07)', border: '1.5px dashed rgba(168,85,247,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
          }}>
            <BookOpen size={32} color="rgba(168,85,247,0.45)" />
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: C.text }}>Knowledge base is empty</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.muted, maxWidth: '340px', lineHeight: 1.6 }}>
            Upload documents or generate insights to build your knowledge base.
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: 'rgba(0,194,168,0.5)', color: C.teal }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(0,194,168,0.08)', border: '1px solid rgba(0,194,168,0.25)',
                borderRadius: '12px', color: C.teal,
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                padding: '12px 24px', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <Upload size={15} /> Upload Document
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(168,85,247,0.2)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(90deg, #A855F7 0%, #0078FF 100%)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '14px', padding: '12px 24px', cursor: 'pointer',
              }}
            >
              <Brain size={15} /> Generate Insights
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard home ────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', color: C.text, marginBottom: '6px', letterSpacing: '-0.5px' }}>
          Welcome back, <span style={{
            background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{profile.name || 'there'}</span> 👋
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: C.muted }}>
          Here's your business overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* KPIs */}
      <section>
        <SectionLabel>Key Metrics</SectionLabel>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {KPIS.map((kpi, i) => <KpiCard key={`kpi-${kpi.id}`} kpi={kpi} i={i} />)}
        </div>
      </section>

      {/* Workspace + Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>
        <section>
          <SectionLabel>Workspace Overview</SectionLabel>
          {workspaces.length === 0 ? (
            <EmptyWorkspaces onCreate={onCreateWorkspace} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {workspaces.map((ws, i) => <WorkspaceCard key={`ws-dash-${ws.id}`} ws={ws} i={i} onOpen={() => onOpenWorkspace(ws)} />)}
              {/* Add another */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ borderColor: 'rgba(0,194,168,0.4)' } as TargetAndTransition}
                onClick={onCreateWorkspace}
                style={{
                  background: 'rgba(0,194,168,0.03)', border: '1.5px dashed rgba(0,194,168,0.2)',
                  borderRadius: '16px', padding: '24px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', minHeight: '160px', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <Plus size={20} color={C.teal} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.teal, fontWeight: 600 }}>New Workspace</span>
              </motion.div>
            </div>
          )}
        </section>

        <section>
          <SectionLabel>AI Insights</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {INSIGHTS.map((item, i) => (
              <motion.div
                key={`insight-${item.id}`}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                whileHover={{ borderColor: `${item.color}35` } as TargetAndTransition}
                style={{
                  background: C.card, backdropFilter: 'blur(12px)',
                  border: `1px solid ${C.border}`, borderRadius: '14px',
                  padding: '14px 16px', display: 'flex', gap: '12px',
                  cursor: 'default', transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', flexShrink: 0,
                  background: `${item.color}18`, border: `1px solid ${item.color}30`,
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: C.text, marginBottom: '3px' }}>{item.title}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.muted, lineHeight: 1.5, marginBottom: '5px' }}>{item.desc}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>{item.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>
        <section>
          <SectionLabel>Quick Actions</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={`qa-${action.id}`}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                whileHover={{ y: -3, borderColor: `${action.color}50`, backgroundColor: `${action.color}10` } as TargetAndTransition}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: `${action.color}08`, border: `1px solid ${action.color}25`,
                  borderRadius: '12px', padding: '13px 18px',
                  color: action.color, fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
                }}
              >
                {action.icon} {action.label}
              </motion.button>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Recent Activity</SectionLabel>
          <Card style={{ overflow: 'hidden' }}>
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={`act-${item.id}`}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '13px 16px',
                  borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <div style={{
                  width: '30px', height: '30px', flexShrink: 0,
                  background: `${item.color}15`, border: `1px solid ${item.color}30`,
                  borderRadius: '8px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: item.color, marginTop: '2px',
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: C.text,
                    lineHeight: 1.5, marginBottom: '3px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.desc}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>{item.time}</div>
                </div>
              </motion.div>
            ))}
          </Card>
        </section>
      </div>

      <div style={{ height: '8px' }} />
    </div>
  );
}

// ─── Root Dashboard ───────────────────────────────────────────────────────────
export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null);
  const [profile, setProfile] = useState({ name: 'Rohan Mehta', email: 'rohan@vbdp.ai', phone: '', address: '', photo: null as string | null });

  const currentUser: WorkspaceMember = {
    id: 'owner-1', name: profile.name || 'You', email: profile.email,
    initials: profile.name ? profile.name.slice(0, 2).toUpperCase() : 'YO',
    color: '#00C2A8', role: 'Owner',
  };

  const handleNavChange = (id: string) => {
    setActiveNav(id);
    setNotifOpen(false);
    setSelectedWorkspace(null);
  };

  const handleCreateWorkspace = (ws: WorkspaceData) => {
    setWorkspaces(prev => [...prev, ws]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: C.bg, overflow: 'hidden', fontFamily: 'DM Sans, sans-serif', color: C.text }}>

      {/* ── Sidebar ─────────────────────────────────────���────────────── */}
      <aside style={{
        width: '240px', flexShrink: 0, background: C.sidebar,
        borderRight: `1px solid ${C.border}`, display: 'flex',
        flexDirection: 'column', padding: '0 0 24px', zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 24px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="26" height="30" viewBox="0 0 34 38" fill="none">
            <path d="M17 2 L31 11 L31 27 L17 36 L3 27 L3 11 Z" stroke="#00C2A8" strokeWidth="1.5" fill="rgba(0,194,168,0.1)" />
            <path d="M17 9 L25 14 L25 24 L17 29 L9 24 L9 14 Z" fill="rgba(0,194,168,0.18)" />
            <text x="17" y="24" textAnchor="middle" fill="#00C2A8" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="10.5">V</text>
          </svg>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '17px', color: C.text, letterSpacing: '-0.5px' }}>VBDP</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                whileHover={{ backgroundColor: isActive ? 'rgba(0,194,168,0.14)' : 'rgba(255,255,255,0.04)' } as TargetAndTransition}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  background: isActive ? 'rgba(0,194,168,0.12)' : 'rgba(0,0,0,0)',
                  border: isActive ? '1px solid rgba(0,194,168,0.25)' : '1px solid rgba(0,0,0,0)',
                  color: isActive ? C.teal : C.muted,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: isActive ? 600 : 400,
                  fontSize: '14px', cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {item.icon} {item.label}
                {isActive && (
                  <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: C.teal, boxShadow: `0 0 8px ${C.teal}` }} />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.2)' } as TargetAndTransition}
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              background: 'rgba(0,0,0,0)', border: '1px solid rgba(0,0,0,0)',
              color: C.dim, fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px', cursor: 'pointer', width: '100%',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
          >
            <LogOut size={18} /> Log Out
          </motion.button>
        </div>
      </aside>

      {/* ── Right column ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Navbar */}
        <header style={{
          height: '64px', flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          background: 'rgba(7,15,30,0.85)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', padding: '0 28px', gap: '16px', zIndex: 10,
        }}>
          {/* Search */}
          <div style={{
            flex: 1, maxWidth: '400px',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: searchFocused ? 'rgba(0,194,168,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${searchFocused ? 'rgba(0,194,168,0.3)' : C.border}`,
            borderRadius: '10px', padding: '8px 14px',
            transition: 'border-color 0.2s, background 0.2s',
          }}>
            <Search size={15} color={searchFocused ? C.teal : C.dim} />
            <input
              value={searchVal} onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search tenders, reports..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: C.text, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }} />

          {/* Create Workspace btn */}
          <motion.button
            whileHover={{ scale: 1.02, borderColor: 'rgba(0,194,168,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCreateWsOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,194,168,0.1)', border: '1px solid rgba(0,194,168,0.25)',
              borderRadius: '8px', padding: '7px 14px', color: C.teal,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <Plus size={14} /> Create Workspace
          </motion.button>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: C.muted, position: 'relative',
              }}
            >
              <Bell size={16} />
              <div style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', borderRadius: '50%', background: C.red, border: '1.5px solid #050D1A' }} />
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: '46px', right: 0, width: '300px',
                    background: '#0A1628', border: `1px solid ${C.border}`,
                    borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', padding: '12px', zIndex: 50,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 4px' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: C.text }}>Notifications</span>
                    <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.dim, display: 'flex' }}><X size={14} /></button>
                  </div>
                  {INSIGHTS.slice(0, 3).map(n => (
                    <div key={`notif-${n.id}`} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '10px', marginBottom: '4px', background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ color: n.color, marginTop: '2px', flexShrink: 0 }}>{n.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: C.text, marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: C.dim }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar — click → profile */}
          <motion.div
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleNavChange('profile')}
            style={{
              width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(0,194,168,0.3) 0%, rgba(0,120,255,0.2) 100%)',
              border: `2px solid ${activeNav === 'profile' ? C.teal : 'rgba(0,194,168,0.35)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            {profile.photo ? (
              <img src={profile.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '14px', color: C.teal }}>
                {profile.name ? profile.name[0].toUpperCase() : 'U'}
              </span>
            )}
          </motion.div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
          <AnimatePresence mode="wait">
            {selectedWorkspace ? (
              <motion.div key={`ws-${selectedWorkspace.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <WorkspaceDetail
                  workspace={selectedWorkspace}
                  onBack={() => setSelectedWorkspace(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <MainContent
                  activeNav={activeNav}
                  workspaces={workspaces}
                  onCreateWorkspace={() => setCreateWsOpen(true)}
                  onNavChange={handleNavChange}
                  profile={profile}
                  onSaveProfile={setProfile}
                  onLogout={onLogout}
                  onOpenWorkspace={setSelectedWorkspace}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        open={createWsOpen}
        onClose={() => setCreateWsOpen(false)}
        onCreate={handleCreateWorkspace}
        currentUser={currentUser}
      />
    </div>
  );
}
