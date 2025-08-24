import { ValidationUtils } from '../validation';

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationUtils.isValidEmail('admin@alphago.internal')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(ValidationUtils.isValidEmail('invalid')).toBe(false);
      expect(ValidationUtils.isValidEmail('test@')).toBe(false);
      expect(ValidationUtils.isValidEmail('@domain.com')).toBe(false);
      expect(ValidationUtils.isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(ValidationUtils.isValidPhone('+216 12 345 678')).toBe(true);
      expect(ValidationUtils.isValidPhone('12345678')).toBe(true);
      expect(ValidationUtils.isValidPhone('+1 (555) 123-4567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(ValidationUtils.isValidPhone('123')).toBe(false);
      expect(ValidationUtils.isValidPhone('abc')).toBe(false);
      expect(ValidationUtils.isValidPhone('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(ValidationUtils.isValidPassword('password123')).toBe(true);
      expect(ValidationUtils.isValidPassword('123456')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(ValidationUtils.isValidPassword('12345')).toBe(false);
      expect(ValidationUtils.isValidPassword('')).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('should return true for valid prices', () => {
      expect(ValidationUtils.isValidPrice('10.50')).toBe(true);
      expect(ValidationUtils.isValidPrice('100')).toBe(true);
      expect(ValidationUtils.isValidPrice('0.01')).toBe(true);
    });

    it('should return false for invalid prices', () => {
      expect(ValidationUtils.isValidPrice('0')).toBe(false);
      expect(ValidationUtils.isValidPrice('-10')).toBe(false);
      expect(ValidationUtils.isValidPrice('abc')).toBe(false);
      expect(ValidationUtils.isValidPrice('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(ValidationUtils.sanitizeInput('  <script>alert("xss")</script>  ')).toBe('scriptalert("xss")/script');
      expect(ValidationUtils.sanitizeInput('Normal text')).toBe('Normal text');
    });

    it('should trim whitespace', () => {
      expect(ValidationUtils.sanitizeInput('  text  ')).toBe('text');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 8-digit numbers with Tunisia country code', () => {
      expect(ValidationUtils.formatPhoneNumber('12345678')).toBe('+216 12 345 678');
    });

    it('should return unchanged for numbers with country codes', () => {
      expect(ValidationUtils.formatPhoneNumber('+216 12 345 678')).toBe('+216 12 345 678');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with TND suffix', () => {
      expect(ValidationUtils.formatCurrency(10.5)).toBe('10.50 TND');
      expect(ValidationUtils.formatCurrency(100)).toBe('100.00 TND');
    });
  });
});
