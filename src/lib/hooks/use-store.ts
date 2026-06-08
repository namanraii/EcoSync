/**
 * Zustand Global Store
 * Centralized state management for user profile, carbon data, and UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CarbonProfile,
  OnboardingData,
  UserProfile,
  CarbonAction,
  Insight,
  TrendData,
} from '@/types';
import { buildCarbonProfile } from '@/lib/utils/calculator';
import { CARBON_ACTIONS } from '@/lib/data/carbon-actions';

// ==================== STORE STATE INTERFACE ====================

interface AppState {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Onboarding
  onboardingData: OnboardingData | null;
  onboardingStep: number;
  setOnboardingData: (data: OnboardingData) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;

  // Carbon Profile
  carbonProfile: CarbonProfile | null;
  calculateProfile: () => void;

  // Actions
  committedActions: string[];
  actionProgress: Record<string, number>;
  commitAction: (actionId: string) => void;
  uncommitAction: (actionId: string) => void;
  updateActionProgress: (actionId: string, progress: number) => void;

  // Insights
  insights: Insight[];
  addInsight: (insight: Insight) => void;
  dismissInsight: (insightId: string) => void;

  // Trends
  trends: TrendData[];
  addTrend: (trend: TrendData) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Reset
  resetStore: () => void;
}

// ==================== INITIAL STATE ====================

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
};

// ==================== STORE CREATION ====================

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (updates) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...updates, updatedAt: new Date().toISOString() }
            : null,
        })),

      // Onboarding Actions
      setOnboardingData: (data) => set({ onboardingData: data }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, onboardingComplete: true }
            : null,
          onboardingStep: 5,
        })),

      // Carbon Profile Actions
      calculateProfile: () => {
        const { onboardingData, userProfile } = get();
        if (!onboardingData || !userProfile) return;

        const profile = buildCarbonProfile(onboardingData, userProfile.region);
        set({ carbonProfile: profile });

        // Generate initial trend
        const trend: TrendData = {
          date: new Date().toISOString(),
          totalCarbon: profile.totalAnnualKgCO2,
          categoryBreakdown: {
            transport: profile.categoryBreakdown.transport.annualKgCO2,
            diet: profile.categoryBreakdown.diet.annualKgCO2,
            energy: profile.categoryBreakdown.energy.annualKgCO2,
            digital: profile.categoryBreakdown.digital.annualKgCO2,
            consumption: profile.categoryBreakdown.consumption.annualKgCO2,
          },
          score: profile.overallScore,
        };

        set((state) => ({ trends: [...state.trends, trend] }));
      },

      // Action Actions
      commitAction: (actionId) =>
        set((state) => ({
          committedActions: [...state.committedActions, actionId],
          actionProgress: { ...state.actionProgress, [actionId]: 0 },
        })),
      uncommitAction: (actionId) =>
        set((state) => ({
          committedActions: state.committedActions.filter((id) => id !== actionId),
          actionProgress: Object.fromEntries(
            Object.entries(state.actionProgress).filter(([id]) => id !== actionId)
          ),
        })),
      updateActionProgress: (actionId, progress) =>
        set((state) => ({
          actionProgress: { ...state.actionProgress, [actionId]: progress },
        })),

      // Insight Actions
      addInsight: (insight) =>
        set((state) => ({ insights: [...state.insights, insight] })),
      dismissInsight: (insightId) =>
        set((state) => ({
          insights: state.insights.filter((i) => i.id !== insightId),
        })),

      // Trend Actions
      addTrend: (trend) =>
        set((state) => ({ trends: [...state.trends, trend] })),

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      showToast: (message, type) => set({ toast: { message, type } }),
      clearToast: () => set({ toast: null }),

      // Reset
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
        trends: state.trends,
      }),
    }
  )
);

// ==================== SELECTOR HOOKS ====================

export function useUserProfile(): UserProfile | null {
  return useStore((state) => state.userProfile);
}

export function useCarbonProfile(): CarbonProfile | null {
  return useStore((state) => state.carbonProfile);
}

export function useCommittedActions(): string[] {
  return useStore((state) => state.committedActions);
}

export function useActionProgress(): Record<string, number> {
  return useStore((state) => state.actionProgress);
}

export function useTrends(): TrendData[] {
  return useStore((state) => state.trends);
}

export function useInsights(): Insight[] {
  return useStore((state) => state.insights);
}

export function useIsOnboardingComplete(): boolean {
  return useStore((state) => state.userProfile?.onboardingComplete ?? false);
}
