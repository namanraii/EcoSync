'use client'

import * as React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { BreakdownItem } from '@/types'

interface CarbonDonutChartProps {
  data: BreakdownItem[]
  total: number
  ariaLabel?: string
  ariaDescription?: string
}

// Memoized active shape for performance
const renderActiveShape = (props: any): JSX.Element => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.label}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#666" className="text-sm">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
    </g>
  )
}

// Memoized chart component to prevent re-renders on parent state changes
export const CarbonDonutChart = React.memo(function CarbonDonutChart({
  data,
  total,
  ariaLabel = 'Carbon emission breakdown by category',
  ariaDescription = 'Donut chart showing the distribution of carbon emissions across different categories'
}: CarbonDonutChartProps): JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const chartId = React.useId()

  const onPieEnter = React.useCallback(
    (_: any, index: number) => {
      setActiveIndex(index)
    },
    []
  )

  // Filter out zero values and sort by percentage descending
  const chartData = React.useMemo(() => {
    return data
      .filter((item) => item.value > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .map((item) => ({
        name: item.label,
        value: Math.round(item.value * 100) / 100,
        color: item.color,
        percentage: item.percentage,
      }))
  }, [data])

  if (chartData.length === 0) {
    return (
      <Card role="region" aria-label={ariaLabel}>
        <CardHeader>
          <CardTitle>Emission Breakdown</CardTitle>
          <CardDescription>No emission data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete the onboarding to see your breakdown.</p>
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
        <CardTitle>Emission Breakdown</CardTitle>
        <CardDescription id={`${chartId}-desc`}>
          {ariaDescription}. Total: {total.toFixed(1)} kg CO₂e/year
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Visually hidden table for screen readers */}
        <table className="sr-only">
          <caption>Carbon emission breakdown data</caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Emissions (kg CO₂e/year)</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.value}</td>
                <td>{item.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="h-[300px] w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={800}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} kg CO₂e`, 'Emissions']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

CarbonDonutChart.displayName = 'CarbonDonutChart'
