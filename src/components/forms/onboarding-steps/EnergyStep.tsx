import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/types'

interface EnergyStepProps {
  data: OnboardingData['energy']
  onChange: (field: keyof OnboardingData['energy'], value: string | number) => void
}

export function EnergyStep({ data, onChange }: EnergyStepProps): JSX.Element {
  return (
    <div className="space-y-6" role="group" aria-label="Energy information">
      <div>
        <label htmlFor="home-type" className="mb-2 block text-sm font-medium">
          Home Type
        </label>
        <select
          id="home-type"
          value={data.homeType}
          onChange={(e): void => onChange('homeType', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      <Input
        id="square-meters"
        label="Square Meters"
        type="number"
        min={5}
        max={1000}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.squareMeters}
        onChange={(e): void => onChange('squareMeters', Number(e.target.value))}
        helperText="Total living area in square meters"
      />

      <Input
        id="occupants"
        label="Number of Occupants"
        type="number"
        min={1}
        max={20}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.occupants}
        onChange={(e): void => onChange('occupants', Number(e.target.value))}
        helperText="Number of people living in your home"
      />

      <Input
        id="renewable-percentage"
        label="Renewable Energy Percentage"
        type="number"
        min={0}
        max={100}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.renewablePercentage}
        onChange={(e): void => onChange('renewablePercentage', Number(e.target.value))}
        helperText="Percentage of energy from renewable sources"
      />

      <div>
        <label htmlFor="heating-type" className="mb-2 block text-sm font-medium">
          Heating Type
        </label>
        <select
          id="heating-type"
          value={data.heatingType}
          onChange={(e): void => onChange('heatingType', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="electric">Electric</option>
          <option value="gas">Natural Gas</option>
          <option value="oil">Heating Oil</option>
          <option value="heat-pump">Heat Pump</option>
          <option value="solar">Solar</option>
        </select>
      </div>

      <div>
        <label htmlFor="ac-usage" className="mb-2 block text-sm font-medium">
          AC Usage
        </label>
        <select
          id="ac-usage"
          value={data.acUsage}
          onChange={(e): void => onChange('acUsage', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="never">Never</option>
          <option value="occasional">Occasional</option>
          <option value="regular">Regular</option>
          <option value="constant">Constant</option>
        </select>
      </div>
    </div>
  )
}
