'use client'

import * as React from 'react'
import { Lightbulb, AlertTriangle, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCarbonProfile, useInsights, useCommittedActions } from '@/lib/hooks/use-store'
import { CARBON_ACTIONS } from '@/lib/data/carbon-actions'
import { formatCarbonValue } from '@/lib/utils/calculator'
import type { Insight } from '@/types'

const INSIGHT_ICONS = {
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
  opportunity: <Lightbulb className="h-5 w-5 text-blue-500" aria-hidden="true" />,
  achievement: <Award className="h-5 w-5 text-green-500" aria-hidden="true" />,
  comparison: <TrendingUp className="h-5 w-5 text-purple-500" aria-hidden="true" />,
  trend: <TrendingUp className="h-5 w-5 text-orange-500" aria-hidden="true" />,
}

const SEVERITY_COLORS = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

function generateInsights(profile: NonNullable<ReturnType<typeof useCarbonProfile>>): Insight[] {
  const insights: Insight[] = []
  const categories = profile.categoryBreakdown

  // Find highest emission category
  const sorted = Object.entries(categories).sort((a, b) => b[1].annualKgCO2 - a[1].annualKgCO2)
  const [highestCat, highestData] = sorted[0]

  // Warning insight for highest category
  if (highestData.annualKgCO2 > 2000) {
    insights.push({
      id: `warning-${highestCat}`,
      type: 'warning',
      title: `High ${highestCat.charAt(0).toUpperCase() + highestCat.slice(1)} Emissions`,
      description: `Your ${highestCat} emissions are ${formatCarbonValue(highestData.annualKgCO2)} CO₂e/year, significantly above average. Consider reducing this category first for maximum impact.`,
      category: highestCat as any,
      severity: 'high',
      actionable: true,
      createdAt: new Date().toISOString(),
    })
  }

  // Opportunity insights
  if (categories.transport.annualKgCO2 > 1500) {
    insights.push({
      id: 'opportunity-transport',
      type: 'opportunity',
      title: 'Switch to Public Transit',
      description: 'Using public transit 3x per week instead of driving could save up to 1,200 kg CO₂e/year.',
      category: 'transport',
      severity: 'medium',
      actionable: true,
      createdAt: new Date().toISOString(),
    })
  }

  if (categories.diet.annualKgCO2 > 2000) {
    insights.push({
      id: 'opportunity-diet',
      type: 'opportunity',
      title: 'Reduce Meat Consumption',
      description: 'Reducing meat intake by 2 meals per week could save approximately 500 kg CO₂e/year.',
      category: 'diet',
      severity: 'medium',
      actionable: true,
      createdAt: new Date().toISOString(),
    })
  }

  if (categories.energy.annualKgCO2 > 1500) {
    insights.push({
      id: 'opportunity-energy',
      type: 'opportunity',
      title: 'Upgrade to LED Lighting',
      description: 'Switching all bulbs to LED could reduce your energy emissions by 10-15%.',
      category: 'energy',
      severity: 'low',
      actionable: true,
      createdAt: new Date().toISOString(),
    })
  }

  // Achievement insights
  if (profile.overallScore >= 60) {
    insights.push({
      id: 'achievement-good-score',
      type: 'achievement',
      title: 'Great Carbon Score!',
      description: `Your score of ${profile.overallScore}/100 puts you in the top performers. Keep up the excellent work!`,
      category: 'transport',
      severity: 'low',
      actionable: false,
      createdAt: new Date().toISOString(),
    })
  }

  if (profile.percentile && profile.percentile > 50) {
    insights.push({
      id: 'achievement-percentile',
      type: 'achievement',
      title: `Top ${100 - profile.percentile}% Performer`,
      description: `You're doing better than ${profile.percentile}% of people in your region.`,
      category: 'transport',
      severity: 'low',
      actionable: false,
      createdAt: new Date().toISOString(),
    })
  }

  return insights
}

export default function InsightsPage(): JSX.Element {
  const carbonProfile = useCarbonProfile()
  const insights = useInsights()
  const committedActions = useCommittedActions()

  const generatedInsights = React.useMemo(() => {
    if (!carbonProfile) return []
    return generateInsights(carbonProfile)
  }, [carbonProfile])

  const allInsights = React.useMemo(() => {
    return [...insights, ...generatedInsights]
  }, [insights, generatedInsights])

  const actionableInsights = allInsights.filter((i) => i.actionable)
  const achievements = allInsights.filter((i) => i.type === 'achievement')

  if (!carbonProfile) {
    return (
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Lightbulb className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold">No Insights Available</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the onboarding to generate personalized insights.
          </p>
          <Button className="mt-6" onClick={() => window.location.href = '/onboarding'}>
            Start Assessment
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" role="main" className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Personalized Insights</h1>
        <p className="mt-1 text-muted-foreground">
          AI-generated recommendations based on your carbon profile.
        </p>
      </header>

      {/* Summary Cards */}
      <section role="region" aria-label="Insight summary" className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card role="region" aria-label="Total insights">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Insights</p>
              <p className="text-3xl font-bold">{allInsights.length}</p>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Actionable insights">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Actionable</p>
              <p className="text-3xl font-bold text-blue-600">{actionableInsights.length}</p>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Achievements">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-3xl font-bold text-green-600">{achievements.length}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Actionable Insights */}
      {actionableInsights.length > 0 && (
        <section role="region" aria-label="Actionable recommendations" className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Recommended Actions</h2>
          <div className="space-y-4">
            {actionableInsights.map((insight) => (
              <Card
                key={insight.id}
                role="article"
                aria-label={`Insight: ${insight.title}`}
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0" aria-hidden="true">
                      {INSIGHT_ICONS[insight.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={SEVERITY_COLORS[insight.severity]}
                        >
                          {insight.severity}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/actions'}
                    aria-label={`View actions for ${insight.title}`}
                  >
                    View Related Actions
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section role="region" aria-label="Your achievements">
          <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                role="article"
                aria-label={`Achievement: ${achievement.title}`}
                className="border-green-200 bg-green-50/30"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div aria-hidden="true">{INSIGHT_ICONS[achievement.type]}</div>
                    <div>
                      <CardTitle className="text-base">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Committed Actions Summary */}
      {committedActions.length > 0 && (
        <section role="region" aria-label="Committed actions summary" className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Your Progress</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                You have committed to <strong>{committedActions.length}</strong> actions.
                Keep going to improve your carbon score!
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => window.location.href = '/actions'}
                aria-label="View all committed actions"
              >
                View All Actions
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}
