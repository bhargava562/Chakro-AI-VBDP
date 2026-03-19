import { motion } from 'motion/react';
import { ArrowRight, Play, Shield, Zap, BarChart3 } from 'lucide-react';

const tenderItems = [
  {
    id: 1,
    source: 'NMRC',
    title: 'Northern Metro Rail Contract',
    match: 92,
    color: '#00C2A8',
    category: 'Infrastructure',
  },
  {
    id: 2,
    source: 'MSME',
    title: 'Maharashtra Solar Procurement',
    match: 78,
    color: '#F5A623',
    category: 'Energy',
  },
  {
    id: 3,
    source: 'GeM',
    title: 'Defense Equipment Bid — Q2',
    match: 65,
    color: '#0078FF',
    category: 'Defense',
  },
];

const trustBadges = [
  { icon: <BarChart3 size={13} />, label: '500+ Portals Monitored' },
  { icon: <Zap size={13} />, label: '85%+ Match Accuracy' },
  { icon: <Shield size={13} />, label: 'ISO Compliant' },
];

function TenderCard() {
  return (
    <div style={{ animation: 'floatCard 4s ease-in-out infinite' }}>
      <div
        style={{
          background: 'rgba(10,22,40,0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '24px',
          width: '360px',
          boxShadow: '0 16px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,194,168,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#00C2A8', letterSpacing: '1px', marginBottom: '4px' }}>
              TENDER MATCH FEED
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', color: '#F0F4FF' }}>
              Live Opportunities
            </div>
          </div>
          <div style={{
            background: 'rgba(0,194,168,0.15)',
            border: '1px solid rgba(0,194,168,0.3)',
            borderRadius: '999px',
            padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00C2A8', animation: 'pulseRing 1.5s ease-out infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00C2A8' }}>LIVE</span>
          </div>
        </div>

        {/* Tender Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tenderItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.15, duration: 0.5 }}
              style={{
                background: 'rgba(15,30,53,0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                      color: item.color, background: `${item.color}18`,
                      border: `1px solid ${item.color}40`,
                      padding: '2px 7px', borderRadius: '4px',
                    }}>
                      {item.source}
                    </span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#3D5070' }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A9BB8', lineHeight: 1.4 }}>
                    {item.title}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                  fontWeight: 700, color: item.color, whiteSpace: 'nowrap', marginLeft: '12px',
                }}>
                  {item.match}%
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.match}%` }}
                  transition={{ delay: 1.6 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}99 100%)`,
                    borderRadius: '999px',
                    backgroundSize: '200% 100%',
                    animation: 'progressShimmer 2s linear infinite',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#3D5070' }}>
            Updated 2 min ago
          </span>
          <span style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#00C2A8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            View all 48 <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

const headline1 = 'Win More Tenders.';
const headline2 = 'Automatically.';

export function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const words1 = headline1.split(' ');
  const words2 = headline2.split(' ');

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '72px',
        background: 'linear-gradient(135deg, #050D1A 0%, #0A1E3D 60%, #001A2E 100%)',
      }}
    >
      {/* Animated Background Orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '15%',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(0,194,168,0.13) 0%, transparent 70%)',
          animation: 'orbDrift 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,120,255,0.1) 0%, transparent 70%)',
          animation: 'orbDrift 10s ease-in-out infinite reverse',
          animationDelay: '2s',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '45%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(0,194,168,0.07) 0%, transparent 70%)',
          animation: 'orbDrift 12s ease-in-out infinite',
          animationDelay: '4s',
        }} />

        {/* Hex Grid SVG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='70' viewBox='0 0 60 70'%3E%3Cpath d='M30 5 L55 19 L55 47 L30 61 L5 47 L5 19 Z' stroke='%2300C2A8' stroke-width='0.5' fill='none' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 70px',
          opacity: 0.04,
          animation: 'hexRotate 120s linear infinite',
          transformOrigin: 'center',
        }} />
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1440px', margin: '0 auto',
        padding: '80px clamp(20px, 5vw, 80px)',
        display: 'flex', alignItems: 'center',
        gap: '60px', width: '100%',
        position: 'relative', zIndex: 1,
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Eyebrow Chip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px dashed rgba(0,194,168,0.5)',
              borderRadius: '6px', padding: '6px 14px',
              marginBottom: '32px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00C2A8' }} />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
              color: '#00C2A8', letterSpacing: '1px',
            }}>
              AI-POWERED · IBM GRANITE LLM
            </span>
          </motion.div>

          {/* H1 Headline with word-by-word stagger */}
          <h1 style={{ margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-2px', fontSize: 'clamp(42px, 6vw, 72px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
              {words1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: 'circOut' }}
                  style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#F0F4FF', display: 'block' }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
              {words2.map((word, i) => (
                <motion.span
                  key={`w2-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.08, duration: 0.6, ease: 'circOut' }}
                  style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', display: 'block',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '18px',
              color: '#8A9BB8', lineHeight: 1.7, maxWidth: '520px',
              margin: '0 0 36px',
            }}
          >
            VBDP automates tender discovery, analysis, and bid response for India's 6.3 crore MSMEs — powered by multi-agent AI that never sleeps.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: 'spring', stiffness: 300, damping: 25 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}
          >
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(0,194,168,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onCTAClick}
              style={{
                background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                border: 'none', borderRadius: '999px',
                color: '#fff', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '16px',
                padding: '14px 32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              Start for Free <ArrowRight size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'rgba(0,194,168,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onCTAClick}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500, fontSize: '16px',
                padding: '14px 28px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.2s',
              }}
            >
              <Play size={15} style={{ fill: '#F0F4FF' }} /> Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '999px', padding: '6px 14px',
                  color: '#8A9BB8', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                }}
              >
                <span style={{ color: '#00C2A8' }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Floating Card */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
          className="hidden lg:flex"
          style={{ flexShrink: 0, justifyContent: 'center' }}
        >
          {/* Glow behind card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: '-40px',
              background: 'radial-gradient(ellipse, rgba(0,194,168,0.2) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <TenderCard />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section divider */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.2) 50%, transparent 100%)',
      }} />
    </section>
  );
}