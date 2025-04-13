/**
 * Generates a formatted message describing the remaining wait time.
 *
 * This function converts the input milliseconds to whole seconds, then determines
 * the number of minutes and remaining seconds. It returns a human-readable string
 * that formats the wait time using proper pluralization (e.g., "1 minute" vs. "2 minutes").
 *
 * @param remainingMillis - The remaining wait time in milliseconds.
 * @returns A string representing the wait time, formatted as either "X minute(s) and Y second(s)" or "Y second(s)".
 */
export function getRateLimitWaitTimeMessage(remainingMillis: number) {
  const secondsTotal = Math.ceil(remainingMillis / 1000);
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;

  // Create a human-readable wait time message
  const waitTimeMessage =
    minutes > 0
      ? `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`
      : `${seconds} second${seconds !== 1 ? "s" : ""}`;

  return waitTimeMessage;
}
