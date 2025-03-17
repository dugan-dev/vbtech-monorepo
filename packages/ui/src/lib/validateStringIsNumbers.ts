export function validateStringIsNumbers(str: string) {
  const pattern = /^\d+$/;
  const isValid = pattern.test(str);
  return isValid;
}
