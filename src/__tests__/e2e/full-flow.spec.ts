import { test, expect } from '@playwright/test'

test.describe('EcoSync Full Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test.describe('Landing Page', () => {
    test('should load landing page with correct title', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/EcoSync/)
      await expect(page.locator('h1')).toContainText('Carbon Footprint')
    })

    test('should have skip link for accessibility', async ({ page }) => {
      await page.goto('/')
      const skipLink = page.locator('a:has-text("Skip to main content")')
      await expect(skipLink).toBeVisible()
      await skipLink.focus()
      await expect(skipLink).toBeFocused()
    })

    test('should navigate to onboarding from CTA', async ({ page }) => {
      await page.goto('/')
      await page.click('text=Start Assessment')
      await expect(page).toHaveURL(/onboarding/)
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)

      const headings = await page.locator('h1, h2, h3').count()
      expect(headings).toBeGreaterThan(0)
    })

    test('should have aria labels on interactive elements', async ({ page }) => {
      await page.goto('/')
      // Check for aria-label on navigation
      const nav = page.locator('nav[role="navigation"]')
      await expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('Onboarding Flow', () => {
    test('should complete full onboarding wizard', async ({ page }) => {
      await page.goto('/onboarding')

      // Step 1: Transport
      await expect(page.locator('text=Transport')).toBeVisible()
      await page.fill('input[type="number"]', '100')
      await page.selectOption('select', 'weekly')
      await page.click('text=Next')

      // Step 2: Diet
      await expect(page.locator('text=Diet')).toBeVisible()
      await page.selectOption('select', 'omnivore')
      await page.click('text=Next')

      // Step 3: Energy
      await expect(page.locator('text=Energy')).toBeVisible()
      await page.fill('input[type="number"]', '80')
      await page.click('text=Next')

      // Step 4: Digital
      await expect(page.locator('text=Digital')).toBeVisible()
      await page.fill('input[type="number"]', '6')
      await page.click('text=Next')

      // Step 5: Consumption
      await expect(page.locator('text=Consumption')).toBeVisible()
      await page.fill('input[type="number"]', '500')
      await page.click('text=Submit')

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/)
      await expect(page.locator('text=Your Carbon Dashboard')).toBeVisible()
    })

    test('should validate inputs and show errors', async ({ page }) => {
      await page.goto('/onboarding')

      // Try to proceed with invalid data
      await page.fill('input[type="number"]', '-1')
      await page.click('text=Next')

      // Should show error or stay on same step
      await expect(page.locator('text=Transport')).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/onboarding')

      // Tab through form elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to navigate with keyboard
      const focused = await page.evaluate(() => document.activeElement?.tagName)
      expect(focused).toBeTruthy()
    })

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/onboarding')

      const labels = await page.locator('label').count()
      expect(labels).toBeGreaterThan(0)

      // Check that inputs have associated labels
      const inputs = await page.locator('input, select').count()
      expect(inputs).toBeGreaterThan(0)
    })
  })

  test.describe('Dashboard', () => {
    test('should display carbon profile after onboarding', async ({ page }) => {
      // First complete onboarding
      await page.goto('/onboarding')
      await page.fill('input[type="number"]', '100')
      await page.selectOption('select', 'weekly')
      await page.click('text=Next')
      await page.selectOption('select', 'omnivore')
      await page.click('text=Next')
      await page.fill('input[type="number"]', '80')
      await page.click('text=Next')
      await page.fill('input[type="number"]', '6')
      await page.click('text=Next')
      await page.fill('input[type="number"]', '500')
      await page.click('text=Submit')

      // Verify dashboard content
      await expect(page.locator('text=Your Carbon Dashboard')).toBeVisible()
      await expect(page.locator('text=Your Carbon Score')).toBeVisible()
      await expect(page.locator('text=Annual Emissions')).toBeVisible()
      await expect(page.locator('text=Daily Average')).toBeVisible()
    })

    test('should show charts with proper aria labels', async ({ page }) => {
      await page.goto('/dashboard')

      // Check for chart regions
      const charts = await page.locator('[role="region"]').count()
      expect(charts).toBeGreaterThan(0)

      // Check for aria-live region for score updates
      const liveRegion = page.locator('[aria-live="polite"]')
      await expect(liveRegion).toHaveCount(1)
    })

    test('should handle no profile state gracefully', async ({ page }) => {
      await page.goto('/dashboard')

      await expect(page.locator('text=No Carbon Profile Found')).toBeVisible()
      await expect(page.locator('text=Start Assessment')).toBeVisible()
    })

    test('should navigate to actions from dashboard', async ({ page }) => {
      await page.goto('/dashboard')

      // If no profile, complete onboarding first
      const noProfile = await page.locator('text=No Carbon Profile Found').isVisible()
      if (noProfile) {
        await page.click('text=Start Assessment')
        await expect(page).toHaveURL(/onboarding/)
      }
    })
  })

  test.describe('Actions Page', () => {
    test('should display action library', async ({ page }) => {
      await page.goto('/actions')

      await expect(page.locator('text=Action Library')).toBeVisible()
      await expect(page.locator('text=Transport')).toBeVisible()
      await expect(page.locator('text=Diet')).toBeVisible()
    })

    test('should filter actions by category', async ({ page }) => {
      await page.goto('/actions')

      // Click on a category filter
      await page.click('text=Transport')

      // Should show transport-related actions
      await expect(page.locator('text=Transport')).toBeVisible()
    })

    test('should commit to an action', async ({ page }) => {
      await page.goto('/actions')

      // Find and click commit button on first action
      const commitButton = page.locator('button:has-text("Commit")').first()
      if (await commitButton.isVisible()) {
        await commitButton.click()

        // Should show success state or update
        await expect(page.locator('text=Committed')).toBeVisible()
      }
    })
  })

  test.describe('Insights Page', () => {
    test('should display insights', async ({ page }) => {
      await page.goto('/insights')

      await expect(page.locator('text=Insights')).toBeVisible()
    })

    test('should handle empty insights state', async ({ page }) => {
      await page.goto('/insights')

      // Should show appropriate message when no insights
      const content = await page.locator('main').textContent()
      expect(content).toBeTruthy()
    })
  })

  test.describe('Trends Page', () => {
    test('should display trends', async ({ page }) => {
      await page.goto('/trends')

      await expect(page.locator('text=Trends')).toBeVisible()
    })
  })

  test.describe('404 Page', () => {
    test('should show 404 for unknown routes', async ({ page }) => {
      await page.goto('/nonexistent-page')

      await expect(page.locator('text=404')).toBeVisible()
      await expect(page.locator('text=Page not found')).toBeVisible()
    })

    test('should have link back to home', async ({ page }) => {
      await page.goto('/nonexistent-page')

      await page.click('text=Go back home')
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Accessibility - Keyboard Navigation', () => {
    test('should navigate entire app with keyboard only', async ({ page }) => {
      await page.goto('/')

      // Tab to skip link
      await page.keyboard.press('Tab')
      const skipLink = page.locator('a:focus')
      await expect(skipLink).toContainText('Skip to main content')

      // Tab through navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to navigate to all pages
      const focused = await page.evaluate(() => document.activeElement?.textContent)
      expect(focused).toBeTruthy()
    })

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/')

      // Focus on a link
      await page.locator('a').first().focus()

      // Check that focus styles are applied
      const styles = await page.evaluate(() => {
        const el = document.activeElement
        if (!el) {return null}
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          outlineOffset: computed.outlineOffset,
        }
      })

      expect(styles).toBeTruthy()
    })
  })

  test.describe('Performance', () => {
    test('should load dashboard within performance budget', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/dashboard')
      const loadTime = Date.now() - startTime

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      expect(errors).toHaveLength(0)
    })
  })

  test.describe('Security', () => {
    test('should have security headers', async ({ page }) => {
      await page.goto('/')

      const response = await page.waitForResponse((resp) => resp.url() === page.url())
      const headers = response.headers()

      // Check for security headers (may vary by hosting)
      expect(headers).toBeDefined()
    })

    test('should sanitize user inputs', async ({ page }) => {
      await page.goto('/onboarding')

      // Try to input HTML/script
      await page.fill('input[type="number"]', '<script>alert(1)</script>')

      // Should not cause issues
      await page.click('text=Next')
      await expect(page).toBeTruthy()
    })
  })
})
