import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/motion/variants';

export function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 dark bg-gradient-to-br from-surface-950 via-brand-950/30 to-surface-950">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8 text-center"
      >
        <motion.div variants={fadeInUp}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Verify your email</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            We've sent a 6-digit code to your email. Enter it below.
          </p>
        </motion.div>

        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
              />
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Verify & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.form>

        <motion.div variants={fadeInUp} className="text-sm text-[var(--text-secondary)]">
          Didn't receive the code?{' '}
          <button className="text-brand-400 hover:text-brand-300 font-medium transition-colors cursor-pointer">
            Resend
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
