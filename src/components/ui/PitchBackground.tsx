import React from 'react';
import { cn } from '@/lib/utils';

interface PitchBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'strong' | 'minimal';
  children?: React.ReactNode;
}

export function PitchBackground({
  className,
  variant = 'subtle',
  children,
}: PitchBackgroundProps) {
  const variantClasses = {
    subtle: 'bg-club-bg pitch-grid',
    strong: 'bg-club-bg pitch-grid',
    minimal: 'bg-club-bg',
  };

  const overlayStyles = {
    subtle: 'bg-gradient-to-b from-club-bg/60 via-transparent to-club-bg/80',
    strong: 'bg-gradient-to-b from-club-bg/80 via-transparent to-club-bg/90',
    minimal: 'bg-gradient-to-b from-club-bg/40 via-transparent to-club-bg/60',
  };

  return (
    <div
      className={cn(
        'relative min-h-screen',
        'overflow-hidden',
        variantClasses[variant],
        className
      )}
    >
      {/* Tactical pitch overlay */}
      <div
        className={cn(
          'absolute inset-0',
          'pointer-events-none',
          overlayStyles[variant]
        )}
        style={
          variant !== 'minimal'
            ? {
                backgroundImage:
                  'radial-gradient(circle at 50% 0%, rgba(197, 30, 50, 0.08) 0%, transparent 70%)',
              }
            : undefined
        }
      />

      {/* Geometric pitch markings */}
      <div
        className={cn(
          'absolute inset-0',
          'pointer-events-none',
          'opacity-20'
        )}
        style={
          variant !== 'minimal'
            ? {
                backgroundImage:
                  'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center',
              }
            : undefined
        }
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}