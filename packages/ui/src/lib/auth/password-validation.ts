// Centralized password validation constants and utilities

/**
 * Password requirements:
 * - At least 12 characters long
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 */
export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{12,}$/;

export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

export const PASSWORD_MIN_LENGTH_MESSAGE = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;

export const PASSWORDS_MUST_MATCH_MESSAGE = "Passwords do not match";

/**
 * Individual regex patterns for granular validation feedback
 */
export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
} as const;

/**
 * Individual validation messages for granular feedback
 */
export const PASSWORD_PATTERN_MESSAGES = {
  uppercase: "Password must contain at least one uppercase letter",
  lowercase: "Password must contain at least one lowercase letter",
  number: "Password must contain at least one number",
  specialChar: "Password must contain at least one special character",
} as const;

/**
 * Validates a password against all requirements
 */
export function validatePassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

/**
 * Gets detailed validation results for a password
 */
export function getPasswordValidationDetails(password: string) {
  return {
    isValid: validatePassword(password),
    length: password.length >= PASSWORD_MIN_LENGTH,
    hasUppercase: PASSWORD_PATTERNS.uppercase.test(password),
    hasLowercase: PASSWORD_PATTERNS.lowercase.test(password),
    hasNumber: PASSWORD_PATTERNS.number.test(password),
    hasSpecialChar: PASSWORD_PATTERNS.specialChar.test(password),
  };
}
