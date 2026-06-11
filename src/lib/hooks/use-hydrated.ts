'use client'

import { useState, useEffect } from 'react'

/**
 * SSR-safe hook to determine if component has mounted on the client.
 * Prevents hydration mismatches by returning false on the server and
 * true after the first client-side mount.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)

  useEffect((): void => {
    setHydrated(true)
  }, [])

  return hydrated
}
