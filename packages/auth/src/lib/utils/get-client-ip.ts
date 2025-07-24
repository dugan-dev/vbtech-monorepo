import { headers } from "next/headers";

/**
 * Retrieves the client's IP address from the provided HTTP headers.
 *
 * This function checks the headers in a prioritized order:
 * 1. It first attempts to extract the IP from the "x-forwarded-for" header,
 *    splitting its value by commas and returning the first trimmed element.
 * 2. If not found, it checks the "x-real-ip" header.
 * 3. It then looks for the "cf-connecting-ip" header (commonly set by Cloudflare),
 *    followed by the "true-client-ip" header (used by Akamai and Cloudflare).
 *
 * @param headerList - An object containing HTTP headers from which to extract the client IP.
 * @returns The client's IP address if available; otherwise, returns "unknown".
 */
export function getClientIp(headerList: Awaited<ReturnType<typeof headers>>) {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") || // Cloudflare
    headerList.get("true-client-ip") || // Akamai and Cloudflare
    "unknown"
  );
}
