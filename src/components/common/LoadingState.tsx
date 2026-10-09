import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading tournament data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-stone-800 border-t-amber-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-amber-500/20" />
      </div>
      <p className="text-sm font-medium text-stone-400 animate-pulse">{message}</p>
    </div>
  );
};
