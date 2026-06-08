/**
 * Progress Component
 * Accessible progress indicator with ARIA support
 */

import * as React from 'react';
import { cn } from '@/lib/utils/helpers';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'default' | 'lg';
  color?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value, max = 100, label, showValue = true, size = 'default', color, ...props },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
      sm: 'h-1.5',
      default: 'h-2.5',
      lg: 'h-4',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between mb-1.5">
            {label && (
              <span className="text-sm font-medium text-foreground" id={`progress-label-${label}`}>
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm font-medium text-muted-foreground" aria-live="polite">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-secondary',
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        >
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out rounded-full',
              color || 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
