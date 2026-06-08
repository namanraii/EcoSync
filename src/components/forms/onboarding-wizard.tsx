/**
 * Onboarding Wizard
 * Multi-step form for collecting user carbon footprint data
 * Full keyboard navigation and accessibility support
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/hooks/use-store';
import { OnboardingData } from '@/types';
import { validateOnboardingData } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/helpers';

const STEPS = [
  { id: 'transport', title: 'Transportation', description: 'How do you get around?' },
  { id: 'diet', title: 'Diet', description: 'What do you eat?' },
  { id: 'energy', title: 'Energy', description: 'How do you power your home?' },
  { id: 'digital', title: 'Digital Life', description: 'What is your screen time?' },
  { id: 'consumption', title: 'Consumption', description: 'What do you buy?' },
];

export function OnboardingWizard(): JSX.Element {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { setOnboardingData, setUserProfile, calculateProfile, userProfile } = useStore();

  const [formData, setFormData] = React.useState<Partial<OnboardingData>>({
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
  });

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
    }));
    setErrors([]);
  };

  const handleNext = (): void => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (): void => {
    setIsSubmitting(true);
    setErrors([]);

    // Validate all data
    const validation = validateOnboardingData(formData);

    if (!validation.success) {
      setErrors(validation.errors || ['Validation failed']);
      setIsSubmitting(false);
      return;
    }

    // Save data
    setOnboardingData(validation.data!);

    // Create user profile if not exists
    if (!userProfile) {
      setUserProfile({
        id: crypto.randomUUID(),
        name: 'Eco User',
        region: 'global',
        householdSize: validation.data!.energy.occupants,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Calculate carbon profile
    calculateProfile();

    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];

  const renderStepContent = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Select
              label="Primary Vehicle"
              value={formData.transport?.primaryVehicle}
              onChange={(e) => updateField('transport', 'primaryVehicle', e.target.value)}
              options={[
                { value: 'petrol_car', label: 'Petrol Car' },
                { value: 'diesel_car', label: 'Diesel Car' },
                { value: 'electric_car', label: 'Electric Car' },
                { value: 'hybrid_car', label: 'Hybrid Car' },
                { value: 'motorcycle', label: 'Motorcycle' },
                { value: 'bicycle', label: 'Bicycle' },
                { value: 'walking', label: 'Walking' },
                { value: 'public_bus', label: 'Public Bus' },
                { value: 'train', label: 'Train' },
                { value: 'subway', label: 'Subway/Metro' },
              ]}
            />
            <Slider
              label="Weekly Distance (km)"
              value={formData.transport?.weeklyDistanceKm || 0}
              onChange={(value) => updateField('transport', 'weeklyDistanceKm', value)}
              min={0}
              max={1000}
              step={10}
              valueFormatter={(v) => `${v} km`}
            />
            <Select
              label="Public Transit Frequency"
              value={formData.transport?.publicTransitFrequency}
              onChange={(e) => updateField('transport', 'publicTransitFrequency', e.target.value)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'never', label: 'Never' },
              ]}
            />
            <Slider
              label="Flights Per Year"
              value={formData.transport?.flightsPerYear || 0}
              onChange={(value) => updateField('transport', 'flightsPerYear', value)}
              min={0}
              max={50}
              step={1}
              valueFormatter={(v) => `${v} flights`}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <Select
              label="Diet Type"
              value={formData.diet?.dietType}
              onChange={(e) => updateField('diet', 'dietType', e.target.value)}
              options={[
                { value: 'vegan', label: 'Vegan' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'pescatarian', label: 'Pescatarian' },
                { value: 'flexitarian', label: 'Flexitarian' },
                { value: 'omnivore', label: 'Omnivore' },
                { value: 'high-meat', label: 'High Meat' },
              ]}
            />
            <Slider
              label="Local Food Percentage"
              value={formData.diet?.localFoodPercentage || 0}
              onChange={(value) => updateField('diet', 'localFoodPercentage', value)}
              min={0}
              max={100}
              step={5}
              valueFormatter={(v) => `${v}%`}
            />
            <Select
              label="Food Waste Frequency"
              value={formData.diet?.foodWasteFrequency}
              onChange={(e) => updateField('diet', 'foodWasteFrequency', e.target.value)}
              options={[
                { value: 'never', label: 'Never' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'often', label: 'Often' },
              ]}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Select
              label="Home Type"
              value={formData.energy?.homeType}
              onChange={(e) => updateField('energy', 'homeType', e.target.value)}
              options={[
                { value: 'apartment', label: 'Apartment' },
                { value: 'house', label: 'House' },
                { value: 'studio', label: 'Studio' },
              ]}
            />
            <Slider
              label="Home Size (sq meters)"
              value={formData.energy?.squareMeters || 0}
              onChange={(value) => updateField('energy', 'squareMeters', value)}
              min={10}
              max={500}
              step={5}
              valueFormatter={(v) => `${v} m²`}
            />
            <Slider
              label="Number of Occupants"
              value={formData.energy?.occupants || 1}
              onChange={(value) => updateField('energy', 'occupants', value)}
              min={1}
              max={10}
              step={1}
              valueFormatter={(v) => `${v} people`}
            />
            <Slider
              label="Renewable Energy Percentage"
              value={formData.energy?.renewablePercentage || 0}
              onChange={(value) => updateField('energy', 'renewablePercentage', value)}
              min={0}
              max={100}
              step={5}
              valueFormatter={(v) => `${v}%`}
            />
            <Select
              label="Heating Type"
              value={formData.energy?.heatingType}
              onChange={(e) => updateField('energy', 'heatingType', e.target.value)}
              options={[
                { value: 'electric', label: 'Electric' },
                { value: 'gas', label: 'Natural Gas' },
                { value: 'oil', label: 'Heating Oil' },
                { value: 'heat-pump', label: 'Heat Pump' },
                { value: 'solar', label: 'Solar' },
              ]}
            />
            <Select
              label="AC Usage"
              value={formData.energy?.acUsage}
              onChange={(e) => updateField('energy', 'acUsage', e.target.value)}
              options={[
                { value: 'never', label: 'Never' },
                { value: 'occasional', label: 'Occasional' },
                { value: 'regular', label: 'Regular' },
                { value: 'constant', label: 'Constant' },
              ]}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Slider
              label="Daily Screen Time (hours)"
              value={formData.digital?.dailyScreenHours || 0}
              onChange={(value) => updateField('digital', 'dailyScreenHours', value)}
              min={0}
              max={16}
              step={0.5}
              valueFormatter={(v) => `${v}h`}
            />
            <Slider
              label="Daily Streaming (hours)"
              value={formData.digital?.streamingHours || 0}
              onChange={(value) => updateField('digital', 'streamingHours', value)}
              min={0}
              max={8}
              step={0.5}
              valueFormatter={(v) => `${v}h`}
            />
            <Slider
              label="Daily Emails Sent/Received"
              value={formData.digital?.emailCount || 0}
              onChange={(value) => updateField('digital', 'emailCount', value)}
              min={0}
              max={500}
              step={10}
              valueFormatter={(v) => `${v} emails`}
            />
            <Slider
              label="Cloud Storage (GB)"
              value={formData.digital?.cloudStorageGB || 0}
              onChange={(value) => updateField('digital', 'cloudStorageGB', value)}
              min={0}
              max={2000}
              step={50}
              valueFormatter={(v) => `${v} GB`}
            />
            <Slider
              label="Connected Devices"
              value={formData.digital?.deviceCount || 1}
              onChange={(value) => updateField('digital', 'deviceCount', value)}
              min={1}
              max={30}
              step={1}
              valueFormatter={(v) => `${v} devices`}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <Slider
              label="Monthly Shopping Budget (USD)"
              value={formData.consumption?.monthlyShoppingBudget || 0}
              onChange={(value) => updateField('consumption', 'monthlyShoppingBudget', value)}
              min={0}
              max={5000}
              step={50}
              valueFormatter={(v) => `$${v}`}
            />
            <Select
              label="Clothing Purchase Frequency"
              value={formData.consumption?.clothingFrequency}
              onChange={(e) => updateField('consumption', 'clothingFrequency', e.target.value)}
              options={[
                { value: 'rarely', label: 'Rarely (few times/year)' },
                { value: 'occasionally', label: 'Occasionally (monthly)' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
            <Select
              label="Electronics Purchase Frequency"
              value={formData.consumption?.electronicsFrequency}
              onChange={(e) => updateField('consumption', 'electronicsFrequency', e.target.value)}
              options={[
                { value: 'rarely', label: 'Rarely (every 3+ years)' },
                { value: 'bi-yearly', label: 'Every 2 years' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            <Select
              label="Recycling Habits"
              value={formData.consumption?.recyclingHabits}
              onChange={(e) => updateField('consumption', 'recyclingHabits', e.target.value)}
              options={[
                { value: 'always', label: 'Always recycle everything' },
                { value: 'often', label: 'Often recycle most items' },
                { value: 'sometimes', label: 'Sometimes recycle' },
                { value: 'rarely', label: 'Rarely recycle' },
              ]}
            />
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} size="sm" showValue={false} />
          <CardTitle className="mt-4">{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Please fix the following errors:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div onKeyDown={handleKeyDown} role="form" aria-label={`${currentStepData.title} form`}>
            {renderStepContent()}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              aria-label="Go to previous step"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              isLoading={isSubmitting}
              aria-label={currentStep === STEPS.length - 1 ? 'Complete onboarding' : 'Go to next step'}
            >
              {currentStep === STEPS.length - 1 ? 'Calculate My Footprint' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
