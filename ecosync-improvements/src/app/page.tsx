import Link from 'next/link'
import { ArrowRight, Leaf, BarChart3, Zap, Shield, Globe, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const FEATURES = [
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: '5-Dimensional Calculator',
    description: 'Analyze Transport, Diet, Energy, Digital, and Consumption emissions with IPCC-backed data.',
  },
  {
    icon: <TrendingDown className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: 'Personalized Insights',
    description: 'Get AI-generated recommendations tailored to your highest impact areas.',
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: 'Action Library',
    description: 'Browse 20+ quantified reduction actions with step-by-step implementation guides.',
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: 'Privacy First',
    description: 'All data stays in your browser. No accounts, no tracking, no servers.',
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: 'Regional Data',
    description: 'Compare against regional averages with India, EU, US, and Global benchmarks.',
  },
  {
    icon: <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: 'Progress Tracking',
    description: 'Monitor your carbon score over time and celebrate milestones.',
  },
]

const CATEGORIES = [
  { icon: '🚗', title: 'Transport', desc: 'Vehicles, flights, public transit', color: 'bg-green-50' },
  { icon: '🍽️', title: 'Diet', desc: 'Food choices, waste, sourcing', color: 'bg-yellow-50' },
  { icon: '⚡', title: 'Energy', desc: 'Home power, heating, cooling', color: 'bg-blue-50' },
  { icon: '💻', title: 'Digital', desc: 'Screen time, streaming, devices', color: 'bg-purple-50' },
  { icon: '🛍️', title: 'Consumption', desc: 'Shopping, recycling, services', color: 'bg-pink-50' },
]

export default function HomePage(): JSX.Element {
  return (
    <main id="main-content" role="main">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white py-20 md:py-32"
        aria-label="Hero section"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Leaf className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Understand Your{' '}
            <span className="text-primary">Carbon Footprint</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Track, analyze, and reduce your environmental impact with personalized insights
            and actionable recommendations. Join thousands taking climate action.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/onboarding" aria-label="Start carbon footprint assessment">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link href="/dashboard" aria-label="View demo dashboard">
                View Demo
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Data stays private
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" aria-hidden="true" />
              Science-based
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How EcoSync Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our intelligent platform guides you through understanding and reducing your carbon footprint
              in three simple steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Card
                key={feature.title}
                role="article"
                aria-label={`Feature ${index + 1}: ${feature.title}`}
                className="transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/50 py-20" aria-label="Carbon footprint categories">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              5 Dimensions of Your Footprint
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We analyze every aspect of your lifestyle to give you the most accurate picture.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((item) => (
              <Card
                key={item.title}
                role="article"
                aria-label={`Category: ${item.title}`}
                className={`${item.color} border-0 transition-all hover:shadow-md`}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 text-4xl" aria-hidden="true">{item.icon}</div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" aria-label="Call to action">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Take Action?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join thousands of users who are tracking their carbon footprint and making meaningful
            changes for the planet.
          </p>
          <Button asChild size="lg" className="mt-8 min-w-[200px]">
            <Link href="/onboarding" aria-label="Start your carbon assessment now">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
