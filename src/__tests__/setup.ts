import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver for lazy loading tests
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock requestIdleCallback for performance tests
Object.defineProperty(window, 'requestIdleCallback', {
  writable: true,
  value: vi.fn((callback: IdleRequestCallback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 0)
  }),
})

Object.defineProperty(window, 'cancelIdleCallback', {
  writable: true,
  value: vi.fn((id: number) => clearTimeout(id)),
})

// Mock localStorage
const localStorageStore: Record<string, string> = {}
const localStorageMock = {
  getItem: vi.fn((key: string): string | null => localStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string): void => {
    localStorageStore[key] = value
  }),
  removeItem: vi.fn((key: string): void => {
    delete localStorageStore[key]
  }),
  clear: vi.fn((): void => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key]
    }
  }),
  get length(): number {
    return Object.keys(localStorageStore).length
  },
  key: vi.fn((index: number): string | null => Object.keys(localStorageStore)[index] ?? null),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
