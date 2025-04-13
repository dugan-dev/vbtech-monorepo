import { headers } from "next/headers";

/**
 * Retrieves the client's IP address from a collection of HTTP headers.
 *
 * The function checks the headers in the following order:
 * 1. `x-forwarded-for` — If present, extracts the first IP (addresses may be comma-separated).
 * 2. `x-real-ip` — Used as an alternative if the first header is missing.
 * 3. `cf-connecting-ip` — Provided by Cloudflare.
 * 4. `true-client-ip` — Used by Akamai and Cloudflare.
 *
 * If none of these headers provide an IP address, the function returns `"unknown"`.
 *
 * @param headerList - The HTTP headers from a Next.js request.
 * @returns The client's IP address if available; otherwise, `"unknown"`.
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
