import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
        brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'brand' && 'bg-brand-500',
            variant === 'info' && 'bg-blue-500',
            (!variant || variant === 'default') && 'bg-surface-500'
          )}
        />
      )}
      {children}
    </span>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { badgeVariants };
