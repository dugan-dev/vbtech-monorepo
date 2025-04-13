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
