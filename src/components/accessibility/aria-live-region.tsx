'use client'

import * as React from 'react'

interface AriaLiveRegionProps {
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
  children: React.ReactNode
  className?: string
}

export function AriaLiveRegion({
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  children,
  className = 'sr-only',
}: AriaLiveRegionProps): JSX.Element {
  return (
    <div aria-live={ariaLive} aria-atomic={ariaAtomic} className={className}>
      {children}
    </div>
  )
}

// Specialized component for carbon score announcements
interface ScoreAnnouncementProps {
  score: number
  previousScore?: number
  label?: string
}

export function ScoreAnnouncement({
  score,
  previousScore,
  label = 'Your carbon score',
}: ScoreAnnouncementProps): JSX.Element {
  const message = React.useMemo(() => {
    if (previousScore === undefined) {
      return `${label} is now ${score} out of 100.`
    }
    const diff = score - previousScore
    if (diff > 0) {
      return `${label} improved by ${diff} points to ${score}.`
    } else if (diff < 0) {
      return `${label} decreased by ${Math.abs(diff)} points to ${score}.`
    }
    return `${label} remains at ${score}.`
  }, [score, previousScore, label])

  return (
    <AriaLiveRegion aria-live="polite" aria-atomic={true}>
      {message}
    </AriaLiveRegion>
  )
}
