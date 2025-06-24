import { customAlphabet } from "nanoid";

/**
 * Creates a new public ID using a custom alphabet.
 * Generates a 12-character string using numbers and lowercase letters.
 */
export const newPubId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12,
);

/**
 * Re-export customAlphabet for use in password generation and other custom alphabet needs.
 */
export { customAlphabet };
