/**
 * Carbon Calculator Unit Tests
 * Comprehensive tests for all calculation functions
 */

import { describe, it, expect } from 'vitest';
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
} from '@/lib/utils/calculator';
import { OnboardingData } from '@/types';

// Test data fixtures
const mockTransportData: OnboardingData['transport'] = {
  primaryVehicle: 'petrol_car',
  weeklyDistanceKm: 200,
  publicTransitFrequency: 'weekly',
  flightsPerYear: 4,
};

const mockDietData: OnboardingData['diet'] = {
  dietType: 'omnivore',
  localFoodPercentage: 30,
  foodWasteFrequency: 'sometimes',
};

const mockEnergyData: OnboardingData['energy'] = {
  homeType: 'apartment',
  squareMeters: 80,
  occupants: 2,
  renewablePercentage: 20,
  heatingType: 'electric',
  acUsage: 'occasional',
};

const mockDigitalData: OnboardingData['digital'] = {
  dailyScreenHours: 8,
  streamingHours: 3,
  emailCount: 100,
  cloudStorageGB: 200,
  deviceCount: 6,
};

const mockConsumptionData: OnboardingData['consumption'] = {
  monthlyShoppingBudget: 800,
  clothingFrequency: 'monthly',
  electronicsFrequency: 'yearly',
  recyclingHabits: 'often',
};

const mockOnboardingData: OnboardingData = {
  transport: mockTransportData,
  diet: mockDietData,
  energy: mockEnergyData,
  digital: mockDigitalData,
  consumption: mockConsumptionData,
};

