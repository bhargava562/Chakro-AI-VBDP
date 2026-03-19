import { motion } from 'motion/react';
import { Twitter, Github, Linkedin, ExternalLink } from 'lucide-react';

const HexLogo = () => (
  <svg width="28" height="32" viewBox="0 0 34 38" fill="none">
    <path d="M17 2 L31 11 L31 27 L17 36 L3 27 L3 11 Z"
      stroke="#00C2A8" strokeWidth="1.5" fill="rgba(0,194,168,0.1)" />
    <path d="M17 9 L25 14 L25 24 L17 29 L9 24 L9 14 Z"
      fill="rgba(0,194,168,0.18)" stroke="none" />
    <text x="17" y="24" textAnchor="middle" fill="#00C2A8"
      fontFamily="Syne, sans-serif" fontWeight="800" fontSize="10.5">V</text>
  </svg>
);

const footerLinks = {
  Platform: ['Tender Discovery', 'AI Analysis', 'Bid Automation', 'Compliance Check', 'Dashboard'],
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Privacy Policy'],
  Resources: ['Documentation', 'API Reference', 'Case Studies', 'MSME Guide', 'Support'],
};

const socialLinks = [
  { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
  { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
  { icon: <Github size={18} />, href: '#', label: 'GitHub' },
];

export function VBDPFooter({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <footer style={{
      background: '#020A15',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(0,194,168,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '64px clamp(20px, 5vw, 80px) 40px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
          marginBottom: '56px',
        }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <HexLogo />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: '#F0F4FF' }}>VBDP</span>
            </div>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
              color: '#3D5070', lineHeight: 1.7, margin: '0 0 24px',
              maxWidth: '220px',
            }}>
              AI-powered tender intelligence for India's 6.3 crore MSMEs.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3D5070', textDecoration: 'none',
                    transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#00C2A8';
                    e.currentTarget.style.borderColor = 'rgba(0,194,168,0.3)';
                    e.currentTarget.style.background = 'rgba(0,194,168,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#3D5070';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 600,
                fontSize: '13px', color: '#F0F4FF',
                letterSpacing: '0.8px', textTransform: 'uppercase',
                margin: '0 0 20px',
              }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(link => (
                  <li key={link} style={{ marginBottom: '12px' }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                        color: '#3D5070', textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#8A9BB8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#3D5070')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Status Column */}
          <div>
            <h4 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 600,
              fontSize: '13px', color: '#F0F4FF',
              letterSpacing: '0.8px', textTransform: 'uppercase',
              margin: '0 0 20px',
            }}>
              System Status
            </h4>

            {/* Status Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(0,194,168,0.06)',
              border: '1px solid rgba(0,194,168,0.15)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00C2A8',
                boxShadow: '0 0 8px rgba(0,194,168,0.6)',
                animation: 'pulseRing 2s ease-out infinite',
              }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#00C2A8', fontWeight: 500 }}>
                All Systems Operational
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['API Gateway', 'Tender Scraper', 'AI Engine'].map(service => (
                <div key={service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#3D5070' }}>{service}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                    color: '#00C2A8', background: 'rgba(0,194,168,0.08)',
                    padding: '2px 8px', borderRadius: '4px',
                  }}>
                    99.9%
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,194,168,0.25)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: '20px', width: '100%',
                background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                border: 'none', borderRadius: '999px',
                color: '#fff', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '14px',
                padding: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              Access Dashboard <ExternalLink size={13} />
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#3D5070' }}>
            © 2026 VBDP Technologies Pvt. Ltd. · Made with ♥ for India's MSMEs
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Terms', 'Privacy', 'Cookies'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                  color: '#3D5070', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#8A9BB8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3D5070')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
