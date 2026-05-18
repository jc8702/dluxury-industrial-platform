import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blue-600 text-white hover:bg-blue-600/80',
        secondary:
          'border-transparent bg-slate-800 text-slate-100 hover:bg-slate-800/80',
        danger:
          'border-transparent bg-red-500/10 text-red-400 border border-red-500/20',
        success:
          'border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        warning:
          'border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20',
        info:
          'border-transparent bg-blue-500/10 text-blue-400 border border-blue-500/20',
        outline: 'text-slate-300 border-slate-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
