import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, MapPin, CheckCircle2, Send, Lock } from 'lucide-react';
import { toast } from 'sonner';

function FloatingSuccessCard() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        background: 'rgba(10,22,40,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,194,168,0.2)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,194,168,0.08)',
        maxWidth: '320px',
        marginTop: '40px',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'rgba(0,194,168,0.15)',
        border: '1px solid rgba(0,194,168,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <CheckCircle2 size={22} color="#00C2A8" />
      </div>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: '#F0F4FF', marginBottom: '4px' }}>
          Your Message Delivered
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A9BB8' }}>
          Our team responds within 2 hours
        </div>
      </div>
    </motion.div>
  );
}

function FormInput({
  label, type = 'text', placeholder, value, onChange, error,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block', fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px', color: '#8A9BB8', marginBottom: '8px',
        letterSpacing: '0.3px',
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'rgba(15,30,53,0.7)',
          border: `1px solid ${error ? '#d4183d' : focused ? 'rgba(0,194,168,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '12px',
          color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
          padding: '13px 16px',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(0,194,168,0.1)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
      {error && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#d4183d', marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FormTextarea({
  label, placeholder, value, onChange,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{
        display: 'block', fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px', color: '#8A9BB8', marginBottom: '8px',
        letterSpacing: '0.3px',
      }}>
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'rgba(15,30,53,0.7)',
          border: `1px solid ${focused ? 'rgba(0,194,168,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '12px',
          color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
          padding: '13px 16px',
          outline: 'none', resize: 'vertical',
          boxShadow: focused ? '0 0 0 3px rgba(0,194,168,0.1)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
    </div>
  );
}

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.company.trim()) e.company = 'Company name is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setForm({ name: '', email: '', company: '', message: '' });
    toast.success('Message sent! We\'ll be in touch within 2 hours.', {
      style: {
        background: '#0A1628',
        border: '1px solid rgba(0,194,168,0.3)',
        color: '#F0F4FF',
      },
    });
  };

  const contactDetails = [
    { icon: <Mail size={18} />, label: 'hello@vbdp.ai', href: 'mailto:hello@vbdp.ai' },
    { icon: <Linkedin size={18} />, label: 'linkedin.com/company/vbdp', href: '#' },
    { icon: <MapPin size={18} />, label: 'Mumbai, India · Pan-India Remote', href: '#' },
  ];

  return (
    <section
      id="contact"
      style={{
        background: '#050D1A',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '120px',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,120,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 80px)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Section Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.2) 50%, transparent 100%)', marginBottom: '80px' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'start',
        }}>
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(0,194,168,0.3)',
              borderRadius: '6px', padding: '5px 12px',
              marginBottom: '24px',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#00C2A8', letterSpacing: '1px' }}>
                GET IN TOUCH
              </span>
            </div>

            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#F0F4FF', lineHeight: 1.2,
              letterSpacing: '-1px', margin: '0 0 24px',
            }}>
              Let's Build<br />
              <span style={{
                background: 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Together.</span>
            </h2>

            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '16px',
              color: '#8A9BB8', lineHeight: 1.7, margin: '0 0 40px',
            }}>
              Whether you're an MSME ready to win more bids, or an enterprise looking to integrate AI-powered procurement intelligence — we'd love to hear from you.
            </p>

            {/* Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '8px' }}>
              {contactDetails.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    textDecoration: 'none',
                    padding: '14px 18px',
                    background: 'rgba(10,22,40,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,194,168,0.25)';
                    e.currentTarget.style.background = 'rgba(0,194,168,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(10,22,40,0.5)';
                  }}
                >
                  <span style={{ color: '#00C2A8' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#8A9BB8' }}>
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            <FloatingSuccessCard />
          </motion.div>

          {/* Right Panel: Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <div style={{
              background: 'rgba(10,22,40,0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 600,
                fontSize: '22px', color: '#F0F4FF',
                margin: '0 0 28px', letterSpacing: '-0.5px',
              }}>
                Send us a message
              </h3>

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Full Name"
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={v => setForm(f => ({ ...f, name: v }))}
                  error={errors.name}
                />
                <FormInput
                  label="Business Email"
                  type="email"
                  placeholder="rajesh@yourmsme.com"
                  value={form.email}
                  onChange={v => setForm(f => ({ ...f, email: v }))}
                  error={errors.email}
                />
                <FormInput
                  label="Company / MSME Name"
                  placeholder="Kumar Enterprises Pvt. Ltd."
                  value={form.company}
                  onChange={v => setForm(f => ({ ...f, company: v }))}
                  error={errors.company}
                />
                <FormTextarea
                  label="Message"
                  placeholder="Tell us about your business and how you're currently handling tenders..."
                  value={form.message}
                  onChange={v => setForm(f => ({ ...f, message: v }))}
                />

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={!submitting ? { scale: 1.01, boxShadow: '0 0 32px rgba(0,194,168,0.35)' } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  style={{
                    width: '100%',
                    background: submitting
                      ? 'rgba(0,194,168,0.4)'
                      : 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                    border: 'none', borderRadius: '999px',
                    color: '#fff', fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600, fontSize: '16px',
                    padding: '15px', cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'background 0.3s',
                  }}
                >
                  {submitting ? (
                    <>Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </motion.button>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '6px', marginTop: '16px',
                }}>
                  <Lock size={12} style={{ color: '#3D5070' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#3D5070', letterSpacing: '0.3px' }}>
                    No spam. Ever.
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
