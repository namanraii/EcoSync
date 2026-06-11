import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/types'

interface DigitalStepProps {
  data: OnboardingData['digital']
  onChange: (field: keyof OnboardingData['digital'], value: string | number) => void
}

export function DigitalStep({ data, onChange }: DigitalStepProps): JSX.Element {
  return (
    <div className="space-y-6" role="group" aria-label="Digital footprint information">
      <Input
        id="screen-hours"
        label="Daily Screen Hours"
        type="number"
        min={0}
        max={24}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.dailyScreenHours}
        onChange={(e): void => onChange('dailyScreenHours', Number(e.target.value))}
        helperText="Average hours spent on screens per day"
      />

      <Input
        id="streaming-hours"
        label="Streaming Hours Per Day"
        type="number"
        min={0}
        max={24}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.streamingHours}
        onChange={(e): void => onChange('streamingHours', Number(e.target.value))}
        helperText="Hours spent streaming video content daily"
      />

      <Input
        id="email-count"
        label="Daily Email Count"
        type="number"
        min={0}
        max={1000}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.emailCount}
        onChange={(e): void => onChange('emailCount', Number(e.target.value))}
        helperText="Average emails sent and received per day"
      />

      <Input
        id="cloud-storage"
        label="Cloud Storage (GB)"
        type="number"
        min={0}
        max={10000}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.cloudStorageGB}
        onChange={(e): void => onChange('cloudStorageGB', Number(e.target.value))}
        helperText="Total cloud storage used in gigabytes"
      />

      <Input
        id="device-count"
        label="Number of Devices"
        type="number"
        min={1}
        max={50}
        pattern="[0-9]*"
        autoComplete="off"
        value={data.deviceCount}
        onChange={(e): void => onChange('deviceCount', Number(e.target.value))}
        helperText="Total number of connected devices"
      />
    </div>
  )
}
