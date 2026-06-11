'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/hooks/use-store'
import { validateOnboardingData } from '@/lib/utils/validation'
import type { OnboardingData } from '@/types'

interface WizardStep {
  id: string
  title: string
  description: string
}

const STEPS: WizardStep[] = [
  {
    id: 'transport',
    title: 'Transport',
    description: 'How do you get around?',
  },
  {
    id: 'diet',
    title: 'Diet',
    description: 'What do you eat?',
  },
  {
    id: 'energy',
    title: 'Energy',
    description: 'How do you power your home?',
  },
  {
    id: 'digital',
    title: 'Digital',
    description: 'What is your digital footprint?',
  },
  {
    id: 'consumption',
    title: 'Consumption',
    description: 'What do you buy?',
  },
]

export default function OnboardingWizard(): JSX.Element {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [errors, setErrors] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isComplete, setIsComplete] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState('')
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {clearTimeout(timerRef.current)}
    }
  }, [])

  const { setOnboardingData, setUserProfile, calculateProfile, userProfile } = useStore()

  const [formData, setFormData] = React.useState<OnboardingData>({
    transport: {
      primaryVehicle: 'petrol_car',
      weeklyDistanceKm: 100,
      publicTransitFrequency: 'weekly',
      flightsPerYear: 2,
    },
    diet: {
      dietType: 'omnivore',
      localFoodPercentage: 20,
      foodWasteFrequency: 'sometimes',
    },
    energy: {
      homeType: 'apartment',
      squareMeters: 80,
      occupants: 2,
      renewablePercentage: 10,
      heatingType: 'electric',
      acUsage: 'occasional',
    },
    digital: {
      dailyScreenHours: 6,
      streamingHours: 2,
      emailCount: 50,
      cloudStorageGB: 100,
      deviceCount: 5,
    },
    consumption: {
      monthlyShoppingBudget: 500,
      clothingFrequency: 'occasionally',
      electronicsFrequency: 'bi-yearly',
      recyclingHabits: 'sometimes',
    },
  })

  const updateField = <K extends keyof OnboardingData>(
    section: K,
    field: keyof OnboardingData[K],
    value: unknown
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    setErrors([])
  }

  const handleNext = (): void => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      const nextStep = STEPS[currentStep + 1]
      setAnnouncement(`Step ${currentStep + 2} of ${STEPS.length}: ${nextStep?.title ?? ''}`)
    } else {
      handleSubmit()
    }
  }

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      const prevStep = STEPS[currentStep - 1]
      setAnnouncement(`Step ${currentStep} of ${STEPS.length}: ${prevStep?.title ?? ''}`)
    }
  }

  const handleSubmit = (): void => {
    setIsSubmitting(true)
    setErrors([])

    const validation = validateOnboardingData(formData)

    if (!validation.success) {
      setErrors(validation.errors || ['Validation failed'])
      setIsSubmitting(false)
      return
    }

    setOnboardingData(validation.data!)

    if (!userProfile) {
      setUserProfile({
        id: crypto.randomUUID(),
        name: 'Eco User',
        region: 'global',
        householdSize: validation.data!.energy.occupants,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    calculateProfile()
    setIsComplete(true)

    timerRef.current = setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100
  const currentStepData = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1

  const renderStepContent = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6" role="group" aria-label="Transport information">
            <div>
              <label htmlFor="vehicle-type" className="mb-2 block text-sm font-medium">
                Primary Vehicle
              </label>
              <select
                id="vehicle-type"
                value={formData.transport.primaryVehicle}
                onChange={(e) => updateField('transport', 'primaryVehicle', e.target.value)}
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
              value={formData.transport.weeklyDistanceKm}
              onChange={(e) => updateField('transport', 'weeklyDistanceKm', Number(e.target.value))}
              helperText="Approximate kilometers traveled per week"
            />

            <div>
              <label htmlFor="transit-frequency" className="mb-2 block text-sm font-medium">
                Public Transit Frequency
              </label>
              <select
                id="transit-frequency"
                value={formData.transport.publicTransitFrequency}
                onChange={(e) => updateField('transport', 'publicTransitFrequency', e.target.value)}
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
              value={formData.transport.flightsPerYear}
              onChange={(e) => updateField('transport', 'flightsPerYear', Number(e.target.value))}
              helperText="Number of flights taken per year"
            />
          </div>
        )
      case 1:
        return (
          <div className="space-y-6" role="group" aria-label="Diet information">
            <div>
              <label htmlFor="diet-type" className="mb-2 block text-sm font-medium">
                Diet Type
              </label>
              <select
                id="diet-type"
                value={formData.diet.dietType}
                onChange={(e) => updateField('diet', 'dietType', e.target.value)}
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
              value={formData.diet.localFoodPercentage}
              onChange={(e) => updateField('diet', 'localFoodPercentage', Number(e.target.value))}
              helperText="Percentage of food sourced locally"
            />

            <div>
              <label htmlFor="food-waste" className="mb-2 block text-sm font-medium">
                Food Waste Frequency
              </label>
              <select
                id="food-waste"
                value={formData.diet.foodWasteFrequency}
                onChange={(e) => updateField('diet', 'foodWasteFrequency', e.target.value)}
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
      case 2:
        return (
          <div className="space-y-6" role="group" aria-label="Energy information">
            <div>
              <label htmlFor="home-type" className="mb-2 block text-sm font-medium">
                Home Type
              </label>
              <select
                id="home-type"
                value={formData.energy.homeType}
                onChange={(e) => updateField('energy', 'homeType', e.target.value)}
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
              value={formData.energy.squareMeters}
              onChange={(e) => updateField('energy', 'squareMeters', Number(e.target.value))}
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
              value={formData.energy.occupants}
              onChange={(e) => updateField('energy', 'occupants', Number(e.target.value))}
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
              value={formData.energy.renewablePercentage}
              onChange={(e) => updateField('energy', 'renewablePercentage', Number(e.target.value))}
              helperText="Percentage of energy from renewable sources"
            />

            <div>
              <label htmlFor="heating-type" className="mb-2 block text-sm font-medium">
                Heating Type
              </label>
              <select
                id="heating-type"
                value={formData.energy.heatingType}
                onChange={(e) => updateField('energy', 'heatingType', e.target.value)}
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
                value={formData.energy.acUsage}
                onChange={(e) => updateField('energy', 'acUsage', e.target.value)}
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
      case 3:
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
              value={formData.digital.dailyScreenHours}
              onChange={(e) => updateField('digital', 'dailyScreenHours', Number(e.target.value))}
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
              value={formData.digital.streamingHours}
              onChange={(e) => updateField('digital', 'streamingHours', Number(e.target.value))}
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
              value={formData.digital.emailCount}
              onChange={(e) => updateField('digital', 'emailCount', Number(e.target.value))}
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
              value={formData.digital.cloudStorageGB}
              onChange={(e) => updateField('digital', 'cloudStorageGB', Number(e.target.value))}
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
              value={formData.digital.deviceCount}
              onChange={(e) => updateField('digital', 'deviceCount', Number(e.target.value))}
              helperText="Total number of connected devices"
            />
          </div>
        )
      case 4:
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
              value={formData.consumption.monthlyShoppingBudget}
              onChange={(e) => updateField('consumption', 'monthlyShoppingBudget', Number(e.target.value))}
              helperText="Monthly spending on non-essential items in your currency"
            />

            <div>
              <label htmlFor="clothing-frequency" className="mb-2 block text-sm font-medium">
                Clothing Purchase Frequency
              </label>
              <select
                id="clothing-frequency"
                value={formData.consumption.clothingFrequency}
                onChange={(e) => updateField('consumption', 'clothingFrequency', e.target.value)}
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
                value={formData.consumption.electronicsFrequency}
                onChange={(e) => updateField('consumption', 'electronicsFrequency', e.target.value)}
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
                value={formData.consumption.recyclingHabits}
                onChange={(e) => updateField('consumption', 'recyclingHabits', e.target.value)}
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
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <main
      id="main-content"
      role="main"
      className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8"
    >
      <Card className="w-full max-w-2xl" role="form" aria-label="Carbon footprint assessment wizard">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <Progress value={progress} className="mt-2" aria-label="Form completion progress" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <CardTitle>{currentStepData?.title ?? ''}</CardTitle>
          <CardDescription>{currentStepData?.description ?? ''}</CardDescription>
        </CardHeader>

        <div id="step-announcement" aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement || `Step ${currentStep + 1} of ${STEPS.length}: ${currentStepData?.title ?? ''}`}
        </div>

        {errors.length > 0 && (
          <div className="mx-6 mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-4" role="alert" aria-label="Form validation errors">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm font-medium">Please fix the following errors:</p>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <CardContent onKeyDown={handleKeyDown}>
          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              aria-label="Previous step"
            >
              <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              aria-label={isLastStep ? 'Submit assessment' : 'Next step'}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 animate-spin">Processing...</span>
                </>
              ) : isLastStep ? (
                <>
                  Submit
                  <Check className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isComplete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Assessment complete"
        >
          <Card className="mx-4 w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
              <CardTitle>Assessment Complete!</CardTitle>
              <CardDescription>
                Calculating your carbon profile...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </main>
  )
}
