/**
 * Carbon Emission Factors Database
 * Sources: IPCC 2023, EPA GHG Emission Factors Hub, Our World in Data
 * All values in kg CO2e per specified unit
 */

import { EmissionFactor } from '@/types';

export const EMISSION_FACTORS: EmissionFactor[] = [
  // ==================== TRANSPORT ====================
  {
    id: 'transport-petrol-car',
    category: 'transport',
    subcategory: 'petrol_car',
    factor: 0.192,
    unit: 'km',
    source: 'IPCC 2023 - Road Transport',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-diesel-car',
    category: 'transport',
    subcategory: 'diesel_car',
    factor: 0.171,
    unit: 'km',
    source: 'IPCC 2023 - Road Transport',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-electric-car',
    category: 'transport',
    subcategory: 'electric_car',
    factor: 0.053,
    unit: 'km',
    source: 'IPCC 2023 - EV Lifecycle',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-hybrid-car',
    category: 'transport',
    subcategory: 'hybrid_car',
    factor: 0.118,
    unit: 'km',
    source: 'IPCC 2023 - Hybrid Vehicles',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-motorcycle',
    category: 'transport',
    subcategory: 'motorcycle',
    factor: 0.103,
    unit: 'km',
    source: 'IPCC 2023 - Two Wheelers',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'transport-public-bus',
    category: 'transport',
    subcategory: 'public_bus',
    factor: 0.089,
    unit: 'km',
    source: 'IPCC 2023 - Public Transport',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-train',
    category: 'transport',
    subcategory: 'train',
    factor: 0.041,
    unit: 'km',
    source: 'IPCC 2023 - Rail Transport',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-subway',
    category: 'transport',
    subcategory: 'subway',
    factor: 0.028,
    unit: 'km',
    source: 'IPCC 2023 - Urban Rail',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-flight-short',
    category: 'transport',
    subcategory: 'flight_short',
    factor: 255.0,
    unit: 'flight',
    source: 'EPA 2023 - Aviation',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'transport-flight-long',
    category: 'transport',
    subcategory: 'flight_long',
    factor: 1020.0,
    unit: 'flight',
    source: 'EPA 2023 - Aviation',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'transport-bicycle',
    category: 'transport',
    subcategory: 'bicycle',
    factor: 0.0,
    unit: 'km',
    source: 'IPCC 2023 - Zero Emission',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'transport-walking',
    category: 'transport',
    subcategory: 'walking',
    factor: 0.0,
    unit: 'km',
    source: 'IPCC 2023 - Zero Emission',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },

  // ==================== DIET ====================
  {
    id: 'diet-vegan',
    category: 'diet',
    subcategory: 'vegan',
    factor: 1.46,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'diet-vegetarian',
    category: 'diet',
    subcategory: 'vegetarian',
    factor: 1.72,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'diet-pescatarian',
    category: 'diet',
    subcategory: 'pescatarian',
    factor: 1.95,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'diet-flexitarian',
    category: 'diet',
    subcategory: 'flexitarian',
    factor: 2.23,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'diet-omnivore',
    category: 'diet',
    subcategory: 'omnivore',
    factor: 2.62,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'diet-high-meat',
    category: 'diet',
    subcategory: 'high-meat',
    factor: 3.29,
    unit: 'day',
    source: 'Our World in Data 2023 - Food Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'diet-local-bonus',
    category: 'diet',
    subcategory: 'local_food_bonus',
    factor: -0.15,
    unit: 'percentage',
    source: 'Local Food Systems Study 2022',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'diet-waste-penalty',
    category: 'diet',
    subcategory: 'food_waste_penalty',
    factor: 0.35,
    unit: 'day',
    source: 'FAO Food Waste Emissions 2023',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },

  // ==================== ENERGY ====================
  {
    id: 'energy-electricity-global',
    category: 'energy',
    subcategory: 'electricity_global',
    factor: 0.475,
    unit: 'kWh',
    source: 'IEA 2023 - Electricity Emissions',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-electricity-india',
    category: 'energy',
    subcategory: 'electricity_india',
    factor: 0.713,
    unit: 'kWh',
    source: 'CEA India 2023 - Grid Emissions',
    region: 'india',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-electricity-eu',
    category: 'energy',
    subcategory: 'electricity_eu',
    factor: 0.278,
    unit: 'kWh',
    source: 'EU EEA 2023 - Grid Emissions',
    region: 'eu',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-electricity-us',
    category: 'energy',
    subcategory: 'electricity_us',
    factor: 0.386,
    unit: 'kWh',
    source: 'EPA eGRID 2023',
    region: 'us',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-natural-gas',
    category: 'energy',
    subcategory: 'natural_gas',
    factor: 2.02,
    unit: 'm3',
    source: 'IPCC 2023 - Natural Gas',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-heating-oil',
    category: 'energy',
    subcategory: 'heating_oil',
    factor: 2.52,
    unit: 'liter',
    source: 'IPCC 2023 - Liquid Fuels',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-lpg',
    category: 'energy',
    subcategory: 'lpg',
    factor: 1.51,
    unit: 'kg',
    source: 'IPCC 2023 - LPG',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },
  {
    id: 'energy-renewable-bonus',
    category: 'energy',
    subcategory: 'renewable_bonus',
    factor: -0.01,
    unit: 'percentage',
    source: 'Renewable Energy Offset Calculation',
    region: 'global',
    year: 2023,
    confidence: 'high',
  },

  // ==================== DIGITAL ====================
  {
    id: 'digital-screen-time',
    category: 'digital',
    subcategory: 'screen_time',
    factor: 0.008,
    unit: 'hour',
    source: 'Digital Carbon Footprint Study 2023',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'digital-streaming',
    category: 'digital',
    subcategory: 'streaming',
    factor: 0.036,
    unit: 'hour',
    source: 'Carbon Trust 2023 - Streaming',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'digital-email',
    category: 'digital',
    subcategory: 'email',
    factor: 0.004,
    unit: 'email',
    source: 'Carbon Trust 2023 - Email',
    region: 'global',
    year: 2023,
    confidence: 'low',
  },
  {
    id: 'digital-cloud-storage',
    category: 'digital',
    subcategory: 'cloud_storage',
    factor: 0.015,
    unit: 'GB',
    source: 'Data Center Energy Study 2023',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'digital-device-standby',
    category: 'digital',
    subcategory: 'device_standby',
    factor: 0.045,
    unit: 'device',
    source: 'Energy Star 2023 - Standby Power',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },

  // ==================== CONSUMPTION ====================
  {
    id: 'consumption-clothing',
    category: 'consumption',
    subcategory: 'clothing',
    factor: 0.25,
    unit: 'USD',
    source: 'Ellen MacArthur Foundation 2023',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'consumption-electronics',
    category: 'consumption',
    subcategory: 'electronics',
    factor: 0.45,
    unit: 'USD',
    source: 'EPA 2023 - Electronics Lifecycle',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
  {
    id: 'consumption-furniture',
    category: 'consumption',
    subcategory: 'furniture',
    factor: 0.32,
    unit: 'USD',
    source: 'Furniture Industry LCA 2023',
    region: 'global',
    year: 2023,
    confidence: 'low',
  },
  {
    id: 'consumption-services',
    category: 'consumption',
    subcategory: 'services',
    factor: 0.12,
    unit: 'USD',
    source: 'Service Sector Emissions 2023',
    region: 'global',
    year: 2023,
    confidence: 'low',
  },
  {
    id: 'consumption-recycling-bonus',
    category: 'consumption',
    subcategory: 'recycling_bonus',
    factor: -0.08,
    unit: 'percentage',
    source: 'Waste Management LCA 2023',
    region: 'global',
    year: 2023,
    confidence: 'medium',
  },
];

/**
 * Get emission factor by category and subcategory
 */
export function getEmissionFactor(
  category: string,
  subcategory: string,
  region: string = 'global'
): EmissionFactor | undefined {
  // Try region-specific first, fallback to global
  return (
    EMISSION_FACTORS.find(
      (f) => f.category === category && f.subcategory === subcategory && f.region === region
    ) ||
    EMISSION_FACTORS.find(
      (f) => f.category === category && f.subcategory === subcategory && f.region === 'global'
    )
  );
}

/**
 * Get all factors for a category
 */
export function getFactorsByCategory(category: string): EmissionFactor[] {
  return EMISSION_FACTORS.filter((f) => f.category === category);
}

/**
 * Global average annual carbon footprint by region (kg CO2e)
 */
export const REGIONAL_AVERAGES: Record<string, number> = {
  global: 4800,
  india: 1900,
  us: 16000,
  eu: 7500,
  china: 8000,
  uk: 6500,
  canada: 15500,
  australia: 17000,
  japan: 8500,
  brazil: 4200,
};

/**
 * Carbon score thresholds (kg CO2e/year)
 * Score = 100 - (actual / target * 100), clamped to 0-100
 */
export const CARBON_SCORE_TARGETS = {
  excellent: 2000, // Net zero aspirational
  good: 4000, // Paris agreement aligned
  average: 6000, // Global average target
  poor: 10000, // Above average
};
