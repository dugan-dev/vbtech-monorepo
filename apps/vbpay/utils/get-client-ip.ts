import { headers } from "next/headers";

/**
 * Retrieves the client's IP address from HTTP request headers.
 *
 * The function checks the "x-forwarded-for" header and returns the first comma-separated value after trimming whitespace.
 * If the "x-forwarded-for" header is absent, it attempts to use the "x-real-ip" header.
 * If neither header is found, it returns "unknown".
 *
 * @param headerList - A collection of HTTP headers typically provided by Next.js.
 * @returns The client's IP address or "unknown" if not available.
 */
export function getClientIp(headerList: Awaited<ReturnType<typeof headers>>) {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown"
  );
}
