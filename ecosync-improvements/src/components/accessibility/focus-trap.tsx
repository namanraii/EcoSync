'use client'

import * as React from 'react'

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
  onEscape?: () => void
  ariaLabel?: string
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef?: React.RefObject<HTMLElement>
}

export function FocusTrap({
  children,
  isActive,
  onEscape,
  ariaLabel = 'Modal dialog',
  initialFocusRef,
  returnFocusRef,
}: FocusTrapProps): JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  // Store previous focus when activating
  React.useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus initial element or first focusable
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else {
        const focusable = getFocusableElements(containerRef.current)
        if (focusable.length > 0) {
          focusable[0].focus()
        }
      }
    } else if (previousFocusRef.current && returnFocusRef?.current) {
      returnFocusRef.current.focus()
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [isActive, initialFocusRef, returnFocusRef])

  // Handle Tab key to trap focus
  React.useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusable = getFocusableElements(containerRef.current)
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      if (e.key === 'Escape' && onEscape) {
        e.preventDefault()
        onEscape()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onEscape])

  // Prevent body scroll when active
  React.useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && onEscape) {
          onEscape()
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-lg bg-background shadow-lg">
        {children}
      </div>
    </div>
  )
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []

  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll(selector))
    .filter((el) => {
      const element = el as HTMLElement
      return element.offsetParent !== null && element.tabIndex >= 0
    }) as HTMLElement[]
}
