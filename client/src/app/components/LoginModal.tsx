import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

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

function InputField({
  icon, label, type = 'text', placeholder, value, onChange,
}: {
  icon: React.ReactNode; label: string; type?: string;
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block', fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px', color: '#8A9BB8', marginBottom: '7px',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: focused ? '#00C2A8' : '#3D5070', transition: 'color 0.2s',
          display: 'flex', alignItems: 'center',
        }}>
          {icon}
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(15,30,53,0.8)',
            border: `1px solid ${focused ? 'rgba(0,194,168,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '12px',
            color: '#F0F4FF', fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
            padding: `13px 14px 13px ${isPassword ? '44px' : '44px'}`,
            paddingRight: isPassword ? '44px' : '14px',
            outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(0,194,168,0.1)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#3D5070', display: 'flex', alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#8A9BB8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3D5070')}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function OAuthButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      whileHover={{ borderColor: 'rgba(0,194,168,0.3)', background: 'rgba(0,194,168,0.04)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '11px 16px',
        color: '#8A9BB8', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function LoginModal({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess?: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', company: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success('Welcome back! Redirecting to dashboard...', {
      style: { background: '#0A1628', border: '1px solid rgba(0,194,168,0.3)', color: '#F0F4FF' },
    });
    onClose();
    onLoginSuccess?.();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success('Account created! Redirecting to dashboard...', {
      style: { background: '#0A1628', border: '1px solid rgba(0,194,168,0.3)', color: '#F0F4FF' },
    });
    onClose();
    onLoginSuccess?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(5,13,26,0.85)',
              backdropFilter: 'blur(24px)',
            }}
          />

          {/* Modal Card */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              position: 'fixed', top: '80px', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 101,
              width: '100%', maxWidth: '480px',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
            }}
          >
            <div style={{
              background: 'rgba(10,22,40,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,194,168,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
              margin: '20px',
            }}>
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '50%', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#8A9BB8',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <HexLogo />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: '#F0F4FF' }}>VBDP</span>
                </div>
                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: '26px', color: '#F0F4FF',
                  letterSpacing: '-0.5px', margin: 0,
                }}>
                  {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                  color: '#8A9BB8', margin: '8px 0 0',
                }}>
                  {tab === 'login' ? 'Sign in to your dashboard' : 'Start winning tenders today'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div style={{
                display: 'flex',
                background: 'rgba(15,30,53,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '999px',
                padding: '4px',
                marginBottom: '28px',
              }}>
                {(['login', 'register'] as const).map(t => (
                  <motion.button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      background: tab === t ? 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)' : 'rgba(0,0,0,0)',
                      border: 'none', borderRadius: '999px',
                      color: tab === t ? '#fff' : '#8A9BB8',
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                      padding: '9px 16px', cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t === 'login' ? 'Login' : 'Register'}
                  </motion.button>
                ))}
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleLogin}
                  >
                    <InputField
                      icon={<Mail size={16} />}
                      label="Email Address"
                      type="email"
                      placeholder="you@company.com"
                      value={loginForm.email}
                      onChange={v => setLoginForm(f => ({ ...f, email: v }))}
                    />
                    <InputField
                      icon={<Lock size={16} />}
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={v => setLoginForm(f => ({ ...f, password: v }))}
                    />

                    <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-4px' }}>
                      <button
                        type="button"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#00C2A8', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={!submitting ? { scale: 1.01, boxShadow: '0 0 28px rgba(0,194,168,0.35)' } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                      style={{
                        width: '100%',
                        background: submitting ? 'rgba(0,194,168,0.5)' : 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                        border: 'none', borderRadius: '999px',
                        color: '#fff', fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 600, fontSize: '16px',
                        padding: '14px', cursor: submitting ? 'not-allowed' : 'pointer',
                        marginBottom: '20px',
                      }}
                    >
                      {submitting ? 'Signing in...' : 'Login to Dashboard →'}
                    </motion.button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#3D5070' }}>or continue with</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <OAuthButton icon={<GoogleIcon />} label="Google" />
                      <OAuthButton icon={<LinkedInIcon />} label="LinkedIn" />
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleRegister}
                  >
                    <InputField
                      icon={<User size={16} />}
                      label="Full Name"
                      placeholder="Rajesh Kumar"
                      value={registerForm.name}
                      onChange={v => setRegisterForm(f => ({ ...f, name: v }))}
                    />
                    <InputField
                      icon={<Mail size={16} />}
                      label="Business Email"
                      type="email"
                      placeholder="rajesh@yourmsme.com"
                      value={registerForm.email}
                      onChange={v => setRegisterForm(f => ({ ...f, email: v }))}
                    />
                    <InputField
                      icon={<Building2 size={16} />}
                      label="Company / MSME Name"
                      placeholder="Kumar Enterprises Pvt. Ltd."
                      value={registerForm.company}
                      onChange={v => setRegisterForm(f => ({ ...f, company: v }))}
                    />
                    <InputField
                      icon={<Lock size={16} />}
                      label="Password"
                      type="password"
                      placeholder="Create a strong password"
                      value={registerForm.password}
                      onChange={v => setRegisterForm(f => ({ ...f, password: v }))}
                    />

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={!submitting ? { scale: 1.01, boxShadow: '0 0 28px rgba(0,194,168,0.35)' } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                      style={{
                        width: '100%', marginTop: '8px',
                        background: submitting ? 'rgba(0,194,168,0.5)' : 'linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)',
                        border: 'none', borderRadius: '999px',
                        color: '#fff', fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 600, fontSize: '16px',
                        padding: '14px', cursor: submitting ? 'not-allowed' : 'pointer',
                        marginBottom: '20px',
                      }}
                    >
                      {submitting ? 'Creating Account...' : 'Create Account →'}
                    </motion.button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#3D5070' }}>or sign up with</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <OAuthButton icon={<GoogleIcon />} label="Google" />
                      <OAuthButton icon={<LinkedInIcon />} label="LinkedIn" />
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}