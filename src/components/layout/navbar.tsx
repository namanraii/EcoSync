/**
 * Navigation Bar
 * Responsive top navigation with mobile menu support
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'
import { useStore, useUserProfile } from '@/lib/hooks/use-store'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/actions', label: 'Actions', icon: '⚡' },
  { href: '/insights', label: 'Insights', icon: '💡' },
  { href: '/trends', label: 'Trends', icon: '📈' },
]

export function Navbar(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const userProfile = useUserProfile()
  const { resetStore } = useStore()

  const handleReset = (): void => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to reset all data?')
    ) {
      resetStore()
      router.push('/')
    }
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-80"
          aria-label="EcoSync Home"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="14" stroke="#10b981" strokeWidth="2" fill="none" />
            <path
              d="M16 8C16 8 12 12 12 16C12 20 16 24 16 24C16 24 20 20 20 16C20 12 16 8 16 8Z"
              fill="#10b981"
            />
            <circle cx="16" cy="16" r="3" fill="white" />
          </svg>
          <span className="hidden sm:inline">EcoSync</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {userProfile?.onboardingComplete &&
            NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <span className="mr-1.5" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {userProfile?.onboardingComplete && (
            <button
              onClick={handleReset}
              className="hidden items-center rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
              aria-label="Reset all data"
            >
              Reset Data
            </button>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 hover:bg-accent md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            aria-controls="mobile-menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t bg-background md:hidden" role="menu">
          <div className="container space-y-1 py-3">
            {userProfile?.onboardingComplete ? (
              NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  <span className="mr-2" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))
            ) : (
              <Link
                href="/"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Onboarding
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
