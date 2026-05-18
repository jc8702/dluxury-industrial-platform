import * as React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  invertTrendColor?: boolean;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
  variant = 'default',
  invertTrendColor = false,
  className,
}: StatCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = trend !== undefined && trend > 0;
  const isNeutral = trend !== undefined && trend === 0;

  // Lógica de cores baseadas nas variantes e no trend
  let trendColor = 'text-slate-400';
  if (hasTrend && !isNeutral) {
    const positiveColor = invertTrendColor ? 'text-red-400' : 'text-emerald-400';
    const negativeColor = invertTrendColor ? 'text-emerald-400' : 'text-red-400';
    trendColor = isPositive ? positiveColor : negativeColor;
  }

  // Cores dos ícones baseadas na variante
  const iconBgClasses = {
    default: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  return (
    <Card className={cn('p-6 hover:border-slate-700/80 transition-all duration-300 group', className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase">{label}</h3>
        <div className={cn('p-2.5 rounded-lg transition-transform group-hover:scale-105 duration-300', iconBgClasses[variant])}>
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">{value}</h2>
        {hasTrend && (
          <div className="flex items-center mt-3">
            {!isNeutral && (
              isPositive ? (
                <TrendingUp className={cn('w-4 h-4 mr-1', trendColor)} />
              ) : (
                <TrendingDown className={cn('w-4 h-4 mr-1', trendColor)} />
              )
            )}
            <span className={cn('text-xs font-semibold tracking-wider uppercase', trendColor)}>
              {isNeutral
                ? 'Estável'
                : `${isPositive ? '+' : ''}${trend}% ${trendLabel || 'vs mês ant.'}`}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
