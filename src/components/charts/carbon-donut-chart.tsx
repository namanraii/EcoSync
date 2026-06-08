/**
 * Carbon Donut Chart
 * Interactive breakdown visualization with accessibility support
 */

'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BreakdownItem } from '@/types';
import { formatCarbonValue } from '@/lib/utils/calculator';
import { cn } from '@/lib/utils/helpers';

interface CarbonDonutChartProps {
  data: BreakdownItem[];
  total: number;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: BreakdownItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg">
      <p className="font-semibold text-sm">{item.label}</p>
      <p className="text-sm text-muted-foreground">
        {formatCarbonValue(item.value)} CO₂e/year
      </p>
      <p className="text-sm font-medium text-primary">{item.percentage.toFixed(1)}%</p>
    </div>
  );
}

export function CarbonDonutChart({ data, total, className }: CarbonDonutChartProps): JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Filter out negligible values
  const filteredData = data.filter((item) => item.percentage > 1);

  const handleMouseEnter = (_: unknown, index: number): void => {
    setActiveIndex(index);
  };

  const handleMouseLeave = (): void => {
    setActiveIndex(null);
  };

  return (
    <div className={cn('relative', className)}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="label"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animationBegin={0}
            animationDuration={800}
            tabIndex={0}
            aria-label="Carbon footprint breakdown by category"
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={activeIndex === index ? '#000' : 'transparent'}
                strokeWidth={activeIndex === index ? 2 : 0}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value: string, entry: { payload?: BreakdownItem }) => {
              const percentage = entry?.payload?.percentage ?? 0;
              return `${value} (${percentage.toFixed(1)}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-foreground">
          {formatCarbonValue(total)}
        </span>
        <span className="text-xs text-muted-foreground">CO₂e/year</span>
      </div>
    </div>
  );
}
