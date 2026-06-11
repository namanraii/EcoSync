import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '@/lib/hooks/use-store'
import type { OnboardingData, UserProfile, Insight } from '@/types'

describe('Zustand Store Integration', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useStore.getState()
    store.resetStore()
    localStorage.removeItem('ecosync-storage')
  })

  describe('User Profile', () => {
    it('should set and retrieve user profile', () => {
      const profile: UserProfile = {
        id: 'test-id-123',
        name: 'Test User',
        region: 'global',
        householdSize: 2,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useStore.getState().setUserProfile(profile)
      expect(useStore.getState().userProfile).toEqual(profile)
    })

    it('should update user profile partially', () => {
      const profile: UserProfile = {
        id: 'test-id-456',
        name: 'Original Name',
        region: 'global',
        householdSize: 1,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useStore.getState().setUserProfile(profile)
      useStore.getState().updateUserProfile({ name: 'Updated Name' })

      expect(useStore.getState().userProfile?.name).toBe('Updated Name')
      expect(useStore.getState().userProfile?.region).toBe('global') // unchanged
    })

    it('should handle null profile updates gracefully', () => {
      // Should not throw when profile is null
      expect(() => {
        useStore.getState().updateUserProfile({ name: 'No Profile' })
      }).not.toThrow()
      expect(useStore.getState().userProfile).toBeNull()
    })
  })

  describe('Onboarding Flow', () => {
    const mockOnboardingData: OnboardingData = {
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
    }

    it('should store onboarding data', () => {
      useStore.getState().setOnboardingData(mockOnboardingData)
      expect(useStore.getState().onboardingData).toEqual(mockOnboardingData)
    })

    it('should advance onboarding steps', () => {
      expect(useStore.getState().onboardingStep).toBe(0)
      useStore.getState().setOnboardingStep(2)
      expect(useStore.getState().onboardingStep).toBe(2)
    })

    it('should complete onboarding and update profile', () => {
      const profile: UserProfile = {
        id: 'test-id',
        name: 'Test User',
        region: 'global',
        householdSize: 2,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useStore.getState().setUserProfile(profile)
      useStore.getState().completeOnboarding()

      expect(useStore.getState().userProfile?.onboardingComplete).toBe(true)
      expect(useStore.getState().onboardingStep).toBe(5)
    })
  })

  describe('Carbon Profile Calculation', () => {
    const mockOnboardingData: OnboardingData = {
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
    }

    const mockProfile: UserProfile = {
      id: 'test-id',
      name: 'Test User',
      region: 'global',
      householdSize: 2,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    it('should calculate carbon profile from onboarding data', () => {
      useStore.getState().setOnboardingData(mockOnboardingData)
      useStore.getState().setUserProfile(mockProfile)
      useStore.getState().calculateProfile()

      const carbonProfile = useStore.getState().carbonProfile
      expect(carbonProfile).not.toBeNull()
      expect(carbonProfile?.totalAnnualKgCO2).toBeGreaterThan(0)
      expect(carbonProfile?.overallScore).toBeGreaterThanOrEqual(0)
      expect(carbonProfile?.overallScore).toBeLessThanOrEqual(100)
    })

    it('should not calculate profile without onboarding data', () => {
      useStore.getState().setUserProfile(mockProfile)
      useStore.getState().calculateProfile()
      expect(useStore.getState().carbonProfile).toBeNull()
    })

    it('should not calculate profile without user profile', () => {
      useStore.getState().setOnboardingData(mockOnboardingData)
      useStore.getState().calculateProfile()
      expect(useStore.getState().carbonProfile).toBeNull()
    })

    it('should generate trend data after calculation', () => {
      useStore.getState().setOnboardingData(mockOnboardingData)
      useStore.getState().setUserProfile(mockProfile)
      useStore.getState().calculateProfile()

      const trends = useStore.getState().trends
      expect(trends.length).toBeGreaterThan(0)
      expect(trends[0]?.totalCarbon).toBeGreaterThan(0)
      expect(trends[0]?.score).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Actions Management', () => {
    it('should commit and uncommit actions', () => {
      useStore.getState().commitAction('action-1')
      expect(useStore.getState().committedActions).toContain('action-1')
      expect(useStore.getState().actionProgress['action-1']).toBe(0)

      useStore.getState().uncommitAction('action-1')
      expect(useStore.getState().committedActions).not.toContain('action-1')
      expect(useStore.getState().actionProgress['action-1']).toBeUndefined()
    })

    it('should update action progress', () => {
      useStore.getState().commitAction('action-1')
      useStore.getState().updateActionProgress('action-1', 50)
      expect(useStore.getState().actionProgress['action-1']).toBe(50)
    })

    it('should handle duplicate commits idempotently', () => {
      useStore.getState().commitAction('action-1')
      useStore.getState().commitAction('action-1')
      // Should only appear once
      expect(useStore.getState().committedActions.filter((id) => id === 'action-1').length).toBe(1)
    })
  })

  describe('Insights', () => {
    const mockInsight: Insight = {
      id: 'insight-1',
      type: 'warning',
      title: 'High Transport Emissions',
      description: 'Your transport emissions are above average.',
      category: 'transport',
      severity: 'high',
      actionable: true,
      createdAt: new Date().toISOString(),
    }

    it('should add and dismiss insights', () => {
      useStore.getState().addInsight(mockInsight)
      expect(useStore.getState().insights).toHaveLength(1)

      useStore.getState().dismissInsight('insight-1')
      expect(useStore.getState().insights).toHaveLength(0)
    })
  })

  describe('UI State', () => {
    it('should manage sidebar state', () => {
      expect(useStore.getState().sidebarOpen).toBe(false)
      useStore.getState().setSidebarOpen(true)
      expect(useStore.getState().sidebarOpen).toBe(true)
    })

    it('should manage active tab', () => {
      useStore.getState().setActiveTab('actions')
      expect(useStore.getState().activeTab).toBe('actions')
    })

    it('should show and clear toast', () => {
      useStore.getState().showToast('Test message', 'success')
      expect(useStore.getState().toast).toEqual({ message: 'Test message', type: 'success' })

      useStore.getState().clearToast()
      expect(useStore.getState().toast).toBeNull()
    })
  })

  describe('Store Reset', () => {
    it('should reset all state to initial values', () => {
      useStore.getState().setUserProfile({
        id: 'test',
        name: 'Test',
        region: 'global',
        householdSize: 1,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      useStore.getState().commitAction('action-1')
      useStore.getState().setActiveTab('settings')

      useStore.getState().resetStore()

      expect(useStore.getState().userProfile).toBeNull()
      expect(useStore.getState().committedActions).toEqual([])
      expect(useStore.getState().activeTab).toBe('dashboard')
      expect(useStore.getState().sidebarOpen).toBe(false)
    })
  })

  describe('Persistence', () => {
    it('should persist and rehydrate state', () => {
      const profile: UserProfile = {
        id: 'persist-test',
        name: 'Persist User',
        region: 'india',
        householdSize: 4,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useStore.getState().setUserProfile(profile)

      // Simulate rehydration by checking localStorage
      const stored = localStorage.getItem('ecosync-storage')
      expect(stored).not.toBeNull()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.userProfile).toEqual(profile)
    })
  })
})
