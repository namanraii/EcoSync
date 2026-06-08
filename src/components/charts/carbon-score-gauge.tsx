/**
 * Carbon Score Gauge
 * Circular progress indicator for carbon score visualization
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/helpers';
import { getCarbonRating } from '@/lib/utils/calculator';

interface CarbonScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function CarbonScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  className,
}: CarbonScoreGaugeProps): JSX.Element {
  const rating = getCarbonRating(score);

  const sizes = {
    sm: { width: 80, strokeWidth: 8, fontSize: 20 },
    md: { width: 150, strokeWidth: 12, fontSize: 32 },
    lg: { width: 200, strokeWidth: 16, fontSize: 42 },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = (): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#34d399';
    if (score >= 40) return '#f59e0b';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height: width }}>
        <svg
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
          role="img"
          aria-label={`Carbon score: ${score} out of 100. Rating: ${rating.label}`}
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${width / 2} ${width / 2})`}
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold text-foreground"
            style={{ fontSize }}
            aria-hidden="true"
          >
            {score}
          </span>
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            /100
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="mt-3 text-center">
          <p className={cn('text-sm font-semibold', rating.color)}>{rating.label}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
            {rating.description}
          </p>
        </div>
      )}
    </div>
  );
}
