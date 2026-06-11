import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  errorMessage?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, errorMessage, id, children, ...props }, ref) => {
    const selectId = id || React.useId()
    const errorId = `${selectId}-error`
    const helperId = `${selectId}-helper`
    const hasError = !!errorMessage

    const describedBy = [
      helperText ? helperId : null,
      hasError ? errorId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={props.required}
          {...props}
        >
          {children}
        </select>
        {helperText && !hasError && (
          <p id={helperId} className="mt-1 text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        {hasError && (
          <p id={errorId} className="mt-1 text-xs text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
