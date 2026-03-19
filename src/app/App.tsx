import { useState } from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { VBDPNavbar } from './components/VBDPNavbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { LoginModal } from './components/LoginModal';
import { VBDPFooter } from './components/VBDPFooter';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const handleLoginSuccess = () => setLoggedIn(true);
  const handleLogout = () => setLoggedIn(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {loggedIn ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Dashboard onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              backgroundColor: '#050D1A',
              color: '#F0F4FF',
              minHeight: '100vh',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <VBDPNavbar onLoginClick={openLogin} />

            <main>
              <HeroSection onCTAClick={openLogin} />
              <AboutSection />
              <ContactSection />
            </main>

            <VBDPFooter onLoginClick={openLogin} />

            <LoginModal
              isOpen={loginOpen}
              onClose={closeLogin}
              onLoginSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0A1628',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F0F4FF',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </>
  );
}
