'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, TrendingUp, Leaf, Zap, ShoppingBag, Monitor } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScoreAnnouncement } from '@/components/accessibility/aria-live-region'
import { ChartErrorBoundary } from '@/components/charts/chart-error-boundary'
import { useStore, useCarbonProfile, useCommittedActions } from '@/lib/hooks/use-store'
import { getCarbonRating, formatCarbonValue } from '@/lib/utils/calculator'
import { CARBON_ACTIONS } from '@/lib/data/carbon-actions'
import type { EmissionCategory } from '@/types'

// Dynamic imports for heavy chart components (EFFICIENCY FIX)
const CarbonDonutChart = dynamic(
  () => import('@/components/charts/carbon-donut-chart').then((mod) => mod.CarbonDonutChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={300} label="Loading emission breakdown..." />,
  }
)

const CarbonScoreGauge = dynamic(
  () => import('@/components/charts/carbon-score-gauge').then((mod) => mod.CarbonScoreGauge),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={200} label="Loading score gauge..." />,
  }
)

const CategoryBarChart = dynamic(
  () => import('@/components/charts/category-bar-chart').then((mod) => mod.CategoryBarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={300} label="Loading category comparison..." />,
  }
)

const CarbonTrendChart = dynamic(
  () => import('@/components/charts/carbon-trend-chart').then((mod) => mod.CarbonTrendChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={300} label="Loading trend chart..." />,
  }
)

