import { z } from 'zod'

const OnboardingTransportSchema = z.object({
  primaryVehicle: z.enum([
    'petrol_car', 'diesel_car', 'electric_car', 'hybrid_car',
    'motorcycle', 'bicycle', 'walking', 'public_bus', 'train', 'subway'
  ]),
  weeklyDistanceKm: z.number().min(0).max(5000),
  publicTransitFrequency: z.enum(['daily', 'weekly', 'rarely', 'never']),
  flightsPerYear: z.number().min(0).max(100),
})

const OnboardingDietSchema = z.object({
  dietType: z.enum(['vegan', 'vegetarian', 'pescatarian', 'flexitarian', 'omnivore', 'high-meat']),
  localFoodPercentage: z.number().min(0).max(100),
  foodWasteFrequency: z.enum(['never', 'rarely', 'sometimes', 'often']),
})

const OnboardingEnergySchema = z.object({
  homeType: z.enum(['apartment', 'house', 'studio']),
  squareMeters: z.number().min(5).max(1000),
  occupants: z.number().min(1).max(20),
  renewablePercentage: z.number().min(0).max(100),
  heatingType: z.enum(['electric', 'gas', 'oil', 'heat-pump', 'solar']),
  acUsage: z.enum(['never', 'occasional', 'regular', 'constant']),
})

const OnboardingDigitalSchema = z.object({
  dailyScreenHours: z.number().min(0).max(24),
  streamingHours: z.number().min(0).max(24),
  emailCount: z.number().min(0).max(1000),
  cloudStorageGB: z.number().min(0).max(10000),
  deviceCount: z.number().min(1).max(50),
})

const OnboardingConsumptionSchema = z.object({
  monthlyShoppingBudget: z.number().min(0).max(50000),
  clothingFrequency: z.enum(['rarely', 'occasionally', 'monthly', 'weekly']),
  electronicsFrequency: z.enum(['yearly', 'bi-yearly', 'rarely']),
  recyclingHabits: z.enum(['always', 'often', 'sometimes', 'rarely']),
})

export const OnboardingDataSchema = z.object({
  transport: OnboardingTransportSchema,
  diet: OnboardingDietSchema,
  energy: OnboardingEnergySchema,
  digital: OnboardingDigitalSchema,
  consumption: OnboardingConsumptionSchema,
})

export function validateOnboardingData(data: unknown): { success: boolean; data?: any; errors?: string[] } {
  try {
    const result = OnboardingDataSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}

export function validateUserInput(input: { category: string; subcategory: string; value: number; frequency: string }): { success: boolean; error?: string } {
  if (!['transport', 'diet', 'energy', 'digital', 'consumption'].includes(input.category)) {
    return { success: false, error: 'Invalid category' }
  }
  if (input.value < 0) {
    return { success: false, error: 'Value cannot be negative' }
  }
  if (input.value > 1000000) {
    return { success: false, error: 'Value exceeds maximum allowed' }
  }
  return { success: true }
}

export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .replace(/<script[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength)
}
