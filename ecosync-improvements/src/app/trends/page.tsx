'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { TrendingUp, Calendar, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCarbonProfile, useTrends } from '@/lib/hooks/use-store'
import { formatCarbonValue } from '@/lib/utils/calculator'
import { ChartErrorBoundary } from '@/components/charts/chart-error-boundary'

const CarbonTrendChart = dynamic(
  () => import('@/components/charts/carbon-trend-chart').then((mod) => mod.CarbonTrendChart),
  {
    ssr: false,
    loading: () => (
      <Card role="status" aria-label="Loading trend chart">
        <CardContent className="p-6">
          <div className="h-[350px] animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    ),
  }
)

function ChartSkeleton({ height }: { height: number }): JSX.Element {
  return (
    <Card role="status" aria-label="Loading chart">
      <CardContent className="p-6">
        <div className="h-[${height}px] animate-pulse rounded-md bg-muted" style={{ height }} />
      </CardContent>
    </Card>
  )
}

export default function TrendsPage(): JSX.Element {
  const carbonProfile = useCarbonProfile()
  const trends = useTrends()

  const trendAnalysis = React.useMemo(() => {
    if (trends.length < 2) return null

    const first = trends[0]
    const last = trends[trends.length - 1]
    const change = last.totalCarbon - first.totalCarbon
    const percentChange = first.totalCarbon > 0 ? (change / first.totalCarbon) * 100 : 0

    return {
      change,
      percentChange,
      direction: change < 0 ? 'improving' : change > 0 ? 'worsening' : 'stable',
      avgScore: trends.reduce((sum, t) => sum + t.score, 0) / trends.length,
    }
  }, [trends])

  if (!carbonProfile) {
    return (
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold">No Trend Data</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the onboarding to start tracking your trends.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" role="main" className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Trend Analysis</h1>
        <p className="mt-1 text-muted-foreground">
          Track your carbon footprint changes over time.
        </p>
      </header>

      {/* Stats Overview */}
      <section role="region" aria-label="Trend statistics" className="mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Card role="region" aria-label="Data points">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="text-3xl font-bold">{trends.length}</p>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Current emissions">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-3xl font-bold">
                {formatCarbonValue(carbonProfile.totalAnnualKgCO2)} CO₂e
              </p>
            </CardContent>
          </Card>
          {trendAnalysis && (
            <>
              <Card role="region" aria-label="Trend direction">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Trend</p>
                  <p className={`text-3xl font-bold ${
                    trendAnalysis.direction === 'improving' ? 'text-green-600' :
                    trendAnalysis.direction === 'worsening' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {trendAnalysis.direction === 'improving' ? '↓ Improving' :
                     trendAnalysis.direction === 'worsening' ? '↑ Worsening' : '→ Stable'}
                  </p>
                </CardContent>
              </Card>
              <Card role="region" aria-label="Average score">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-3xl font-bold">
                    {Math.round(trendAnalysis.avgScore)}/100
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Trend Chart */}
      {trends.length > 1 && (
        <section role="region" aria-label="Emission trends chart" className="mb-8">
          <Suspense fallback={<ChartSkeleton height={350} />}>
            <ChartErrorBoundary
              fallbackTitle="Trend Analysis"
              ariaLabel="Carbon emission trends"
            >
              <CarbonTrendChart
                data={trends}
                ariaLabel="Carbon emission trends over time"
                ariaDescription="Line chart showing your total carbon emissions and carbon score over time"
              />
            </ChartErrorBoundary>
          </Suspense>
        </section>
      )}

      {/* Trend History */}
      {trends.length > 0 && (
        <section role="region" aria-label="Trend history">
          <h2 className="mb-4 text-xl font-semibold">History</h2>
          <div className="space-y-3">
            {[...trends]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((trend, index) => {
                const prevTrend = trends[index + 1]
                const change = prevTrend ? trend.totalCarbon - prevTrend.totalCarbon : 0

                return (
                  <Card
                    key={trend.date}
                    role="article"
                    aria-label={`Trend entry: ${new Date(trend.date).toLocaleDateString()}`}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <div>
                          <p className="font-medium">
                            {new Date(trend.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Score: {trend.score}/100
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {formatCarbonValue(trend.totalCarbon)} CO₂e
                        </p>
                        {change !== 0 && (
                          <Badge
                            variant="outline"
                            className={change < 0 ? 'text-green-600' : 'text-red-600'}
                          >
                            {change < 0 ? '↓' : '↑'} {formatCarbonValue(Math.abs(change))}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </section>
      )}

      {/* Milestones */}
      <section role="region" aria-label="Carbon reduction milestones" className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Milestones</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { target: 2000, label: 'Paris Agreement Target', description: '2 tonnes CO₂e/year' },
            { target: 4000, label: 'Global Average', description: '4 tonnes CO₂e/year' },
            { target: 6000, label: 'National Average', description: '6 tonnes CO₂e/year' },
          ].map((milestone) => {
            const current = carbonProfile.totalAnnualKgCO2
            const progress = Math.min((current / milestone.target) * 100, 100)
            const achieved = current <= milestone.target

            return (
              <Card
                key={milestone.label}
                role="article"
                aria-label={`Milestone: ${milestone.label}`}
                className={achieved ? 'border-green-200 bg-green-50/30' : ''}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Target className={`h-5 w-5 ${achieved ? 'text-green-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                    <CardTitle className="text-base">{milestone.label}</CardTitle>
                  </div>
                  <CardDescription>{milestone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achieved ? 'Achieved!' : `${Math.round(progress)}%`}
                    </span>
                  </div>
                  <Progress
                    value={achieved ? 100 : progress}
                    className={achieved ? 'bg-green-200' : ''}
                    aria-label={`${milestone.label} progress`}
                    aria-valuenow={achieved ? 100 : Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Current: {formatCarbonValue(current)} CO₂e
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
