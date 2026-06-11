import type { OnboardingData, CarbonProfile, BreakdownItem } from '@/types'

const TRANSPORT_FACTORS: Record<string, number> = {
  petrol_car: 0.192,
  diesel_car: 0.171,
  electric_car: 0.053,
  hybrid_car: 0.120,
  motorcycle: 0.103,
  bicycle: 0,
  walking: 0,
  public_bus: 0.089,
  train: 0.041,
  subway: 0.028,
}

const DIET_FACTORS: Record<string, number> = {
  vegan: 1500,
  vegetarian: 1700,
  pescatarian: 2500,
  flexitarian: 3000,
  omnivore: 3300,
  'high-meat': 4500,
}

const HEATING_FACTORS: Record<string, number> = {
  electric: 0.4,
  gas: 0.2,
  oil: 0.28,
  'heat-pump': 0.12,
  solar: 0,
}

export function calculateTransportEmissions(data: OnboardingData['transport']): { annualKgCO2: number; dailyKgCO2: number; breakdown: BreakdownItem[]; confidence: number } {
  const vehicleFactor = TRANSPORT_FACTORS[data.primaryVehicle] || 0
  const vehicleEmissions = data.weeklyDistanceKm * 52 * vehicleFactor

  const transitFactors: Record<string, number> = { daily: 800, weekly: 200, rarely: 50, never: 0 }
  const transitEmissions = transitFactors[data.publicTransitFrequency] || 0

  const flightEmissions = data.flightsPerYear * 900

  const total = vehicleEmissions + transitEmissions + flightEmissions

  return {
    annualKgCO2: total,
    dailyKgCO2: total / 365,
    breakdown: [
      { label: 'Vehicle', value: vehicleEmissions, percentage: (vehicleEmissions / total) * 100, color: '#ef4444' },
      { label: 'Public Transit', value: transitEmissions, percentage: (transitEmissions / total) * 100, color: '#3b82f6' },
      { label: 'Air Travel', value: flightEmissions, percentage: (flightEmissions / total) * 100, color: '#f59e0b' },
    ].filter(b => b.value > 0),
    confidence: 0.85,
  }
}

export function calculateDietEmissions(data: OnboardingData['diet']): { annualKgCO2: number; dailyKgCO2: number; breakdown: BreakdownItem[]; confidence: number } {
  const baseEmissions = DIET_FACTORS[data.dietType] || 3000
  const localReduction = (data.localFoodPercentage / 100) * baseEmissions * 0.1
  const wasteFactors: Record<string, number> = { never: 0, rarely: 100, sometimes: 300, often: 600 }
  const wasteEmissions = wasteFactors[data.foodWasteFrequency] || 300

  const total = baseEmissions - localReduction + wasteEmissions

  return {
    annualKgCO2: total,
    dailyKgCO2: total / 365,
    breakdown: [
      { label: 'Diet Type', value: baseEmissions, percentage: (baseEmissions / total) * 100, color: '#10b981' },
      { label: 'Food Waste', value: wasteEmissions, percentage: (wasteEmissions / total) * 100, color: '#f59e0b' },
    ].filter(b => b.value > 0),
    confidence: 0.75,
  }
}

export function calculateEnergyEmissions(data: OnboardingData['energy']): { annualKgCO2: number; dailyKgCO2: number; breakdown: BreakdownItem[]; confidence: number } {
  const baseEnergy = data.squareMeters * 150 / data.occupants
  const heatingFactor = HEATING_FACTORS[data.heatingType] || 0.4
  const heatingEmissions = baseEnergy * heatingFactor

  const acFactors: Record<string, number> = { never: 0, occasional: 200, regular: 600, constant: 1200 }
  const acEmissions = acFactors[data.acUsage] || 0

  const renewableReduction = (data.renewablePercentage / 100) * (heatingEmissions + acEmissions)
  const total = heatingEmissions + acEmissions - renewableReduction

  return {
    annualKgCO2: total,
    dailyKgCO2: total / 365,
    breakdown: [
      { label: 'Heating', value: heatingEmissions, percentage: (heatingEmissions / total) * 100, color: '#f97316' },
      { label: 'Cooling', value: acEmissions, percentage: (acEmissions / total) * 100, color: '#3b82f6' },
    ].filter(b => b.value > 0),
    confidence: 0.80,
  }
}

