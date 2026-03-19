import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { cn } from '@/lib/utils';
import type { AlertLevel } from '@/types';

const icons: Record<AlertLevel, React.ReactNode> = {
  info: <Info className="h-5 w-5 text-blue-400" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-400" />,
  urgent: <AlertCircle className="h-5 w-5 text-red-500" />,
};

const bgColors: Record<AlertLevel, string> = {
  info: 'border-blue-500/30 bg-blue-950/50',
  success: 'border-emerald-500/30 bg-emerald-950/50',
  warning: 'border-amber-500/30 bg-amber-950/50',
  error: 'border-red-500/30 bg-red-950/50',
  urgent: 'border-red-500/50 bg-red-950/70',
};

export function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts);
  const removeToast = useNotificationStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-xl',
              bgColors[toast.level]
            )}
          >
            {icons[toast.level]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
