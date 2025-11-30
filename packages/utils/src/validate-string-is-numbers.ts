/**
 * Validates if a string contains only numeric digits (0-9)
 *
 * @param str - The string to validate
 * @returns true if the string contains only digits, false otherwise
 *
 * @example
 * validateStringIsNumbers("123")    // returns true
 * validateStringIsNumbers("12.3")   // returns false
 * validateStringIsNumbers("abc")    // returns false
 * validateStringIsNumbers("")       // returns false
 */
export function validateStringIsNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}
