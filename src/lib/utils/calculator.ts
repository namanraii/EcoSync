/**
 * Carbon Footprint Calculator Engine
 * Pure functions for calculating emissions based on user inputs
 * All calculations are deterministic, testable, and well-documented
 */

import {
  CarbonProfile,
  CarbonResult,
  BreakdownItem,
  EmissionCategory,
  OnboardingData,
  UserInput,
} from '@/types';
import {
  EMISSION_FACTORS,
  getEmissionFactor,
  REGIONAL_AVERAGES,
  CARBON_SCORE_TARGETS,
} from '@/lib/data/emission-factors';

// ==================== COLOR PALETTE FOR BREAKDOWN ====================
const CATEGORY_COLORS: Record<EmissionCategory, string[]> = {
  transport: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  diet: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  energy: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  digital: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  consumption: ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
};

// ==================== CORE CALCULATION FUNCTIONS ====================

/**
 * Calculate transport emissions from onboarding data
 * @param data - Transport section of onboarding
 * @returns CarbonResult with annual and daily emissions
 */
export function calculateTransportEmissions(data: OnboardingData['transport']): CarbonResult {
  const factor = getEmissionFactor('transport', data.primaryVehicle, 'global');
  if (!factor) {
    throw new Error(`Unknown transport type: ${data.primaryVehicle}`);
  }

  const weeklyDistance = data.weeklyDistanceKm;
  const annualDistance = weeklyDistance * 52;
  const primaryEmissions = annualDistance * factor.factor;

  // Public transit calculation
  let transitEmissions = 0;
  const transitFactor = getEmissionFactor('transport', 'public_bus', 'global');
  if (transitFactor) {
    const transitMultiplier: Record<string, number> = {
      daily: 260,
      weekly: 52,
      rarely: 12,
      never: 0,
    };
    transitEmissions = weeklyDistance * 0.3 * transitFactor.factor * transitMultiplier[data.publicTransitFrequency];
  }

  // Flight calculation
  let flightEmissions = 0;
  const shortFlightFactor = getEmissionFactor('transport', 'flight_short', 'global');
  const longFlightFactor = getEmissionFactor('transport', 'flight_long', 'global');
  if (shortFlightFactor && longFlightFactor) {
    const shortFlights = Math.floor(data.flightsPerYear * 0.7);
    const longFlights = Math.ceil(data.flightsPerYear * 0.3);
    flightEmissions = shortFlights * shortFlightFactor.factor + longFlights * longFlightFactor.factor;
  }

  const totalAnnual = primaryEmissions + transitEmissions + flightEmissions;

  const breakdown: BreakdownItem[] = [
    {
      label: 'Primary Vehicle',
      value: primaryEmissions,
      percentage: (primaryEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.transport[0],
    },
    {
      label: 'Public Transit',
      value: transitEmissions,
      percentage: (transitEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.transport[1],
    },
    {
      label: 'Air Travel',
      value: flightEmissions,
      percentage: (flightEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.transport[2],
    },
  ].filter((item) => item.value > 0);

  return {
    category: 'transport',
    subcategory: data.primaryVehicle,
    annualKgCO2: totalAnnual,
    dailyKgCO2: totalAnnual / 365,
    breakdown,
    confidence: 0.85,
  };
}

/**
 * Calculate diet emissions from onboarding data
 */
export function calculateDietEmissions(data: OnboardingData['diet']): CarbonResult {
  const factor = getEmissionFactor('diet', data.dietType, 'global');
  if (!factor) {
    throw new Error(`Unknown diet type: ${data.dietType}`);
  }

  const baseEmissions = factor.factor * 365; // Annual

  // Local food bonus
  const localBonusFactor = getEmissionFactor('diet', 'local_food_bonus', 'global');
  const localBonus = localBonusFactor
    ? baseEmissions * (localBonusFactor.factor * (data.localFoodPercentage / 100))
    : 0;

  // Food waste penalty
  const wastePenaltyFactor = getEmissionFactor('diet', 'food_waste_penalty', 'global');
  const wasteMultiplier: Record<string, number> = {
    never: 0,
    rarely: 0.25,
    sometimes: 0.6,
    often: 1.0,
  };
  const wastePenalty = wastePenaltyFactor
    ? wastePenaltyFactor.factor * 365 * wasteMultiplier[data.foodWasteFrequency]
    : 0;

  const totalAnnual = baseEmissions + localBonus + wastePenalty;

  const breakdown: BreakdownItem[] = [
    {
      label: 'Diet Base',
      value: baseEmissions,
      percentage: (baseEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.diet[0],
    },
    {
      label: 'Local Food Bonus',
      value: Math.abs(localBonus),
      percentage: (Math.abs(localBonus) / totalAnnual) * 100,
      color: CATEGORY_COLORS.diet[1],
    },
    {
      label: 'Food Waste',
      value: wastePenalty,
      percentage: (wastePenalty / totalAnnual) * 100,
      color: CATEGORY_COLORS.diet[2],
    },
  ].filter((item) => item.value > 0.1);

  return {
    category: 'diet',
    subcategory: data.dietType,
    annualKgCO2: totalAnnual,
    dailyKgCO2: totalAnnual / 365,
    breakdown,
    confidence: 0.8,
  };
}

/**
 * Calculate energy emissions from onboarding data
 */
export function calculateEnergyEmissions(data: OnboardingData['energy']): CarbonResult {
  // Estimate electricity usage based on home size and occupants
  const baseKwhPerSqm = 15; // Average kWh per sqm per year
  const estimatedKwh = data.squareMeters * baseKwhPerSqm * (1 + (data.occupants - 1) * 0.3);

  // Get region-specific electricity factor (default to global)
  const electricityFactor = getEmissionFactor('energy', 'electricity_global', 'global');
  if (!electricityFactor) {
    throw new Error('Electricity emission factor not found');
  }

  const electricityEmissions = estimatedKwh * electricityFactor.factor;

  // Heating calculation
  let heatingEmissions = 0;
  const heatingMultipliers: Record<string, number> = {
    electric: 1.0,
    gas: 0.8,
    oil: 1.2,
    'heat-pump': 0.3,
    solar: 0.05,
  };

  const heatingFactor = getEmissionFactor('energy', 'natural_gas', 'global');
  if (heatingFactor && data.heatingType !== 'solar') {
    const heatingKwh = estimatedKwh * 0.4 * heatingMultipliers[data.heatingType];
    heatingEmissions = heatingKwh * heatingFactor.factor * 0.5;
  }

  // AC usage multiplier
  const acMultipliers: Record<string, number> = {
    never: 0,
    occasional: 0.15,
    regular: 0.35,
    constant: 0.6,
  };
  const acEmissions = estimatedKwh * acMultipliers[data.acUsage] * electricityFactor.factor;

  // Renewable energy bonus
  const renewableBonusFactor = getEmissionFactor('energy', 'renewable_bonus', 'global');
  const renewableBonus = renewableBonusFactor
    ? (electricityEmissions + acEmissions) * (renewableBonusFactor.factor * data.renewablePercentage)
    : 0;

  const totalAnnual = electricityEmissions + heatingEmissions + acEmissions + renewableBonus;

  const breakdown: BreakdownItem[] = [
    {
      label: 'Electricity',
      value: electricityEmissions,
      percentage: (electricityEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.energy[0],
    },
    {
      label: 'Heating',
      value: heatingEmissions,
      percentage: (heatingEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.energy[1],
    },
    {
      label: 'Air Conditioning',
      value: acEmissions,
      percentage: (acEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.energy[2],
    },
    {
      label: 'Renewable Offset',
      value: Math.abs(renewableBonus),
      percentage: (Math.abs(renewableBonus) / totalAnnual) * 100,
      color: CATEGORY_COLORS.energy[3],
    },
  ].filter((item) => item.value > 0.1);

  return {
    category: 'energy',
    subcategory: data.heatingType,
    annualKgCO2: totalAnnual,
    dailyKgCO2: totalAnnual / 365,
    breakdown,
    confidence: 0.7,
  };
}

/**
 * Calculate digital emissions from onboarding data
 */
export function calculateDigitalEmissions(data: OnboardingData['digital']): CarbonResult {
  const screenFactor = getEmissionFactor('digital', 'screen_time', 'global');
  const streamingFactor = getEmissionFactor('digital', 'streaming', 'global');
  const emailFactor = getEmissionFactor('digital', 'email', 'global');
  const cloudFactor = getEmissionFactor('digital', 'cloud_storage', 'global');
  const standbyFactor = getEmissionFactor('digital', 'device_standby', 'global');

  if (!screenFactor || !streamingFactor || !emailFactor || !cloudFactor || !standbyFactor) {
    throw new Error('Digital emission factors not found');
  }

  const screenEmissions = data.dailyScreenHours * 365 * screenFactor.factor;
  const streamingEmissions = data.streamingHours * 365 * streamingFactor.factor;
  const emailEmissions = data.emailCount * 365 * emailFactor.factor;
  const cloudEmissions = data.cloudStorageGB * cloudFactor.factor * 12; // Monthly
  const standbyEmissions = data.deviceCount * standbyFactor.factor * 365;

  const totalAnnual = screenEmissions + streamingEmissions + emailEmissions + cloudEmissions + standbyEmissions;

  const breakdown: BreakdownItem[] = [
    {
      label: 'Screen Time',
      value: screenEmissions,
      percentage: (screenEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.digital[0],
    },
    {
      label: 'Streaming',
      value: streamingEmissions,
      percentage: (streamingEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.digital[1],
    },
    {
      label: 'Email',
      value: emailEmissions,
      percentage: (emailEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.digital[2],
    },
    {
      label: 'Cloud Storage',
      value: cloudEmissions,
      percentage: (cloudEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.digital[3],
    },
    {
      label: 'Device Standby',
      value: standbyEmissions,
      percentage: (standbyEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.digital[4],
    },
  ].filter((item) => item.value > 0.1);

  return {
    category: 'digital',
    subcategory: 'digital_lifestyle',
    annualKgCO2: totalAnnual,
    dailyKgCO2: totalAnnual / 365,
    breakdown,
    confidence: 0.6,
  };
}

/**
 * Calculate consumption emissions from onboarding data
 */
export function calculateConsumptionEmissions(data: OnboardingData['consumption']): CarbonResult {
  const clothingFactor = getEmissionFactor('consumption', 'clothing', 'global');
  const electronicsFactor = getEmissionFactor('consumption', 'electronics', 'global');
  const servicesFactor = getEmissionFactor('consumption', 'services', 'global');

  if (!clothingFactor || !electronicsFactor || !servicesFactor) {
    throw new Error('Consumption emission factors not found');
  }

  // Estimate budget allocation
  const clothingBudget = data.monthlyShoppingBudget * 0.3 * 12;
  const electronicsBudget = data.monthlyShoppingBudget * 0.2 * 12;
  const servicesBudget = data.monthlyShoppingBudget * 0.5 * 12;

  const clothingEmissions = clothingBudget * clothingFactor.factor;
  const electronicsEmissions = electronicsBudget * electronicsFactor.factor;
  const servicesEmissions = servicesBudget * servicesFactor.factor;

  // Recycling bonus
  const recyclingBonusFactor = getEmissionFactor('consumption', 'recycling_bonus', 'global');
  const recyclingMultiplier: Record<string, number> = {
    always: 1.0,
    often: 0.7,
    sometimes: 0.4,
    rarely: 0.1,
  };
  const totalConsumption = clothingEmissions + electronicsEmissions + servicesEmissions;
  const recyclingBonus = recyclingBonusFactor
    ? totalConsumption * (recyclingBonusFactor.factor * recyclingMultiplier[data.recyclingHabits])
    : 0;

  const totalAnnual = totalConsumption + recyclingBonus;

  const breakdown: BreakdownItem[] = [
    {
      label: 'Clothing',
      value: clothingEmissions,
      percentage: (clothingEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.consumption[0],
    },
    {
      label: 'Electronics',
      value: electronicsEmissions,
      percentage: (electronicsEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.consumption[1],
    },
    {
      label: 'Services',
      value: servicesEmissions,
      percentage: (servicesEmissions / totalAnnual) * 100,
      color: CATEGORY_COLORS.consumption[2],
    },
    {
      label: 'Recycling Offset',
      value: Math.abs(recyclingBonus),
      percentage: (Math.abs(recyclingBonus) / totalAnnual) * 100,
      color: CATEGORY_COLORS.consumption[3],
    },
  ].filter((item) => item.value > 0.1);

  return {
    category: 'consumption',
    subcategory: data.clothingFrequency,
    annualKgCO2: totalAnnual,
    dailyKgCO2: totalAnnual / 365,
    breakdown,
    confidence: 0.65,
  };
}

// ==================== PROFILE COMPOSITION ====================

/**
 * Build complete carbon profile from onboarding data
 */
export function buildCarbonProfile(
  data: OnboardingData,
  region: string = 'global'
): CarbonProfile {
  const transport = calculateTransportEmissions(data.transport);
  const diet = calculateDietEmissions(data.diet);
  const energy = calculateEnergyEmissions(data.energy);
  const digital = calculateDigitalEmissions(data.digital);
  const consumption = calculateConsumptionEmissions(data.consumption);

  const totalAnnual =
    transport.annualKgCO2 +
    diet.annualKgCO2 +
    energy.annualKgCO2 +
    digital.annualKgCO2 +
    consumption.annualKgCO2;

  // Calculate score (0-100, higher is better)
  const score = calculateCarbonScore(totalAnnual);

  // Calculate percentile vs regional average
  const regionalAverage = REGIONAL_AVERAGES[region] || REGIONAL_AVERAGES.global;
  const percentile = Math.round((1 - totalAnnual / regionalAverage) * 100);

  return {
    totalAnnualKgCO2: Math.round(totalAnnual * 100) / 100,
    totalDailyKgCO2: Math.round((totalAnnual / 365) * 100) / 100,
    categoryBreakdown: {
      transport,
      diet,
      energy,
      digital,
      consumption,
    },
    overallScore: Math.max(0, Math.min(100, score)),
    percentile: Math.max(0, Math.min(100, percentile)),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate carbon score (0-100)
 * 100 = carbon neutral (0 kg CO2e)
 * 0 = extremely high emissions
 */
export function calculateCarbonScore(annualKgCO2: number): number {
  const { excellent, poor } = CARBON_SCORE_TARGETS;

  if (annualKgCO2 <= excellent) return 100;
  if (annualKgCO2 >= poor) return 0;

  // Linear interpolation between excellent and poor
  const score = 100 - ((annualKgCO2 - excellent) / (poor - excellent)) * 100;
  return Math.round(score * 10) / 10;
}

/**
 * Get carbon rating label based on score
 */
export function getCarbonRating(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      label: 'Excellent',
      color: 'text-green-600',
      description: 'Your carbon footprint is aligned with Paris Agreement targets',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      color: 'text-emerald-500',
      description: 'Below average emissions with room for improvement',
    };
  }
  if (score >= 40) {
    return {
      label: 'Average',
      color: 'text-yellow-500',
      description: 'Around global average - significant reduction possible',
    };
  }
  if (score >= 20) {
    return {
      label: 'High',
      color: 'text-orange-500',
      description: 'Above average - priority actions recommended',
    };
  }
  return {
    label: 'Critical',
    color: 'text-red-600',
    description: 'Very high emissions - immediate action needed',
  };
}

/**
 * Format carbon value for display
 */
export function formatCarbonValue(kgCO2: number): string {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(1)}t`;
  }
  return `${Math.round(kgCO2)}kg`;
}

/**
 * Convert daily to annual and vice versa
 */
export function convertToAnnual(daily: number): number {
  return daily * 365;
}

export function convertToDaily(annual: number): number {
  return annual / 365;
}

/**
 * Calculate potential savings from committed actions
 */
export function calculateCommittedSavings(actionIds: string[]): number {
  // This will be implemented with the actions database
  // Placeholder for now
  return actionIds.length * 200; // Rough estimate
}
