/**
 * E2E Tests for Onboarding Flow
 * Playwright tests covering complete user journey
 */

import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate from landing to onboarding', async ({ page }) => {
    // Click the CTA button
    await page.click('text=Calculate My Footprint')

    // Should be on onboarding page
    await expect(page).toHaveURL(/.*onboarding/)
    await expect(page.locator('h1')).toContainText('Calculate Your Carbon Footprint')
  })

  test('should complete full onboarding wizard', async ({ page }) => {
    await page.goto('/onboarding')

    // Step 1: Transport
    await expect(page.locator('text=Transportation')).toBeVisible()
    await page.selectOption('select[name="primaryVehicle"]', 'petrol_car')
    await page.fill('input[type="range"]', '100')
    await page.click('button:has-text("Next")')

    // Step 2: Diet
    await expect(page.locator('text=Diet')).toBeVisible()
    await page.selectOption('select[name="dietType"]', 'omnivore')
    await page.click('button:has-text("Next")')

    // Step 3: Energy
    await expect(page.locator('text=Energy')).toBeVisible()
    await page.selectOption('select[name="homeType"]', 'apartment')
    await page.click('button:has-text("Next")')

    // Step 4: Digital
    await expect(page.locator('text=Digital Life')).toBeVisible()
    await page.fill('input[type="range"]', '6')
    await page.click('button:has-text("Next")')

    // Step 5: Consumption
    await expect(page.locator('text=Consumption')).toBeVisible()
    await page.selectOption('select[name="clothingFrequency"]', 'occasionally')

    // Submit
    await page.click('button:has-text("Calculate My Footprint")')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
    await expect(page.locator('text=Your Carbon Dashboard')).toBeVisible()
  })

  test('should show validation errors for invalid data', async ({ page }) => {
    await page.goto('/onboarding')

    // Try to proceed with invalid data
    await page.fill('input[type="range"]', '-1')
    await page.click('button:has-text("Next")')

    // Should show error
    await expect(page.locator('text=Please fix')).toBeVisible()
  })
})

test.describe('Dashboard', () => {
  test('should display carbon profile after onboarding', async ({ page }) => {
    // First complete onboarding
    await page.goto('/onboarding')

    // Fill all steps quickly
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Next")')
    }

    await page.click('button:has-text("Calculate My Footprint")')
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })

    // Check dashboard elements
    await expect(page.locator('text=Your Carbon Dashboard')).toBeVisible()
    await expect(page.locator('text=Annual Emissions')).toBeVisible()
    await expect(page.locator('text=Daily Average')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Check for h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3').count()
    expect(headings).toBeGreaterThan(0)
  })

  test('should have skip link', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.locator('text=Skip to main content')
    await expect(skipLink).toBeVisible()
  })

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/onboarding')

    // Check buttons have accessible names
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      expect(ariaLabel || text).toBeTruthy()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/onboarding')

    // Tab through form elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should be able to interact with focused element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Should show mobile menu button
    await expect(page.locator('button[aria-label="Toggle mobile menu"]')).toBeVisible()

    // Content should be visible
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/dashboard')

    // Cards should be in grid layout
    const cards = page.locator('.card')
    await expect(cards.first()).toBeVisible()
  })
})
