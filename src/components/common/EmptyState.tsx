import React from 'react';
import { ShieldAlert } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-stone-800 rounded-2xl bg-stone-900/30">
      <div className="p-3 bg-stone-800/80 text-amber-400 rounded-2xl mb-4">
        {icon || <ShieldAlert className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-200">{title}</h3>
      <p className="mt-1.5 text-sm text-stone-400 max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
