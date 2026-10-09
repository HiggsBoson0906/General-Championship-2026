import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'live' | 'completed' | 'scheduled' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  const variantClasses = {
    gold: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10',
    live: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse',
    completed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    scheduled: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    neutral: 'bg-stone-800 text-stone-300 border border-stone-700',
    outline: 'bg-transparent text-stone-400 border border-stone-700',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
