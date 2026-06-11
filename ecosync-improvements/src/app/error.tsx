'use client'

import * as React from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps): JSX.Element {
  const [errorDetails, setErrorDetails] = React.useState(false)

  React.useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <main id="main-content" role="main" className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Aria-live region for error announcement */}
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          An error has occurred: {error.message}. Please try refreshing the page.
        </div>

        <Card role="alert" aria-label="Error notification">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
            <CardDescription>
              We encountered an unexpected error. Our team has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Error: {error.message || 'Unknown error'}
              </p>
              {error.digest && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={reset}
                className="flex-1"
                aria-label="Try again to recover from error"
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1"
                aria-label="Return to home page"
              >
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go Home
              </Button>
            </div>

            <button
              onClick={() => setErrorDetails(!errorDetails)}
              className="w-full text-center text-sm text-muted-foreground underline hover:text-foreground"
              aria-expanded={errorDetails}
              aria-controls="error-details"
            >
              {errorDetails ? 'Hide' : 'Show'} technical details
            </button>

            {errorDetails && (
              <div
                id="error-details"
                className="rounded-md bg-muted p-4"
                role="region"
                aria-label="Technical error details"
              >
                <pre className="overflow-x-auto text-xs text-muted-foreground">
                  {error.stack || 'No stack trace available'}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
