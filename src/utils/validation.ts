export const ValidationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  isValidPrice: (price: string): boolean => {
    const num = Number(price);
    return !isNaN(num) && num > 0;
  },

  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },

  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Add Tunisia country code if not present
    if (digits.length === 8) {
      return `+216 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
    
    return phone;
  },

  formatCurrency: (amount: number): string => {
    return `${amount.toFixed(2)} TND`;
  },
};
