/**
 * Input Validation Utilities
 * Zod schemas for type-safe validation across the application
 */

import { z } from 'zod'
import { OnboardingData, UserInput } from '@/types'

// ==================== ONBOARDING VALIDATION ====================

export const TransportDataSchema = z.object({
  primaryVehicle: z.enum([
    'petrol_car',
    'diesel_car',
    'electric_car',
    'hybrid_car',
    'motorcycle',
    'bicycle',
    'walking',
    'public_bus',
    'train',
    'subway',
  ]),
  weeklyDistanceKm: z.number().min(0).max(5000),
  publicTransitFrequency: z.enum(['daily', 'weekly', 'rarely', 'never']),
  flightsPerYear: z.number().min(0).max(100),
})

export const DietDataSchema = z.object({
  dietType: z.enum(['vegan', 'vegetarian', 'pescatarian', 'flexitarian', 'omnivore', 'high-meat']),
  localFoodPercentage: z.number().min(0).max(100),
  foodWasteFrequency: z.enum(['never', 'rarely', 'sometimes', 'often']),
})

export const EnergyDataSchema = z.object({
  homeType: z.enum(['apartment', 'house', 'studio']),
  squareMeters: z.number().min(5).max(1000),
  occupants: z.number().min(1).max(20),
  renewablePercentage: z.number().min(0).max(100),
  heatingType: z.enum(['electric', 'gas', 'oil', 'heat-pump', 'solar']),
  acUsage: z.enum(['never', 'occasional', 'regular', 'constant']),
})

export const DigitalDataSchema = z.object({
  dailyScreenHours: z.number().min(0).max(24),
  streamingHours: z.number().min(0).max(24),
  emailCount: z.number().min(0).max(1000),
  cloudStorageGB: z.number().min(0).max(10000),
  deviceCount: z.number().min(1).max(50),
})

export const ConsumptionDataSchema = z.object({
  monthlyShoppingBudget: z.number().min(0).max(50000),
  clothingFrequency: z.enum(['rarely', 'occasionally', 'monthly', 'weekly']),
  electronicsFrequency: z.enum(['yearly', 'bi-yearly', 'rarely']),
  recyclingHabits: z.enum(['always', 'often', 'sometimes', 'rarely']),
})

export const OnboardingDataSchema = z.object({
  transport: TransportDataSchema,
  diet: DietDataSchema,
  energy: EnergyDataSchema,
  digital: DigitalDataSchema,
  consumption: ConsumptionDataSchema,
})

// ==================== USER INPUT VALIDATION ====================

export const UserInputSchema = z.object({
  category: z.enum(['transport', 'diet', 'energy', 'digital', 'consumption']),
  subcategory: z.string().min(1).max(100),
  value: z.number().min(0).max(1000000),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  metadata: z.record(z.union([z.string(), z.number()])).optional(),
})

// ==================== USER PROFILE VALIDATION ====================

export const UserProfileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  region: z.string().min(2).max(100),
  householdSize: z.number().min(1).max(50),
  onboardingComplete: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate onboarding data with detailed error messages
 */
export function validateOnboardingData(data: unknown): {
  success: boolean
  data?: OnboardingData
  errors?: string[]
} {
  const result = OnboardingDataSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.errors.map((err) => {
    const path = err.path.join('.')
    return `${path}: ${err.message}`
  })

  return { success: false, errors }
}

/**
 * Validate a single user input
 */
export function validateUserInput(data: unknown): {
  success: boolean
  data?: UserInput
  error?: string
} {
  const result = UserInputSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data as UserInput }
  }

  return {
    success: false,
    error: result.error.errors.map((e) => e.message).join(', '),
  }
}

/**
 * Validate user profile
 */
export function validateUserProfile(data: unknown): {
  success: boolean
  data?: unknown
  errors?: string[]
} {
  const result = UserProfileSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.errors.map((err) => {
    const path = err.path.join('.')
    return `${path}: ${err.message}`
  })

  return { success: false, errors }
}

/**
 * Sanitize and validate a string input
 * Strips HTML tags, script content, and XSS vectors
 */
export function sanitizeString(input: string, maxLength: number = 500): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, maxLength)
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min) {
    return `${fieldName} must be at least ${min}`
  }
  if (value > max) {
    return `${fieldName} must be at most ${max}`
  }
  return null
}

/**
 * Validate array length
 */
export function validateArrayLength<T>(
  array: T[],
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (array.length < min) {
    return `${fieldName} must have at least ${min} items`
  }
  if (array.length > max) {
    return `${fieldName} must have at most ${max} items`
  }
  return null
}

// Type exports for use in components
export type ValidatedOnboardingData = z.infer<typeof OnboardingDataSchema>
export type ValidatedUserInput = z.infer<typeof UserInputSchema>
export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>
