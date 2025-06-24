/**
 * Extracts the client IP address from HTTP headers.
 *
 * This function checks multiple header fields commonly used by proxies and CDNs
 * to determine the real client IP address. It follows the priority order:
 * 1. X-Forwarded-For (first IP in the list)
 * 2. X-Real-IP
 * 3. CF-Connecting-IP (Cloudflare)
 *
 * @param headers - HTTP headers object containing IP-related headers
 * @returns The client IP address as a string, or undefined if not found
 *
 * @example
 * ```typescript
 * const ip = getClientIP({
 *   'x-forwarded-for': '192.168.1.1, 10.0.0.1',
 *   'x-real-ip': '192.168.1.1'
 * });
 * // Returns: '192.168.1.1'
 * ```
 */
export function getClientIP(
  headers?: Record<string, string | string[] | undefined>,
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const forwarded = Array.isArray(headers["x-forwarded-for"])
    ? headers["x-forwarded-for"][0]
    : headers["x-forwarded-for"];
  const realIP = Array.isArray(headers["x-real-ip"])
    ? headers["x-real-ip"][0]
    : headers["x-real-ip"];
  const cfConnectingIP = Array.isArray(headers["cf-connecting-ip"])
    ? headers["cf-connecting-ip"][0]
    : headers["cf-connecting-ip"];

  if (forwarded) {
    return forwarded?.split(",")[0]?.trim() ?? undefined;
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return undefined;
}

/**
 * Adapter function to convert Next.js Headers to plain object for getClientIP.
 *
 * This function extracts the client IP from Next.js Headers object and returns
 * a fallback value of "unknown" if no IP is found.
 *
 * @param headers - Next.js Headers object
 * @returns The client IP address as a string, or "unknown" if not found
 *
 * @example
 * ```typescript
 * import { headers } from "next/headers";
 *
 * const ip = getClientIpFromHeaders(headers());
 * // Returns: '192.168.1.1' or 'unknown'
 * ```
 */
export function getClientIpFromHeaders(headers: Headers): string {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}
