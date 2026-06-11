/**
 * Validation Unit Tests
 * Tests for input validation and sanitization
 */

import { describe, it, expect } from 'vitest';
import {
  validateOnboardingData,
  validateUserInput,
  sanitizeString,
  validateRange,
} from '@/lib/utils/validation';

describe('Validation', () => {
  describe('Onboarding Data Validation', () => {
    it('should validate complete onboarding data', () => {
      const validData = {
        transport: {
          primaryVehicle: 'petrol_car',
          weeklyDistanceKm: 100,
          publicTransitFrequency: 'daily',
          flightsPerYear: 2,
        },
        diet: {
          dietType: 'vegan',
          localFoodPercentage: 50,
          foodWasteFrequency: 'rarely',
        },
        energy: {
          homeType: 'apartment',
          squareMeters: 80,
          occupants: 2,
          renewablePercentage: 20,
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
          recyclingHabits: 'often',
        },
      };

      const result = validateOnboardingData(validData);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject invalid transport data', () => {
      const invalidData = {
        transport: {
          primaryVehicle: 'invalid_vehicle',
          weeklyDistanceKm: -10,
          publicTransitFrequency: 'daily',
          flightsPerYear: 2,
        },
        diet: {
          dietType: 'vegan',
          localFoodPercentage: 50,
          foodWasteFrequency: 'rarely',
        },
        energy: {
          homeType: 'apartment',
          squareMeters: 80,
          occupants: 2,
          renewablePercentage: 20,
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
          recyclingHabits: 'often',
        },
      };

      const result = validateOnboardingData(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should reject missing required fields', () => {
      const incompleteData = {
        transport: {
          primaryVehicle: 'petrol_car',
        },
      };

      const result = validateOnboardingData(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('User Input Validation', () => {
    it('should validate valid user input', () => {
      const validInput = {
        category: 'transport',
        subcategory: 'petrol_car',
        value: 100,
        frequency: 'daily',
      };

      const result = validateUserInput(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid category', () => {
      const invalidInput = {
        category: 'invalid',
        subcategory: 'test',
        value: 100,
        frequency: 'daily',
      };

      const result = validateUserInput(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('String Sanitization', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<p>hello world</p>')).toBe('hello world');
    });

    it('should remove script tags completely', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('');
    });

    it('should remove javascript protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('Range Validation', () => {
    it('should accept valid range', () => {
      expect(validateRange(50, 0, 100, 'value')).toBeNull();
    });

    it('should reject below minimum', () => {
      expect(validateRange(-1, 0, 100, 'value')).toBe('value must be at least 0');
    });

    it('should reject above maximum', () => {
      expect(validateRange(101, 0, 100, 'value')).toBe('value must be at most 100');
    });
  });
});
