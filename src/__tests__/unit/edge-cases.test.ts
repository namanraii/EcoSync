import { describe, it, expect } from 'vitest'
import {
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
  calculateDigitalEmissions,
  calculateConsumptionEmissions,
  buildCarbonProfile,
  calculateCarbonScore,
  getCarbonRating,
  formatCarbonValue,
} from '@/lib/utils/calculator'
import { validateOnboardingData, validateUserInput, sanitizeString } from '@/lib/utils/validation'

describe('Calculator Edge Cases', () => {
  describe('Empty and Zero Data', () => {
    it('should handle zero weekly distance', () => {
      const result = calculateTransportEmissions({
        primaryVehicle: 'bicycle',
        weeklyDistanceKm: 0,
        publicTransitFrequency: 'never',
        flightsPerYear: 0,
      })
      expect(result.annualKgCO2).toBe(0)
      expect(result.dailyKgCO2).toBe(0)
      expect(result.breakdown).toEqual([])
    })

    it('should handle zero screen time', () => {
      const result = calculateDigitalEmissions({
        dailyScreenHours: 0,
        streamingHours: 0,
        emailCount: 0,
        cloudStorageGB: 0,
        deviceCount: 1,
      })
      expect(result.annualKgCO2).toBeGreaterThan(0) // device standby still counts
      expect(result.breakdown.some(b => b.label === 'Screen Time')).toBe(false)
    })

    it('should handle zero shopping budget', () => {
      const result = calculateConsumptionEmissions({
        monthlyShoppingBudget: 0,
        clothingFrequency: 'rarely',
        electronicsFrequency: 'rarely',
        recyclingHabits: 'always',
      })
      expect(result.annualKgCO2).toBe(0)
    })

    it('should handle zero square meters', () => {
      expect(() =>
        calculateEnergyEmissions({
          homeType: 'apartment',
          squareMeters: 0,
          occupants: 1,
          renewablePercentage: 0,
          heatingType: 'electric',
          acUsage: 'never',
        })
      ).not.toThrow()
    })
  })

  describe('Extreme Values', () => {
    it('should handle maximum weekly distance', () => {
      const result = calculateTransportEmissions({
        primaryVehicle: 'petrol_car',
        weeklyDistanceKm: 5000,
        publicTransitFrequency: 'daily',
        flightsPerYear: 100,
      })
      expect(result.annualKgCO2).toBeGreaterThan(0)
      expect(result.confidence).toBeLessThan(1)
    })

    it('should handle maximum flights per year', () => {
      const result = calculateTransportEmissions({
        primaryVehicle: 'petrol_car',
        weeklyDistanceKm: 100,
        publicTransitFrequency: 'weekly',
        flightsPerYear: 100,
      })
      expect(result.annualKgCO2).toBeGreaterThan(0)
      expect(result.breakdown.some(b => b.label === 'Air Travel')).toBe(true)
    })

    it('should handle 24 hours of screen time', () => {
      const result = calculateDigitalEmissions({
        dailyScreenHours: 24,
        streamingHours: 24,
        emailCount: 1000,
        cloudStorageGB: 10000,
        deviceCount: 50,
      })
      expect(result.annualKgCO2).toBeGreaterThan(0)
      expect(result.breakdown.length).toBeGreaterThan(0)
    })
  })

  describe('Null and Invalid Data', () => {
    it('should handle invalid vehicle type gracefully', () => {
      expect(() =>
        calculateTransportEmissions({
          primaryVehicle: 'invalid_vehicle' as any,
          weeklyDistanceKm: 100,
          publicTransitFrequency: 'weekly',
          flightsPerYear: 2,
        })
      ).toThrow('Unknown transport type')
    })

    it('should handle invalid diet type gracefully', () => {
      expect(() =>
        calculateDietEmissions({
          dietType: 'invalid_diet' as any,
          localFoodPercentage: 20,
          foodWasteFrequency: 'sometimes',
        })
      ).toThrow('Unknown diet type')
    })

    it('should handle invalid heating type gracefully', () => {
      expect(() =>
        calculateEnergyEmissions({
          homeType: 'apartment',
          squareMeters: 80,
          occupants: 2,
          renewablePercentage: 10,
          heatingType: 'invalid_heating' as any,
          acUsage: 'occasional',
        })
      ).not.toThrow()
    })
  })

  describe('Score Calculation Edge Cases', () => {
    it('should return 100 for zero emissions', () => {
      const score = calculateCarbonScore(0)
      expect(score).toBe(100)
    })

    it('should return 0 for extremely high emissions', () => {
      const score = calculateCarbonScore(100000)
      expect(score).toBe(0)
    })

    it('should handle negative emissions (carbon negative)', () => {
      const score = calculateCarbonScore(-1000)
      expect(score).toBe(100)
    })

    it('should return exact boundary values', () => {
      // Assuming excellent = 2000 and poor = 15000 based on typical targets
      // These tests verify the function doesn't crash at boundaries
      expect(calculateCarbonScore(2000)).toBeGreaterThanOrEqual(0)
      expect(calculateCarbonScore(2000)).toBeLessThanOrEqual(100)
      expect(calculateCarbonScore(15000)).toBeGreaterThanOrEqual(0)
      expect(calculateCarbonScore(15000)).toBeLessThanOrEqual(100)
    })
  })

  describe('Rating Edge Cases', () => {
    it('should handle score of exactly 100', () => {
      const rating = getCarbonRating(100)
      expect(rating.label).toBe('Excellent')
    })

    it('should handle score of exactly 0', () => {
      const rating = getCarbonRating(0)
      expect(rating.label).toBe('Critical')
    })

    it('should handle boundary scores', () => {
      expect(getCarbonRating(80).label).toBe('Excellent')
      expect(getCarbonRating(60).label).toBe('Good')
      expect(getCarbonRating(40).label).toBe('Average')
      expect(getCarbonRating(20).label).toBe('High')
      expect(getCarbonRating(19).label).toBe('Critical')
    })
  })

  describe('Format Carbon Value Edge Cases', () => {
    it('should format values less than 1000 as kg', () => {
      expect(formatCarbonValue(999)).toBe('999kg')
      expect(formatCarbonValue(1)).toBe('1kg')
      expect(formatCarbonValue(0)).toBe('0kg')
    })

    it('should format values >= 1000 as tonnes', () => {
      expect(formatCarbonValue(1000)).toBe('1.0t')
      expect(formatCarbonValue(2500)).toBe('2.5t')
      expect(formatCarbonValue(10000)).toBe('10.0t')
    })

    it('should handle negative values', () => {
      expect(formatCarbonValue(-100)).toBe('-100kg')
    })
  })

  describe('Profile Building Edge Cases', () => {
    it('should handle empty onboarding data', () => {
      expect(() =>
        buildCarbonProfile({
          transport: {
            primaryVehicle: 'walking',
            weeklyDistanceKm: 0,
            publicTransitFrequency: 'never',
            flightsPerYear: 0,
          },
          diet: {
            dietType: 'vegan',
            localFoodPercentage: 100,
            foodWasteFrequency: 'never',
          },
          energy: {
            homeType: 'studio',
            squareMeters: 5,
            occupants: 1,
            renewablePercentage: 100,
            heatingType: 'solar',
            acUsage: 'never',
          },
          digital: {
            dailyScreenHours: 0,
            streamingHours: 0,
            emailCount: 0,
            cloudStorageGB: 0,
            deviceCount: 1,
          },
          consumption: {
            monthlyShoppingBudget: 0,
            clothingFrequency: 'rarely',
            electronicsFrequency: 'rarely',
            recyclingHabits: 'always',
          },
        })
      ).not.toThrow()
    })

    it('should handle unknown region', () => {
      const profile = buildCarbonProfile(
        {
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
        },
        'mars' // Unknown region
      )
      expect(profile.percentile).toBeDefined()
      expect(profile.overallScore).toBeGreaterThanOrEqual(0)
      expect(profile.overallScore).toBeLessThanOrEqual(100)
    })
  })
})

