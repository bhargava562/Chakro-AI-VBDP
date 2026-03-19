import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function GlassNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={cn(
          'mx-auto max-w-7xl px-4 sm:px-6',
          'pt-4'
        )}
      >
        <div
          className={cn(
            'glass rounded-2xl border border-white/10',
            'backdrop-blur-xl',
            'px-4 sm:px-5 py-3',
            'flex items-center justify-between gap-3',
            'transition-shadow duration-300 ease-out',
            scrolled && 'shadow-lg'
          )}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 min-w-0 cursor-pointer"
            aria-label="Go to landing"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-white truncate">Chakro AI</div>
              <div className="text-[11px] text-surface-400 truncate">Virtual Business Development Partner</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Agents
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              How it works
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              className="border-white/15 text-surface-200 hover:text-white hover:bg-white/5"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
            <Button size="md" className="glow-brand" onClick={() => navigate('/login')}>
              Live Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
