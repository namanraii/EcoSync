import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OnboardingData, UserProfile, CarbonProfile, Insight, TrendData, ToastData } from '@/types'
import { buildCarbonProfile } from '@/lib/utils/calculator'

interface AppState {
  // User data
  userProfile: UserProfile | null
  onboardingData: OnboardingData | null
  onboardingStep: number
  carbonProfile: CarbonProfile | null

  // Actions
  committedActions: string[]
  actionProgress: Record<string, number>

  // Insights
  insights: Insight[]

  // Trends
  trends: TrendData[]

  // UI state
  sidebarOpen: boolean
  activeTab: string
  toast: ToastData | null

  // Actions
  setUserProfile: (profile: UserProfile) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  setOnboardingData: (data: OnboardingData) => void
  setOnboardingStep: (step: number) => void
  completeOnboarding: () => void
  calculateProfile: () => void
  commitAction: (actionId: string) => void
  uncommitAction: (actionId: string) => void
  updateActionProgress: (actionId: string, progress: number) => void
  addInsight: (insight: Insight) => void
  dismissInsight: (insightId: string) => void
  addTrend: (trend: TrendData) => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
  showToast: (message: string, type: ToastData['type']) => void
  clearToast: () => void
  resetStore: () => void
}

const initialState = {
  userProfile: null,
  onboardingData: null,
  onboardingStep: 0,
  carbonProfile: null,
  committedActions: [],
  actionProgress: {},
  insights: [],
  trends: [],
  sidebarOpen: false,
  activeTab: 'dashboard',
  toast: null,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserProfile: (profile) => set({ userProfile: profile }),

      updateUserProfile: (updates) => {
        const current = get().userProfile
        if (!current) return
        set({
          userProfile: { ...current, ...updates, updatedAt: new Date().toISOString() },
        })
      },

      setOnboardingData: (data) => set({ onboardingData: data }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      completeOnboarding: () => {
        const { userProfile } = get()
        if (userProfile) {
          set({
            userProfile: { ...userProfile, onboardingComplete: true, updatedAt: new Date().toISOString() },
            onboardingStep: 5,
          })
        }
      },

      calculateProfile: () => {
        const { onboardingData, userProfile } = get()
        if (!onboardingData || !userProfile) return

        const profile = buildCarbonProfile(onboardingData, userProfile.region)

        // Add trend entry
        const trend: TrendData = {
          date: new Date().toISOString(),
          totalCarbon: profile.totalAnnualKgCO2,
          score: profile.overallScore,
          categoryBreakdown: {
            transport: profile.categoryBreakdown.transport.annualKgCO2,
            diet: profile.categoryBreakdown.diet.annualKgCO2,
            energy: profile.categoryBreakdown.energy.annualKgCO2,
            digital: profile.categoryBreakdown.digital.annualKgCO2,
            consumption: profile.categoryBreakdown.consumption.annualKgCO2,
          },
        }

        set({
          carbonProfile: profile,
          trends: [...get().trends, trend],
        })
      },

      commitAction: (actionId) => {
        const { committedActions } = get()
        if (!committedActions.includes(actionId)) {
          set({
            committedActions: [...committedActions, actionId],
            actionProgress: { ...get().actionProgress, [actionId]: 0 },
          })
        }
      },

      uncommitAction: (actionId) => {
        const { committedActions, actionProgress } = get()
        const newProgress = { ...actionProgress }
        delete newProgress[actionId]
        set({
          committedActions: committedActions.filter((id) => id !== actionId),
          actionProgress: newProgress,
        })
      },

      updateActionProgress: (actionId, progress) => {
        set({
          actionProgress: {
            ...get().actionProgress,
            [actionId]: Math.min(100, Math.max(0, progress)),
          },
        })
      },

      addInsight: (insight) => {
        set({ insights: [...get().insights, insight] })
      },

      dismissInsight: (insightId) => {
        set({ insights: get().insights.filter((i) => i.id !== insightId) })
      },

      addTrend: (trend) => {
        set({ trends: [...get().trends, trend] })
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      showToast: (message, type) => {
        set({ toast: { message, type } })
        setTimeout(() => {
          set({ toast: null })
        }, 5000)
      },

      clearToast: () => set({ toast: null }),

      resetStore: () => set(initialState),
    }),
    {
      name: 'ecosync-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        onboardingData: state.onboardingData,
        onboardingStep: state.onboardingStep,
        carbonProfile: state.carbonProfile,
        committedActions: state.committedActions,
        actionProgress: state.actionProgress,
        insights: state.insights,
        trends: state.trends,
      }),
    }
  )
)

// Selectors
export function useCarbonProfile() {
  return useStore((state) => state.carbonProfile)
}

export function useCommittedActions() {
  return useStore((state) => state.committedActions)
}

export function useActionProgress() {
  return useStore((state) => state.actionProgress)
}

export function useInsights() {
  return useStore((state) => state.insights)
}

export function useTrends() {
  return useStore((state) => state.trends)
}

export function useUserProfile() {
  return useStore((state) => state.userProfile)
}

export function useToast() {
  return useStore((state) => state.toast)
}
