/**
 * Returns a formatted wait time message given a remaining duration in milliseconds.
 *
 * This function converts the provided duration from milliseconds to seconds, calculates the number of minutes 
 * and remaining seconds, and constructs a human-readable message describing the wait time. If the wait time includes 
 * one or more minutes, the message displays both minutes and seconds with proper pluralization; otherwise, it shows 
 * only seconds.
 *
 * @param remainingMillis - The duration to wait in milliseconds.
 * @returns A string that describes the wait time in minutes and seconds.
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
