import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const HexLogo = () => (
  <svg width="34" height="38" viewBox="0 0 34 38" fill="none">
    <path d="M17 2 L31 11 L31 27 L17 36 L3 27 L3 11 Z"
      stroke="#00C2A8" strokeWidth="1.5" fill="rgba(0,194,168,0.1)" />
    <path d="M17 9 L25 14 L25 24 L17 29 L9 24 L9 14 Z"
      fill="rgba(0,194,168,0.18)" stroke="none" />
    <text x="17" y="24" textAnchor="middle" fill="#00C2A8"
      fontFamily="Syne, sans-serif" fontWeight="800" fontSize="10.5">V</text>
  </svg>
);

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: active ? '#00C2A8' : '#8A9BB8',
        fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
        padding: '6px 0', position: 'relative',
        transition: 'color 0.2s ease',
      }}
    >
      {label}
      <motion.span
        animate={{ scaleX: hovered || active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '1.5px', background: '#00C2A8',
          display: 'block', transformOrigin: 'left',
        }}
      />
    </button>
  );
}

export function VBDPNavbar({ onLoginClick }: { onLoginClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['contact', 'about', 'home'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: '72px',
          background: 'rgba(5,13,26,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1440px', margin: '0 auto', height: '100%',
          padding: '0 clamp(20px, 5vw, 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <button
            onClick={() => scrollTo('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <HexLogo />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: '#F0F4FF', letterSpacing: '-0.5px' }}>VBDP</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '48px' }}>
            {navLinks.map(link => (
              <NavLink key={link.id} label={link.label} active={activeSection === link.id} onClick={() => scrollTo(link.id)} />
            ))}
            <NavLink label="Login" active={false} onClick={onLoginClick} />
          </div>

          {/* Desktop CTA */}
          <motion.button
            onClick={() => scrollTo('contact')}
            whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(0,194,168,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:block"
            style={{
              background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
              border: 'none', borderRadius: '999px',
              color: '#fff', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: '14px',
              padding: '9px 22px', cursor: 'pointer',
            }}
          >
            Get Early Access
          </motion.button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F0F4FF', padding: '8px' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.7)', zIndex: 60, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
                background: '#0A1628', zIndex: 70,
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column', padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HexLogo />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: '#F0F4FF' }}>VBDP</span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A9BB8' }}>
                  <X size={22} />
                </button>
              </div>

              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', padding: '14px 16px', borderRadius: '12px',
                    color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '17px',
                    marginBottom: '4px', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,194,168,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { onLoginClick(); setMobileOpen(false); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '14px 16px', borderRadius: '12px',
                  color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '17px',
                  marginBottom: '32px', transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,194,168,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Login
              </button>

              <motion.button
                onClick={() => { scrollTo('contact'); setMobileOpen(false); }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                  border: 'none', borderRadius: '999px',
                  color: '#fff', fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600, fontSize: '16px',
                  padding: '14px', cursor: 'pointer', width: '100%',
                }}
              >
                Get Early Access
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
