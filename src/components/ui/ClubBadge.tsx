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
  showText = true 
}: ClubBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const variantClasses = {
    default: 'bg-club-pitch text-club-darkest',
    dark: 'bg-club-darkest text-club-silver',
    light: 'bg-club-silver text-club-darkest',
  };

  return (
    <div className={cn(
      'relative inline-flex items-center justify-center',
      'font-display font-bold',
      'rounded-full',
      'border-2 border-club-pitch',
      'shadow-lg',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}
    style={variant === 'default' ? {
      background: 'linear-gradient(135deg, #00E676 0%, #00FF85 100%)',
      boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)'
    } : undefined}
    >
      <span className={cn('font-mono', textSizeClasses[size])}>VK</span>
      {showText && (
        <span className={cn('absolute -bottom-1 -right-1', textSizeClasses.sm)}>
          FC
        </span>
      )}
    </div>
  );
}