/**
 * Trends Page
 * Historical tracking and projection of carbon footprint
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CarbonTrendChart } from '@/components/charts/carbon-trend-chart'
import { useStore, useCarbonProfile, useTrends } from '@/lib/hooks/use-store'
import { formatCarbonValue } from '@/lib/utils/calculator'
import { cn } from '@/lib/utils/helpers'

export default function TrendsPage(): JSX.Element {
  const carbonProfile = useCarbonProfile()
  const trends = useTrends()
  const { committedActions } = useStore()

  if (!carbonProfile) {
    return (
      <>
        <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>No Profile Found</CardTitle>
              <CardDescription>Complete the onboarding to see your trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/onboarding"
                className="block w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Start Onboarding
              </Link>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  // Calculate projections
  const currentTotal = carbonProfile.totalAnnualKgCO2
  const committedSavings = committedActions.length * 200
  const projectedTotal = Math.max(0, currentTotal - committedSavings)
  const reductionPercentage = currentTotal > 0 ? (committedSavings / currentTotal) * 100 : 0

  // Generate mock trend data if only one entry exists
  const chartData =
    trends.length > 1
      ? trends
      : [
          ...trends,
          {
            date: new Date(
              new Date(carbonProfile.lastUpdated).getTime() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            totalCarbon: currentTotal * 1.1,
            categoryBreakdown: {
              transport: carbonProfile.categoryBreakdown.transport.annualKgCO2 * 1.1,
              diet: carbonProfile.categoryBreakdown.diet.annualKgCO2 * 1.1,
              energy: carbonProfile.categoryBreakdown.energy.annualKgCO2 * 1.1,
              digital: carbonProfile.categoryBreakdown.digital.annualKgCO2 * 1.1,
              consumption: carbonProfile.categoryBreakdown.consumption.annualKgCO2 * 1.1,
            },
            score: Math.max(0, carbonProfile.overallScore - 10),
          },
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <>
      <main className="flex-1 py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Carbon Trends</h1>
            <p className="text-muted-foreground">
              Track your progress over time and see projections based on your committed actions.
            </p>
          </div>

          {/* Projection Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Current Annual</p>
                <p className="text-2xl font-bold">{formatCarbonValue(currentTotal)} CO₂e</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Projected (with actions)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCarbonValue(projectedTotal)} CO₂e
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Potential Reduction</p>
                <p className="text-2xl font-bold text-primary">{reductionPercentage.toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Emission Trend</CardTitle>
              <CardDescription>Your carbon footprint over time</CardDescription>
            </CardHeader>
            <CardContent>
              <CarbonTrendChart data={chartData} ariaLabel="Carbon emission trend over time" />
            </CardContent>
          </Card>

          {/* Category Trends */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {Object.entries(carbonProfile.categoryBreakdown).map(([key, category]) => {
              const lastEntry = chartData[chartData.length - 1]
              const firstEntry = chartData[0]
              const lastVal =
                lastEntry?.categoryBreakdown[key as keyof typeof lastEntry.categoryBreakdown] ?? 0
              const firstVal =
                firstEntry?.categoryBreakdown[key as keyof typeof firstEntry.categoryBreakdown] ?? 0
              const trend =
                chartData.length > 1 && firstVal !== 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0

              return (
                <Card key={key}>
                  <CardContent className="pt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold capitalize">{key}</h3>
                      <Badge
                        variant={trend < 0 ? 'success' : trend > 0 ? 'destructive' : 'secondary'}
                      >
                        {trend > 0 ? '+' : ''}
                        {trend.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCarbonValue(category.annualKgCO2)} CO₂e
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.dailyKgCO2.toFixed(1)} kg/day
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Reduction Milestones</CardTitle>
              <CardDescription>Targets based on your committed actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { target: currentTotal * 0.9, label: '10% Reduction', timeframe: '3 months' },
                  { target: currentTotal * 0.8, label: '20% Reduction', timeframe: '6 months' },
                  { target: currentTotal * 0.7, label: '30% Reduction', timeframe: '1 year' },
                  {
                    target: currentTotal * 0.5,
                    label: '50% Reduction (Paris Aligned)',
                    timeframe: '2 years',
                  },
                ].map((milestone, index) => {
                  const progress = Math.max(
                    0,
                    Math.min(100, ((currentTotal - milestone.target) / currentTotal) * 100)
                  )
                  const isReached = currentTotal <= milestone.target

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-lg',
                          isReached ? 'bg-green-100' : 'bg-secondary'
                        )}
                      >
                        {isReached ? '✅' : '🎯'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{milestone.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {milestone.timeframe}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                isReached ? 'bg-green-500' : 'bg-primary'
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="w-24 text-right text-sm text-muted-foreground">
                            {formatCarbonValue(milestone.target)} CO₂e
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
