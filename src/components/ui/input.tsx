import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  helperText?: string
  label?: string
  maxLength?: number
  pattern?: string
  autoComplete?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      errorMessage,
      helperText,
      label,
      maxLength = 500,
      pattern,
      autoComplete,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const defaultId = React.useId()
    const inputId = id || defaultId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const hasError = !!errorMessage

    const describedBy = [
      helperText ? helperId : null,
      hasError ? errorId : null,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={props.required}
          {...props}
        />
        {helperText && !hasError && (
          <p id={helperId} className="mt-1 text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        {hasError && (
          <p
            id={errorId}
            className="mt-1 text-xs text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
