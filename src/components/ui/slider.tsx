/**
 * Slider Component
 * Accessible range input with keyboard support
 */

import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label?: string
  error?: string
  helperText?: string
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  showValue?: boolean
  valueFormatter?: (value: number) => string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      showValue = true,
      valueFormatter = (v: number): string => String(v),
      id,
      ...props
    },
    ref
  ): React.ReactElement => {
    const defaultId = React.useId()
    const sliderId = id || defaultId
    const errorId = `${sliderId}-error`
    const helperId = `${sliderId}-helper`
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className={cn('w-full', className)}>
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label htmlFor={sliderId} className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-primary" aria-live="polite">
              {valueFormatter(value)}
            </span>
          )}
        </div>
        <div className="relative flex items-center">
          <input
            id={sliderId}
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              'h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:bg-primary/90',
              '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary',
              error && '[&::-moz-range-thumb]:bg-red-500 [&::-webkit-slider-thumb]:bg-red-500'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          />
          <div
            className="pointer-events-none absolute h-2 rounded-l-lg bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }
