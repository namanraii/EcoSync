/**
 * Core Type Definitions for EcoSync
 * Strict TypeScript interfaces ensuring type safety across the application
 */

// ==================== CARBON ENGINE TYPES ====================

export interface EmissionFactor {
  id: string
  category: EmissionCategory
  subcategory: string
  factor: number // kg CO2e per unit
  unit: string
  source: string
  region: string
  year: number
  confidence: 'high' | 'medium' | 'low'
}

export type EmissionCategory = 'transport' | 'diet' | 'energy' | 'digital' | 'consumption'

export type { UserInput } from '@/lib/utils/validation'

export interface CarbonResult {
  category: EmissionCategory
  subcategory: string
  annualKgCO2: number
  dailyKgCO2: number
  breakdown: BreakdownItem[]
  confidence: number // 0-1
}

export interface BreakdownItem {
  label: string
  value: number
  percentage: number
  color: string
}

export interface CarbonProfile {
  totalAnnualKgCO2: number
  totalDailyKgCO2: number
  categoryBreakdown: Record<EmissionCategory, CarbonResult>
  overallScore: number // 0-100 (100 = carbon neutral)
  percentile?: number
  lastUpdated: string
}

// ==================== USER PROFILE TYPES ====================

export type {
  UserProfile,
  OnboardingData,
  TransportData,
  DietData,
  EnergyData,
  DigitalData,
  ConsumptionData,
} from '@/lib/utils/validation'

// ==================== ACTION TYPES ====================

export interface CarbonAction {
  id: string
  title: string
  description: string
  category: EmissionCategory
  difficulty: 'easy' | 'medium' | 'hard'
  impactScore: number // kg CO2e saved per year
  estimatedCost: 'free' | 'low' | 'medium' | 'high'
  timeToImplement: string
  prerequisites: string[]
  steps: string[]
  resources: ResourceLink[]
  isCommitted: boolean
  committedDate?: string
  progress: number // 0-100
}

export interface ResourceLink {
  title: string
  url: string
  type: 'article' | 'video' | 'tool' | 'calculator'
}

export interface ActionCommitment {
  actionId: string
  committedDate: string
  targetDate: string
  progress: number
  completed: boolean
  notes: string
}

// ==================== INSIGHT TYPES ====================

export interface Insight {
  id: string
  type: 'warning' | 'opportunity' | 'achievement' | 'comparison' | 'trend'
  title: string
  description: string
  category: EmissionCategory
  severity: 'low' | 'medium' | 'high'
  actionable: boolean
  relatedActionId?: string
  createdAt: string
}

export interface TrendData {
  date: string
  totalCarbon: number
  categoryBreakdown: Record<EmissionCategory, number>
  score: number
}

// ==================== UI TYPES ====================

export interface ChartDataPoint {
  name: string
  value: number
  color?: string
  fill?: string
}

export interface WizardStep {
  id: string
  title: string
  description: string
  component: string
  isValid: boolean
}

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
}

// Simplified toast for store state
export interface ToastData {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

// ==================== API TYPES ====================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface InsightsRequest {
  profile: CarbonProfile
  actions: CarbonAction[]
  trends: TrendData[]
}

export interface InsightsResponse {
  insights: Insight[]
  recommendedActions: string[]
  projections: ProjectionData
}

export interface ProjectionData {
  currentTrajectory: number
  optimizedTrajectory: number
  potentialSavings: number
  targetDate: string
  milestones: Milestone[]
}

export interface Milestone {
  date: string
  targetCarbon: number
  description: string
}

// ==================== VALIDATION TYPES ====================

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}
