import { customAlphabet } from "nanoid";

const length = 12;

// Define the required character sets
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?";

// Helper function to get a random character from a string
const getRandomChar = (alphabet: string): string => {
  const index = Math.floor(Math.random() * alphabet.length);
  return alphabet.charAt(index);
};

/**
 * Generates a secure random password that meets the following requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one symbol
 * - Minimum length (default is 12 characters)
 *
 * @returns {string} The generated password.
 */
export function generateTempPassword(): string {
  // Ensure at least one character from each required set
  const requiredChars = [
    getRandomChar(UPPERCASE),
    getRandomChar(LOWERCASE),
    getRandomChar(DIGITS),
    getRandomChar(SYMBOLS),
  ];

  // Calculate remaining length and generate random characters from all sets combined
  const remainingLength = length - requiredChars.length;
  const customAlphabetGenerator = customAlphabet(
    UPPERCASE + LOWERCASE + DIGITS + SYMBOLS,
    remainingLength,
  );
  const remainingChars = customAlphabetGenerator().split("");

  // Combine the required characters with the remaining random characters
  const passwordArray = [...requiredChars, ...remainingChars];

  // Shuffle the array to randomize the positions using the Fisher-Yates algorithm
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Use non-null assertion or provide default values to satisfy TypeScript
    const temp = passwordArray[i] || "";
    passwordArray[i] = passwordArray[j] || "";
    passwordArray[j] = temp;
  }

  return passwordArray.join("");
}
