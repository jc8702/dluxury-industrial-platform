import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('w-full space-y-4 mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight leading-none">
            {title}
          </h1>
          {description && (
            <p className="text-slate-400 text-sm">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center shrink-0">{action}</div>}
      </div>
      <Separator />
    </div>
  );
}
