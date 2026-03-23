import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/motion/variants';
import { authService } from '@/services/auth';

type FormFields = 'name' | 'email' | 'company' | 'password' | 'confirm';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Record<FormFields, string>>({ name: '', email: '', company: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.register({ name: form.name, email: form.email, companyName: form.company, password: form.password });
      navigate('/verify', { state: { email: form.email } });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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
          <div>
            <Input id="name" label="Full Name" placeholder="Your name" value={form.name} onChange={update('name')} icon={<User className="h-4 w-4" />} />
            {errors.name && <p className="mt-1 text-xs text-danger-400">{errors.name}</p>}
          </div>
          <div>
            <Input id="email" label="Work Email" type="email" placeholder="name@company.com" value={form.email} onChange={update('email')} icon={<Mail className="h-4 w-4" />} />
            {errors.email && <p className="mt-1 text-xs text-danger-400">{errors.email}</p>}
          </div>
          <div>
            <Input id="company" label="Company Name" placeholder="Your MSME name" value={form.company} onChange={update('company')} icon={<Building className="h-4 w-4" />} />
            {errors.company && <p className="mt-1 text-xs text-danger-400">{errors.company}</p>}
          </div>
          <div>
            <Input id="password" label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} icon={<Lock className="h-4 w-4" />} />
            {errors.password && <p className="mt-1 text-xs text-danger-400">{errors.password}</p>}
          </div>
          <div>
            <Input id="confirm" label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={update('confirm')} icon={<Lock className="h-4 w-4" />} />
            {errors.confirm && <p className="mt-1 text-xs text-danger-400">{errors.confirm}</p>}
          </div>

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
