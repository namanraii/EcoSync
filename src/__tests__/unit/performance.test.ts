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
import { validateOnboardingData } from '@/lib/utils/validation'

describe('Performance Benchmarks', () => {
  const ITERATIONS = 1000

  describe('Calculator Performance', () => {
    const mockData = {
      transport: {
        primaryVehicle: 'petrol_car' as const,
        weeklyDistanceKm: 100,
        publicTransitFrequency: 'weekly' as const,
        flightsPerYear: 2,
      },
      diet: {
        dietType: 'omnivore' as const,
        localFoodPercentage: 20,
        foodWasteFrequency: 'sometimes' as const,
      },
      energy: {
        homeType: 'apartment' as const,
        squareMeters: 80,
        occupants: 2,
        renewablePercentage: 10,
        heatingType: 'electric' as const,
        acUsage: 'occasional' as const,
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
        clothingFrequency: 'occasionally' as const,
        electronicsFrequency: 'bi-yearly' as const,
        recyclingHabits: 'sometimes' as const,
      },
    }

    it(`should calculate transport emissions under 1ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        calculateTransportEmissions(mockData.transport)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(1)
      console.log(`Transport calc avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should calculate diet emissions under 1ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        calculateDietEmissions(mockData.diet)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(1)
      console.log(`Diet calc avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should calculate energy emissions under 1ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        calculateEnergyEmissions(mockData.energy)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(1)
      console.log(`Energy calc avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should calculate digital emissions under 1ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        calculateDigitalEmissions(mockData.digital)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(1)
      console.log(`Digital calc avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should calculate consumption emissions under 1ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        calculateConsumptionEmissions(mockData.consumption)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(1)
      console.log(`Consumption calc avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should build full profile under 5ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        buildCarbonProfile(mockData)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(5)
      console.log(`Full profile build avg: ${avgMs.toFixed(4)}ms`)
    })

    it(`should calculate score under 0.1ms (${ITERATIONS * 10} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS * 10; i++) {
        calculateCarbonScore(5000)
      }
      const duration = performance.now() - start
      const avgMs = duration / (ITERATIONS * 10)

      expect(avgMs).toBeLessThan(0.1)
      console.log(`Score calc avg: ${avgMs.toFixed(6)}ms`)
    })

    it(`should get rating under 0.1ms (${ITERATIONS * 10} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS * 10; i++) {
        getCarbonRating(75)
      }
      const duration = performance.now() - start
      const avgMs = duration / (ITERATIONS * 10)

      expect(avgMs).toBeLessThan(0.1)
      console.log(`Rating calc avg: ${avgMs.toFixed(6)}ms`)
    })

    it(`should format carbon value under 0.1ms (${ITERATIONS * 10} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS * 10; i++) {
        formatCarbonValue(2500)
      }
      const duration = performance.now() - start
      const avgMs = duration / (ITERATIONS * 10)

      expect(avgMs).toBeLessThan(0.1)
      console.log(`Format value avg: ${avgMs.toFixed(6)}ms`)
    })
  })

  describe('Validation Performance', () => {
    const mockData = {
      transport: {
        primaryVehicle: 'petrol_car' as const,
        weeklyDistanceKm: 100,
        publicTransitFrequency: 'weekly' as const,
        flightsPerYear: 2,
      },
      diet: {
        dietType: 'omnivore' as const,
        localFoodPercentage: 20,
        foodWasteFrequency: 'sometimes' as const,
      },
      energy: {
        homeType: 'apartment' as const,
        squareMeters: 80,
        occupants: 2,
        renewablePercentage: 10,
        heatingType: 'electric' as const,
        acUsage: 'occasional' as const,
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
        clothingFrequency: 'occasionally' as const,
        electronicsFrequency: 'bi-yearly' as const,
        recyclingHabits: 'sometimes' as const,
      },
    }

    it(`should validate onboarding data under 2ms (${ITERATIONS} iterations)`, () => {
      const start = performance.now()
      for (let i = 0; i < ITERATIONS; i++) {
        validateOnboardingData(mockData)
      }
      const duration = performance.now() - start
      const avgMs = duration / ITERATIONS

      expect(avgMs).toBeLessThan(2)
      console.log(`Validation avg: ${avgMs.toFixed(4)}ms`)
    })
  })

  describe('Memory Efficiency', () => {
    it('should not leak memory during repeated calculations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0

      for (let i = 0; i < 10000; i++) {
        buildCarbonProfile({
          transport: {
            primaryVehicle: 'petrol_car',
            weeklyDistanceKm: 100 + i,
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
      }

      // Force garbage collection if available (Node.js --expose-gc)
      if (global.gc) {
        global.gc()
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0

      // Memory should not grow unboundedly
      if (initialMemory > 0 && finalMemory > 0) {
        const growth = (finalMemory - initialMemory) / initialMemory
        expect(growth).toBeLessThan(0.5) // Less than 50% growth
      }
    })
  })
})
