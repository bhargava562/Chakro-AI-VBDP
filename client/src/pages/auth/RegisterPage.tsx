import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/motion/variants';

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/verify';
    }, 1500);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-8 dark bg-gradient-to-br from-surface-950 via-brand-950/30 to-surface-950">
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create your account</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Start your 14-day free trial. No credit card required.
          </p>
        </motion.div>

        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name" label="Full Name" placeholder="Your name"
            value={form.name} onChange={update('name')}
            icon={<User className="h-4 w-4" />} required
          />
          <Input
            id="email" label="Work Email" type="email" placeholder="name@company.com"
            value={form.email} onChange={update('email')}
            icon={<Mail className="h-4 w-4" />} required
          />
          <Input
            id="company" label="Company Name" placeholder="Your MSME name"
            value={form.company} onChange={update('company')}
            icon={<Building className="h-4 w-4" />} required
          />
          <Input
            id="password" label="Password" type="password" placeholder="Min. 8 characters"
            value={form.password} onChange={update('password')}
            icon={<Lock className="h-4 w-4" />} required
          />
          <Input
            id="confirm" label="Confirm Password" type="password" placeholder="••••••••"
            value={form.confirm} onChange={update('confirm')}
            icon={<Lock className="h-4 w-4" />} required
          />

          <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
            Create Account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.form>

        <motion.p variants={fadeInUp} className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <a href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