// Skeleton component for Suspense fallback
function ChartSkeleton({ height, label }: { height: number; label: string }): JSX.Element {
  return (
    <Card role="status" aria-label={label}>
      <CardContent className="p-6">
        <div
          className="animate-pulse rounded-md bg-muted"
          style={{ height: `${height}px` }}
        />
        <p className="sr-only mt-2 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

const CATEGORY_ICONS: Record<EmissionCategory, React.ReactNode> = {
  transport: <TrendingUp className="h-4 w-4" aria-hidden="true" />,
  diet: <Leaf className="h-4 w-4" aria-hidden="true" />,
  energy: <Zap className="h-4 w-4" aria-hidden="true" />,
  digital: <Monitor className="h-4 w-4" aria-hidden="true" />,
  consumption: <ShoppingBag className="h-4 w-4" aria-hidden="true" />,
}


export default function DashboardPage(): JSX.Element {
  const router = useRouter()
  const carbonProfile = useCarbonProfile()
  const committedActions = useCommittedActions()
  const { trends, commitAction } = useStore()
  const [previousScore, setPreviousScore] = React.useState<number | undefined>(undefined)

  // Track score changes for aria-live announcements
  React.useEffect(() => {
    if (carbonProfile) {
      setPreviousScore((prev) => {
        if (prev !== undefined && prev !== carbonProfile.overallScore) {
          // Score changed - will be announced by ScoreAnnouncement
        }
        return carbonProfile.overallScore
      })
    }
  }, [carbonProfile])

  if (!carbonProfile) {
    return (
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold">No Carbon Profile Found</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the onboarding to see your carbon dashboard.
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push('/onboarding')}
            aria-label="Start carbon footprint assessment"
          >
            Start Assessment
          </Button>
        </div>
      </main>
    )
  }

  const rating = getCarbonRating(carbonProfile.overallScore)
  const categories = carbonProfile.categoryBreakdown
  const committedActionObjects = CARBON_ACTIONS.filter((a) =>
    committedActions.includes(a.id)
  )
  const totalSavings = committedActionObjects.reduce(
    (sum, a) => sum + a.impactScore,
    0
  )

  // Get top 3 recommendations based on highest emission categories
  const sortedCategories = Object.entries(categories).sort(
    (a, b) => b[1].annualKgCO2 - a[1].annualKgCO2
  )
  const topCategories = sortedCategories.slice(0, 2).map(([cat]) => cat as EmissionCategory)
  const recommendations = CARBON_ACTIONS.filter(
    (a) => topCategories.includes(a.category) && !committedActions.includes(a.id)
  )
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3)

  return (
    <main id="main-content" role="main" className="container mx-auto px-4 py-8">
      {/* Aria-live region for score announcements */}
      <ScoreAnnouncement
        score={carbonProfile.overallScore}
        {...(previousScore !== undefined ? { previousScore } : {})}
      />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Carbon Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Last updated: {new Date(carbonProfile.lastUpdated).toLocaleDateString()}
        </p>
      </header>

      {/* Score Alert with aria-live */}
      <section
        aria-label="Carbon score summary"
        aria-live="polite"
        aria-atomic="true"
        className="mb-6"
      >
        <Card
          className={
            carbonProfile.overallScore >= 60
              ? 'border-green-200 bg-green-50/50'
              : carbonProfile.overallScore >= 40
              ? 'border-yellow-200 bg-yellow-50/50'
              : 'border-red-200 bg-red-50/50'
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Carbon Score: {carbonProfile.overallScore}/100
            </CardTitle>
            <CardDescription>
              <span className={rating.color}>{rating.label}</span>.{' '}
              {rating.description} You emit{' '}
              <strong>{formatCarbonValue(carbonProfile.totalAnnualKgCO2)}</strong> CO₂e
              annually.
              {carbonProfile.percentile !== undefined && (
                <>
                  {' '}
                  You are doing better than{' '}
                  <strong>{carbonProfile.percentile}%</strong> of people in your region.
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Main Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Score Gauge */}
        <Suspense fallback={<ChartSkeleton height={200} label="Loading score gauge..." />}>
          <ChartErrorBoundary
            fallbackTitle="Score Gauge"
            ariaLabel="Carbon score visualization"
          >
            <Card role="region" aria-label="Carbon score gauge">
              <CardHeader>
                <CardTitle>Score</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CarbonScoreGauge
                  score={carbonProfile.overallScore}
                  size="md"
                  showLabel={true}
                />
              </CardContent>
            </Card>
          </ChartErrorBoundary>
        </Suspense>

        {/* Quick Stats */}
        <Card role="region" aria-label="Quick statistics">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Annual Emissions</p>
              <p className="text-2xl font-bold">
                {formatCarbonValue(carbonProfile.totalAnnualKgCO2)} CO₂e
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-bold">
                {formatCarbonValue(carbonProfile.totalDailyKgCO2)} CO₂e
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actions Committed</p>
              <p className="text-2xl font-bold">{committedActions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCarbonValue(totalSavings)} CO₂e
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {/* Breakdown Donut */}
        <Suspense fallback={<ChartSkeleton height={300} label="Loading emission breakdown..." />}>
          <ChartErrorBoundary
            fallbackTitle="Emission Breakdown"
            ariaLabel="Emission breakdown by category"
          >
            <CarbonDonutChart
              data={Object.values(categories).flatMap((cat) => cat.breakdown)}
              total={carbonProfile.totalAnnualKgCO2}
              ariaLabel="Carbon emission breakdown by subcategory"
              ariaDescription="Interactive donut chart showing your carbon emissions distributed across subcategories"
            />
          </ChartErrorBoundary>
        </Suspense>

        {/* Category Comparison */}
        <Suspense fallback={<ChartSkeleton height={300} label="Loading category comparison..." />}>
          <ChartErrorBoundary
            fallbackTitle="Category Comparison"
            ariaLabel="Category comparison chart"
          >
            <CategoryBarChart
              data={Object.entries(categories).map(([key, cat]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: cat.annualKgCO2,
                color: cat.breakdown[0]?.color || '#10b981',
              }))}
              ariaLabel="Annual emissions by category"
            />
          </ChartErrorBoundary>
        </Suspense>
      </div>

      {/* Category Details */}
      <section
        aria-label="Category details"
        className="mb-8"
      >
        <h2 className="mb-4 text-xl font-semibold">Category Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categories).map(([key, category]) => {
            return (
              <Card
                key={key}
                role="article"
                aria-label={`${key} category details`}
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md p-1.5" aria-hidden="true">
                      {CATEGORY_ICONS[key as EmissionCategory]}
                    </span>
                    <CardTitle className="text-lg capitalize">{key}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      category.annualKgCO2 > 2000
                        ? 'destructive'
                        : category.annualKgCO2 > 1000
                        ? 'warning'
                        : 'success'
                    }
                    className="mb-2"
                  >
                    {formatCarbonValue(category.annualKgCO2)}/yr
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {category.dailyKgCO2.toFixed(1)} kg CO₂e/day
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Confidence: {Math.round(category.confidence * 100)}%
                  </p>
                  <Progress
                    value={Math.min((category.annualKgCO2 / 5000) * 100, 100)}
                    className="mt-3"
                    aria-label={`${key} emission progress bar`}
                    aria-valuenow={Math.round(category.annualKgCO2)}
                    aria-valuemax={5000}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Trend Chart */}
      {trends.length > 1 && (
        <Suspense fallback={<ChartSkeleton height={300} label="Loading trend chart..." />}>
          <ChartErrorBoundary
            fallbackTitle="Trend Analysis"
            ariaLabel="Carbon trend over time"
          >
            <CarbonTrendChart
              data={trends}
              ariaLabel="Carbon emission trends over time"
            />
          </ChartErrorBoundary>
        </Suspense>
      )}

      {/* Recommended Actions */}
      <section
        aria-label="Recommended actions"
        className="mb-8"
      >
        <h2 className="mb-4 text-xl font-semibold">Recommended Actions</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Based on your highest impact areas: {topCategories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((action) => (
            <Card
              key={action.id}
              role="article"
              aria-label={`Action: ${action.title}`}
              className="transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <Badge variant="outline">{action.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Leaf className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span>
                    Save {formatCarbonValue(action.impactScore)} CO₂e/year
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {action.estimatedCost} cost • {action.timeToImplement}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => {
                    commitAction(action.id)
                  }}
                  aria-label={`Commit to action: ${action.title}`}
                >
                  Commit to Action
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
