/**
 * Category Bar Chart
 * Horizontal bar chart comparing category emissions
 */

'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CarbonResult } from '@/types';
import { formatCarbonValue } from '@/lib/utils/calculator';
import { cn } from '@/lib/utils/helpers';

interface CategoryBarChartProps {
  categories: Record<string, CarbonResult>;
  className?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  daily: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg">
      <p className="font-semibold text-sm capitalize">{item.name}</p>
      <p className="text-sm text-muted-foreground">
        Annual: {formatCarbonValue(item.value)} CO₂e
      </p>
      <p className="text-sm text-muted-foreground">
        Daily: {formatCarbonValue(item.daily)} CO₂e
      </p>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#10b981',
  diet: '#f59e0b',
  energy: '#3b82f6',
  digital: '#8b5cf6',
  consumption: '#ec4899',
};

export function CategoryBarChart({ categories, className }: CategoryBarChartProps): JSX.Element {
  const chartData: ChartDataItem[] = Object.entries(categories).map(([key, value]) => ({
    name: key,
    value: value.annualKgCO2,
    color: CATEGORY_COLORS[key] || '#6b7280',
    daily: value.dailyKgCO2,
  }));

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value);

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => formatCarbonValue(value)}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={70}
            axisLine={false}
            tickFormatter={(value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
