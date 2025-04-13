/**
 * Converts a duration in milliseconds to a human-readable wait time message.
 *
 * The function rounds up the given milliseconds to determine the total seconds,
 * then computes the number of full minutes and the remaining seconds. It returns
 * a formatted message with proper pluralization—displaying both minutes and seconds
 * when applicable, or just seconds if there are no minutes.
 *
 * @param remainingMillis - The remaining wait time in milliseconds.
 * @returns A string message describing the wait time, formatted in minutes and seconds.
 *
 * @example
 * // For 65000 milliseconds, the function returns "1 minute and 5 seconds".
 * console.log(getRateLimitWaitTimeMessage(65000));
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
