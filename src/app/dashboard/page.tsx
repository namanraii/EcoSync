/**
 * Dashboard Page
 * Main user dashboard showing carbon profile overview
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CarbonScoreGauge } from '@/components/charts/carbon-score-gauge';
import { CarbonDonutChart } from '@/components/charts/carbon-donut-chart';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';
import { useStore, useCarbonProfile } from '@/lib/hooks/use-store';
import { formatCarbonValue, getCarbonRating } from '@/lib/utils/calculator';
import { getRecommendedActions } from '@/lib/data/carbon-actions';
import { cn } from '@/lib/utils/helpers';

export default function DashboardPage(): JSX.Element {
  const carbonProfile = useCarbonProfile();
  const { committedActions } = useStore();

  // Redirect if no profile
  if (!carbonProfile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Profile Found</CardTitle>
              <CardDescription>
                Complete the onboarding to see your carbon dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/onboarding">
                <Button className="w-full">Start Onboarding</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const rating = getCarbonRating(carbonProfile.overallScore);
  const categories = carbonProfile.categoryBreakdown;

  // Get recommendations based on highest emission categories
  const categoryValues: Record<string, number> = {};
  Object.entries(categories).forEach(([key, value]) => {
    categoryValues[key] = value.annualKgCO2;
  });
  const recommendations = getRecommendedActions(categoryValues, 3);

  // Calculate committed savings
  const totalSavings = committedActions.length * 200; // Rough estimate

  return (
    <>
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Carbon Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date(carbonProfile.lastUpdated).toLocaleDateString()}
            </p>
          </div>

          {/* Score Alert */}
          <Alert
            variant={carbonProfile.overallScore >= 60 ? 'success' : carbonProfile.overallScore >= 40 ? 'warning' : 'destructive'}
            className="mb-6"
          >
            <AlertTitle>Your Carbon Score: {carbonProfile.overallScore}/100</AlertTitle>
            <AlertDescription>
              {rating.description} You emit {formatCarbonValue(carbonProfile.totalAnnualKgCO2)} CO₂e annually.
              {carbonProfile.percentile && (
                <> You are doing better than {carbonProfile.percentile}% of people in your region.</>
              )}
            </AlertDescription>
          </Alert>

          {/* Main Stats Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Score Gauge */}
            <Card>
              <CardContent className="pt-6">
                <CarbonScoreGauge score={carbonProfile.overallScore} size="lg" />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Annual Emissions</p>
                    <p className="text-2xl font-bold">{formatCarbonValue(carbonProfile.totalAnnualKgCO2)} CO₂e</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                    <p className="text-2xl font-bold">{formatCarbonValue(carbonProfile.totalDailyKgCO2)} CO₂e</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Actions Committed</p>
                    <p className="text-2xl font-bold">{committedActions.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-2xl font-bold text-green-600">{formatCarbonValue(totalSavings)} CO₂e</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Breakdown Donut */}
            <Card>
              <CardHeader>
                <CardTitle>Emission Breakdown</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonDonutChart
                  data={Object.values(categories).flatMap((cat) => cat.breakdown)}
                  total={carbonProfile.totalAnnualKgCO2}
                />
              </CardContent>
            </Card>

            {/* Category Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Annual emissions by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBarChart categories={categories} />
              </CardContent>
            </Card>
          </div>

          {/* Category Details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries(categories).map(([key, category]) => {
              const catRating = getCarbonRating(
                100 - (category.annualKgCO2 / 5000) * 100
              );
              return (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{key}</CardTitle>
                      <Badge variant={category.annualKgCO2 > 2000 ? 'destructive' : category.annualKgCO2 > 1000 ? 'warning' : 'success'}>
                        {formatCarbonValue(category.annualKgCO2)}/yr
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={Math.min(100, (category.annualKgCO2 / 5000) * 100)}
                      size="sm"
                      showValue={false}
                      color={catRating.color.replace('text-', 'bg-')}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {category.dailyKgCO2.toFixed(1)} kg CO₂e/day
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {Math.round(category.confidence * 100)}%
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommended Actions */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>Based on your highest impact areas</CardDescription>
                </div>
                <Link href="/actions">
                  <Button variant="outline">View All Actions</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{action.title}</h4>
                        <Badge variant={action.difficulty === 'easy' ? 'success' : action.difficulty === 'medium' ? 'warning' : 'destructive'}>
                          {action.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Save {formatCarbonValue(action.impactScore)} CO₂e/year • {action.estimatedCost} cost
                      </p>
                    </div>
                    <Link href="/actions">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