export function calculateDigitalEmissions(data: OnboardingData['digital']): { annualKgCO2: number; dailyKgCO2: number; breakdown: BreakdownItem[]; confidence: number } {
  const screenEmissions = data.dailyScreenHours * 365 * 0.05
  const streamingEmissions = data.streamingHours * 365 * 0.1
  const emailEmissions = data.emailCount * 365 * 0.004
  const cloudEmissions = data.cloudStorageGB * 0.2
  const deviceEmissions = data.deviceCount * 50

  const total = screenEmissions + streamingEmissions + emailEmissions + cloudEmissions + deviceEmissions

  return {
    annualKgCO2: total,
    dailyKgCO2: total / 365,
    breakdown: [
      { label: 'Screen Time', value: screenEmissions, percentage: (screenEmissions / total) * 100, color: '#8b5cf6' },
      { label: 'Streaming', value: streamingEmissions, percentage: (streamingEmissions / total) * 100, color: '#ec4899' },
      { label: 'Email', value: emailEmissions, percentage: (emailEmissions / total) * 100, color: '#06b6d4' },
      { label: 'Cloud Storage', value: cloudEmissions, percentage: (cloudEmissions / total) * 100, color: '#14b8a6' },
      { label: 'Devices', value: deviceEmissions, percentage: (deviceEmissions / total) * 100, color: '#f43f5e' },
    ].filter(b => b.value > 0),
    confidence: 0.65,
  }
}

export function calculateConsumptionEmissions(data: OnboardingData['consumption']): { annualKgCO2: number; dailyKgCO2: number; breakdown: BreakdownItem[]; confidence: number } {
  const shoppingEmissions = data.monthlyShoppingBudget * 12 * 0.5
  const clothingFactors: Record<string, number> = { rarely: 100, occasionally: 300, monthly: 800, weekly: 2000 }
  const clothingEmissions = clothingFactors[data.clothingFrequency] || 300
  const electronicsFactors: Record<string, number> = { yearly: 200, 'bi-yearly': 100, rarely: 50 }
  const electronicsEmissions = electronicsFactors[data.electronicsFrequency] || 100
  const recyclingReductions: Record<string, number> = { always: 500, often: 300, sometimes: 100, rarely: 0 }
  const recyclingReduction = recyclingReductions[data.recyclingHabits] || 0

  const total = shoppingEmissions + clothingEmissions + electronicsEmissions - recyclingReduction

  return {
    annualKgCO2: Math.max(0, total),
    dailyKgCO2: Math.max(0, total) / 365,
    breakdown: [
      { label: 'Shopping', value: shoppingEmissions, percentage: (shoppingEmissions / total) * 100, color: '#f472b6' },
      { label: 'Clothing', value: clothingEmissions, percentage: (clothingEmissions / total) * 100, color: '#a78bfa' },
      { label: 'Electronics', value: electronicsEmissions, percentage: (electronicsEmissions / total) * 100, color: '#60a5fa' },
    ].filter(b => b.value > 0),
    confidence: 0.70,
  }
}

export function calculateCarbonScore(totalAnnualKgCO2: number): number {
  const excellent = 2000
  const poor = 15000
  const score = Math.max(0, Math.min(100, 100 - ((totalAnnualKgCO2 - excellent) / (poor - excellent)) * 100))
  return Math.round(score)
}

export function getCarbonRating(score: number): { label: string; description: string; color: string } {
  if (score >= 80) return { label: 'Excellent', description: 'Outstanding carbon performance', color: 'text-green-600' }
  if (score >= 60) return { label: 'Good', description: 'Above average sustainability', color: 'text-green-500' }
  if (score >= 40) return { label: 'Average', description: 'Room for improvement', color: 'text-yellow-500' }
  if (score >= 20) return { label: 'High', description: 'Significant reduction needed', color: 'text-orange-500' }
  return { label: 'Critical', description: 'Immediate action required', color: 'text-red-600' }
}

export function formatCarbonValue(value: number): string {
  if (Math.abs(value) < 1000) return `${Math.round(value)}kg`
  return `${(value / 1000).toFixed(1)}t`
}

export function buildCarbonProfile(data: OnboardingData, region = 'global'): CarbonProfile {
  const transport = calculateTransportEmissions(data.transport)
  const diet = calculateDietEmissions(data.diet)
  const energy = calculateEnergyEmissions(data.energy)
  const digital = calculateDigitalEmissions(data.digital)
  const consumption = calculateConsumptionEmissions(data.consumption)

  const totalAnnual = transport.annualKgCO2 + diet.annualKgCO2 + energy.annualKgCO2 + digital.annualKgCO2 + consumption.annualKgCO2
  const totalDaily = totalAnnual / 365
  const score = calculateCarbonScore(totalAnnual)

  const regionAverages: Record<string, number> = { global: 4800, india: 1900, us: 16000, eu: 7500, china: 8000 }
  const avg = regionAverages[region] || regionAverages.global
  const percentile = Math.max(0, Math.min(100, Math.round(((avg - totalAnnual) / avg) * 50 + 50)))

  return {
    totalAnnualKgCO2: totalAnnual,
    totalDailyKgCO2: totalDaily,
    overallScore: score,
    categoryBreakdown: {
      transport,
      diet,
      energy,
      digital,
      consumption,
    },
    percentile,
    lastUpdated: new Date().toISOString(),
  }
}
