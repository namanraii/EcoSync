'use client'

import * as React from 'react'

interface SkipLinkProps {
  targetId?: string
  label?: string
}

export function SkipLink({
  targetId = 'main-content',
  label = 'Skip to main content',
}: SkipLinkProps): JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.tabIndex = -1
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
      // Remove tabIndex after blur to keep DOM clean
      const handleBlur = (): void => {
        target.removeAttribute('tabindex')
        target.removeEventListener('blur', handleBlur)
      }
      target.addEventListener('blur', handleBlur)
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {label}
    </a>
  )
}
