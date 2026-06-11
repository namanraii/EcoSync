import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/types'

interface ConsumptionStepProps {
  data: OnboardingData['consumption']
  onChange: (field: keyof OnboardingData['consumption'], value: string | number) => void
}

export function ConsumptionStep({ data, onChange }: ConsumptionStepProps): JSX.Element {
  return (
    <div className="space-y-6" role="group" aria-label="Consumption information">
      <Input
        id="shopping-budget"
        label="Monthly Shopping Budget"
        type="number"
        min={0}
        max={50000}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.monthlyShoppingBudget}
        onChange={(e): void => onChange('monthlyShoppingBudget', Number(e.target.value))}
        helperText="Monthly spending on non-essential items in your currency"
      />

      <div>
        <label htmlFor="clothing-frequency" className="mb-2 block text-sm font-medium">
          Clothing Purchase Frequency
        </label>
        <select
          id="clothing-frequency"
          value={data.clothingFrequency}
          onChange={(e): void => onChange('clothingFrequency', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="rarely">Rarely (few times/year)</option>
          <option value="occasionally">Occasionally (monthly)</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label htmlFor="electronics-frequency" className="mb-2 block text-sm font-medium">
          Electronics Purchase Frequency
        </label>
        <select
          id="electronics-frequency"
          value={data.electronicsFrequency}
          onChange={(e): void => onChange('electronicsFrequency', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="yearly">Yearly</option>
          <option value="bi-yearly">Bi-yearly</option>
          <option value="rarely">Rarely</option>
        </select>
      </div>

      <div>
        <label htmlFor="recycling-habits" className="mb-2 block text-sm font-medium">
          Recycling Habits
        </label>
        <select
          id="recycling-habits"
          value={data.recyclingHabits}
          onChange={(e): void => onChange('recyclingHabits', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="always">Always recycle everything</option>
          <option value="often">Often recycle most items</option>
          <option value="sometimes">Sometimes recycle</option>
          <option value="rarely">Rarely recycle</option>
        </select>
      </div>
    </div>
  )
}
