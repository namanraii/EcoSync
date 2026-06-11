'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/hooks/use-store'
import { validateOnboardingData } from '@/lib/utils/validation'
import type { OnboardingData } from '@/types'

import { TransportStep } from './onboarding-steps/TransportStep'
import { DietStep } from './onboarding-steps/DietStep'
import { EnergyStep } from './onboarding-steps/EnergyStep'
import { DigitalStep } from './onboarding-steps/DigitalStep'
import { ConsumptionStep } from './onboarding-steps/ConsumptionStep'

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

  React.useEffect((): (() => void) => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
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

    if (!validation.data) {
      setErrors(['Validation data is missing'])
      setIsSubmitting(false)
      return
    }

    setOnboardingData(validation.data)

    if (!userProfile) {
      setUserProfile({
        id: crypto.randomUUID(),
        name: 'Eco User',
        region: 'global',
        householdSize: validation.data.energy.occupants,
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
          <TransportStep
            data={formData.transport}
            onChange={(field, value): void => updateField('transport', field, value)}
          />
        )
      case 1:
        return (
          <DietStep
            data={formData.diet}
            onChange={(field, value): void => updateField('diet', field, value)}
          />
        )
      case 2:
        return (
          <EnergyStep
            data={formData.energy}
            onChange={(field, value): void => updateField('energy', field, value)}
          />
        )
      case 3:
        return (
          <DigitalStep
            data={formData.digital}
            onChange={(field, value): void => updateField('digital', field, value)}
          />
        )
      case 4:
        return (
          <ConsumptionStep
            data={formData.consumption}
            onChange={(field, value): void => updateField('consumption', field, value)}
          />
        )
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <main
      id="main-content"
      className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8"
    >
      <Card className="w-full max-w-2xl" aria-label="Carbon footprint assessment wizard">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <Progress
                value={progress}
                className="mt-2"
                aria-label="Form completion progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <CardTitle>{currentStepData?.title ?? ''}</CardTitle>
          <CardDescription>{currentStepData?.description ?? ''}</CardDescription>
        </CardHeader>

        <div id="step-announcement" aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement ||
            `Step ${currentStep + 1} of ${STEPS.length}: ${currentStepData?.title ?? ''}`}
        </div>

        {errors.length > 0 && (
          <div
            className="mx-6 mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-4"
            role="alert"
            aria-label="Form validation errors"
          >
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
              <CardDescription>Calculating your carbon profile...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </main>
  )
}
