import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  valueFormatter?: (value: number) => string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, helperText, valueFormatter, id, min = 0, max = 100, value, ...props }, ref) => {
    const sliderId = id || React.useId()
    const helperId = `${sliderId}-helper`
    const numericValue = typeof value === 'string' ? Number(value) : (value || 0)
    const percentage = ((numericValue - Number(min)) / (Number(max) - Number(min))) * 100

    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={sliderId} className="mb-1.5 block text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {valueFormatter && (
            <span className="text-sm font-medium text-muted-foreground">
              {valueFormatter(numericValue)}
            </span>
          )}
        </div>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          value={value}
          className={cn(
            'w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
          )}
          ref={ref}
          aria-describedby={helperText ? helperId : undefined}
          aria-valuemin={Number(min)}
          aria-valuemax={Number(max)}
          aria-valuenow={numericValue}
          {...props}
        />
        {helperText && (
          <p id={helperId} className="mt-1 text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
