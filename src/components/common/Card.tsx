import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  const hoverClasses = hoverEffect
    ? 'hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer transition-all duration-300'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-5 shadow-sm ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
