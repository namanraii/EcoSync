import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/types'

interface TransportStepProps {
  data: OnboardingData['transport']
  onChange: (field: keyof OnboardingData['transport'], value: string | number) => void
}

export function TransportStep({ data, onChange }: TransportStepProps): JSX.Element {
  return (
    <div className="space-y-6" role="group" aria-label="Transport information">
      <div>
        <label htmlFor="vehicle-type" className="mb-2 block text-sm font-medium">
          Primary Vehicle
        </label>
        <select
          id="vehicle-type"
          value={data.primaryVehicle}
          onChange={(e): void => onChange('primaryVehicle', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-describedby="vehicle-help"
        >
          <option value="petrol_car">Petrol Car</option>
          <option value="diesel_car">Diesel Car</option>
          <option value="electric_car">Electric Car</option>
          <option value="hybrid_car">Hybrid Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="bicycle">Bicycle</option>
          <option value="walking">Walking</option>
          <option value="public_bus">Public Bus</option>
          <option value="train">Train</option>
          <option value="subway">Subway</option>
        </select>
        <p id="vehicle-help" className="mt-1 text-xs text-muted-foreground">
          Select your most frequently used mode of transport
        </p>
      </div>

      <Input
        id="weekly-distance"
        label="Weekly Distance (km)"
        type="number"
        min={0}
        max={5000}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.weeklyDistanceKm}
        onChange={(e): void => onChange('weeklyDistanceKm', Number(e.target.value))}
        helperText="Approximate kilometers traveled per week"
      />

      <div>
        <label htmlFor="transit-frequency" className="mb-2 block text-sm font-medium">
          Public Transit Frequency
        </label>
        <select
          id="transit-frequency"
          value={data.publicTransitFrequency}
          onChange={(e): void => onChange('publicTransitFrequency', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      <Input
        id="flights-per-year"
        label="Flights Per Year"
        type="number"
        min={0}
        max={100}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.flightsPerYear}
        onChange={(e): void => onChange('flightsPerYear', Number(e.target.value))}
        helperText="Number of flights taken per year"
      />
    </div>
  )
}
