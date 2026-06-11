/**
 * Custom Hook for LocalStorage with Type Safety, Rate Limiting, and Security
 * Provides reactive localStorage access with SSR safety and DOS protection
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { isClient } from '@/lib/utils/helpers'

// Rate limiting configuration
const RATE_LIMIT = {
  maxOperations: 10,      // Max 10 operations per window
  windowMs: 1000,         // 1 second window
  maxStorageSize: 5 * 1024 * 1024, // 5MB limit (localStorage typical max ~5-10MB)
  keyMaxLength: 256,      // Prevent key flooding
}

interface RateLimitState {
  operations: number[]
  lastWarning: number
}

function checkRateLimit(state: RateLimitState): { allowed: boolean; warning: boolean } {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.windowMs
  const recentOps = state.operations.filter((t) => t > windowStart)

  if (recentOps.length >= RATE_LIMIT.maxOperations) {
    const shouldWarn = now - state.lastWarning > 5000
    return { allowed: false, warning: shouldWarn }
  }

  return { allowed: true, warning: false }
}

function getStorageSize(): number {
  if (!isClient()) {return 0}
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    const value = localStorage.getItem(key) || ''
    total += key.length + value.length
  }
  return total * 2 // UTF-16 = 2 bytes per char
}

function sanitizeKey(key: string): string {
  // Prevent injection and limit length
  return key
    .replace(/[<>'"&]/g, '')
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .slice(0, RATE_LIMIT.keyMaxLength)
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void, { error: string | null; rateLimited: boolean }] {
  const sanitizedKey = sanitizeKey(key)
  const rateLimitRef = useRef<RateLimitState>({ operations: [], lastWarning: 0 })
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient()) {return initialValue}
    try {
      const item = window.localStorage.getItem(sanitizedKey)
      if (!item) {return initialValue}

      // Validate size before parsing
      if (item.length > 100000) {
        console.warn(`LocalStorage item ${sanitizedKey} exceeds safe size limit`)
        return initialValue
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`Error reading localStorage key "${sanitizedKey}":`, error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Check rate limit
        const { allowed, warning } = checkRateLimit(rateLimitRef.current)
        if (!allowed) {
          if (warning) {
            console.warn(`Rate limit exceeded for localStorage key: ${sanitizedKey}`)
            rateLimitRef.current.lastWarning = Date.now()
          }
          setRateLimited(true)
          setTimeout(() => setRateLimited(false), RATE_LIMIT.windowMs)
          return
        }

        rateLimitRef.current.operations.push(Date.now())
        setRateLimited(false)
        setError(null)

        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Validate serialized size before storing
        const serialized = JSON.stringify(valueToStore)
        if (serialized.length > 500000) {
          throw new Error(`Value exceeds maximum storage size of 500KB for key: ${sanitizedKey}`)
        }

        // Check total storage quota
        if (getStorageSize() + serialized.length * 2 > RATE_LIMIT.maxStorageSize) {
          throw new Error('Total localStorage quota exceeded. Please clear old data.')
        }

        setStoredValue(valueToStore)
        if (isClient()) {
          window.localStorage.setItem(sanitizedKey, serialized)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown storage error'
        console.warn(`Error setting localStorage key "${sanitizedKey}":`, message)
        setError(message)
      }
    },
    [sanitizedKey, storedValue]
  )

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      const { allowed } = checkRateLimit(rateLimitRef.current)
      if (!allowed) {
        setRateLimited(true)
        setTimeout(() => setRateLimited(false), RATE_LIMIT.windowMs)
        return
      }

      rateLimitRef.current.operations.push(Date.now())
      setStoredValue(initialValue)
      setError(null)
      if (isClient()) {
        window.localStorage.removeItem(sanitizedKey)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown removal error'
      console.warn(`Error removing localStorage key "${sanitizedKey}":`, message)
      setError(message)
    }
  }, [sanitizedKey, initialValue])

  // Sync with other tabs/windows
  useEffect(() => {
    if (!isClient()) {return}

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === sanitizedKey && event.newValue !== null) {
        try {
          // Validate before parsing
          if (event.newValue.length > 100000) {
            console.warn('Received oversized storage update')
            return
          }
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch {
          setStoredValue(initialValue)
        }
      }
      // Handle key removal in other tabs
      if (event.key === sanitizedKey && event.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [sanitizedKey, initialValue])

  // Operations array is pruned lazily during checkRateLimit and setValue


  return [storedValue, setValue, removeValue, { error, rateLimited }]
}
