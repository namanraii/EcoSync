'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { TrendData } from '@/types'

interface CarbonTrendChartProps {
  data: TrendData[]
  ariaLabel?: string
  ariaDescription?: string
}

export const CarbonTrendChart = React.memo(function CarbonTrendChart({
  data,
  ariaLabel = 'Carbon trend over time',
  ariaDescription = 'Line chart showing your carbon emission trends over time',
}: CarbonTrendChartProps): JSX.Element {
  const chartId = React.useId()

  const chartData = React.useMemo(() => {
    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        total: Math.round(item.totalCarbon * 100) / 100,
        transport: Math.round(item.categoryBreakdown.transport * 100) / 100,
        diet: Math.round(item.categoryBreakdown.diet * 100) / 100,
        energy: Math.round(item.categoryBreakdown.energy * 100) / 100,
        digital: Math.round(item.categoryBreakdown.digital * 100) / 100,
        consumption: Math.round(item.categoryBreakdown.consumption * 100) / 100,
        score: item.score,
      }))
  }, [data])

  if (chartData.length < 2) {
    return (
      <Card role="region" aria-label={ariaLabel}>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Not enough data for trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Complete the onboarding and check back later to see your emission trends.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      role="region"
      aria-label={ariaLabel}
      aria-describedby={`${chartId}-desc`}
    >
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription id={`${chartId}-desc`}>
          {ariaDescription}. Showing data from {chartData.length} time points.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Visually hidden data table for screen readers */}
        <table className="sr-only">
          <caption>Carbon emission trend data</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Emissions</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.total} kg CO₂e</td>
                <td>{item.score}/100</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="h-[350px] w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{
                  value: 'kg CO₂e',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Score',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Total Emissions"
                animationDuration={1000}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Carbon Score"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

CarbonTrendChart.displayName = 'CarbonTrendChart'
