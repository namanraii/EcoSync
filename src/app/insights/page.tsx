/**
 * Insights Page
 * Personalized insights and recommendations based on carbon profile
 */

'use client';

import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useStore, useCarbonProfile } from '@/lib/hooks/use-store';
import { formatCarbonValue } from '@/lib/utils/calculator';
import { REGIONAL_AVERAGES } from '@/lib/data/emission-factors';
import { cn } from '@/lib/utils/helpers';

interface InsightItem {
  id: string;
  type: 'warning' | 'opportunity' | 'achievement' | 'comparison';
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  metric?: string;
  action?: string;
}

export default function InsightsPage(): JSX.Element {
  const carbonProfile = useCarbonProfile();
  const { committedActions } = useStore();

  if (!carbonProfile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Profile Found</CardTitle>
              <CardDescription>Complete the onboarding to see personalized insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/onboarding">
                <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                  Start Onboarding
                </button>
              </a>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // Generate insights based on profile data
  const insights: InsightItem[] = React.useMemo(() => {
    const items: InsightItem[] = [];
    const categories = carbonProfile.categoryBreakdown;

    // Find highest emission category
    const categoryEntries = Object.entries(categories);
    const highestCategory = categoryEntries.reduce((a, b) =>
      a[1].annualKgCO2 > b[1].annualKgCO2 ? a : b
    );

    // Warning insight for highest category
    if (highestCategory[1].annualKgCO2 > 2000) {
      items.push({
        id: 'high-category',
        type: 'warning',
        title: `High ${highestCategory[0]} Emissions`,
        description: `Your ${highestCategory[0]} footprint is ${formatCarbonValue(highestCategory[1].annualKgCO2)} CO₂e/year, which is above the recommended threshold. This is your biggest opportunity for reduction.`,
        category: highestCategory[0],
        severity: 'high',
        metric: `${formatCarbonValue(highestCategory[1].annualKgCO2)} CO₂e/year`,
        action: 'View recommended actions for this category',
      });
    }

    // Comparison insight
    const globalAverage = REGIONAL_AVERAGES['global'] ?? 12000;
    const diff = carbonProfile.totalAnnualKgCO2 - globalAverage;
    if (diff > 0) {
      items.push({
        id: 'above-average',
        type: 'comparison',
        title: 'Above Global Average',
        description: `You emit ${formatCarbonValue(Math.abs(diff))} more CO₂e than the global average of ${formatCarbonValue(globalAverage)}. Small changes can bring you below average.`,
        category: 'overall',
        severity: 'medium',
        metric: `+${formatCarbonValue(diff)} vs global avg`,
      });
    } else {
      items.push({
        id: 'below-average',
        type: 'achievement',
        title: 'Below Global Average!',
        description: `Great job! You emit ${formatCarbonValue(Math.abs(diff))} less CO₂e than the global average. Keep up the good work.`,
        category: 'overall',
        severity: 'low',
        metric: `${formatCarbonValue(Math.abs(diff))} below avg`,
      });
    }

    // Category-specific insights
    categoryEntries.forEach(([key, category]) => {
      const threshold = 1500;
      if (category.annualKgCO2 > threshold) {
        items.push({
          id: `${key}-high`,
          type: 'opportunity',
          title: `${key.charAt(0).toUpperCase() + key.slice(1)} Reduction Opportunity`,
          description: `Reducing your ${key} emissions by 30% would save ${formatCarbonValue(category.annualKgCO2 * 0.3)} CO₂e annually.`,
          category: key,
          severity: 'medium',
          metric: `Save ${formatCarbonValue(category.annualKgCO2 * 0.3)}/yr`,
        });
      }
    });

    // Achievement for committed actions
    if (committedActions.length > 0) {
      const totalSavings = committedActions.length * 200;
      items.push({
        id: 'actions-committed',
        type: 'achievement',
        title: `${committedActions.length} Actions Committed`,
        description: `You've committed to ${committedActions.length} carbon reduction actions. Estimated annual savings: ${formatCarbonValue(totalSavings)} CO₂e.`,
        category: 'overall',
        severity: 'low',
        metric: `${formatCarbonValue(totalSavings)} potential savings`,
      });
    }

    // Score-based insight
    if (carbonProfile.overallScore >= 70) {
      items.push({
        id: 'good-score',
        type: 'achievement',
        title: 'Excellent Carbon Score',
        description: 'Your carbon score is in the excellent range. You are a climate leader!',
        category: 'overall',
        severity: 'low',
        metric: `${carbonProfile.overallScore}/100`,
      });
    } else if (carbonProfile.overallScore < 30) {
      items.push({
        id: 'low-score',
        type: 'warning',
        title: 'Carbon Score Needs Improvement',
        description: 'Your carbon score is in the critical range. Focus on high-impact actions to see quick improvements.',
        category: 'overall',
        severity: 'high',
        metric: `${carbonProfile.overallScore}/100`,
      });
    }

    return items;
  }, [carbonProfile, committedActions]);

  const typeConfig = {
    warning: { icon: '⚠️', color: 'border-l-orange-500 bg-orange-50' },
    opportunity: { icon: '💡', color: 'border-l-blue-500 bg-blue-50' },
    achievement: { icon: '🏆', color: 'border-l-green-500 bg-green-50' },
    comparison: { icon: '📊', color: 'border-l-purple-500 bg-purple-50' },
  };

  const severityConfig = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Personalized Insights</h1>
            <p className="text-muted-foreground">
              AI-generated insights based on your carbon profile and behavior patterns.
            </p>
          </div>

          {/* Insights Count */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {(['warning', 'opportunity', 'achievement', 'comparison'] as const).map((type) => {
              const count = insights.filter((i) => i.type === type).length;
              return (
                <Card key={type}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{typeConfig[type].icon}</span>
                      <div>
                        <p className="text-sm text-muted-foreground capitalize">{type}s</p>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            {insights.map((insight) => {
              const config = typeConfig[insight.type];
              return (
                <Card
                  key={insight.id}
                  className={cn('border-l-4', config.color)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{config.icon}</span>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={severityConfig[insight.severity]}>
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{insight.description}</p>
                        {insight.metric && (
                          <p className="text-sm font-medium text-primary">
                            {insight.metric}
                          </p>
                        )}
                        {insight.action && (
                          <a
                            href="/actions"
                            className="text-sm text-primary hover:underline mt-2 inline-block"
                          >
                            {insight.action} →
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {insights.length === 0 && (
            <Alert>
              <AlertTitle>No Insights Yet</AlertTitle>
              <AlertDescription>
                Complete your profile to generate personalized insights.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
