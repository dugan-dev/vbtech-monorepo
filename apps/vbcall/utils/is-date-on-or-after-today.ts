import { env } from "@/env/client";

export function isDateOnOrAfterToday(dateString: string) {
  // Get timezone from env or default to New York
  const configuredTZ = env.NEXT_PUBLIC_TIMEZONE;

  // Create a timezone instance
  const timeZone = new Intl.DateTimeFormat("en-US", {
    timeZone: configuredTZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Get current date in configured timezone
  const now = new Date();
  now.setHours(now.getHours() - 4); // Add buffer for earlier timezones

  // Format today's date in YYYY-MM-DD format for the specified timezone
  const parts = timeZone.formatToParts(now);
  const todayFormatted = `${parts.find((p) => p.type === "year")?.value}-${parts.find((p) => p.type === "month")?.value}-${parts.find((p) => p.type === "day")?.value}`;

  return dateString >= todayFormatted;
}
