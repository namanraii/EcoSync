export interface BreakdownItem {
  label: string
  value: number
  percentage: number
  color: string
}

export interface EmissionCategoryData {
  annualKgCO2: number
  dailyKgCO2: number
  breakdown: BreakdownItem[]
  confidence: number
}

export interface CarbonProfile {
  totalAnnualKgCO2: number
  totalDailyKgCO2: number
  overallScore: number
  categoryBreakdown: {
    transport: EmissionCategoryData
    diet: EmissionCategoryData
    energy: EmissionCategoryData
    digital: EmissionCategoryData
    consumption: EmissionCategoryData
  }
  percentile: number
  lastUpdated: string
}

export interface OnboardingData {
  transport: {
    primaryVehicle: string
    weeklyDistanceKm: number
    publicTransitFrequency: string
    flightsPerYear: number
  }
  diet: {
    dietType: string
    localFoodPercentage: number
    foodWasteFrequency: string
  }
  energy: {
    homeType: string
    squareMeters: number
    occupants: number
    renewablePercentage: number
    heatingType: string
    acUsage: string
  }
  digital: {
    dailyScreenHours: number
    streamingHours: number
    emailCount: number
    cloudStorageGB: number
    deviceCount: number
  }
  consumption: {
    monthlyShoppingBudget: number
    clothingFrequency: string
    electronicsFrequency: string
    recyclingHabits: string
  }
}

export interface UserProfile {
  id: string
  name: string
  region: string
  householdSize: number
  onboardingComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface Insight {
  id: string
  type: 'warning' | 'opportunity' | 'achievement' | 'comparison' | 'trend'
  title: string
  description: string
  category: EmissionCategory
  severity: 'low' | 'medium' | 'high'
  actionable: boolean
  createdAt: string
}

export interface TrendData {
  date: string
  totalCarbon: number
  score: number
  categoryBreakdown: {
    transport: number
    diet: number
    energy: number
    digital: number
    consumption: number
  }
}

export interface CarbonAction {
  id: string
  title: string
  description: string
  category: EmissionCategory
  impactScore: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedCost: string
  timeToImplement: string
  prerequisites: string[]
  steps: string[]
}

export interface ChartDataPoint {
  name: string
  value: number
  color: string
}

export type EmissionCategory = 'transport' | 'diet' | 'energy' | 'digital' | 'consumption'

export interface ToastData {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}
