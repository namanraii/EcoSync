import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/types'

interface DietStepProps {
  data: OnboardingData['diet']
  onChange: (field: keyof OnboardingData['diet'], value: string | number) => void
}

export function DietStep({ data, onChange }: DietStepProps): JSX.Element {
  return (
    <div className="space-y-6" role="group" aria-label="Diet information">
      <div>
        <label htmlFor="diet-type" className="mb-2 block text-sm font-medium">
          Diet Type
        </label>
        <select
          id="diet-type"
          value={data.dietType}
          onChange={(e): void => onChange('dietType', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="pescatarian">Pescatarian</option>
          <option value="flexitarian">Flexitarian</option>
          <option value="omnivore">Omnivore</option>
          <option value="high-meat">High Meat</option>
        </select>
      </div>

      <Input
        id="local-food"
        label="Local Food Percentage"
        type="number"
        min={0}
        max={100}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.localFoodPercentage}
        onChange={(e): void => onChange('localFoodPercentage', Number(e.target.value))}
        helperText="Percentage of food sourced locally"
      />

      <div>
        <label htmlFor="food-waste" className="mb-2 block text-sm font-medium">
          Food Waste Frequency
        </label>
        <select
          id="food-waste"
          value={data.foodWasteFrequency}
          onChange={(e): void => onChange('foodWasteFrequency', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="never">Never</option>
          <option value="rarely">Rarely</option>
          <option value="sometimes">Sometimes</option>
          <option value="often">Often</option>
        </select>
      </div>
    </div>
  )
}
