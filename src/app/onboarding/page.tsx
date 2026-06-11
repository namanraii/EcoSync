/**
 * Onboarding Page
 * Entry point for the carbon footprint assessment
 */

import type { Metadata } from 'next'
import OnboardingWizard from '@/components/forms/onboarding-wizard'

export const metadata: Metadata = {
  title: 'Onboarding | EcoSync',
  description: 'Calculate your carbon footprint in 5 simple steps.',
}

export default function OnboardingPage(): JSX.Element {
  return (
    <>
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Calculate Your Carbon Footprint</h1>
            <p className="text-muted-foreground">
              Answer a few questions about your lifestyle. It takes about 3 minutes.
            </p>
          </div>
          <OnboardingWizard />
        </div>
      </main>
    </>
  )
}
