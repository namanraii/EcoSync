/**
 * Onboarding Page
 * Entry point for the carbon footprint assessment
 */

import OnboardingWizard from '@/components/forms/onboarding-wizard';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Onboarding | EcoSync',
  description: 'Calculate your carbon footprint in 5 simple steps.',
};

export default function OnboardingPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Calculate Your Carbon Footprint</h1>
            <p className="text-muted-foreground">
              Answer a few questions about your lifestyle. It takes about 3 minutes.
            </p>
          </div>
          <OnboardingWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
