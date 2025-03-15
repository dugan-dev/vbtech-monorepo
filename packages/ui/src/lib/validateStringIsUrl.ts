export function validateStringIsUrl(str: string) {
  // Remove any protocol and www if present
  const cleanUrl = str.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Domain pattern:
  // - Can contain letters, numbers, dots, and hyphens
  // - Must have at least one dot
  // - TLD must be at least 2 characters
  // - Optional path after domain
  const pattern = /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

  return pattern.test(cleanUrl);
}
