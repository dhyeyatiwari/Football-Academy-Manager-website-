import React from 'react';
import { cn } from '@/lib/utils';

interface ClubBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dark' | 'light';
  showText?: boolean;
}

export function ClubBadge({
  className,
  size = 'md',
  variant = 'default',
  showText = false,
}: ClubBadgeProps) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
  };

  const ringClasses = {
    default: 'ring-club-gold/50',
    dark: 'ring-club-gold/40',
    light: 'ring-club-gold/30',
  };

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-xl',
          'bg-white ring-1 shadow-lg shadow-black/40',
          sizeClasses[size],
          ringClasses[variant]
        )}
      >
        <img
          src="/vk-crest.jpg"
          alt="VK Football Academy crest"
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
      {showText && (
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-club-gold">
          VK Football Academy
        </span>
      )}
    </div>
  );
}
