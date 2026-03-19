import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/motion/variants';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const setTenant = useTenantStore((s) => s.setTenant);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(
        {
          id: 'demo-user',
          name: 'Demo User',
          email: email || 'demo@chakro.ai',
          role: 'owner',
          tenantId: 'demo-tenant',
          createdAt: new Date().toISOString(),
        },
        {
          accessToken: 'demo-access-token',
          refreshToken: 'demo-refresh-token',
          expiresAt: Date.now() + 1000 * 60 * 60,
        }
      );
      setTenant('demo-tenant', 'Demo Organization');
      setIsLoading(false);
      navigate('/dashboard', { replace: true });
    }, 900);
  };

  return (
    <div className="min-h-screen flex dark">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Sign in to your Chakro AI dashboard
            </p>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--border-default)] accent-brand-500" />
                Remember me
              </label>
              <a href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          <motion.p variants={fadeInUp} className="text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <a href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Start free trial
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Right — Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-brand-950 via-surface-900 to-brand-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="relative z-10 text-center px-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-8 border border-brand-500/20"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Your AI Business Partner</h2>
          <p className="text-surface-400 max-w-sm mx-auto">
            5 intelligent agents working around the clock to find, analyze, and help you win contracts.
          </p>
        </div>
      </div>
    </div>
  );
}
