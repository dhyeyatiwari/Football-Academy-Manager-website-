import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  accent?: boolean;
  color?: 'red' | 'blue' | 'gold' | 'white';
}

export function SectionHeading({
  title,
  subtitle,
  className,
  size = 'lg',
  centered = false,
  accent = false,
  color = 'white',
}: SectionHeadingProps) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
  };

  const colorClasses = {
    red: 'text-club-red',
    blue: 'text-club-blue',
    gold: 'text-club-gold',
    white: 'text-white',
  };

  const accentStyles = accent
    ? {
        textShadow: '0 0 30px rgba(197, 30, 50, 0.35)',
      }
    : {};

  return (
    <div
      className={cn(
        'space-y-2',
        centered && 'text-center',
        className
      )}
      style={accent ? accentStyles : undefined}
    >
      <h2
        className={cn(
          'font-display font-bold',
          'tracking-tight',
          sizeClasses[size],
          'uppercase',
          colorClasses[color]
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'font-sans',
            'text-club-muted',
            'text-base md:text-lg',
            'max-w-2xl',
            centered && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}