/**
 * Carbon Trend Chart
 * Line chart showing carbon footprint trends over time
 */

'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { TrendData } from '@/types';
import { formatDate, formatCarbonValue } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils/helpers';

interface CarbonTrendChartProps {
  data: TrendData[];
  target?: number;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TrendData;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (!active || !payload || !payload.length) return null;

  const trend = payload[0].payload;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg">
      <p className="font-semibold text-sm">{formatDate(trend.date)}</p>
      <p className="text-sm text-muted-foreground">
        Total: {formatCarbonValue(trend.totalCarbon)} CO₂e/year
      </p>
      <p className="text-sm font-medium text-primary">
        Score: {trend.score}/100
      </p>
    </div>
  );
}

export function CarbonTrendChart({ data, target, className }: CarbonTrendChartProps): JSX.Element {
  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedData.map((trend) => ({
    date: formatDate(trend.date),
    rawDate: trend.date,
    totalCarbon: trend.totalCarbon,
    score: trend.score,
    transport: trend.categoryBreakdown.transport,
    diet: trend.categoryBreakdown.diet,
    energy: trend.categoryBreakdown.energy,
    digital: trend.categoryBreakdown.digital,
    consumption: trend.categoryBreakdown.consumption,
  }));

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={8}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => formatCarbonValue(value)}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          {target && (
            <ReferenceLine
              y={target}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: 'Target',
                position: 'right',
                fill: '#10b981',
                fontSize: 12,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="totalCarbon"
            stroke="#10b981"
            strokeWidth={2}
            fill="#10b981"
            fillOpacity={0.1}
            name="Total Carbon"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
