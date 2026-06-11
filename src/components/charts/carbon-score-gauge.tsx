'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/helpers'
import { getCarbonRating } from '@/lib/utils/calculator'

interface CarbonScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  ariaLabel?: string
}

export const CarbonScoreGauge = React.memo(function CarbonScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  className,
  ariaLabel = 'Carbon score gauge',
}: CarbonScoreGaugeProps): JSX.Element {
  const rating = getCarbonRating(score)

  const sizes = {
    sm: { width: 80, strokeWidth: 8, fontSize: 20 },
    md: { width: 150, strokeWidth: 12, fontSize: 32 },
    lg: { width: 200, strokeWidth: 16, fontSize: 42 },
  }

  const { width, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (): string => {
    if (score >= 80) {
      return '#10b981'
    }
    if (score >= 60) {
      return '#34d399'
    }
    if (score >= 40) {
      return '#f59e0b'
    }
    if (score >= 20) {
      return '#f97316'
    }
    return '#ef4444'
  }

  const color = getColor()

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      role="meter"
      aria-label={ariaLabel}
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${score} out of 100, ${rating.label}`}
    >
      {/* Visually hidden description for screen readers */}
      <span className="sr-only">
        Your carbon score is {score} out of 100. Rating: {rating.label}. {rating.description}
      </span>

      <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`} aria-hidden="true">
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
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${width / 2} ${width / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
        {/* Center text */}
        <text
          x={width / 2}
          y={width / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill={color}
        >
          {score}
        </text>
      </svg>

      {showLabel && (
        <div className="mt-2 text-center" aria-hidden="true">
          <p className={cn('font-semibold', rating.color)}>{rating.label}</p>
          <p className="text-xs text-muted-foreground">{rating.description}</p>
        </div>
      )}
    </div>
  )
})

CarbonScoreGauge.displayName = 'CarbonScoreGauge'
