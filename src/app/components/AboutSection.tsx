import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

// Count-up hook
function useCountUp(target: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [enabled, target, duration]);
  return count;
}

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(value, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'rgba(10,22,40,0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '32px 28px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        flex: 1,
        minWidth: '200px',
        transition: 'border-color 0.25s, transform 0.25s',
        cursor: 'default',
      }}
      whileHover={{ y: -4, borderColor: 'rgba(0,194,168,0.3)' }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
        fontSize: 'clamp(36px, 5vw, 56px)',
        color: '#00C2A8',
        lineHeight: 1.1, marginBottom: '8px',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
        color: '#8A9BB8', letterSpacing: '0.5px', lineHeight: 1.5,
      }}>
        {label}
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: '#050D1A',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '120px',
      }}
    >
      {/* Circuit blueprint background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='%2300C2A8' stroke-width='0.3' opacity='0.15'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%2300C2A8' opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>

        {/* Section Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.2) 50%, transparent 100%)', marginBottom: '80px' }} />

        {/* Subsection A: Problem Statement */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: '6px', padding: '5px 12px',
              marginBottom: '24px',
            }}
          >
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              color: '#F5A623', letterSpacing: '1px',
            }}>
              PROBLEM STATEMENT
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#F0F4FF', lineHeight: 1.2,
              letterSpacing: '-1px', margin: '0 0 48px',
            }}
          >
            6.3 Crore MSMEs.<br />
            <span style={{
              background: 'linear-gradient(90deg, #F5A623 0%, #FFD580 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              One Broken System.
            </span>
          </motion.h2>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <StatCard value={500} suffix="+" label="Fragmented Portals Monitored" delay={0} />
            <StatCard value={80} suffix="%" label="Manual Effort Wasted" delay={0.1} />
            <StatCard value={50} suffix="%" label="Faster Response with VBDP" delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}