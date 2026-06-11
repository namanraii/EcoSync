import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { SkipLink } from '@/components/accessibility/skip-link'
import { AriaLiveRegion, ScoreAnnouncement } from '@/components/accessibility/aria-live-region'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// Extend expect with axe matchers
expect.extend(toHaveNoViolations)

// Mock window.matchMedia for prefers-reduced-motion
describe('Accessibility Compliance', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  describe('SkipLink', () => {
    it('should be accessible via axe-core', async () => {
      const { container } = render(<SkipLink />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have correct href and be focusable', () => {
      render(<SkipLink targetId="main-content" />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveAttribute('href', '#main-content')
      expect(skipLink).toHaveFocus()
      // Tab to it
      skipLink.focus()
      expect(skipLink).toHaveFocus()
    })

    it('should support custom labels', () => {
      render(<SkipLink label="Skip to dashboard" />)
      expect(screen.getByText('Skip to dashboard')).toBeInTheDocument()
    })
  })

  describe('AriaLiveRegion', () => {
    it('should have aria-live attribute', () => {
      render(
        <AriaLiveRegion aria-live="polite">
          Score updated to 75
        </AriaLiveRegion>
      )
      const region = screen.getByText('Score updated to 75')
      expect(region).toHaveAttribute('aria-live', 'polite')
      expect(region).toHaveAttribute('aria-atomic', 'true')
    })

    it('should be visually hidden but accessible to screen readers', () => {
      render(
        <AriaLiveRegion aria-live="assertive">
          Error: Invalid input
        </AriaLiveRegion>
      )
      const region = screen.getByText('Error: Invalid input')
      expect(region).toHaveClass('sr-only')
    })
  })

  describe('ScoreAnnouncement', () => {
    it('should announce initial score correctly', () => {
      render(<ScoreAnnouncement score={75} />)
      expect(screen.getByText('Your carbon score is now 75 out of 100.')).toBeInTheDocument()
    })

    it('should announce score improvement', () => {
      render(<ScoreAnnouncement score={80} previousScore={70} />)
      expect(screen.getByText('Your carbon score improved by 10 points to 80.')).toBeInTheDocument()
    })

    it('should announce score decrease', () => {
      render(<ScoreAnnouncement score={60} previousScore={75} />)
      expect(screen.getByText('Your carbon score decreased by 15 points to 60.')).toBeInTheDocument()
    })

    it('should announce no change', () => {
      render(<ScoreAnnouncement score={70} previousScore={70} />)
      expect(screen.getByText('Your carbon score remains at 70.')).toBeInTheDocument()
    })
  })

  describe('Input Component', () => {
    it('should be accessible via axe-core', async () => {
      const { container } = render(
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          maxLength={100}
          helperText="We will never share your email."
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper label association', () => {
      render(<Input label="Full Name" id="name-input" />)
      const label = screen.getByText('Full Name')
      const input = screen.getByLabelText('Full Name')
      expect(label).toHaveAttribute('for', 'name-input')
      expect(input).toHaveAttribute('id', 'name-input')
    })

    it('should show error state with aria-invalid', () => {
      render(<Input label="Age" errorMessage="Age must be between 1 and 120" />)
      const input = screen.getByLabelText('Age')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByRole('alert')).toHaveTextContent('Age must be between 1 and 120')
    })

    it('should have helper text with aria-describedby', () => {
      render(<Input label="Password" helperText="Min 8 characters" />)
      const input = screen.getByLabelText('Password')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Input label="Test Input" />)
      const input = screen.getByLabelText('Test Input')
      await user.tab()
      expect(input).toHaveFocus()
      await user.type(input, 'hello')
      expect(input).toHaveValue('hello')
    })

    it('should enforce maxLength', () => {
      render(<Input label="Username" maxLength={5} />)
      const input = screen.getByLabelText('Username')
      expect(input).toHaveAttribute('maxLength', '5')
    })

    it('should have autocomplete attribute for security', () => {
      render(<Input label="Email" type="email" autoComplete="email" />)
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('autoComplete', 'email')
    })
  })

  describe('Card Component', () => {
    it('should use heading element for CardTitle', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      const title = screen.getByText('Test Card')
      expect(title.tagName).toBe('H3')
    })

    it('should be accessible via axe-core', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is accessible content.</p>
          </CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support full keyboard interaction on inputs', async () => {
      const user = userEvent.setup()
      render(
        <>
          <Input label="First Name" id="first" />
          <Input label="Last Name" id="last" />
          <Input label="Email" id="email" />
        </>
      )

      const first = screen.getByLabelText('First Name')
      const last = screen.getByLabelText('Last Name')
      const email = screen.getByLabelText('Email')

      await user.tab()
      expect(first).toHaveFocus()
      await user.tab()
      expect(last).toHaveFocus()
      await user.tab()
      expect(email).toHaveFocus()
    })
  })

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      render(<Input label="Focus Test" />)
      const input = screen.getByLabelText('Focus Test')
      input.focus()
      expect(input).toHaveFocus()
      // Check that focus styles are applied (ring classes)
      expect(input.className).toContain('focus-visible:ring-2')
    })
  })
})
