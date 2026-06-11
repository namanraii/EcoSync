/**
 * Landing Page
 * Hero section with CTA to start onboarding
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CarbonScoreGauge } from '@/components/charts/carbon-score-gauge';

export default function HomePage(): JSX.Element {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden flex items-center min-h-[calc(100vh-4rem)] py-12">
          {/* Faded Nature Background Layer */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
            style={{ backgroundImage: 'url("/hero-bg.png")' }}
          />
          {/* Gradient overlay to fade the image into the background color seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-0 pointer-events-none" />
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-primary bg-primary/10">
                  🌱 Hack2Skill PromptWars Challenge 3
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Understand Your{' '}
                  <span className="text-primary">Carbon Footprint</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Track, analyze, and reduce your environmental impact with personalized insights
                  and actionable recommendations. Join thousands taking climate action.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/onboarding">
                    <Button size="lg" className="text-lg px-8">
                      Calculate My Footprint
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free to use
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Data stays private
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Science-based
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl" />
                  <Card className="relative w-72 h-72 flex items-center justify-center shadow-2xl">
                    <CarbonScoreGauge score={65} size="lg" />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How EcoSync Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our intelligent platform guides you through understanding and reducing your carbon footprint
                in three simple steps.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Calculate</h3>
                  <p className="text-muted-foreground">
                    Answer a few questions about your lifestyle. Our algorithm uses IPCC and EPA
                    emission factors to calculate your precise carbon footprint.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. Analyze</h3>
                  <p className="text-muted-foreground">
                    Get detailed breakdowns by category with personalized insights. See how you
                    compare to regional averages and identify your biggest impact areas.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. Act</h3>
                  <p className="text-muted-foreground">
                    Receive curated, quantified action recommendations. Track your progress and watch
                    your carbon score improve over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">5 Dimensions of Your Footprint</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We analyze every aspect of your lifestyle to give you the most accurate picture.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: '🚗', title: 'Transport', desc: 'Vehicles, flights, public transit', color: 'bg-green-50' },
                { icon: '🍽️', title: 'Diet', desc: 'Food choices, waste, sourcing', color: 'bg-yellow-50' },
                { icon: '⚡', title: 'Energy', desc: 'Home power, heating, cooling', color: 'bg-blue-50' },
                { icon: '💻', title: 'Digital', desc: 'Screen time, streaming, devices', color: 'bg-purple-50' },
                { icon: '🛍️', title: 'Consumption', desc: 'Shopping, recycling, services', color: 'bg-pink-50' },
              ].map((item) => (
                <Card key={item.title} className={item.color}>
                  <CardContent className="pt-6 text-center">
                    <span className="text-3xl mb-2 block">{item.icon}</span>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Action?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of users who are tracking their carbon footprint and making meaningful
              changes for the planet.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="text-lg px-8">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
