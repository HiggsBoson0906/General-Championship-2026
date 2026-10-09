import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import type { CsvValidationError } from '../../types';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  validationErrors?: CsvValidationError[];
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Failed to load tournament data',
  message,
  validationErrors = [],
  onRetry,
}) => {
  return (
    <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6 my-6 max-w-2xl mx-auto backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-rose-200">{title}</h3>
          <p className="mt-1 text-sm text-rose-300/90 leading-relaxed">{message}</p>

          {validationErrors.length > 0 && (
            <div className="mt-4 p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs font-mono max-h-48 overflow-y-auto">
              <p className="text-stone-400 font-sans font-semibold mb-2">CSV Issues Detected ({validationErrors.length}):</p>
              <ul className="space-y-1 text-rose-300">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="break-words">
                    [{err.file}{err.row ? `:row ${err.row}` : ''}] {err.field ? `field "${err.field}": ` : ''}{err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onRetry && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Loading
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