describe('Validation Edge Cases', () => {
  describe('Onboarding Data Validation', () => {
    it('should reject null data', () => {
      const result = validateOnboardingData(null)
      expect(result.success).toBe(false)
    })

    it('should reject undefined data', () => {
      const result = validateOnboardingData(undefined)
      expect(result.success).toBe(false)
    })

    it('should reject empty object', () => {
      const result = validateOnboardingData({})
      expect(result.success).toBe(false)
    })

    it('should reject negative numbers', () => {
      const result = validateOnboardingData({
        transport: {
          primaryVehicle: 'petrol_car',
          weeklyDistanceKm: -100,
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
      expect(result.success).toBe(false)
    })

    it('should reject numbers exceeding maximums', () => {
      const result = validateOnboardingData({
        transport: {
          primaryVehicle: 'petrol_car',
          weeklyDistanceKm: 10000,
          publicTransitFrequency: 'weekly',
          flightsPerYear: 200,
        },
        diet: {
          dietType: 'omnivore',
          localFoodPercentage: 200,
          foodWasteFrequency: 'sometimes',
        },
        energy: {
          homeType: 'apartment',
          squareMeters: 80,
          occupants: 2,
          renewablePercentage: 200,
          heatingType: 'electric',
          acUsage: 'occasional',
        },
        digital: {
          dailyScreenHours: 50,
          streamingHours: 50,
          emailCount: 5000,
          cloudStorageGB: 50000,
          deviceCount: 100,
        },
        consumption: {
          monthlyShoppingBudget: 100000,
          clothingFrequency: 'occasionally',
          electronicsFrequency: 'bi-yearly',
          recyclingHabits: 'sometimes',
        },
      })
      expect(result.success).toBe(false)
    })
  })

  describe('User Input Validation', () => {
    it('should reject invalid category', () => {
      const result = validateUserInput({
        category: 'invalid',
        subcategory: 'test',
        value: 100,
        frequency: 'daily',
      })
      expect(result.success).toBe(false)
    })

    it('should reject negative value', () => {
      const result = validateUserInput({
        category: 'transport',
        subcategory: 'car',
        value: -10,
        frequency: 'daily',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Sanitization', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert(1)</script>')).not.toContain('<')
      expect(sanitizeString('<script>alert(1)</script>')).not.toContain('>')
    })

    it('should remove javascript protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).not.toContain('javascript:')
    })

    it('should remove event handlers', () => {
      expect(sanitizeString('onclick=alert(1)')).not.toContain('onclick')
    })

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello')
    })

    it('should enforce max length', () => {
      const longString = 'a'.repeat(1000)
      expect(sanitizeString(longString, 100).length).toBe(100)
    })

    it('should handle empty string', () => {
      expect(sanitizeString('')).toBe('')
    })

    it('should handle special characters safely', () => {
      expect(sanitizeString('hello@world.com')).toBe('hello@world.com')
      expect(sanitizeString('test_123')).toBe('test_123')
    })
  })
})
