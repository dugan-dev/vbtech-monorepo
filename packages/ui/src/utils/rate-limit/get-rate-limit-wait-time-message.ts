/**
 * Generates a user-friendly message for rate limit wait times.
 *
 * This function converts a wait time in milliseconds to a human-readable
 * message that tells users how long they need to wait before retrying.
 * It automatically formats the message in seconds or minutes as appropriate.
 *
 * @param waitTimeMs - Wait time in milliseconds
 * @returns A user-friendly message indicating the wait time
 *
 * @example
 * ```typescript
 * getRateLimitWaitTimeMessage(30000); // "Please wait 30 seconds before trying again."
 * getRateLimitWaitTimeMessage(120000); // "Please wait 2 minutes before trying again."
 * getRateLimitWaitTimeMessage(60000); // "Please wait 1 minute before trying again."
 * ```
 */
export function getRateLimitWaitTimeMessage(waitTimeMs: number): string {
  const waitTimeSeconds = Math.ceil(waitTimeMs / 1000);

  if (waitTimeSeconds < 60) {
    return `Please wait ${waitTimeSeconds} seconds before trying again.`;
  }

  const waitTimeMinutes = Math.ceil(waitTimeSeconds / 60);
  return `Please wait ${waitTimeMinutes} minute${waitTimeMinutes > 1 ? "s" : ""} before trying again.`;
}
