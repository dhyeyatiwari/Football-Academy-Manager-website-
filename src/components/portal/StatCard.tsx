import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, accent = false, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-club-border bg-club-surface p-6 transition-all duration-300 hover:border-club-red/60',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-club-muted">{label}</p>
          <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div
              className={cn(
                'mt-3 inline-flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-club-red' : 'text-destructive'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value}% vs last month
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            accent ? 'bg-club-red text-club-silver' : 'bg-club-red/10 text-club-red'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-club-red/5 blur-2xl"
      />
    </div>
  );
}