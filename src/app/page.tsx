/**
 * Landing Page
 * Hero section with CTA to start onboarding
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CarbonScoreGauge } from '@/components/charts/carbon-score-gauge'
import { CheckCircle2 } from 'lucide-react'

export default function HomePage(): JSX.Element {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden py-12">
          {/* Faded Nature Background Layer */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: 'url("/hero-bg.png")' }}
          />
          {/* Gradient overlay to fade the image into the background color seamlessly */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

          <div className="container relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  🌱 Hack2Skill PromptWars Challenge 3
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                  Understand Your <span className="text-primary">Carbon Footprint</span>
                </h1>
                <p className="max-w-lg text-lg text-muted-foreground">
                  Track, analyze, and reduce your environmental impact with personalized insights
                  and actionable recommendations. Join thousands taking climate action.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/onboarding">
                    <Button size="lg" className="px-8 text-lg">
                      Calculate My Footprint
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="px-8 text-lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Free to use
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Data stays private
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Science-based
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl" />
                  <Card className="relative flex h-72 w-72 items-center justify-center shadow-2xl">
                    <CarbonScoreGauge score={65} size="lg" />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/30 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">How EcoSync Works</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our intelligent platform guides you through understanding and reducing your carbon
                footprint in three simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">1. Calculate</h3>
                  <p className="text-muted-foreground">
                    Answer a few questions about your lifestyle. Our algorithm uses IPCC and EPA
                    emission factors to calculate your precise carbon footprint.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">2. Analyze</h3>
                  <p className="text-muted-foreground">
                    Get detailed breakdowns by category with personalized insights. See how you
                    compare to regional averages and identify your biggest impact areas.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">3. Act</h3>
                  <p className="text-muted-foreground">
                    Receive curated, quantified action recommendations. Track your progress and
                    watch your carbon score improve over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">5 Dimensions of Your Footprint</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                We analyze every aspect of your lifestyle to give you the most accurate picture.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  icon: '🚗',
                  title: 'Transport',
                  desc: 'Vehicles, flights, public transit',
                  color: 'bg-green-50',
                },
                {
                  icon: '🍽️',
                  title: 'Diet',
                  desc: 'Food choices, waste, sourcing',
                  color: 'bg-yellow-50',
                },
                {
                  icon: '⚡',
                  title: 'Energy',
                  desc: 'Home power, heating, cooling',
                  color: 'bg-blue-50',
                },
                {
                  icon: '💻',
                  title: 'Digital',
                  desc: 'Screen time, streaming, devices',
                  color: 'bg-purple-50',
                },
                {
                  icon: '🛍️',
                  title: 'Consumption',
                  desc: 'Shopping, recycling, services',
                  color: 'bg-pink-50',
                },
              ].map((item) => (
                <Card key={item.title} className={item.color}>
                  <CardContent className="pt-6 text-center">
                    <span className="mb-2 block text-3xl">{item.icon}</span>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-20">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Take Action?</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Join thousands of users who are tracking their carbon footprint and making meaningful
              changes for the planet.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="px-8 text-lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
