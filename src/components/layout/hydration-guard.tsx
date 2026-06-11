'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import { Leaf } from 'lucide-react'

interface HydrationGuardProps {
  children: React.ReactNode
}

/**
 * A wrapper component that delays rendering of its children until the
 * client-side store has hydrated to prevent layout shifts.
 */
export function HydrationGuard({ children }: HydrationGuardProps): JSX.Element {
  const hydrated = useHydrated()
  const pathname = usePathname()

  // Pages that don't depend on pre-existing user profile data can bypass the guard
  const bypassGuard = pathname === '/' || pathname === '/onboarding'

  if (!hydrated && !bypassGuard) {
    return (
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center space-y-4"
        role="status"
        aria-label="Loading platform data"
      >
        <div className="relative flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/10" />
          {/* Inner spinning wheel */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <Leaf className="absolute h-5 w-5 animate-pulse text-primary" />
        </div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Synchronizing eco profile...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
