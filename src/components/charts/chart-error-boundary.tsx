'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartErrorBoundaryProps {
  children: React.ReactNode
  fallbackTitle?: string
  ariaLabel?: string
}

interface ChartErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ChartErrorBoundary extends React.Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Chart rendering error:', error, errorInfo)
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Card role="region" aria-label={this.props.ariaLabel || 'Chart error'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              {this.props.fallbackTitle || 'Visualization Unavailable'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load chart data. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Retry loading chart"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