describe('Carbon Calculator', () => {
  describe('Transport Emissions', () => {
    it('should calculate petrol car emissions correctly', () => {
      const result = calculateTransportEmissions(mockTransportData);
      expect(result.annualKgCO2).toBeGreaterThan(0);
      expect(result.category).toBe('transport');
      expect(result.breakdown.length).toBeGreaterThan(0);
      expect(result.confidence).toBe(0.85);
    });

    it('should handle zero distance', () => {
      const data = { ...mockTransportData, weeklyDistanceKm: 0 };
      const result = calculateTransportEmissions(data);
      expect(result.annualKgCO2).toBeGreaterThanOrEqual(0);
    });

    it('should handle bicycle (zero emissions)', () => {
      const data = { ...mockTransportData, primaryVehicle: 'bicycle' };
      const result = calculateTransportEmissions(data);
      expect(result.annualKgCO2).toBeGreaterThanOrEqual(0);
    });

    it('should throw error for unknown vehicle', () => {
      const data = { ...mockTransportData, primaryVehicle: 'unknown' as any };
      expect(() => calculateTransportEmissions(data)).toThrow();
    });
  });

  describe('Diet Emissions', () => {
    it('should calculate omnivore diet correctly', () => {
      const result = calculateDietEmissions(mockDietData);
      expect(result.annualKgCO2).toBeGreaterThan(0);
      expect(result.category).toBe('diet');
    });

    it('should calculate vegan diet with lower emissions', () => {
      const veganData = { ...mockDietData, dietType: 'vegan' as const };
      const veganResult = calculateDietEmissions(veganData);
      const omnivoreResult = calculateDietEmissions(mockDietData);
      expect(veganResult.annualKgCO2).toBeLessThan(omnivoreResult.annualKgCO2);
    });

    it('should apply local food bonus', () => {
      const highLocal = { ...mockDietData, localFoodPercentage: 100 };
      const lowLocal = { ...mockDietData, localFoodPercentage: 0 };
      const highResult = calculateDietEmissions(highLocal);
      const lowResult = calculateDietEmissions(lowLocal);
      expect(highResult.annualKgCO2).toBeLessThan(lowResult.annualKgCO2);
    });
  });

  describe('Energy Emissions', () => {
    it('should calculate energy emissions correctly', () => {
      const result = calculateEnergyEmissions(mockEnergyData);
      expect(result.annualKgCO2).toBeGreaterThan(0);
      expect(result.category).toBe('energy');
    });

    it('should apply renewable energy bonus', () => {
      const highRenewable = { ...mockEnergyData, renewablePercentage: 100 };
      const lowRenewable = { ...mockEnergyData, renewablePercentage: 0 };
      const highResult = calculateEnergyEmissions(highRenewable);
      const lowResult = calculateEnergyEmissions(lowRenewable);
      expect(highResult.annualKgCO2).toBeLessThan(lowResult.annualKgCO2);
    });
  });

  describe('Digital Emissions', () => {
    it('should calculate digital emissions correctly', () => {
      const result = calculateDigitalEmissions(mockDigitalData);
      expect(result.annualKgCO2).toBeGreaterThan(0);
      expect(result.category).toBe('digital');
    });

    it('should scale with screen time', () => {
      const highScreen = { ...mockDigitalData, dailyScreenHours: 16 };
      const lowScreen = { ...mockDigitalData, dailyScreenHours: 1 };
      const highResult = calculateDigitalEmissions(highScreen);
      const lowResult = calculateDigitalEmissions(lowScreen);
      expect(highResult.annualKgCO2).toBeGreaterThan(lowResult.annualKgCO2);
    });
  });

  describe('Consumption Emissions', () => {
    it('should calculate consumption emissions correctly', () => {
      const result = calculateConsumptionEmissions(mockConsumptionData);
      expect(result.annualKgCO2).toBeGreaterThan(0);
      expect(result.category).toBe('consumption');
    });

    it('should apply recycling bonus', () => {
      const alwaysRecycle = { ...mockConsumptionData, recyclingHabits: 'always' as const };
      const neverRecycle = { ...mockConsumptionData, recyclingHabits: 'rarely' as const };
      const alwaysResult = calculateConsumptionEmissions(alwaysRecycle);
      const neverResult = calculateConsumptionEmissions(neverRecycle);
      expect(alwaysResult.annualKgCO2).toBeLessThan(neverResult.annualKgCO2);
    });
  });

  describe('Profile Builder', () => {
    it('should build complete carbon profile', () => {
      const profile = buildCarbonProfile(mockOnboardingData, 'global');
      expect(profile.totalAnnualKgCO2).toBeGreaterThan(0);
      expect(profile.totalDailyKgCO2).toBeGreaterThan(0);
      expect(profile.overallScore).toBeGreaterThanOrEqual(0);
      expect(profile.overallScore).toBeLessThanOrEqual(100);
      expect(Object.keys(profile.categoryBreakdown)).toHaveLength(5);
    });

    it('should calculate daily from annual correctly', () => {
      const profile = buildCarbonProfile(mockOnboardingData, 'global');
      expect(profile.totalDailyKgCO2).toBeCloseTo(
        profile.totalAnnualKgCO2 / 365,
        1
      );
    });
  });

  describe('Score Calculation', () => {
    it('should return 100 for zero emissions', () => {
      expect(calculateCarbonScore(0)).toBe(100);
    });

    it('should return 0 for very high emissions', () => {
      expect(calculateCarbonScore(20000)).toBe(0);
    });

    it('should return intermediate score', () => {
      const score = calculateCarbonScore(5000);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });
  });

  describe('Rating Labels', () => {
    it('should return excellent for high score', () => {
      const rating = getCarbonRating(85);
      expect(rating.label).toBe('Excellent');
    });

    it('should return critical for low score', () => {
      const rating = getCarbonRating(10);
      expect(rating.label).toBe('Critical');
    });
  });

  describe('Format Utilities', () => {
    it('should format kg values', () => {
      expect(formatCarbonValue(500)).toBe('500kg');
    });

    it('should format ton values', () => {
      expect(formatCarbonValue(1500)).toBe('1.5t');
    });
  });
});
