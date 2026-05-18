import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
        industrial:
          'bg-gradient-to-b from-slate-800 to-[#1e2330] text-slate-100 border border-slate-700/80 shadow-[0_1px_2px_rgba(0,0,0,0.4)] hover:from-slate-700/90 hover:to-[#222938] hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] active:from-slate-800 active:to-slate-900 transition-all duration-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm',
        outline:
          'border border-slate-800 bg-[#0F1115] hover:bg-slate-800 hover:text-white',
        secondary:
          'bg-slate-800 text-slate-100 hover:bg-slate-700',
        ghost: 'hover:bg-slate-800 hover:text-white',
        link: 'text-blue-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
