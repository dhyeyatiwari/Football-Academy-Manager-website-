import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-club-border bg-club-surface/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-club-pitch/10 text-club-pitch">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-club-muted">{description}</p>}
    </div>
  );
}