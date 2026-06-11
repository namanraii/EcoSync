'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { ChartDataPoint } from '@/types'

interface CategoryBarChartProps {
  data: ChartDataPoint[]
  ariaLabel?: string
  ariaDescription?: string
}

export const CategoryBarChart = React.memo(function CategoryBarChart({
  data,
  ariaLabel = 'Category comparison bar chart',
  ariaDescription = 'Bar chart comparing carbon emissions across different categories',
}: CategoryBarChartProps): JSX.Element {
  const chartId = React.useId()

  const chartData = React.useMemo(() => {
    return data
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [data])

  if (chartData.length === 0) {
    return (
      <Card role="region" aria-label={ariaLabel}>
        <CardHeader>
          <CardTitle>Category Comparison</CardTitle>
          <CardDescription>No category data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete the onboarding to see category comparisons.</p>
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
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription id={`${chartId}-desc`}>
          {ariaDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Visually hidden data table for screen readers */}
        <table className="sr-only">
          <caption>Category emission comparison data</caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Emissions (kg CO₂e/year)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.value.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="h-[300px] w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: 'kg CO₂e/year',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} kg CO₂e`, 'Emissions']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

CategoryBarChart.displayName = 'CategoryBarChart'
